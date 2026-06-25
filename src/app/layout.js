import "./globals.css";

export const metadata = {
  title: "The Residency on 8th Street",
  description: "Experience the creative workspace of SVR. Deep house vinyl mixes, custom streetwear lookbooks, and photography archives in an interactive 3D studio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
