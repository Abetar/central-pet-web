export const clinic = {
 name: process.env.NEXT_PUBLIC_CLINIC_NAME || "Central Pet",
 whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "523323553635",
 address: process.env.NEXT_PUBLIC_CLINIC_ADDRESS || "",
 mapsUrl: process.env.NEXT_PUBLIC_CLINIC_MAPS_URL || "",
 hours: process.env.NEXT_PUBLIC_CLINIC_HOURS || "",
};
export const services = [
 {id:"consulta",name:"Consulta veterinaria",short:"Cuando algo no se siente bien.",description:"Una revisión para entender qué le pasa y cómo ayudarlo.",details:["Revisión del estado general","Orientación sobre el motivo de consulta","Plan de seguimiento según valoración"],icon:"stethoscope",tag:"Su salud, primero",image:"vet-care.webp"},
 {id:"prevencion",name:"Vacunas y prevención",short:"Cuidarlo también es anticiparse.",description:"Vacunación y desparasitación según su edad y estilo de vida.",details:["Revisión de cartilla","Orientación sobre vacunas y desparasitación","Seguimiento de cuidados preventivos"],icon:"shield",tag:"Un paso por delante",image:"vet-dog.webp"},
 {id:"seguimiento",name:"Seguimiento y bienestar",short:"A su lado en cada etapa.",description:"Revisiones y seguimiento en cada etapa de su vida.",details:["Revisión de evolución","Dudas sobre cuidados indicados","Orientación para su etapa de vida"],icon:"heart",tag:"Cuidar es acompañar",image:"vet-paw.webp"},
 {id:"felinos",name:"Atención para gatos",short:"A su ritmo. Con mucho cuidado.",description:"Una valoración para tu gato y orientación para preparar su visita.",details:["Consulta de valoración","Orientación para el traslado","Cuidados según edad y antecedentes"],icon:"cat",tag:"También hablamos miau",image:"vet-cat.webp"},
] as const;
export type Appointment = {name:string;pet:string;species:string;service:string;date:string;note:string};
export function appointmentMessage(data:Appointment){
 return ["Hola, "+clinic.name+". Me gustaría solicitar una cita veterinaria.","","Mi nombre: "+data.name.trim(),"Mascota: "+data.pet.trim()+" ("+data.species+")","Motivo: "+data.service,data.date?"Fecha preferida: "+data.date:"",data.note.trim()?"Comentario: "+data.note.trim():"","","¿Me confirman disponibilidad y costo de la consulta?"].filter((line,i,all)=>line!==""||all[i-1]!=="").join("\n");
}
