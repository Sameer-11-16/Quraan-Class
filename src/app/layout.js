import "./globals.css";

export const metadata = {
  title: "Quraan Class Attendance System",
  description: "A modern attendance management system for Quraan classes. Mark, track, and export student attendance with ease.",
  keywords: ["Quraan", "attendance", "Islamic education", "class management"],
  authors: [{ name: "Quraan Academy" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Quraan Class",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#047857" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
