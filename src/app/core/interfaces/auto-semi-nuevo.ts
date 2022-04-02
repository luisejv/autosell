import { Accesorio } from './accesorio';
import { Denuncia } from './denuncia';
import { User } from './user';

export interface AutoSemiNuevo {
  id?: number;
  // usuario: User;
  placa: string;
  serie: string;
  correoDueno: string;
  nombreDueno: string;
  telefonoDueno: string;
  marca: string;
  modelo: string;
  anoFabricacion: number;
  tipoCambios: string;
  tipoCombustible: string;
  tipoCarroceria: string;
  cilindrada: number;
  kilometraje: number;
  numeroPuertas: number;
  tipoTraccion: string;
  color: string;
  numeroCilindros: number;
  precioVenta: number;
  comprado?: boolean;
  validado?: boolean;
  enabled?: boolean;
  revisado?: boolean;
  comisionUsuario?: number;
  comisionVendedor?: number;
  comisionEmpresa?: number;
  fechaPublicacion?: string;
  video?: string;
  fotoPrincipal: string;
  fotos?: string[];
  accesorios?: Accesorio[];
  locacion?: string;
  descripcion?: string;
  denuncias?: Denuncia[];
  solicitudRemocionAuto?: boolean; //TODO: esto es una clase
  nombredeauto?: string;
  version?: string;
  mantenimiento?: string;
  unicoDueno?: boolean;
  vin?: string;
  tag?: string;
  registrador?: any;

  // ? De Auto Nuevo:
  concesionarios?: string;
  documentacion?: string;
  moneda?: string;
  usoauto?: string[];
  presentar?: boolean;
  codVersion?: string;
  locaciones?: string[];
}

interface Foto {
  foto: string;
}

export interface Locacion {
  id: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  enabled?: boolean;
}

export interface SponsoredCar {
  id?: number;
  autoSemiNuevo: AutoSemiNuevo;
  level?: number;
}
