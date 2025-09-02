

import './globals.css';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </AuthProvider>
  );
}


