import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  monedas: string[] = ['PEN', 'USD', 'EUR'];

  tiposDeCarro: string[] = ['Nuevo', 'De Segunda'];

  ciudades: string[] = [
    'Lima',
    'Huancayo',
    'Ayacucho',
    'Iquitos',
    'Chiclayo',
    'Casma',
    'Mollendo',
    'Callao',
    'Ica',
    'Pisco',
    'Pucallpa',
    'Jauja',
    'Puno',
    'Churín',
    'Tarma',
    'La Oroya',
    'Arequipa',
  ];

  departamentos: string[] = [
    'Amazonas',
    'Áncash',
    'Apurímac',
    'Arequipa',
    'Ayacucho',
    'Cajamarca',
    'Cuzco',
    'Huancavelica',
    'Huánuco',
    'Ica',
    'Junín',
    'La Libertad',
    'Lambayeque',
    'Lima',
    'Lima provincia',
    'Loreto',
    'Madre de Dios',
    'Moquegua',
    'Pasco',
    'Piura',
    'Puno',
    'San Martín',
    'Tacna',
    'Tumbes',
    'Ucayali',
  ];

  tiposTransmision: string[] = [
    'Mecánico',
    'Automático',
    'Automático/Secuencial',
  ];

  tiposCombustible: string[] = [
    'Diesel',
    'Gasolina',
    'GLP',
    'GNV',
    'Eléctrico',
    'Híbrido',
  ];

  tiposCarroceria: string[] = [
    'SUV',
    'Van',
    'Sedán',
    'Coupé',
    'Pick up',
    'Convertible',
    'Citycar',
    'Hatchback',
    'Camión',
    'Panel',
    'OTRO',
  ];

  tiposTracciones: string[] = ['4x4', '4x2 Delantera', '4x2 Trasera', 'AWD'];

  anos: string[] = [
    '2000',
    '2001',
    '2002',
    '2003',
    '2004',
    '2005',
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
  ];

  constructor() {}
}
