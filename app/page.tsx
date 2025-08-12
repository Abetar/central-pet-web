"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const INFO = {
  nombre: "Central Pet",
  telefono: "+52 33 2355 3635",
  whatsapp: "523323553635", // sin signos + para la URL
  direccion: "Carretera Nextipac Km. 1 La Venta del Astillero, 45221 Zapopan, Jal.",
  horario: "Lun-Vie 10:00–21:00\nSab 10:00–18:00\nDom 10:00–16:00", // con saltos de línea
  googleMaps:
    "https://maps.google.com/?q=Central+Pet,+20.7392495,-103.540059",
};

const TESTIMONIOS = [
  {
    texto: "Muy buena veterinaria, excelente atención médica y servicio de baño profesional 😌…",
    autor: "Nicolas MVZ.",
    url: "https://maps.app.goo.gl/LDCtaPcssqePCSqx5",
  },
  {
    texto: "El doctor fue muy amable y me explicó todo lo que pasaba con mi gatita. Es un plus que esté abierto todos los días en caso de alguna emergencia, como me pasó a mí.",
    autor: "Illo Farfán.",
    url: "https://maps.app.goo.gl/noYJZ9s1eU5nuTMM9",
  },
  {
    texto: "Excelente servicio, sucursal limpia, fueron rápidos, amables y muy profesionales 100% recomendados para cualquier procedimiento",
    autor: "Edmundo Parada.",
    url: "https://maps.app.goo.gl/8EabcwuMa233NvFYA",
  },
];

const Section = ({
  id,
  children,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section id={id} className={`max-w-7xl mx-auto px-6 py-20 ${className}`}>
    {children}
  </section>
);

function buildWhatsAppMessage({
  nombre,
  telefono,
  mascota,
  servicio,
  fecha,
  mensaje,
}: {
  nombre: string;
  telefono: string;
  mascota: string;
  servicio: string;
  fecha: string;
  mensaje: string;
}) {
  const lines = [
    `Hola, me gustaría agendar una cita 👋`,
    `• Nombre: ${nombre || "-"}`,
    `• Teléfono: ${telefono || "-"}`,
    `• Mascota: ${mascota || "-"}`,
    `• Servicio: ${servicio || "-"}`,
    `• Fecha preferida: ${fecha || "-"}`,
    `• Comentarios: ${mensaje || "-"}`,
  ];
  return encodeURIComponent(lines.join("\n"));
}

function WhatsAppForm({ waNumber }: { waNumber: string }) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mascota, setMascota] = useState("");
  const [servicio, setServicio] = useState("Consulta general");
  const [fecha, setFecha] = useState("");
  const [mensaje, setMensaje] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = buildWhatsAppMessage({
      nombre,
      telefono,
      mascota,
      servicio,
      fecha,
      mensaje,
    });
    const url = `https://wa.me/${waNumber}?text=${text}`;
    window.location.href = url;
  };

  return (
    <form onSubmit={onSubmit} className="form space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label>Nombre*</label>
          <input
            required
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
          />
        </div>
        <div>
          <label>Teléfono</label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej. 3312345678"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label>Mascota</label>
          <input
            type="text"
            value={mascota}
            onChange={(e) => setMascota(e.target.value)}
            placeholder="Nombre o especie/raza"
          />
        </div>
        <div>
          <label>Servicio</label>
          <select
            value={servicio}
            onChange={(e) => setServicio(e.target.value)}
          >
            <option>Consulta general</option>
            <option>Vacunas y desparasitación</option>
            <option>Urgencias</option>
            <option>Estética y baño</option>
            <option>Cirugía y esterilización</option>
            <option>Laboratorio y estudios</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label>Fecha preferida</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <button type="submit" className="btn-primary w-full md:w-auto">
            Enviar por WhatsApp
          </button>
        </div>
      </div>

      <div>
        <label>Comentarios</label>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          rows={4}
          placeholder="Describe síntomas, horarios, notas…"
        />
        <p className="help">Ej. tos leve desde ayer, prefiere tarde.</p> 
      </div>
    </form>
  );
}

export default function Page() {
  const whatsappUrl = `https://wa.me/${INFO.whatsapp}?text=${encodeURIComponent(
    "Hola, me gustaría agendar una cita 👋"
  )}`;
  const telUrl = `tel:${INFO.telefono.replace(/\s+/g, "")}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VeterinaryCare",
    name: INFO.nombre,
    url: "https://centralpet.mx",
    telephone: INFO.telefono,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Carretera Nextipac Km. 1 La Venta del Astillero",
      addressLocality: "Zapopan",
      addressRegion: "Jalisco",
      addressCountry: "MX",
    },
    openingHours: "Mo-Su 09:00-20:00",
    sameAs: [INFO.googleMaps],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* NAV */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b dark:bg-gray-900/80">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div
            style={{
              color: "var(--color-brown)",
              mixBlendMode: "difference",
              fontWeight: 600,
            }}
          >
            🐾 {INFO.nombre}
          </div>
          <ul className="hidden md:flex items-center gap-6 text-sm text-on-light dark:text-gray-200">
            <li>
              <a href="#servicios" className="hover:underline">
                Servicios
              </a>
            </li>
            <li>
              <a href="#nosotros" className="hover:underline">
                Nosotros
              </a>
            </li>
            <li>
              <a href="#testimonios" className="hover:underline">
                Testimonios
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:underline">
                FAQ
              </a>
            </li>
            <li>
              <a href="#contacto" className="hover:underline">
                Contacto
              </a>
            </li>
          </ul>
          <div className="flex items-center gap-3">
            <a href={whatsappUrl} className="btn-primary">
              Agendar por WhatsApp
            </a>
          </div>
        </nav>
      </header>

      {/* resto de tu contenido igual que antes */}
    </>
  );
}
