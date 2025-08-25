import "./globals.css";


export const metadata = {
  title: "KarenFlix",
  description: "A movie streaming platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
