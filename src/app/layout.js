import "./globals.css";

export const metadata = {
  title: "Quraan Class Attendance System",
  description: "A modern attendance management system for Quraan classes. Mark, track, and export student attendance with ease.",
  keywords: ["Quraan", "attendance", "Islamic education", "class management"],
  authors: [{ name: "Quraan Academy" }],
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
