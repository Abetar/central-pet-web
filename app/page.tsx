"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const INFO = {
  nombre: "Central Pet",
  telefono: "+52 33 2355 3635",
  whatsapp: "523323553635",
  direccion:
    "Carretera Nextipac Km. 1 La Venta del Astillero, 45221 Zapopan, Jal.",
  horario: "Lun-Vie 10:00–21:00\nSab 10:00–18:00\nDom 10:00–16:00",
  googleMaps: "https://maps.google.com/?q=Central+Pet,+20.7392495,-103.540059",
};

const TESTIMONIOS = [
  {
    texto:
      "Muy buena veterinaria, excelente atención médica y servicio de baño profesional 😌…",
    autor: "Nicolas MVZ.",
    url: "https://maps.app.goo.gl/LDCtaPcssqePCSqx5",
  },
  {
    texto:
      "El doctor fue muy amable y me explicó todo lo que pasaba con mi gatita. Es un plus que esté abierto todos los días en caso de alguna emergencia, como me pasó a mí.",
    autor: "Illo Farfán.",
    url: "https://maps.app.goo.gl/noYJZ9s1eU5nuTMM9",
  },
  {
    texto:
      "Excelente servicio, sucursal limpia, fueron rápidos, amables y muy profesionales 100% recomendados para cualquier procedimiento",
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
  children: ReactNode;
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
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* NAV: SIEMPRE light, usando .nav-solid del globals.css */}
      <header className="sticky top-0 z-50 nav-solid">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div
            style={{
              color: "var(--color-primary)",
              fontWeight: 700,
              fontSize: "1.125rem",
            }}
          >
            🐾 {INFO.nombre}
          </div>

          <ul className="hidden md:flex items-center gap-6 text-sm">
            {[
              { href: "#servicios", label: "Servicios" },
              { href: "#nosotros", label: "Nosotros" },
              { href: "#testimonios", label: "Testimonios" },
              { href: "#faq", label: "FAQ" },
              { href: "#contacto", label: "Contacto" },
            ].map((i) => (
              <li key={i.href}>
                <a href={i.href} className="hover:underline">
                  {i.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a href={whatsappUrl} className="btn-primary">
              Agendar por WhatsApp
            </a>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden text-on-dark">
        <div className="absolute inset-0 hero-aqua" />
        <div className="absolute inset-0">
          <Image
            src="/perrito.png"
            alt="Veterinaria cuidando un cachorro"
            fill
            priority
            className="object-cover opacity-30 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-28">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold leading-tight"
          >
            Cuidado integral para tu mascota
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-5 max-w-2xl text-lg opacity-90"
          >
            Consultas, vacunas, urgencias y estética. Atención cálida,
            diagnósticos claros y seguimiento real.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <a href={whatsappUrl} className="btn-primary">
              Agendar por WhatsApp
            </a>
            <a
              href={telUrl}
              className="btn-secondary"
              style={{
                backgroundColor: "transparent",
                color: "var(--surface)",
                borderColor: "var(--surface)",
              }}
            >
              Llamar: {INFO.telefono}
            </a>
          </motion.div>

          <div className="mt-8 text-sm opacity-85">
            {INFO.direccion} •{" "}
            <span style={{ whiteSpace: "pre-line" }}>{INFO.horario}</span>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <Section id="servicios" className="text-on-light">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-brown)]">
            Servicios
          </h2>
          <span className="tag-accent">Shop &amp; Shower</span>
        </div>
        <p className="mt-3 text-muted">Todo lo esencial para su salud y bienestar.</p>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { t: "Consulta general", d: "Evaluación, diagnóstico y plan de tratamiento." },
            { t: "Vacunas y desparasitación", d: "Calendario completo para cachorros y adultos." },
            { t: "Urgencias", d: "Atención rápida en situaciones críticas." },
            { t: "Estética y baño", d: "Baño, corte y cuidado dermatológico." },
            { t: "Cirugía y esterilización", d: "Protocolos seguros y control del dolor." },
            { t: "Laboratorio y estudios", d: "Análisis hematológicos, imagen y más." },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="card"
            >
              <h3 className="font-semibold text-lg text-[var(--color-brown)]">{s.t}</h3>
              <p className="mt-2 text-muted">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* NOSOTROS */}
      <Section id="nosotros" className="py-24 text-on-light">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-brown)]">
              Equipo cercano y profesional
            </h2>
            <p className="mt-4 text-muted">
              Somos un equipo con años de experiencia clínica y un trato humano.
              Te explicamos cada decisión médica con claridad y opciones.
            </p>
            <div className="mt-6 flex gap-3">
              <a href={whatsappUrl} className="btn-primary">Agendar cita</a>
              <a href="#contacto" className="btn-secondary">Cómo llegar</a>
            </div>
          </div>
          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden">
            <Image src="/perrito.png" alt="Equipo veterinario" fill className="object-cover" />
          </div>
        </div>
      </Section>

      {/* TESTIMONIOS */}
      <Section id="testimonios" className="text-on-light">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-brown)]">Testimonios</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {TESTIMONIOS.map((c, i) => (
            <a
              key={i}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card transition duration-200 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer block"
              aria-label={`Abrir reseña de ${c.autor} en Google Maps`}
            >
              <p className="italic text-default">“{c.texto}”</p>
              <footer className="mt-3 text-sm" style={{ color: "#6b7280" }}>— {c.autor}</footer>
              <span className="mt-4 inline-block text-sm text-[var(--color-secondary)] underline">
                Ver reseña en Google Maps
              </span>
            </a>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="text-on-light">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-brown)]">Preguntas frecuentes</h2>
        <div className="mt-6 space-y-4">
          {[
            { q: "¿Atienden urgencias?", a: "Sí. Recomendamos avisar por WhatsApp para preparar el ingreso." },
            { q: "¿Trabajan con citas?", a: "Sí. Agenda por WhatsApp para evitar esperas." },
            { q: "¿Aceptan todas las razas y especies?", a: "Perros y gatos. Para especies exóticas, consúltanos primero." },
          ].map((f, i) => (
            <details key={i} className="rounded-xl border bg-white p-4">
              <summary className="cursor-pointer font-medium text-default">{f.q}</summary>
              <p className="mt-2 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* CONTACTO */}
      <Section id="contacto" className="text-on-light">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-brown)]">Contacto</h2>
        <div className="mt-6 grid lg:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-xl font-semibold text-[var(--color-brown)] mb-4">
              Agenda por WhatsApp
            </h3>
            <WhatsAppForm waNumber={INFO.whatsapp} />
            <p className="mt-3 text-sm" style={{ color: "#6b7280" }}>
              Al enviar, te redirigiremos a WhatsApp con el mensaje armado.
            </p>
          </div>

          <div className="space-y-3 text-default">
            <p><strong>Dirección:</strong> {INFO.direccion}</p>
            <p>
              <strong>Horario:</strong>{" "}
              <span style={{ whiteSpace: "pre-line" }}>{INFO.horario}</span>
            </p>
            <p>
              <strong>Teléfono:</strong>{" "}
              <a className="underline text-[var(--color-secondary)]" href={telUrl}>
                {INFO.telefono}
              </a>
            </p>
            <p>
              <strong>WhatsApp directo:</strong>{" "}
              <a
                className="underline text-[var(--color-secondary)]"
                href={`https://wa.me/${INFO.whatsapp}`}
                target="_blank"
              >
                Abrir chat
              </a>
            </p>

            <iframe
              title="Mapa Google"
              className="w-full h-80 rounded-2xl border"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`${INFO.googleMaps}&output=embed`}
            />
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t py-8 text-center text-sm" style={{ color: "#6b7280", borderColor: "var(--border-color)" }}>
        © {new Date().getFullYear()} {INFO.nombre}. Todos los derechos reservados.
        <a href="https://agsolutions.dev/" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline font-medium">AG Solution Dev</a>
      </footer>
    </>
  );
}
