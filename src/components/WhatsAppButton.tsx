"use client";
import {clinic} from "@/lib/veterinary";
import {whatsappUrl} from "@/lib/whatsapp";
type Props={onUnavailable:()=>void};
export default function WhatsAppButton({onUnavailable}:Props){
 const href=whatsappUrl(`Hola, ${clinic.name}. Me gustaría información para agendar una consulta veterinaria para mi mascota.`);
 const content=<><span className="whatsapp-label">Agendemos su próxima visita</span><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 .5A15.4 15.4 0 0 0 2.65 23.55L.5 31.5l8.16-2.14A15.5 15.5 0 1 0 16 .5Zm0 28.16a12.7 12.7 0 0 1-6.5-1.78l-.46-.27-4.84 1.27 1.3-4.72-.3-.48A12.73 12.73 0 1 1 16 28.66Zm7-9.53c-.38-.19-2.26-1.11-2.61-1.24-.35-.12-.6-.19-.85.2-.25.37-.98 1.23-1.2 1.49-.22.25-.44.28-.82.1-.38-.2-1.6-.6-3.05-1.89-1.13-1-1.9-2.24-2.12-2.62-.22-.38-.02-.58.17-.77.17-.17.38-.44.57-.66.19-.22.25-.38.38-.63.12-.25.06-.47-.03-.66-.1-.19-.85-2.06-1.17-2.82-.3-.74-.62-.64-.85-.65h-.73c-.25 0-.66.09-1 .47-.35.38-1.32 1.3-1.32 3.18s1.36 3.69 1.55 3.94c.19.25 2.68 4.1 6.5 5.75.9.4 1.61.63 2.16.8.91.29 1.74.25 2.4.15.72-.1 2.25-.92 2.57-1.81.31-.89.31-1.65.22-1.81-.1-.16-.35-.25-.73-.44Z"/></svg></>;
 return href?<a className="whatsapp-float" href={href} target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp">{content}</a>:<button className="whatsapp-float" type="button" onClick={onUnavailable} aria-label="WhatsApp, contacto próximamente">{content}</button>;
}
