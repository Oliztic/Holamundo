export const metadata = {
  title: "Oliztic",
  description: "Hola Mundo, bienvenidos a Oliztic",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
