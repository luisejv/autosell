import { AutoSemiNuevo } from './auto-semi-nuevo';

export interface User {
  id?: number;
  email: string;
  password?: string;
  rol?: string;
  fbId?: string;
  nombre?: string;
  apellidos?: string;
  imagenPerfil?: string;
  numTelefono?: any;
  tipoLicencia?: any;
  tiempoLicencia?: any;
  trabajoAplicativo?: any;
  tipoDocumento?: any;
  numDocumento?: number;
  enabled?: boolean;
  validated?: boolean;
  balance?: number;
  cantidadCarrosAno?: number;
  carrosPosteados?: AutoSemiNuevo[];
  denuncias?: any[]; //TODO: interface denuncia
  interesadosReventas?: any[]; //TODO: interface interesado
  solicitudesRetiros?: any[];
  solicitudesRetiro?: any[];
  numeroDenuncias?: number;
  form?: Form;
}

interface Form {
  estado: boolean;
}
