import { Denuncia } from './denuncia';
import { User } from './user';

export interface AutoSemiNuevo {
  id?: number;
  usuario: User;
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
  comisionUsuario?: number;
  comisionVendedor?: number;
  comisionEmpresa?: number;
  fechaPublicacion?: string;
  video?: string;
  fotoPrincipal: string;
  fotos?: Foto[];
  accesorios?: string[];
  locacion?: Locacion;
  descripcion?: string;
  denuncias?: Denuncia[];
  solicitudRemocionAuto?: boolean; //TODO: esto es una clase
  nombredeauto?: string;
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
  id: number;
  autoSemiNuevo: AutoSemiNuevo;
  level: number;
}
