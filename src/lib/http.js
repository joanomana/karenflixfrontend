const RAW_PUBLIC = process.env.NEXT_PUBLIC_API_URL || 'https://glasgow-recruiting-blade-devoted.trycloudflare.com';
const RAW_SERVER = process.env.NEXT_PUBLIC_API_URL;

const IS_SERVER = typeof window === 'undefined';
const norm = (s) => (s && s.trim() ? s.replace(/\/+$/, '') : s);


const BASE_BROWSER = norm(RAW_PUBLIC) || '';


const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

const BASE_SERVER = norm(RAW_SERVER) || norm(SITE_ORIGIN) || 'https://glasgow-recruiting-blade-devoted.trycloudflare.com';

const BASE_URL = IS_SERVER ? BASE_SERVER : BASE_BROWSER;

function isAbsolute(u) { return /^https?:\/\//i.test(u); }

function buildURL(path, query) {
    let url = isAbsolute(path)
        ? path
        : `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

    if (query && typeof query === 'object' && Object.keys(query).length > 0) {
        const qs = new URLSearchParams();
        for (const [k, v] of Object.entries(query)) {
            if (v === undefined || v === null || v === '') continue;
            Array.isArray(v) ? v.forEach(val => qs.append(k, String(val))) : qs.append(k, String(v));
        }
        url += (url.includes('?') ? '&' : '?') + qs.toString();
    }
    return url;
}

export async function request(path, { method = 'GET', body, headers, timeout = 15000, query, credentials } = {}) {
    const url = buildURL(path, query);
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const computedHeaders = { ...(headers || {}) };
    if (body && !computedHeaders['Content-Type']) {
        computedHeaders['Content-Type'] = 'application/json';
    }

    let res;
    try {
        // During build time, if external API is not available, provide fallback
        const fetchOptions = {
            method,
            headers: computedHeaders,
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal,
            next: { revalidate: 3600 }, // Cache for 1 hour during build and runtime
            credentials,
        };

        res = await fetch(url, fetchOptions);
    } catch (err) {
        clearTimeout(id);
        // During build time, return empty fallback instead of throwing
        if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
            console.warn(`Build-time fetch failed for ${url}, returning fallback`);
            return { items: [], total: 0 };
        }
        throw new Error(`Fetch error: ${err.message} | url=${url}`);
    }
    clearTimeout(id);

    const text = await res.text();
    let data; try { data = text ? JSON.parse(text) : null; } catch { data = text; }

    if (!res.ok) {
        // During build time, return empty fallback instead of throwing
        if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
            console.warn(`Build-time fetch failed with status ${res.status} for ${url}, returning fallback`);
            return { items: [], total: 0 };
        }
        const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
        const e = new Error(msg);
        e.status = res.status;
        e.data = data;
        e.url = url;
        throw e;
    }
    return data;
}

export const http = {
    get: (p, o) => request(p, { ...o, method: 'GET' }),
    post: (p, body, o) => request(p, { ...o, method: 'POST', body }),
    put: (p, body, o) => request(p, { ...o, method: 'PUT', body }),
    patch: (p, body, o) => request(p, { ...o, method: 'PATCH', body }),
    delete: (p, o) => request(p, { ...o, method: 'DELETE' }),
};

export function getApiBaseUrl() { return BASE_URL; }