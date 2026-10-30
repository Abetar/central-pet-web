import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title: "Central Pet | Veterinaria · Cuidado que se siente",description:"Conoce nuestros servicios veterinarios para perros y gatos. Solicita tu cita por WhatsApp y encuentra el siguiente paso para cuidar de tu compañero.",robots:{index:false,follow:false}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="es-MX"><body>{children}</body></html>}
