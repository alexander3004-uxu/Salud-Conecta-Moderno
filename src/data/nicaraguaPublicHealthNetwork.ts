import { Clinic } from '../types';

export const PUBLIC_HEALTH_NETWORK: Omit<Clinic, 'id'>[] = [
  // RACCS
  {
    name: "Hospital Regional Dr. Ernesto Sequeira Blanco",
    type: "hospital",
    sector: "public",
    address: "Barrio Central, Bluefields, RACCS",
    phone: "2575-1000",
    location: { lat: 12.0131, lng: -83.7635 },
    open24h: true,
    description: "Hospital Regional de referencia en la Costa Caribe Sur.",
    services: ["Emergencias", "Cirugía", "Maternidad"]
  },
  {
    name: "Hospital Primario Corn Island",
    type: "hospital",
    sector: "public",
    address: "Barrio Central, Corn Island, RACCS",
    phone: "N/D",
    location: { lat: 12.169, lng: -83.056 },
    description: "Hospital Primario brindando atención a la población de la isla.",
    services: ["Consulta General", "Emergencias"]
  },
  {
    name: "Hospital Primario Kukra Hill",
    type: "hospital",
    sector: "public",
    address: "Frente al parque central, Kukra Hill, RACCS",
    phone: "N/D",
    location: { lat: 12.378, lng: -83.748 },
    description: "Atención primaria para el municipio de Kukra Hill.",
    services: ["Consulta General", "Urgencias"]
  },
  {
    name: "Centro de Salud Laguna de Perlas",
    type: "health-center",
    sector: "public",
    address: "Barrio Central, Laguna de Perlas, RACCS",
    phone: "N/D",
    location: { lat: 12.348, lng: -83.674 },
    services: ["Medicina General", "Vacunación"]
  },
  {
    name: "Centro de Salud Desembocadura del Río Grande",
    type: "health-center",
    sector: "public",
    address: "Frente al parque central, Desembocadura del Río Grande, RACCS",
    phone: "N/D",
    location: { lat: 12.872, lng: -83.568 },
    services: ["Atención Básica"]
  },
  {
    name: "Puesto de Salud El Rama",
    type: "health-center",
    sector: "public",
    address: "Comunidad El Rama, RACCS",
    phone: "N/D",
    location: { lat: 12.155, lng: -84.225 },
    services: ["Consulta Comunitaria"]
  },
  {
    name: "Casa Materna Santa María",
    type: "clinic",
    sector: "public",
    address: "Barrio Central, Bluefields, RACCS",
    phone: "N/D",
    location: { lat: 12.0135, lng: -83.7630 },
    description: "Hogar de espera materna para embarazadas de comunidades lejanas.",
    services: ["Acompañamiento embarazo", "Nutrición"]
  },
  // Río San Juan
  {
    name: "Hospital Departamental Luis Felipe Moncada",
    type: "hospital",
    sector: "public",
    address: "Barrio Central, San Carlos, Río San Juan",
    phone: "2763-1000",
    location: { lat: 11.126, lng: -84.777 },
    open24h: true,
    description: "Hospital Departamental de Río San Juan.",
    services: ["Emergencias", "Especialidades Básicas"]
  },
  {
    name: "Hospital Primario San Miguel",
    type: "hospital",
    sector: "public",
    address: "Frente al parque central, El Almendro, Río San Juan",
    phone: "N/D",
    location: { lat: 11.677, lng: -84.846 },
    services: ["Atención Primaria"]
  },
  {
    name: "Hospital Primario San Pedro",
    type: "hospital",
    sector: "public",
    address: "Barrio Central, San Miguelito, Río San Juan",
    phone: "N/D",
    location: { lat: 11.408, lng: -84.901 },
    services: ["Emergencias", "Consulta Externa"]
  },
  {
    name: "Centro de Salud Morrito",
    type: "health-center",
    sector: "public",
    address: "Frente al parque central, Morrito, Río San Juan",
    phone: "N/D",
    location: { lat: 11.621, lng: -85.080 },
    services: ["Atención Médica"]
  },
  {
    name: "Centro de Salud El Castillo",
    type: "health-center",
    sector: "public",
    address: "Barrio Central, El Castillo, Río San Juan",
    phone: "N/D",
    location: { lat: 11.018, lng: -84.402 },
    services: ["Atención Primaria"]
  },
  {
    name: "Puesto de Salud San Juan del Norte",
    type: "health-center",
    sector: "public",
    address: "Comunidad San Juan del Norte, Río San Juan",
    phone: "N/D",
    location: { lat: 10.925, lng: -83.702 },
    services: ["Atención Básica"]
  },
  {
    name: "Casa Materna Virgen del Carmen",
    type: "clinic",
    sector: "public",
    address: "Barrio Central, San Carlos, Río San Juan",
    phone: "N/D",
    location: { lat: 11.127, lng: -84.778 },
    services: ["Atención a embarazadas"]
  },
  // Chontales
  {
    name: "Hospital Regional Asunción",
    type: "hospital",
    sector: "public",
    address: "Km 141 carretera Managua - El Rama, Juigalpa, Chontales",
    phone: "2512-2000",
    location: { lat: 12.106, lng: -85.364 },
    open24h: true,
    description: "Hospital Regional de referencia para la zona central.",
    services: ["Emergencias", "Cirugía", "UCI"]
  },
  {
    name: "Hospital Primario San Francisco",
    type: "hospital",
    sector: "public",
    address: "Frente al parque central, Acoyapa, Chontales",
    phone: "N/D",
    location: { lat: 11.970, lng: -85.172 },
    services: ["Consulta General"]
  },
  {
    name: "Hospital Primario San Pedro (Chontales)",
    type: "hospital",
    sector: "public",
    address: "Barrio Central, Comalapa, Chontales",
    phone: "N/D",
    location: { lat: 12.284, lng: -85.511 },
    services: ["Emergencias"]
  },
  {
    name: "Centro de Salud La Libertad",
    type: "health-center",
    sector: "public",
    address: "Frente al parque central, La Libertad, Chontales",
    phone: "N/D",
    location: { lat: 12.215, lng: -85.166 },
    services: ["Atención Básica"]
  },
  {
    name: "Centro de Salud Santo Domingo",
    type: "health-center",
    sector: "public",
    address: "Barrio Central, Santo Domingo, Chontales",
    phone: "N/D",
    location: { lat: 12.261, lng: -85.082 },
    services: ["Medicina General"]
  },
  {
    name: "Puesto de Salud Villa Sandino",
    type: "health-center",
    sector: "public",
    address: "Comunidad Villa Sandino, Chontales",
    phone: "N/D",
    location: { lat: 12.124, lng: -84.995 },
    services: ["Atención Comunitaria"]
  },
  {
    name: "Casa Materna Virgen del Rosario",
    type: "clinic",
    sector: "public",
    address: "Barrio Central, Juigalpa, Chontales",
    phone: "N/D",
    location: { lat: 12.107, lng: -85.365 },
    services: ["Acompañamiento Materno"]
  },
  // Nueva Segovia
  {
    name: "Hospital Departamental Alfonso Moncada Guillén",
    type: "hospital",
    sector: "public",
    address: "Barrio Central, Ocotal, Nueva Segovia",
    phone: "2734-1000",
    location: { lat: 13.504, lng: -86.481 },
    open24h: true,
    services: ["Emergencias", "Especialidades Médicas"]
  },
  {
    name: "Hospital Primario San Fernando",
    type: "hospital",
    sector: "public",
    address: "Frente al parque central, San Fernando, Nueva Segovia",
    phone: "N/D",
    location: { lat: 13.676, lng: -86.315 },
    services: ["Consulta General"]
  },
  {
    name: "Hospital Primario Mozonte",
    type: "hospital",
    sector: "public",
    address: "Barrio Central, Mozonte, Nueva Segovia",
    phone: "N/D",
    location: { lat: 13.541, lng: -86.442 },
    services: ["Atención Primaria"]
  },
  {
    name: "Centro de Salud Jalapa",
    type: "health-center",
    sector: "public",
    address: "Barrio Central, Jalapa, Nueva Segovia",
    phone: "N/D",
    location: { lat: 13.917, lng: -86.133 },
    services: ["Emergencias Básicas"]
  },
  {
    name: "Centro de Salud Dipilto",
    type: "health-center",
    sector: "public",
    address: "Frente al parque central, Dipilto, Nueva Segovia",
    phone: "N/D",
    location: { lat: 13.593, lng: -86.505 },
    services: ["Atención Médica"]
  },
  {
    name: "Puesto de Salud Murra",
    type: "health-center",
    sector: "public",
    address: "Comunidad Murra, Nueva Segovia",
    phone: "N/D",
    location: { lat: 13.765, lng: -86.012 },
    services: ["Consulta Básica"]
  },
  // Madriz
  {
    name: "Hospital Departamental Juan Antonio Brenes Palacios",
    type: "hospital",
    sector: "public",
    address: "Barrio Central, Somoto, Madriz",
    phone: "2732-1000",
    location: { lat: 13.481, lng: -86.582 },
    open24h: true,
    services: ["Emergencias", "Cirugía"]
  },
  {
    name: "Hospital Primario San Lucas",
    type: "hospital",
    sector: "public",
    address: "Frente al parque central, San Lucas, Madriz",
    phone: "N/D",
    location: { lat: 13.414, lng: -86.611 },
    services: ["Atención Primaria"]
  },
  {
    name: "Hospital Primario Las Sabanas",
    type: "hospital",
    sector: "public",
    address: "Barrio Central, Las Sabanas, Madriz",
    phone: "N/D",
    location: { lat: 13.315, lng: -86.643 },
    services: ["Atención Médica"]
  },
  {
    name: "Centro de Salud Totogalpa",
    type: "health-center",
    sector: "public",
    address: "Frente al parque central, Totogalpa, Madriz",
    phone: "N/D",
    location: { lat: 13.563, lng: -86.491 },
    services: ["Medicina General"]
  },
  {
    name: "Centro de Salud Palacagüina",
    type: "health-center",
    sector: "public",
    address: "Barrio Central, Palacagüina, Madriz",
    phone: "N/D",
    location: { lat: 13.456, lng: -86.408 },
    services: ["Atención Básica"]
  },
  // Estelí
  {
    name: "Hospital Departamental Pedro Altamirano",
    type: "hospital",
    sector: "public",
    address: "Km 123 ½ Panamericana, La Trinidad, Estelí",
    phone: "2712-5000",
    location: { lat: 12.966, lng: -86.233 },
    open24h: true,
    services: ["Emergencias", "UCI"]
  },
  {
    name: "Hospital Primario Ada María López",
    type: "hospital",
    sector: "public",
    address: "Bo. Bayron Jiménez, Condega, Estelí",
    phone: "N/D",
    location: { lat: 13.352, lng: -86.398 },
    services: ["Atención Primaria"]
  },
  {
    name: "Hospital Primario San Nicolás",
    type: "hospital",
    sector: "public",
    address: "Barrio Central, San Nicolás, Estelí",
    phone: "N/D",
    location: { lat: 12.932, lng: -86.345 },
    services: ["Consulta General"]
  },
  // Jinotega
  {
    name: "Hospital Departamental Victoria Motta",
    type: "hospital",
    sector: "public",
    address: "Barrio Central, Jinotega",
    phone: "2782-1000",
    location: { lat: 13.092, lng: -86.002 },
    open24h: true,
    services: ["Emergencias", "Especialidades"]
  },
  {
    name: "Hospital Primario San Rafael",
    type: "hospital",
    sector: "public",
    address: "Frente al parque central, San Rafael del Norte, Jinotega",
    phone: "N/D",
    location: { lat: 13.212, lng: -86.111 },
    services: ["Consulta General"]
  },
  // Matagalpa
  {
    name: "Hospital Departamental César Amador Molina",
    type: "hospital",
    sector: "public",
    address: "Barrio El Laborío, Matagalpa",
    phone: "2772-1000",
    location: { lat: 12.925, lng: -85.917 },
    open24h: true,
    services: ["Emergencias", "Cirugía"]
  },
  {
    name: "Hospital Primario San José",
    type: "hospital",
    sector: "public",
    address: "Frente al parque central, San Ramón, Matagalpa",
    phone: "N/D",
    location: { lat: 12.923, lng: -85.839 },
    services: ["Atención Primaria"]
  },
  {
    name: "Hospital Primario San Francisco (Matagalpa)",
    type: "hospital",
    sector: "public",
    address: "Barrio Central, Sébaco, Matagalpa",
    phone: "N/D",
    location: { lat: 12.855, lng: -86.101 },
    services: ["Consulta Médica"]
  },
  // Rivas
  {
    name: "Hospital Departamental Gaspar García Laviana",
    type: "hospital",
    sector: "public",
    address: "Barrio San Pedro, Rivas",
    phone: "2563-1000",
    location: { lat: 11.437, lng: -85.830 },
    open24h: true,
    services: ["Emergencias", "Especialidades"]
  },
  {
    name: "Hospital Primario San Carlos Borromeo",
    type: "hospital",
    sector: "public",
    address: "Barrio Central, San Juan del Sur, Rivas",
    phone: "N/D",
    location: { lat: 11.252, lng: -85.871 },
    services: ["Atención Turística y Local"]
  },
  // Granada
  {
    name: "Hospital Departamental Amistad Japón-Nicaragua",
    type: "hospital",
    sector: "public",
    address: "Barrio Xalteva, Granada",
    phone: "2552-1000",
    location: { lat: 11.9366, lng: -85.9764 },
    open24h: true,
    services: ["Emergencias", "Cirugía", "Maternidad"]
  },
  // Masaya
  {
    name: "Hospital Departamental Humberto Alvarado Vásquez",
    type: "hospital",
    sector: "public",
    address: "Barrio Monimbó, Masaya",
    phone: "2528-1000",
    location: { lat: 11.974, lng: -86.094 },
    open24h: true,
    services: ["Emergencias", "Especialidades"]
  },
  // Carazo
  {
    name: "Hospital Regional Santiago",
    type: "hospital",
    sector: "public",
    address: "Barrio José Antonio Sánchez, Jinotepe, Carazo",
    phone: "2522-3000",
    location: { lat: 11.850, lng: -86.199 },
    open24h: true,
    services: ["Emergencias", "Especialidades"]
  },
  // Chinandega
  {
    name: "Hospital Departamental España",
    type: "hospital",
    sector: "public",
    address: "Colonia Roberto González, Chinandega",
    phone: "2341-4000",
    location: { lat: 12.628, lng: -87.129 },
    open24h: true,
    services: ["Emergencias", "Cirugía"]
  },
  // León
  {
    name: "Hospital Escuela Oscar Danilo Rosales Argüello (HEODRA)",
    type: "hospital",
    sector: "public",
    address: "Barrio Guadalupe, León",
    phone: "2311-2000",
    location: { lat: 12.437, lng: -86.877 },
    open24h: true,
    services: ["Emergencias", "Docencia", "Especialidades"]
  },
  // Boaco
  {
    name: "Hospital Departamental José Nieborowsky",
    type: "hospital",
    sector: "public",
    address: "Carretera Boaco-Muy Muy, Boaco",
    phone: "2542-1000",
    location: { lat: 12.472, lng: -85.658 },
    open24h: true,
    services: ["Emergencias", "Medicina General"]
  },
  // RACCN
  {
    name: "Hospital Regional Nuevo Amanecer",
    type: "hospital",
    sector: "public",
    address: "Barrio Los Ángeles, Puerto Cabezas, RACCN",
    phone: "2572-1000",
    location: { lat: 14.030, lng: -83.388 },
    open24h: true,
    services: ["Emergencias", "Atención Regional"]
  },
  {
    name: "Hospital Primario Oswaldo Padilla",
    type: "hospital",
    sector: "public",
    address: "Barrio Esteban Jaenz, Waspán, RACCN",
    phone: "N/D",
    location: { lat: 14.741, lng: -83.972 },
    services: ["Medicina General"]
  },
  // Managua Nacionales
  {
    name: "Hospital Manolo Morales",
    type: "hospital",
    sector: "public",
    address: "Carretera Norte, Managua",
    phone: "2255-6800",
    location: { lat: 12.136, lng: -86.251 },
    open24h: true,
    services: ["Emergencias Especializadas", "UCI"]
  },
  {
    name: "Hospital Lenin Fonseca",
    type: "hospital",
    sector: "public",
    address: "Carretera Norte, km 4 ½, Managua",
    phone: "2255-7000",
    location: { lat: 12.155, lng: -86.225 },
    open24h: true,
    services: ["Especialidades Quirúrgicas", "Nefrología"]
  },
  {
    name: "Hospital Bertha Calderón",
    type: "hospital",
    sector: "public",
    address: "Barrio Monseñor Lezcano, Managua",
    phone: "2255-7200",
    location: { lat: 12.128, lng: -86.289 },
    open24h: true,
    services: ["Ginecología", "Obstetricia", "Neonatología"]
  },
  {
    name: "Centro Nacional de Oftalmología",
    type: "health-center",
    sector: "public",
    address: "Complejo Nacional de Salud, Managua",
    phone: "2255-6820",
    location: { lat: 12.1365, lng: -86.2515 },
    services: ["Oftalmología", "Cirugía Ocular"]
  },
  {
    name: "Centro Nacional de Radioterapia",
    type: "health-center",
    sector: "public",
    address: "Complejo Nacional de Salud, Managua",
    phone: "2255-6830",
    location: { lat: 12.1370, lng: -86.2520 },
    services: ["Oncología", "Radioterapia"]
  }
];
