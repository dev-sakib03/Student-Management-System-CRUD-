import "./globals.css";

export const metadata = {
  title: "CampusFlow | Student Management",
  description: "A clean and simple student management system.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
