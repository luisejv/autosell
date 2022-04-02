import { Denuncia } from './denuncia';
import { User } from './user';

export interface AutoReportado {
  id: number;
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
  locacion: Locacion;
  comprado: string;
  validado: string;
  enabled: string;
  comisionUsuario: number;
  comisionVendedor: number;
  comisionEmpresa: number;
  fechaPublicacion: string;
  video: string;
  accesorios: string[];
  fotoPrincipal: string;
  descripcion: string;
  fotos: Foto[];
  solicitudRemocionAuto: string; //TODO: esto es una clase
  denuncias: Denuncia[];
  nombredeauto: string;
  tag?: string;
}

interface Foto {
  foto: string;
}

interface Locacion {
  id: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  enabled?: boolean;
}
