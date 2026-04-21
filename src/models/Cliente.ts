import mongoose, { Schema, Document, Model } from "mongoose";


export interface ServicioCliente {
  nombre: string;
  precio: number;
  horasIncluidas: number;
  notas?: string;
}

export interface DatosFiscales {
  razonSocial: string;
  cif: string;
  direccion: string;
  cp: string;
  localidad: string;
  provincia: string;
  pais: string;
}

export interface ICliente extends Document {
  nombre: string;
  empresa?: string;
  email: string;
  telefono?: string;
  web?: string;
  localidad?: string;
  datosFiscales?: DatosFiscales;
  serviciosContratados: ServicioCliente[];
  tarifaHoraExtra: number;
  estado: "activo" | "inactivo" | "potencial";
  fechaAlta: Date;
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}


const ServicioClienteSchema = new Schema<ServicioCliente>({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  horasIncluidas: { type: Number, default: 0 },
  notas: { type: String },
}, { _id: false });

const DatosFiscalesSchema = new Schema<DatosFiscales>({
  razonSocial: { type: String, required: true },
  cif: { type: String, required: true },
  direccion: { type: String, required: true },
  cp: { type: String, required: true },
  localidad: { type: String, required: true },
  provincia: { type: String, required: true },
  pais: { type: String, required: true },
}, { _id: false });

const ClienteSchema = new Schema<ICliente>({
  nombre: { type: String, required: true },
  empresa: { type: String },
  email: { type: String, required: true },
  telefono: { type: String },
  web: { type: String },
  localidad: { type: String },
  datosFiscales: { type: DatosFiscalesSchema },
  serviciosContratados: { type: [ServicioClienteSchema], default: [] },
  tarifaHoraExtra: { type: Number, default: 0 },
  estado: {
    type: String,
    enum: ["activo", "inactivo", "potencial"],
    default: "activo",
  },
  fechaAlta: { type: Date, default: Date.now },
  notas: { type: String },
}, { timestamps: true });

const Cliente: Model<ICliente> =
  mongoose.models.Cliente || mongoose.model<ICliente>("Cliente", ClienteSchema);

export default Cliente;
