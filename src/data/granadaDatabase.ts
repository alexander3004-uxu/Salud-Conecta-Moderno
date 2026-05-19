/**
═══════════════════════════════════════════════════════════════
BASE DE DATOS DE SALUD — Salud-Conecta IA (Granada, Nicaragua)
═══════════════════════════════════════════════════════════════
📌 VERSIÓN: 7.4.0
📌 ÚLTIMA ACTUALIZACIÓN: 2026-04-15
📌 CAMBIOS v7.4.0:
- Nuevos centros: 3 clínicas, 2 laboratorios, 4 farmacias
- Nueva categoría: LABORATORIOS integrada en el mapa
- Mejoras en la visualización de información completa (v7.2+)
═══════════════════════════════════════════════════════════════
*/

export const VERSION_BASE_DATOS = '7.4.0';
export const ULTIMA_ACTUALIZACION = '2026-04-16';

// ═══════════════════════════════════════════════════════════════
//  🏥 HOSPITALES
// ═══════════════════════════════════════════════════════════════
export const HOSPITALES = [
  {
    id: 1,
    categoria: 'hospital',
    nombre: 'Hospital Amistad Japón Nicaragua',
    direccion: 'Km 44.5 Carretera Granada-Masaya, Barrio El Capullo',
    telefono: '2552-7050',
    emergencia: true,
    lat: 11.93749, lng: -85.97651,
    horario: '24 horas',
    servicios: ['urgencias','consulta','hospitalizacion','laboratorio','rayos_x','cirugia','pediatria','ginecologia','maternidad','oncologia','medicina_natural'],
    disponible: true, verificado: true,
    barrio: 'Barrio El Capullo',
    notas: 'Hospital Departamental público principal de Granada (MINSA/SILAIS). Urgencias 24h gratuitas. Referencia departamental.',
    seguros: ['INSS','MINSA','Atención gratuita']
  },
];

// ═══════════════════════════════════════════════════════════════
//  🏥 CLÍNICAS / CENTROS DE SALUD
// ═══════════════════════════════════════════════════════════════
export const CLINICAS = [
  {
    id: 5, categoria: 'clinica',
    nombre: 'Centro de Salud Villa Sandino',
    direccion: 'Barrio Villa Sandino, Granada',
    telefono: '2552-0800', emergencia: false,
    lat: 11.940325538533882, lng: -85.95034747503418,
    horario: 'Lun-Vie 7am-5pm',
    servicios: ['consulta','vacunacion','curaciones'],
    disponible: true, verificado: true,
    barrio: 'Villa Sandino',
    notas: 'Centro de Salud MINSA. Atención gratuita.',
    seguros: ['MINSA','Atención gratuita']
  },
  
  {
    id: 8, categoria: 'clinica',
    nombre: 'CMP MINSA — Amistad Japón Nicaragua',
    direccion: 'Km 44.5 Carretera Granada-Masaya, junto al Hospital',
    telefono: '2552-7060', emergencia: false,
    lat: 11.9378, lng: -85.9768,
    horario: 'Lun-Vie 7am-4pm',
    servicios: ['consulta','especialidades','laboratorio','ultrasonido','fisioterapia'],
    disponible: true, verificado: true,
    barrio: 'Barrio El Capullo',
    notas: 'Clínica Médica Previsional MINSA. Atención INSS.',
    seguros: ['INSS']
  },
  {
    id: 9, categoria: 'clinica',
    nombre: 'Centro de Salud Pedro José Chamorro',
    direccion: 'Shell Palmira 1/2 Cuadra al sur, Barrio Calle Palmira',
    telefono: '2552-0550', emergencia: false,
    lat: 11.924550288880951, lng: -85.9551822857508,
    horario: 'Lun-Vie 7am-5pm',
    servicios: ['consulta','vacunacion','curaciones','control_nino_sano'],
    disponible: true, verificado: true,
    barrio: 'Barrio Calle Palmira',
    notas: 'Centro de Salud MINSA. Atención gratuita.',
    seguros: ['MINSA','Atención gratuita']
  },
  
{
    id: 10, categoria: 'clinica',
    nombre: 'Centro de Salud Jorge Sinforoso Bravo',
    direccion: 'Costado norte del Parque Sandino, Barrio Estación',
    telefono: '2552-0600',
    emergencia: false,
    lat: 11.937906439969485, lng: -85.95607792577198,
    horario: 'Lun-Vie 7am-8pm, Sab-Dom 7am-12pm',
    servicios: ['urgencias','consulta','vacunacion','maternidad','pediatria','laboratorio','medicina_natural'],
    disponible: true, verificado: true,
    barrio: 'Barrio Estación',
    notas: 'Centro de Salud principal MINSA Granada. Frente al Parque Sandino. Atención gratuita.',
    seguros: ['MINSA','Atención gratuita']
  }

];

// ═══════════════════════════════════════════════════════════════
//  🔬 LABORATORIOS
// ═══════════════════════════════════════════════════════════════
export const LABORATORIOS = [
 
];

// ═══════════════════════════════════════════════════════════════
//  💊 FARMACIAS
// ═══════════════════════════════════════════════════════════════
export const FARMACIAS = [
  {
    id: 12, categoria: 'farmacia',
    nombre: 'Farmacia Praga',
    direccion: 'Calle Real Xalteva, Granada',
    telefono: '2552-5726', emergencia: true,
    lat: 11.929166203335145, lng: -85.95543572290977,
    horario: '8 am - 10 pm',
    servicios: ['medicamentos'],
    disponible: true, verificado: true,
    barrio: 'Xalteva',
    notas: 'Precios económicos.'
  },
  
];

// ═══════════════════════════════════════════════════════════════
//  💊 MEDICAMENTOS
// ═══════════════════════════════════════════════════════════════
export const MEDICAMENTOS = [
  // ════════════════════════════════════════════════════════
  //  GRUPO 1 — ANALGÉSICOS Y ANTIPIRÉTICOS
  // ════════════════════════════════════════════════════════
  {
    id: 1,
    nombre_es: 'Paracetamol',
    nombre_en: 'Acetaminophen',
    nombres_comerciales: ['Tempra','Panadol','Tylenol','Acetaminofén MK','Tabcin','Dolartrin'],
    sinonimos: ['acetaminofen','acetaminofén','tylenol','panadol','tempra','paracetamol mk','tabcin','dolartrin'],
    categoria: 'Analgésico/Antipirético',
    uso_principal: 'Dolor leve a moderado, fiebre, dolor de cabeza, dolor muscular',
    dosis_adulto: '500-1000 mg cada 6-8 horas (máximo 4 g por día)',
    dosis_nino: '10-15 mg/kg cada 6 horas (consultar médico)',
    contraindicaciones: 'Enfermedad hepática grave, alergia al paracetamol, consumo de alcohol',
    efectos_secundarios: 'Raro: daño hepático con sobredosis. No exceder dosis máxima.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '25-192 C$ (según presentación: gotas 25C$, jarabe 33-92.50C$, tabletas 43-192C$)',
    embarazo: 'Categoría B — Seguro bajo supervisión médica'
  },
  {
    id: 2,
    nombre_es: 'Ibuprofeno',
    nombre_en: 'Ibuprofen',
    nombres_comerciales: ['Advil','Motrin','Nurofen','Ibuprofeno MK','Aleve','Ibuwin'],
    sinonimos: ['advil','motrin','ibuprofeno','ibuprofeno mk','aleve','ibuwin'],
    categoria: 'Antiinflamatorio No Esteroideo (AINE)',
    uso_principal: 'Dolor, inflamación, fiebre, dolor muscular, artritis',
    dosis_adulto: '400-600 mg cada 6-8 horas (máximo 2.4 g por día). Tomar con comida.',
    dosis_nino: '5-10 mg/kg cada 6-8 horas (consultar médico)',
    contraindicaciones: 'Úlceras gástricas, enfermedad renal, embarazo en 3er trimestre, alergia a AINEs',
    efectos_secundarios: 'Malestar estomacal, mareos. Tomar con alimentos.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '48.50-611 C$ (según presentación: jarabe 31-48.50C$, tabletas 63-242C$, forte 361.50-611C$)',
    embarazo: 'Categoría C — Evitar en 3er trimestre'
  },
  {
    id: 3,
    nombre_es: 'Amoxicilina',
    nombre_en: 'Amoxicillin',
    nombres_comerciales: ['Amoxal','Trimox','Novamox','Amoxicilina MK','Solkamox','Cilamox'],
    sinonimos: ['amoxal','amoxicillin','amoxicilina mk','solkamox','cilamox'],
    categoria: 'Antibiótico (Betalactámico)',
    uso_principal: 'Infecciones bacterianas: garganta, oído, sinusitis, urinarias, bronquitis',
    dosis_adulto: '500 mg cada 8 horas, o 875 mg cada 12 horas (7-10 días)',
    dosis_nino: '20-40 mg/kg/día dividido en 3 dosis (consultar médico)',
    contraindicaciones: 'Alergia a penicilinas o cefalosporinas, mononucleosis infecciosa',
    efectos_secundarios: 'Diarrea, náuseas, erupción cutánea. Completar el tratamiento.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '32-206 C$ (según presentación: suspensión 32-89C$, cápsulas 127-206C$)',
    embarazo: 'Categoría B — Generalmente seguro con prescripción'
  },
  {
    id: 4,
    nombre_es: 'Omeprazol',
    nombre_en: 'Omeprazole',
    nombres_comerciales: ['Losec','Prilosec','Omepral','Omeprazol MK'],
    sinonimos: ['losec','prilosec','omepral','omeprazol mk'],
    categoria: 'Inhibidor de Bomba de Protones (IBP)',
    uso_principal: 'Acidez, reflujo gastroesofágico (ERGE), úlceras gástricas, gastritis',
    dosis_adulto: '20-40 mg una vez al día, 30 min antes del desayuno',
    dosis_nino: 'Consultar médico (uso pediátrico con supervisión)',
    contraindicaciones: 'Alergia al omeprazol o benzimidazoles. Interacción con clopidogrel.',
    efectos_secundarios: 'Dolor de cabeza, diarrea, náuseas. Uso prolongado puede reducir vitamina B12.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '44-83 C$ (según presentación: inyectable 44C$, cápsulas 83C$)',
    embarazo: 'Categoría C — Consultar médico'
  },
  {
    id: 5,
    nombre_es: 'Ácido Fólico',
    nombre_en: 'Folic Acid',
    nombres_comerciales: ['Folamil','Acido Fólico MK','Folato'],
    sinonimos: ['acido folico','folato','folic acid','folamil','vitamina b9'],
    categoria: 'Vitamina B9 / Suplemento Prenatal',
    uso_principal: 'Prevención de defectos del tubo neural en el feto. Anemia megaloblástica. Suplemento prenatal.',
    dosis_adulto: '400-800 mcg una vez al día (iniciar 1 mes antes del embarazo)',
    dosis_nino: 'Consultar médico pediátrico',
    contraindicaciones: 'Alergia al ácido fólico. Puede enmascarar deficiencia de vitamina B12.',
    efectos_secundarios: 'Muy raros: náuseas leves, malestar estomacal',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '143 C$ (100 tabletas)',
    embarazo: 'Categoría A — SEGURO y RECOMENDADO en embarazo',
    trimestres: 'Especialmente importante en primer trimestre'
  },
  {
    id: 6,
    nombre_es: 'Loratadina',
    nombre_en: 'Loratadine',
    nombres_comerciales: ['Claritin','Loratadina MK','Clarityne','Histiacil','Restaler'],
    sinonimos: ['claritin','clarityne','histiacil','antihistaminico','loratadina mk','restaler'],
    categoria: 'Antihistamínico (no sedante)',
    uso_principal: 'Alergias, rinitis alérgica, urticaria, picazón ocular, estornudos frecuentes',
    dosis_adulto: '10 mg una vez al día (no causa sueño)',
    dosis_nino: '5 mg una vez al día (niños 2-12 años, consultar médico)',
    contraindicaciones: 'Alergia a la loratadina. Precaución en insuficiencia hepática grave.',
    efectos_secundarios: 'Dolor de cabeza, boca seca. Generalmente bien tolerado.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '26-159.50 C$ (según presentación: jarabe 35-48C$, tabletas 62-159.50C$)',
    embarazo: 'Categoría B — Generalmente seguro, consultar médico'
  },
  {
    id: 7,
    nombre_es: 'Metronidazol',
    nombre_en: 'Metronidazole',
    nombres_comerciales: ['Flagyl','Metronidazol MK','Rozex','Metrazol'],
    sinonimos: ['flagyl','metronidazole','rozex','metronidazol mk','metrazol'],
    categoria: 'Antibiótico/Antiparasitario',
    uso_principal: 'Infecciones por bacterias anaerobias, amebas (diarrea con sangre), Giardia, vaginosis bacteriana',
    dosis_adulto: '500 mg cada 8 horas por 7-10 días (según infección)',
    dosis_nino: '7.5 mg/kg cada 8 horas (consultar médico)',
    contraindicaciones: 'Alergia al metronidazol. No consumir alcohol durante el tratamiento (reacción grave).',
    efectos_secundarios: 'Náuseas, sabor metálico en la boca, mareos. Orina puede oscurecerse.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '35-232 C$ (según presentación: suspensión 35-123C$, tabletas 56-232C$)',
    embarazo: 'Categoría B — Evitar en primer trimestre, consultar médico'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 2 — GASTROENTEROLOGÍA
  // ════════════════════════════════════════════════════════
  {
    id: 8,
    nombre_es: 'Ranitidina',
    nombre_en: 'Ranitidine',
    nombres_comerciales: ['Zantac','Ulcodin','Ranitidina MK'],
    sinonimos: ['zantac','ulcodin','para la acidez','antiulcera','anti acido'],
    categoria: 'Antiulceroso (H2)',
    uso_principal: 'Úlcera gástrica y duodenal, reflujo, acidez estomacal',
    dosis_adulto: '150 mg dos veces al día o 300 mg en la noche',
    dosis_nino: '2-4 mg/kg/día dividido en 2 dosis',
    contraindicaciones: 'Alergia a ranitidina. Precaución en insuficiencia renal.',
    efectos_secundarios: 'Dolor de cabeza, mareos, constipación. Generalmente bien tolerado.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '125 C$ (100 cápsulas)',
    embarazo: 'Categoría B — Generalmente seguro, consultar médico'
  },
  {
    id: 9,
    nombre_es: 'Loperamida',
    nombre_en: 'Loperamide',
    nombres_comerciales: ['Imodium','Lopex','Loperamida MK','Tape-C','Ilo mida'],
    sinonimos: ['imodium','antidiarreico','para la diarrea','para el estomago','tape-c','ilomida'],
    categoria: 'Antidiarreico',
    uso_principal: 'Diarrea aguda no complicada en adultos y mayores de 2 años',
    dosis_adulto: '4 mg al inicio, luego 2 mg tras cada deposición líquida (máx 16 mg/día)',
    dosis_nino: 'Mayores de 2 años: 1-2 mg según peso. NO en menores de 2 años.',
    contraindicaciones: 'Diarrea con sangre o fiebre alta, menores de 2 años, colitis.',
    efectos_secundarios: 'Estreñimiento, náuseas, dolor abdominal leve.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '180-265 C$ (según presentación: 50-100 cápsulas)',
    embarazo: 'Categoría C — Evitar en primer trimestre'
  },
  {
    id: 10,
    nombre_es: 'Metoclopramida',
    nombre_en: 'Metoclopramide',
    nombres_comerciales: ['Plasil','Primperan','Metoclopramida MK','Nausyl'],
    sinonimos: ['plasil','primperan','para el vomito','antinausea','antiemetico','nausyl'],
    categoria: 'Antivomitivo / Procinético',
    uso_principal: 'Náuseas y vómitos, reflujo gastroesofágico',
    dosis_adulto: '10 mg tres veces al día, 30 minutos antes de comidas. Máx 5 días.',
    dosis_nino: '0.1 mg/kg tres veces al día (consultar médico)',
    contraindicaciones: 'Epilepsia, hemorragia gastrointestinal, obstrucción intestinal.',
    efectos_secundarios: 'Somnolencia, inquietud, movimientos involuntarios con uso prolongado.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '71-270 C$ (según presentación: tabletas 50-208C$, inyectable 75C$)',
    embarazo: 'Categoría B — Consultar médico'
  },
  {
    id: 11,
    nombre_es: 'Sales de Rehidratación Oral',
    nombre_en: 'Oral Rehydration Salts',
    nombres_comerciales: ['Suero oral','Hidraplus','Rehidrat','Litrosol','Electrolit','Pedialyte','Oralectril'],
    sinonimos: ['suero','suero oral','rehidratacion','sales orales','litrosol','hidraplus','para deshidratacion','suero casero','electrolit','pedialyte','oralectril'],
    categoria: 'Electrolítico / Rehidratación',
    uso_principal: 'Deshidratación por diarrea, vómitos o fiebre alta',
    dosis_adulto: '1 sobre disuelto en 1 litro de agua hervida, tomar a sorbos frecuentes',
    dosis_nino: '50-100 mL por kg en 4 horas (casos moderados)',
    contraindicaciones: 'Vómitos incoercibles (requiere suero IV). Obstrucción intestinal.',
    efectos_secundarios: 'Náuseas leves si se toma muy rápido. Muy bien tolerado.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '39.50-266 C$ (según presentación: 475-1000ml)',
    embarazo: 'Categoría A — Seguro y recomendado'
  },
  {
    id: 12,
    nombre_es: 'Sulfato de Zinc',
    nombre_en: 'Zinc Sulfate',
    nombres_comerciales: ['Zinc MK','Zincovit','Zintablets','Nor Crezinc'],
    sinonimos: ['zinc','para la diarrea del niño','suplemento zinc','nor crezinc'],
    categoria: 'Suplemento / Antidiarreico pediátrico',
    uso_principal: 'Diarrea infantil (junto al suero oral), deficiencia de zinc',
    dosis_adulto: '20 mg al día por 10-14 días',
    dosis_nino: 'Menores de 6 meses: 10 mg/día. Mayores: 20 mg/día por 10-14 días.',
    contraindicaciones: 'Alergia al zinc. No exceder dosis recomendada.',
    efectos_secundarios: 'Náuseas o vómitos si se toma en ayunas. Tomar con comida.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '63-126.50 C$ (según presentación)',
    embarazo: 'Categoría A — Suplemento seguro'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 3 — RESPIRATORIO
  // ════════════════════════════════════════════════════════
  {
    id: 13,
    nombre_es: 'Salbutamol',
    nombre_en: 'Salbutamol / Albuterol',
    nombres_comerciales: ['Ventolin','Salbumax','Broncovent','Albuterol','Asthamol'],
    sinonimos: ['ventolin','inhalador','para el asma','broncodilatador','dificultad para respirar','silbido','asthamol'],
    categoria: 'Broncodilatador (Beta-2)',
    uso_principal: 'Asma, broncoespasmo, EPOC. Alivio rápido de dificultad para respirar.',
    dosis_adulto: 'Inhalador: 1-2 puffs cada 4-6 h. Jarabe: 2-4 mg tres veces al día.',
    dosis_nino: 'Inhalador: 1-2 puffs según necesidad. Jarabe: 0.1-0.15 mg/kg 3 veces al día.',
    contraindicaciones: 'Alergia al salbutamol. Precaución en cardiopatías y diabetes.',
    efectos_secundarios: 'Temblor de manos, palpitaciones, dolor de cabeza. Transitorios.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '34.50-63 C$ (según presentación: jarabe 34.50C$, inhalador 50.50-63C$, gotas nebulizar 48.50C$)',
    embarazo: 'Categoría C — Usar solo si es necesario'
  },
  {
    id: 14,
    nombre_es: 'Clorfeniramina',
    nombre_en: 'Chlorpheniramine',
    nombres_comerciales: ['Alercort','Allergan','CTM','Clorfeniramina MK','Histac lor'],
    sinonimos: ['ctm','antihistaminico sedante','alergia','picazon','estornudos','histaclor'],
    categoria: 'Antihistamínico (1ra generación, causa sueño)',
    uso_principal: 'Alergias, rinitis alérgica, urticaria, picazón. Causa somnolencia.',
    dosis_adulto: '4 mg cada 6 horas (causa sueño — no conducir)',
    dosis_nino: '0.35 mg/kg/día dividido en 3-4 dosis',
    contraindicaciones: 'Glaucoma, retención urinaria, asma agudo. No conducir.',
    efectos_secundarios: 'Somnolencia (intensa), boca seca, visión borrosa.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '32.50-157 C$ (según presentación)',
    embarazo: 'Categoría B — Consultar médico'
  },
  {
    id: 15,
    nombre_es: 'Bromuro de Ipratropio',
    nombre_en: 'Ipratropium Bromide',
    nombres_comerciales: ['Atrovent','Ipravent','Ipratropio MK','Reloxyl'],
    sinonimos: ['atrovent','para epoc','broncodilatador anticolin','para enfisema','reloxyl'],
    categoria: 'Broncodilatador anticolinérgico',
    uso_principal: 'EPOC (enfisema, bronquitis crónica), asma como terapia adicional',
    dosis_adulto: 'Inhalador: 2-3 puffs tres o cuatro veces al día',
    dosis_nino: 'Bajo supervisión médica',
    contraindicaciones: 'Alergia a atropina o ipratropio.',
    efectos_secundarios: 'Boca seca, retención urinaria leve, visión borrosa.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '75-207 C$ (según presentación: solución nebulizar 75-207C$, inhalador 216C$)',
    embarazo: 'Categoría B — Consultar médico'
  },
  {
    id: 163,
    nombre_es: 'Ambroxol + Clenbuterol',
    nombre_en: 'Ambroxol + Clenbuterol',
    nombres_comerciales: ['Ambroxol+Clambuterol MK','Broncodil'],
    sinonimos: ['ambroxol clenbuterol','tos flema','broncodilatador','broncodil'],
    categoria: 'Mucolítico + Broncodilatador',
    uso_principal: 'Tos con flema, bronquitis, asma',
    dosis_adulto: '15mg+5mcg/5ml: 10ml tres veces al día',
    dosis_nino: '7.5mg+5mcg/5ml: según edad',
    contraindicaciones: 'Alergia, cardiopatías, hipertiroidismo',
    efectos_secundarios: 'Temblor, palpitaciones, náuseas',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '45.50-115 C$ (según presentación: jarabe adulto 73C$, pediátrico 45.50C$, gotas 97-115C$)',
    embarazo: 'Categoría C — Consultar médico'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 4 — CARDIOVASCULAR
  // ════════════════════════════════════════════════════════
  {
    id: 16,
    nombre_es: 'Enalapril',
    nombre_en: 'Enalapril',
    nombres_comerciales: ['Renitec','Vasotec','Lotrial','Enalapril MK'],
    sinonimos: ['renitec','para la presion','ieca','antihipertensivo','presion alta'],
    categoria: 'Antihipertensivo (IECA)',
    uso_principal: 'Hipertensión arterial, insuficiencia cardíaca, protección renal en diabetes',
    dosis_adulto: '5-40 mg una o dos veces al día (iniciar con 5 mg)',
    dosis_nino: 'Bajo supervisión médica estricta',
    contraindicaciones: 'Embarazo (contraindicado absolutamente), angioedema previo, alergia.',
    efectos_secundarios: 'Tos seca persistente (muy común), mareos, hiperpotasemia.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '54-70 C$ (100 tabletas)',
    embarazo: 'Categoría D — CONTRAINDICADO en embarazo'
  },
  {
    id: 17,
    nombre_es: 'Losartán',
    nombre_en: 'Losartan',
    nombres_comerciales: ['Cozaar','Losartan MK','Losacar','Losaraven'],
    sinonimos: ['cozaar','losacar','para la presion','ara2','antihipertensivo','sinttos','losaraven'],
    categoria: 'Antihipertensivo (ARA II)',
    uso_principal: 'Hipertensión arterial, nefropatía diabética, insuficiencia cardíaca',
    dosis_adulto: '50-100 mg una vez al día',
    dosis_nino: 'Mayores de 6 años bajo supervisión médica',
    contraindicaciones: 'Embarazo (contraindicado), alergia. No combinar con enalapril ni potasio sin control.',
    efectos_secundarios: 'Mareos, hiperpotasemia. NO causa tos (ventaja sobre enalapril).',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '27.50-334 C$ (según presentación: 10-100 tabletas)',
    embarazo: 'Categoría D — CONTRAINDICADO en embarazo'
  },
  {
    id: 18,
    nombre_es: 'Amlodipina',
    nombre_en: 'Amlodipine',
    nombres_comerciales: ['Norvasc','Amlocard','Amlodipina MK'],
    sinonimos: ['norvasc','para la presion','calcioantagonista','para angina'],
    categoria: 'Antihipertensivo (Bloqueador calcio)',
    uso_principal: 'Hipertensión arterial, angina de pecho',
    dosis_adulto: '5-10 mg una vez al día',
    dosis_nino: 'Consultar médico pediátrico',
    contraindicaciones: 'Alergia a dihidropiridinas. Precaución en insuficiencia cardíaca grave.',
    efectos_secundarios: 'Edema en tobillos, enrojecimiento facial, palpitaciones, dolor de cabeza.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '80-111 C$ (30 tabletas)',
    embarazo: 'Categoría C — Consultar médico'
  },
  {
    id: 19,
    nombre_es: 'Hidroclorotiazida',
    nombre_en: 'Hydrochlorothiazide',
    nombres_comerciales: ['HCT','Dichlotride','Hidroclorotiazida MK'],
    sinonimos: ['hct','diuretico','para los pies hinchados','para la presion','tiazida'],
    categoria: 'Diurético tiazídico / Antihipertensivo',
    uso_principal: 'Hipertensión arterial, edemas, insuficiencia cardíaca',
    dosis_adulto: '12.5-25 mg una vez al día (mañana)',
    dosis_nino: 'Consultar médico',
    contraindicaciones: 'Insuficiencia renal grave, alergia a sulfas. Precaución en diabetes y gota.',
    efectos_secundarios: 'Baja el potasio (calambres), sube el azúcar y el ácido úrico.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '38-50 C$ (según presentación)',
    embarazo: 'Categoría B — Consultar médico'
  },
  {
    id: 20,
    nombre_es: 'Furosemida',
    nombre_en: 'Furosemide',
    nombres_comerciales: ['Lasix','Diurin','Furosemida MK','Diuremide'],
    sinonimos: ['lasix','diuretico fuerte','para pies hinchados','edema','para el corazon','diuremide'],
    categoria: 'Diurético de asa',
    uso_principal: 'Edema (pies/tobillos hinchados), insuficiencia cardíaca, hipertensión grave',
    dosis_adulto: '20-80 mg una o dos veces al día',
    dosis_nino: '0.5-1 mg/kg (consultar médico)',
    contraindicaciones: 'Insuficiencia renal grave, deshidratación severa, alergia a sulfas.',
    efectos_secundarios: 'Pérdida de potasio (calambres), deshidratación, mareos al pararse.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '77-104 C$ (100 tabletas)',
    embarazo: 'Categoría C — Usar solo si es necesario'
  },
  {
    id: 21,
    nombre_es: 'Atenolol',
    nombre_en: 'Atenolol',
    nombres_comerciales: ['Tenormin','Betacard','Atenolol MK'],
    sinonimos: ['tenormin','betabloqueador','para el corazon','para la presion','para las palpitaciones'],
    categoria: 'Antihipertensivo / Betabloqueador',
    uso_principal: 'Hipertensión arterial, angina, arritmias, prevención de infarto',
    dosis_adulto: '25-100 mg una vez al día',
    dosis_nino: 'Consultar médico',
    contraindicaciones: 'Asma o EPOC grave, bloqueo cardíaco. No suspender bruscamente.',
    efectos_secundarios: 'Cansancio, manos frías, bradicardia, puede agravar asma.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '68.50 C$ (100 tabletas)',
    embarazo: 'Categoría D — Consultar médico'
  },
  {
    id: 131,
    nombre_es: 'Irbesartán',
    nombre_en: 'Irbesartan',
    nombres_comerciales: ['Irbesartán MK','Aprovel','Irbesartan LaSanté'],
    sinonimos: ['irbesartan','ara2','para la presion','antihipertensivo'],
    categoria: 'Antihipertensivo (ARA II)',
    uso_principal: 'Hipertensión arterial, nefropatía diabética',
    dosis_adulto: '150-300 mg una vez al día',
    dosis_nino: 'Mayores de 6 años bajo supervisión médica',
    contraindicaciones: 'Embarazo, alergia, insuficiencia renal grave',
    efectos_secundarios: 'Mareos, fatiga, hiperpotasemia',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '108-352 C$ (según presentación)',
    embarazo: 'Categoría D — CONTRAINDICADO'
  },
  {
    id: 132,
    nombre_es: 'Carvedilol',
    nombre_en: 'Carvedilol',
    nombres_comerciales: ['Coreg','Dilatrend','Carvedilol MK'],
    sinonimos: ['coreg','dilatrend','para el corazon','betabloqueador','insuficiencia cardiaca'],
    categoria: 'Betabloqueador / Alfa-bloqueador',
    uso_principal: 'Insuficiencia cardíaca, hipertensión arterial, cardioprotección post-infarto',
    dosis_adulto: 'HTA: 12.5-25 mg dos veces al día. IC: iniciar 3.125 mg dos veces al día.',
    dosis_nino: 'Solo bajo supervisión cardiológica pediátrica',
    contraindicaciones: 'Asma grave, bloqueo cardíaco, bradicardia severa. No suspender bruscamente.',
    efectos_secundarios: 'Mareos, fatiga, manos frías, bradicardia.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '70-116.50 C$ (30 tabletas)',
    embarazo: 'Categoría C — Consultar médico'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 5 — ANTIINFLAMATORIOS ADICIONALES
  // ════════════════════════════════════════════════════════
  {
    id: 39,
    nombre_es: 'Diclofenaco',
    nombre_en: 'Diclofenac',
    nombres_comerciales: ['Voltaren','Cataflam','Artren','Diclofenaco MK','Diclo Azul','Dro pa Gel'],
    sinonimos: ['voltaren','cataflam','artren','para el dolor','antiinflamatorio','para la artritis','dolor muscular','diclo azul','dropa gel'],
    categoria: 'AINE / Antiinflamatorio',
    uso_principal: 'Dolor musculoesquelético, artritis, cólicos menstruales, traumatismos',
    dosis_adulto: '50 mg dos o tres veces al día con comida. Máx 150 mg/día.',
    dosis_nino: '1-3 mg/kg/día (consultar médico)',
    contraindicaciones: 'Úlcera gástrica, insuficiencia renal o cardíaca, embarazo avanzado. SIEMPRE con comida.',
    efectos_secundarios: 'Malestar estomacal, úlcera si no come, retención de líquidos.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '19.50-300 C$ (según presentación: gel 29.50-60.50C$, tabletas 60-101C$, complejo B 300C$)',
    embarazo: 'Categoría D en 3er trimestre — CONTRAINDICADO'
  },
  {
    id: 134,
    nombre_es: 'Dexketoprofeno',
    nombre_en: 'Dexketoprofen',
    nombres_comerciales: ['Dolkyl','Doltium','Enantyum','Dolantyum'],
    sinonimos: ['dexketoprofeno','dolkyl','doltium','para dolor fuerte','enantyum','dolantyum'],
    categoria: 'AINE potente',
    uso_principal: 'Dolor agudo moderado a severo',
    dosis_adulto: '25 mg cada 8 horas. MAX 75 mg/día',
    dosis_nino: 'No recomendado menores de 18 años',
    contraindicaciones: 'Úlcera, insuficiencia renal, embarazo',
    efectos_secundarios: 'Náuseas, malestar gástrico',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '24-935 C$ (según presentación: tabletas 71-75C$, solución oral 225-356C$, stick 513C$)',
    embarazo: 'Categoría C — Contraindicado en 3er trimestre'
  },
  {
    id: 40,
    nombre_es: 'Dipirona / Metamizol',
    nombre_en: 'Metamizole / Dipyrone',
    nombres_comerciales: ['Novalgin','Novalgina','Conmel','Dipirona MK','Biovalgina'],
    sinonimos: ['novalgin','novalgina','conmel','metamizol','para el dolor fuerte','para la fiebre alta','biovalgina'],
    categoria: 'Analgésico / Antipirético',
    uso_principal: 'Dolor intenso, fiebre alta, cólico renal o biliar',
    dosis_adulto: '500-1000 mg cada 6-8 horas (oral o inyectable)',
    dosis_nino: '10-15 mg/kg cada 6-8 horas',
    contraindicaciones: 'Alergia, porfiria, depresión de médula ósea.',
    efectos_secundarios: 'Reacciones alérgicas, caída de presión con inyección rápida. Rara agranulocitosis.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '11.50-110 C$ (según presentación: ampolla 11.50C$, jarabe 56-110C$, tabletas 43C$)',
    embarazo: 'Categoría C — Evitar en primer y tercer trimestre'
  },
  {
    id: 41,
    nombre_es: 'Ketorolaco',
    nombre_en: 'Ketorolac',
    nombres_comerciales: ['Toradol','Dolac','Ketorolaco MK','Ketalorac'],
    sinonimos: ['toradol','dolac','para el dolor fuerte','inyeccion para el dolor','antiinflamatorio inyectable'],
    categoria: 'AINE potente (oral e inyectable)',
    uso_principal: 'Dolor moderado a severo de corta duración (máx 5 días), dolor posoperatorio',
    dosis_adulto: '10-30 mg cada 4-6 horas. MAX 5 días de tratamiento.',
    dosis_nino: 'Bajo supervisión médica',
    contraindicaciones: 'Úlcera, insuficiencia renal, embarazo, uso prolongado. MAX 5 días.',
    efectos_secundarios: 'Malestar gástrico, riesgo de sangrado gastrointestinal.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '42.50-291.50 C$ (según presentación: tabletas 10-225C$, ampollas 42.50-74.50C$)',
    embarazo: 'Categoría C/D — Contraindicado en tercer trimestre'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 6 — ANTIBIÓTICOS ADICIONALES
  // ════════════════════════════════════════════════════════
  {
    id: 125,
    nombre_es: 'Azitromicina',
    nombre_en: 'Azithromycin',
    nombres_comerciales: ['Aziram','Zitromax','Azitromicina MK','Bactazit'],
    sinonimos: ['aziram','azitromicina','antibiotico fuerte','para infeccion','bactazit'],
    categoria: 'Antibiótico Macrólido',
    uso_principal: 'Infecciones respiratorias, faringitis, neumonía, ITS',
    dosis_adulto: '500 mg día 1, luego 250 mg días 2-5 O 500 mg por 3 días',
    dosis_nino: '10 mg/kg día 1, luego 5 mg/kg días 2-5',
    contraindicaciones: 'Alergia a macrólidos, enfermedad hepática grave',
    efectos_secundarios: 'Náuseas, diarrea, dolor abdominal',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '35.50-825 C$ (según presentación: suspensión 48.50-72.50C$, tabletas 35.50-191.50C$)',
    embarazo: 'Categoría B — Consultar médico'
  },
  {
    id: 126,
    nombre_es: 'Cefadroxilo',
    nombre_en: 'Cefadroxil',
    nombres_comerciales: ['Cefadroxilo MK','Duracef'],
    sinonimos: ['cefadroxilo','cefalosporina','antibiotico'],
    categoria: 'Antibiótico Cefalosporina (1ra generación)',
    uso_principal: 'Infecciones de piel, garganta, urinarias',
    dosis_adulto: '500 mg-1 g cada 12 horas',
    dosis_nino: '30-50 mg/kg/día dividido en 2 dosis',
    contraindicaciones: 'Alergia a cefalosporinas o penicilinas',
    efectos_secundarios: 'Diarrea, náuseas, erupción cutánea',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '61-380 C$ (según presentación: suspensión 61-78C$, tabletas 258-380C$)',
    embarazo: 'Categoría B — Generalmente seguro'
  },
  {
    id: 127,
    nombre_es: 'Cefalexina',
    nombre_en: 'Cephalexin',
    nombres_comerciales: ['Cefalexina MK','Keflex'],
    sinonimos: ['cefalexina','cefalosporina','antibiotico'],
    categoria: 'Antibiótico Cefalosporina (1ra generación)',
    uso_principal: 'Infecciones de piel, respiratorias, urinarias',
    dosis_adulto: '250-500 mg cada 6 horas',
    dosis_nino: '25-50 mg/kg/día dividido en 4 dosis',
    contraindicaciones: 'Alergia a cefalosporinas',
    efectos_secundarios: 'Diarrea, náuseas, mareos',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '409.50 C$ (100 cápsulas)',
    embarazo: 'Categoría B — Generalmente seguro'
  },
  {
    id: 128,
    nombre_es: 'Dicloxacilina',
    nombre_en: 'Dicloxacillin',
    nombres_comerciales: ['Dicloxacilina MK','Dicloxapen'],
    sinonimos: ['dicloxacilina','penicilina','antibiotico','dicloxapen'],
    categoria: 'Antibiótico Penicilina',
    uso_principal: 'Infecciones por Staphylococcus, piel, huesos',
    dosis_adulto: '250-500 mg cada 6 horas',
    dosis_nino: '12.5-25 mg/kg/día dividido en 4 dosis',
    contraindicaciones: 'Alergia a penicilinas',
    efectos_secundarios: 'Diarrea, náuseas, erupción',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '33-395 C$ (según presentación: suspensión 33-39C$, cápsulas 304.50-395C$)',
    embarazo: 'Categoría B — Generalmente seguro'
  },
  {
    id: 129,
    nombre_es: 'Ampicilina',
    nombre_en: 'Ampicillin',
    nombres_comerciales: ['Ampicilina MK','Omnipen','Unicilina'],
    sinonimos: ['ampicilina','penicilina','antibiotico','unicilina'],
    categoria: 'Antibiótico Penicilina',
    uso_principal: 'Infecciones respiratorias, urinarias, meningitis',
    dosis_adulto: '250-500 mg cada 6 horas',
    dosis_nino: '25-50 mg/kg/día dividido en 4 dosis',
    contraindicaciones: 'Alergia a penicilinas, mononucleosis',
    efectos_secundarios: 'Diarrea, erupción, náuseas',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '56.50-185.50 C$ (según presentación)',
    embarazo: 'Categoría B — Generalmente seguro'
  },
  {
    id: 130,
    nombre_es: 'Cloranfenicol',
    nombre_en: 'Chloramphenicol',
    nombres_comerciales: ['Cloranfenicol MK','Cloranfenicol Selectpharma'],
    sinonimos: ['cloranfenicol','antibiotico','para infeccion'],
    categoria: 'Antibiótico de amplio espectro',
    uso_principal: 'Infecciones graves, meningitis, infecciones oculares',
    dosis_adulto: '500 mg cada 6 horas',
    dosis_nino: '50-100 mg/kg/día dividido en 4 dosis',
    contraindicaciones: 'Alergia, embarazo, lactancia, neonatos',
    efectos_secundarios: 'Anemia aplásica (raro), náuseas, diarrea',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '45.50-290 C$ (según presentación: oftálmico 45.50C$, cápsulas 290C$)',
    embarazo: 'Categoría C — Evitar'
  },
  {
    id: 102,
    nombre_es: 'Amoxicilina + Ácido Clavulánico',
    nombre_en: 'Amoxicillin + Clavulanic Acid',
    nombres_comerciales: ['Augmentin','Clavulin','Amoxiclav','Cil Amox','Claviphar'],
    sinonimos: ['augmentin','clavulin','amoxiclav','antibiotico fuerte','para infeccion resistente','amoxicilina reforzada','claviphar'],
    categoria: 'Antibiótico amplio espectro (Penicilina + inhibidor)',
    uso_principal: 'Infecciones resistentes a amoxicilina: otitis, sinusitis, neumonía, ITU, mordeduras',
    dosis_adulto: '875/125 mg cada 12 horas por 7-10 días',
    dosis_nino: 'Suspensión: 25-45 mg/kg/día dividido cada 12 horas',
    contraindicaciones: 'Alergia a penicilinas, hepatitis previa por amoxiclav.',
    efectos_secundarios: 'Diarrea (común), náuseas, erupción cutánea. Tomar con comida.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '92.50-330 C$ (según presentación)',
    embarazo: 'Categoría B — Generalmente seguro'
  },
  {
    id: 103,
    nombre_es: 'Claritromicina',
    nombre_en: 'Clarithromycin',
    nombres_comerciales: ['Biaxin','Klaricid','Clanic','Claritromicina MK'],
    sinonimos: ['biaxin','klaricid','clanic','macrolido','para infeccion respiratoria','para h pylori'],
    categoria: 'Antibiótico Macrólido (2da generación)',
    uso_principal: 'Infecciones respiratorias, H. pylori (combinado), sinusitis, faringitis',
    dosis_adulto: '250-500 mg cada 12 horas por 7-14 días',
    dosis_nino: '7.5 mg/kg cada 12 horas',
    contraindicaciones: 'Alergia a macrólidos. Muchas interacciones (estatinas, warfarina, digoxina).',
    efectos_secundarios: 'Sabor metálico, náuseas, diarrea, dolor abdominal.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '290-360 C$ (30 tabletas)',
    embarazo: 'Categoría C — Evitar en primer trimestre'
  },
  {
    id: 104,
    nombre_es: 'Cefixima',
    nombre_en: 'Cefixime',
    nombres_comerciales: ['Suprax','Baxfim','Cefixima MK'],
    sinonimos: ['suprax','baxfim','cefalosporina oral','para gonorrea','infeccion urinaria complicada'],
    categoria: 'Antibiótico Cefalosporina (3ra generación oral)',
    uso_principal: 'Infecciones urinarias, gonorrea, otitis, faringitis, bronquitis',
    dosis_adulto: '400 mg una vez al día o 200 mg cada 12 horas por 7-10 días',
    dosis_nino: '8 mg/kg/día una vez al día (suspensión)',
    contraindicaciones: 'Alergia a cefalosporinas o penicilinas (precaución).',
    efectos_secundarios: 'Diarrea, náuseas, dolor abdominal.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '100-166 C$ (según presentación)',
    embarazo: 'Categoría B — Generalmente seguro'
  },
  {
    id: 46,
    nombre_es: 'Ceftriaxona',
    nombre_en: 'Ceftriaxone',
    nombres_comerciales: ['Rocephin','Ceftriaxona MK','Triaxon','Ceftril','Rocefort'],
    sinonimos: ['rocephin','triaxon','cefalosporina','antibiotico inyectable','para infeccion grave','ceftril','rocefort'],
    categoria: 'Antibiótico Cefalosporina (3ra generación)',
    uso_principal: 'Infecciones graves: neumonía, meningitis, sepsis, ITS (gonorrea)',
    dosis_adulto: '1-2 g al día (IM o IV)',
    dosis_nino: '50-100 mg/kg/día (consultar médico)',
    contraindicaciones: 'Alergia a cefalosporinas o penicilinas (precaución). Neonatos con hiperbilirrubinemia.',
    efectos_secundarios: 'Dolor en sitio de inyección, diarrea, reacciones alérgicas.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '38.50-190 C$ (según presentación: 1g IM/IV)',
    embarazo: 'Categoría B — Generalmente seguro'
  },
  {
    id: 107,
    nombre_es: 'Levofloxacina',
    nombre_en: 'Levofloxacin',
    nombres_comerciales: ['Levaquin','Xinanx','Levofloxacina MK'],
    sinonimos: ['levaquin','xinanx','quinolona potente','para neumonia','para infeccion grave'],
    categoria: 'Antibiótico Fluoroquinolona (3ra generación)',
    uso_principal: 'Neumonía, infecciones urinarias complicadas, sinusitis, bronquitis crónica agudizada',
    dosis_adulto: '500-750 mg una vez al día por 5-14 días',
    dosis_nino: 'No recomendado en menores de 18 años (excepto casos especiales)',
    contraindicaciones: 'Alergia a quinolonas, embarazo, epilepsia. Evitar sol excesivo.',
    efectos_secundarios: 'Náuseas, diarrea, fotosensibilidad, tendinitis (raro pero importante).',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '97-157 C$ (30 tabletas)',
    embarazo: 'Categoría C — Evitar'
  },
  {
    id: 45,
    nombre_es: 'Ciprofloxacina',
    nombre_en: 'Ciprofloxacin',
    nombres_comerciales: ['Cipro','Cifran','Ciprofloxacina MK','Ciprofthal'],
    sinonimos: ['cipro','cifran','quinolona','para infeccion urinaria','para la diarrea bacteriana','ciprofthal'],
    categoria: 'Antibiótico Fluoroquinolona',
    uso_principal: 'Infecciones urinarias complicadas, diarrea bacteriana, infecciones respiratorias',
    dosis_adulto: '250-750 mg dos veces al día por 3-14 días según infección',
    dosis_nino: 'Uso limitado (bajo supervisión médica)',
    contraindicaciones: 'Alergia a quinolonas, embarazo, menores de 18 años rutinario. Evitar con antiácidos.',
    efectos_secundarios: 'Náuseas, diarrea, sensibilidad al sol, tendinitis (raro). No tomar con leche.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '85-127 C$ (según presentación)',
    embarazo: 'Categoría C — Evitar si es posible'
  },
  {
    id: 108,
    nombre_es: 'Nitrofurantoína',
    nombre_en: 'Nitrofurantoin',
    nombres_comerciales: ['Macrobid','Uvamin','Nitrofurantoina MK'],
    sinonimos: ['macrobid','uvamin','para infeccion urinaria','para cistitis','antibiotico orina','itu recurrente'],
    categoria: 'Antibiótico urinario específico',
    uso_principal: 'Infecciones del tracto urinario inferior (cistitis), profilaxis de ITU recurrente. SOLO actúa en orina.',
    dosis_adulto: '100 mg cada 12 horas por 5-7 días. Profilaxis: 50-100 mg/noche.',
    dosis_nino: '5-7 mg/kg/día dividido (mayores de 3 meses)',
    contraindicaciones: 'Insuficiencia renal, embarazo término, menores de 3 meses.',
    efectos_secundarios: 'Orina amarilla/marrón (normal), náuseas. Tomar con comida.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '213 C$ (100 tabletas)',
    embarazo: 'Categoría B — Evitar en término y parto'
  },
  {
    id: 116,
    nombre_es: 'Eritromicina',
    nombre_en: 'Erythromycin',
    nombres_comerciales: ['Ery-Tab','Ilosone','Eritromicina MK','Ericiclina'],
    sinonimos: ['ilosone','macrolido basico','para acne','alternativa penicilina','para alergia a penicilina','ericiclina'],
    categoria: 'Antibiótico Macrólido (1ra generación)',
    uso_principal: 'Infecciones en alérgicos a penicilina, acné moderado, infecciones de piel y respiratorias',
    dosis_adulto: '250-500 mg cada 6-12 horas por 7-10 días',
    dosis_nino: '30-50 mg/kg/día dividido cada 6-8 horas',
    contraindicaciones: 'Alergia a macrólidos. Muchas interacciones medicamentosas.',
    efectos_secundarios: 'Náuseas, vómitos, diarrea (comunes). Tomar con comida si hay malestar.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '50-84.50 C$ (según presentación)',
    embarazo: 'Categoría B — Generalmente seguro'
  },
  {
    id: 43,
    nombre_es: 'Cotrimoxazol',
    nombre_en: 'Trimethoprim-Sulfamethoxazole',
    nombres_comerciales: ['Bactrim','Septrin','Trimel','Cotrimoxazol MK','Sulfaprim'],
    sinonimos: ['bactrim','septrin','trimel','trimetoprim','para la orina','infeccion urinaria','sulfa','sulfaprim'],
    categoria: 'Antibiótico Sulfonamida',
    uso_principal: 'Infecciones urinarias, diarrea bacteriana, toxoplasmosis',
    dosis_adulto: '1 tableta forte (800/160 mg) dos veces al día por 7-10 días',
    dosis_nino: '8/40 mg/kg/día dividido en 2 dosis',
    contraindicaciones: 'Alergia a sulfas, insuficiencia renal grave, embarazo 3er trimestre, menores de 2 meses.',
    efectos_secundarios: 'Sarpullido, náuseas. Tomar mucho líquido.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '59-413.50 C$ (según presentación)',
    embarazo: 'Categoría C — Evitar en tercer trimestre'
  },
  {
    id: 44,
    nombre_es: 'Doxiciclina',
    nombre_en: 'Doxycycline',
    nombres_comerciales: ['Vibramycin','Vivox','Doxiciclina MK'],
    sinonimos: ['vibramycin','tetraciclina','para acne','para infeccion','para malaria'],
    categoria: 'Antibiótico Tetraciclina',
    uso_principal: 'Infecciones respiratorias, acné moderado-grave, ITS, malaria',
    dosis_adulto: '100 mg dos veces al día el primer día, luego 100 mg/día',
    dosis_nino: 'Contraindicado en menores de 8 años',
    contraindicaciones: 'Menores de 8 años, embarazo, lactancia. Evitar sol excesivo.',
    efectos_secundarios: 'Náuseas, fotosensibilidad (protegerse del sol), reduce efecto de anticonceptivos.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '30-70 C$ (cápsulas)',
    embarazo: 'Categoría D — CONTRAINDICADO'
  },
  {
    id: 66,
    nombre_es: 'Tetraciclina',
    nombre_en: 'Tetracycline',
    nombres_comerciales: ['Tetraciclina MK','Vistaclina'],
    sinonimos: ['tetraciclina','antibiotico','para acne','vistaclina'],
    categoria: 'Antibiótico Tetraciclina',
    uso_principal: 'Infecciones bacterianas, acné, infecciones oculares',
    dosis_adulto: '250-500 mg cada 6 horas',
    dosis_nino: 'No usar en menores de 8 años',
    contraindicaciones: 'Menores de 8 años, embarazo, lactancia',
    efectos_secundarios: 'Náuseas, fotosensibilidad, decoloración dental',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '42-177 C$ (según presentación: oftálmico 42C$, cápsulas 144-177C$)',
    embarazo: 'Categoría D — CONTRAINDICADO'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 7 — ANTIHIPERTENSIVOS ADICIONALES
  // ════════════════════════════════════════════════════════
  {
    id: 109,
    nombre_es: 'Captopril',
    nombre_en: 'Captopril',
    nombres_comerciales: ['Capoten','Captopril MK','Tensiomin'],
    sinonimos: ['capoten','tensiomin','para la presion alta','ieca','crisis hipertensiva','tableta bajo la lengua presion'],
    categoria: 'Antihipertensivo IECA (acción corta)',
    uso_principal: 'Hipertensión arterial, insuficiencia cardíaca, crisis hipertensiva (sublingual)',
    dosis_adulto: '25-50 mg dos o tres veces al día. Crisis: 25 mg sublingual.',
    dosis_nino: '0.1-0.5 mg/kg cada 8-12 horas (bajo supervisión)',
    contraindicaciones: 'Embarazo (contraindicado), angioedema previo, estenosis renal bilateral.',
    efectos_secundarios: 'Tos seca persistente, mareos, hiperpotasemia.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '49.50-77 C$ (50 tabletas)',
    embarazo: 'Categoría D — CONTRAINDICADO'
  },
  {
    id: 110,
    nombre_es: 'Propranolol',
    nombre_en: 'Propranolol',
    nombres_comerciales: ['Inderal','Sumial','Propranolol MK'],
    sinonimos: ['inderal','sumial','para la migrana','para el temblor','betabloqueador','palpitaciones','para la ansiedad fisica'],
    categoria: 'Betabloqueador no selectivo',
    uso_principal: 'Hipertensión, prevención de migraña, temblor esencial, ansiedad somática, hipertiroidismo',
    dosis_adulto: 'HTA: 40-80 mg dos veces al día. Migraña: 40-80 mg dos veces al día.',
    dosis_nino: '1-4 mg/kg/día dividido (bajo supervisión)',
    contraindicaciones: 'Asma o EPOC grave, bloqueo cardíaco. No suspender bruscamente.',
    efectos_secundarios: 'Fatiga, extremidades frías, bradicardia, puede agravar asma.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '59 C$ (100 tabletas)',
    embarazo: 'Categoría C — Consultar médico'
  },
  {
    id: 112,
    nombre_es: 'Nifedipina',
    nombre_en: 'Nifedipine',
    nombres_comerciales: ['Adalat','Procardia','Nifedipina MK'],
    sinonimos: ['adalat','procardia','para la presion','para angina','bloqueador calcio','para parto prematuro'],
    categoria: 'Bloqueador de calcio (Dihidropiridina)',
    uso_principal: 'Hipertensión arterial, angina de pecho, parto prematuro (tocolítico)',
    dosis_adulto: 'Liberación inmediata: 10-30 mg tres veces al día. Sostenida: 30-90 mg/día.',
    dosis_nino: 'Bajo supervisión médica',
    contraindicaciones: 'Choque cardiogénico, estenosis aórtica grave.',
    efectos_secundarios: 'Enrojecimiento facial, edema en tobillos, palpitaciones, dolor de cabeza.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '125-130 C$ (100 tabletas)',
    embarazo: 'Categoría C — Se usa como tocolítico bajo supervisión'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 8 — ANTIHIPERTENSIVOS / LIPÍDICOS
  // ════════════════════════════════════════════════════════
  {
    id: 22,
    nombre_es: 'Simvastatina',
    nombre_en: 'Simvastatin',
    nombres_comerciales: ['Zocor','Sivastin','Simvastatina MK'],
    sinonimos: ['zocor','estatina','para el colesterol','colesterol alto','trigliceridos'],
    categoria: 'Hipolipemiante (Estatina)',
    uso_principal: 'Colesterol elevado, prevención de enfermedades cardiovasculares',
    dosis_adulto: '10-40 mg una vez al día (noche)',
    dosis_nino: 'Bajo supervisión médica',
    contraindicaciones: 'Enfermedad hepática activa, embarazo, lactancia. Interacciones con antibióticos.',
    efectos_secundarios: 'Dolor muscular (importante: consultar médico si es severo).',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '79 C$ (30 tabletas)',
    embarazo: 'Categoría X — CONTRAINDICADO en embarazo'
  },
  {
    id: 114,
    nombre_es: 'Atorvastatina',
    nombre_en: 'Atorvastatin',
    nombres_comerciales: ['Lipitor','Torvast','Atorvastatina MK'],
    sinonimos: ['lipitor','torvast','para el colesterol','estatina potente','colesterol alto','ldl alto'],
    categoria: 'Hipolipemiante (Estatina potente)',
    uso_principal: 'Colesterol LDL elevado, triglicéridos altos, prevención cardiovascular',
    dosis_adulto: '10-80 mg una vez al día (noche). Más potente que simvastatina.',
    dosis_nino: 'Bajo supervisión médica',
    contraindicaciones: 'Enfermedad hepática activa, embarazo, lactancia.',
    efectos_secundarios: 'Dolor muscular (mialgia — consultar si es severo), enzimas hepáticas elevadas.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '154 C$ (30 tabletas)',
    embarazo: 'Categoría X — CONTRAINDICADO'
  },
  {
    id: 121,
    nombre_es: 'Omega 3',
    nombre_en: 'Omega-3 Fatty Acids',
    nombres_comerciales: ['Cardio-Vital','Omega 3 MK','Aceite de salmon','EPA DHA'],
    sinonimos: ['omega 3','acidos grasos','aceite de salmon','para el colesterol','para el corazon','trigliceridos altos'],
    categoria: 'Ácido graso esencial / Suplemento cardiovascular',
    uso_principal: 'Triglicéridos elevados, prevención cardiovascular, salud cerebral',
    dosis_adulto: '1000-3000 mg al día con las comidas',
    dosis_nino: 'Formulas pediátricas bajo indicación médica',
    contraindicaciones: 'Alergia al pescado. Anticoagulantes (consultar con dosis altas).',
    efectos_secundarios: 'Eructos con sabor a pescado, náuseas. Tomar con comida.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '147-653.50 C$ (según presentación)',
    embarazo: 'Categoría C — Generalmente seguro en dosis normales'
  },
  {
    id: 23,
    nombre_es: 'Aspirina',
    nombre_en: 'Aspirin',
    nombres_comerciales: ['Aspirina Bayer','Ecotrin','AAS','ASA','Cardioaspirina'],
    sinonimos: ['acido acetilsalicilico','asa','aas','para el dolor','para el infarto','antipiretico','cardioaspirina'],
    categoria: 'AINE / Antiagregante / Antipirético',
    uso_principal: 'Dolor leve, fiebre, prevención de trombosis e infartos (dosis baja 75-100 mg)',
    dosis_adulto: 'Dolor/fiebre: 500-1000 mg cada 6-8 h. Cardiovascular: 75-100 mg/día.',
    dosis_nino: 'NO usar en menores de 16 años con fiebre viral (riesgo síndrome de Reye).',
    contraindicaciones: 'Úlcera gástrica, alergia a AINEs, hemofilia. Menores de 16 con fiebre.',
    efectos_secundarios: 'Irritación gástrica, sangrado. Tomar con comida.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '138-299 C$ (según presentación: niño 138C$, forte 245.25C$, cardio 81mg 299C$)',
    embarazo: 'Categoría D en tercer trimestre — Evitar'
  },
  {
    id: 24,
    nombre_es: 'Clopidogrel',
    nombre_en: 'Clopidogrel',
    nombres_comerciales: ['Plavix','Clopidogrel MK','Iscover'],
    sinonimos: ['plavix','antiagregante','para el corazon','para el infarto','para la trombosis'],
    categoria: 'Antiagregante plaquetario',
    uso_principal: 'Prevención de infarto y ACV en pacientes de alto riesgo cardiovascular',
    dosis_adulto: '75 mg una vez al día',
    dosis_nino: 'No aplica en uso pediátrico rutinario',
    contraindicaciones: 'Sangrado activo, úlcera péptica activa, alergia.',
    efectos_secundarios: 'Sangrado (hematomas, encías), raramente sangrado grave.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '190 C$ (30 tabletas)',
    embarazo: 'Categoría B — Consultar médico'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 9 — ANTIPARASITARIOS
  // ════════════════════════════════════════════════════════
  {
    id: 47,
    nombre_es: 'Albendazol',
    nombre_en: 'Albendazole',
    nombres_comerciales: ['Zentel','Eskazole','Albendazol MK','Aldal','Sol kalben','Mebendamin'],
    sinonimos: ['zentel','antiparasitario','para los parasitos','gusanos','lombrices','parasitosis','oxiuros','aldal','sol kalben','mebendamin'],
    categoria: 'Antihelmíntico / Antiparasitario',
    uso_principal: 'Parasitosis intestinal (lombrices, oxiuros, tenias)',
    dosis_adulto: '400 mg dosis única',
    dosis_nino: 'Mayores de 2 años: 400 mg. Menores de 2: 200 mg.',
    contraindicaciones: 'Alergia, embarazo primer trimestre, enfermedad hepática grave.',
    efectos_secundarios: 'Dolor abdominal leve, náuseas.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '14-98 C$ (según presentación: suspensión 14-65C$, tabletas 17.50-98C$)',
    embarazo: 'Categoría C — Evitar en primer trimestre'
  },
  {
    id: 135,
    nombre_es: 'Mebendazol',
    nombre_en: 'Mebendazole',
    nombres_comerciales: ['Vermox','Mebendazol MK','Mebendamin'],
    sinonimos: ['mebendazol','vermox','antiparasitario','lombrices','mebendamin'],
    categoria: 'Antihelmíntico',
    uso_principal: 'Parasitosis intestinal (lombrices, oxiuros)',
    dosis_adulto: '100 mg dos veces al día por 3 días O 500 mg dosis única',
    dosis_nino: 'Mayores de 2 años: misma dosis que adulto',
    contraindicaciones: 'Alergia, menores de 1 año, embarazo 1er trimestre',
    efectos_secundarios: 'Dolor abdominal leve, diarrea',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '17.50-98 C$ (según presentación)',
    embarazo: 'Categoría C — Evitar en 1er trimestre'
  },
  {
    id: 57,
    nombre_es: 'Ivermectina',
    nombre_en: 'Ivermectin',
    nombres_comerciales: ['Stromectol','Ivexterm','Ivermectina MK'],
    sinonimos: ['stromectol','ivexterm','para la sarna','para los parasitos','antiparasitario oral'],
    categoria: 'Antiparasitario sistémico',
    uso_principal: 'Sarna (escabiosis), oncocercosis, estrongiloidiasis, piojos',
    dosis_adulto: 'Sarna: 200 mcg/kg dosis única (repetir a los 7-14 días)',
    dosis_nino: 'Mayores de 15 kg: 200 mcg/kg. No usar en menores de 15 kg.',
    contraindicaciones: 'Menores de 15 kg, embarazo, meningitis. Alergia.',
    efectos_secundarios: 'Mareos, náuseas, reacción de Mazzotti (en oncocercosis).',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '30-80 C$ (tabletas)',
    embarazo: 'Categoría C — Evitar'
  },
  {
    id: 77,
    nombre_es: 'Nitazoxanida',
    nombre_en: 'Nitazoxanide',
    nombres_comerciales: ['Alinia','Nitazoxanida MK','Paramix'],
    sinonimos: ['alinia','paramix','para parasitos','giardia','cryptosporidium','diarrea parasitaria'],
    categoria: 'Antiparasitario / Antiprotozoario',
    uso_principal: 'Giardiasis, criptosporidiosis, diarrea por parásitos, algunas infecciones virales digestivas',
    dosis_adulto: '500 mg dos veces al día por 3 días con comida',
    dosis_nino: '1-3 años: 100 mg dos veces al día. 4-11 años: 200 mg dos veces al día.',
    contraindicaciones: 'Alergia a nitazoxanida.',
    efectos_secundarios: 'Dolor abdominal leve, náuseas, orina amarilla (normal).',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '86-760 C$ (según presentación)',
    embarazo: 'Categoría B — Consultar médico'
  },
  {
    id: 78,
    nombre_es: 'Tinidazol',
    nombre_en: 'Tinidazole',
    nombres_comerciales: ['Fasigyn','Tinidazol MK','Triconex'],
    sinonimos: ['fasigyn','triconex','para parasitos','giardia','amebas','tricomonas'],
    categoria: 'Antiparasitario / Antibiótico',
    uso_principal: 'Giardiasis, amebiasis, tricomoniasis, vaginosis bacteriana',
    dosis_adulto: 'Giardia: 2 g dosis única. Amebiasis: 2 g al día por 3 días.',
    dosis_nino: '50-60 mg/kg/día (consultar médico)',
    contraindicaciones: 'Alergia, embarazo primer trimestre. NO alcohol durante tratamiento.',
    efectos_secundarios: 'Sabor metálico, náuseas, mareo. Evitar alcohol.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '104 C$ (100 tabletas)',
    embarazo: 'Categoría C — Evitar en primer trimestre'
  },
  {
    id: 117,
    nombre_es: 'Secnidazol',
    nombre_en: 'Secnidazole',
    nombres_comerciales: ['Flagentyl','Secnil','Secnidazol MK'],
    sinonimos: ['flagentyl','secnil','para parasitos dosis unica','giardia rapido','vaginosis','amebiasis'],
    categoria: 'Antiparasitario (5-nitroimidazol, dosis única)',
    uso_principal: 'Giardiasis, amebiasis, vaginosis bacteriana, tricomoniasis. Ventaja: dosis única.',
    dosis_adulto: '2 g dosis única. Vaginosis: 1 g dosis única.',
    dosis_nino: '30 mg/kg dosis única (consultar médico)',
    contraindicaciones: 'Alergia, embarazo primer trimestre. NO alcohol.',
    efectos_secundarios: 'Náuseas, sabor metálico, mareos. Evitar alcohol.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '13.50-36 C$ (según presentación)',
    embarazo: 'Categoría B — Evitar en primer trimestre'
  },
  {
    id: 80,
    nombre_es: 'Furazolidona',
    nombre_en: 'Furazolidone',
    nombres_comerciales: ['Furoxona','Furazolidona MK','Enterogel'],
    sinonimos: ['furoxona','para la diarrea bacteriana','colitis','enterocolitis','giardia','enterogel'],
    categoria: 'Antibiótico / Antiparasitario intestinal',
    uso_principal: 'Diarrea bacteriana, giardiasis, cólera, enterocolitis',
    dosis_adulto: '100 mg cuatro veces al día por 5-7 días con comida',
    dosis_nino: '1.25 mg/kg cuatro veces al día',
    contraindicaciones: 'Alergia. NO consumir alcohol. Menores de 1 mes.',
    efectos_secundarios: 'Náuseas, vómitos, orina oscura (normal). Evitar alcohol.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '40-69.50 C$ (según presentación)',
    embarazo: 'Categoría C — Consultar médico'
  },
  {
    id: 56,
    nombre_es: 'Permetrina',
    nombre_en: 'Permethrin',
    nombres_comerciales: ['Elimite','Nix','Scabimite','Permetrina MK','Escabiax'],
    sinonimos: ['nix','para la sarna','para los piojos','scabiosis','pediculosis','parasitos piel','escabiax'],
    categoria: 'Antiparasitario tópico',
    uso_principal: 'Sarna (escabiosis), piojos de la cabeza (pediculosis)',
    dosis_adulto: 'Sarna: cuello a pies, dejar 8-12 h, lavar. Piojos: cabello 10 min, lavar.',
    dosis_nino: 'Igual que adulto. Menores de 2 meses: consultar médico.',
    contraindicaciones: 'Alergia a la permetrina. Evitar contacto con ojos.',
    efectos_secundarios: 'Picazón o ardor leve temporal.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '30-90 C$ (crema o champú)',
    embarazo: 'Categoría B — Generalmente seguro'
  },
  {
    id: 122,
    nombre_es: 'Benzoato de Bencilo',
    nombre_en: 'Benzyl Benzoate',
    nombres_comerciales: ['Ascabiol','Scabinil','Benzoato de bencilo MK'],
    sinonimos: ['ascabiol','scabinil','para la sarna','escabiosis','acaricida','alternativa permetrina'],
    categoria: 'Antiparasitario tópico (acaricida)',
    uso_principal: 'Sarna (escabiosis) — alternativa cuando permetrina no está disponible',
    dosis_adulto: 'Loción 25%: de cuello a pies, dejar 24 horas, lavar. Repetir a los 7 días.',
    dosis_nino: 'Diluir al 12.5% en niños. NO en menores de 2 años.',
    contraindicaciones: 'Alergia, heridas abiertas extensas. Evitar ojos y mucosas.',
    efectos_secundarios: 'Ardor local (normal y transitorio), irritación de piel.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '24 C$ (loción 120 mL)',
    embarazo: 'Categoría C — Usar con precaución'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 10 — ANTIMICÓTICOS
  // ════════════════════════════════════════════════════════
  {
    id: 48,
    nombre_es: 'Aciclovir',
    nombre_en: 'Acyclovir',
    nombres_comerciales: ['Zovirax','Acivir','Aciclovir MK','Andi Tevirin'],
    sinonimos: ['zovirax','para el herpes','fuego labial','culebrina','varicela','antiviral','andi tevirin'],
    categoria: 'Antiviral',
    uso_principal: 'Herpes labial, herpes genital, varicela, culebrina (herpes zoster)',
    dosis_adulto: 'Herpes labial: 200 mg 5 veces/día por 5 días. Varicela: 800 mg 5 veces/día.',
    dosis_nino: '20 mg/kg 4 veces al día para varicela',
    contraindicaciones: 'Alergia al aciclovir. Beber abundante agua.',
    efectos_secundarios: 'Náuseas, dolor de cabeza. Beber mucha agua.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '30.50-196.50 C$ (según presentación: crema 30.50-40.50C$, tabletas 196.50C$)',
    embarazo: 'Categoría B — Generalmente seguro'
  },
  {
    id: 49,
    nombre_es: 'Fluconazol',
    nombre_en: 'Fluconazole',
    nombres_comerciales: ['Diflucan','Fluconazol MK','Fluconal','Caplin'],
    sinonimos: ['diflucan','para los hongos','candidiasis','hongo vaginal','micosis','caplin'],
    categoria: 'Antimicótico sistémico',
    uso_principal: 'Candidiasis vaginal, candidiasis oral, micosis sistémicas',
    dosis_adulto: 'Candidiasis vaginal: 150 mg dosis única. Oral: 100-200 mg/día.',
    dosis_nino: '3-6 mg/kg/día (consultar médico)',
    contraindicaciones: 'Alergia, embarazo (primer trimestre). Muchas interacciones medicamentosas.',
    efectos_secundarios: 'Náuseas, dolor abdominal, dolor de cabeza.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '16-240 C$ (según presentación: 2 cápsulas 16-21.50C$, 10-12 cápsulas 71.50-240C$)',
    embarazo: 'Categoría D — Evitar en primer trimestre'
  },
  {
    id: 54,
    nombre_es: 'Clotrimazol',
    nombre_en: 'Clotrimazole',
    nombres_comerciales: ['Canesten','Lotrimin','Gyne-Lotrimin','Clotrimazol MK','Clodersol','Clotriplex','Gencloben'],
    sinonimos: ['canesten','lotrimin','antimicotico','hongos en la piel','pie de atleta','candidiasis vaginal','hongo','clodersol','clotriplex','gencloben'],
    categoria: 'Antimicótico tópico',
    uso_principal: 'Candidiasis vaginal, pie de atleta, tiña, hongos en la piel',
    dosis_adulto: 'Crema: 2-3 veces al día por 2-4 semanas. Óvulo vaginal: 1 óvulo 500 mg dosis única.',
    dosis_nino: 'Crema: 2-3 veces al día según indicación',
    contraindicaciones: 'Alergia al clotrimazol.',
    efectos_secundarios: 'Ardor o irritación leve en el sitio de aplicación.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '16.50-85.50 C$ (según presentación: crema 16.50-40C$, óvulos 33-85.50C$)',
    embarazo: 'Categoría B — Crema segura'
  },
  {
    id: 85,
    nombre_es: 'Miconazol',
    nombre_en: 'Miconazole',
    nombres_comerciales: ['Monistat','Miconazol MK','Daktarin','Gyno-Daktarin'],
    sinonimos: ['monistat','daktarin','gyno-daktarin','para hongos vaginales','candidiasis','hongo en la piel'],
    categoria: 'Antimicótico tópico y vaginal',
    uso_principal: 'Candidiasis vaginal, hongos en la piel (tiña, pie de atleta), candidiasis oral',
    dosis_adulto: 'Vaginal: 200 mg óvulo por 3 días o 100 mg por 7 días. Tópica: crema 2% dos veces al día.',
    dosis_nino: 'Tópica bajo supervisión médica',
    contraindicaciones: 'Alergia al miconazol.',
    efectos_secundarios: 'Ardor o irritación leve local.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '46.50 C$ (crema vaginal con aplicador)',
    embarazo: 'Categoría C — Consultar médico, uso tópico generalmente aceptado'
  },
  {
    id: 86,
    nombre_es: 'Nistatina',
    nombre_en: 'Nystatin',
    nombres_comerciales: ['Mycostatin','Nistatina MK','Nilstat'],
    sinonimos: ['mycostatin','nilstat','para hongos bucales','candidiasis oral','algodoncillo','muguet'],
    categoria: 'Antimicótico (tópico oral y vaginal)',
    uso_principal: 'Candidiasis oral (algodoncillo), candidiasis vaginal, candidiasis cutánea',
    dosis_adulto: 'Oral: 500,000 UI enjuague y trague 4 veces al día. Vaginal: 100,000 UI óvulo por 14 días.',
    dosis_nino: 'Oral: 100,000 UI cuatro veces al día en la boca (neonatos y lactantes)',
    contraindicaciones: 'Alergia a nistatina.',
    efectos_secundarios: 'Sabor desagradable, náuseas con dosis altas.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '36.50-45 C$ (según presentación)',
    embarazo: 'Categoría B — Segura en uso tópico'
  },
  {
    id: 87,
    nombre_es: 'Terbinafina',
    nombre_en: 'Terbinafine',
    nombres_comerciales: ['Lamisil','Terbinafina MK','Fungimed','Fungil'],
    sinonimos: ['lamisil','fungimed','para hongos en unas','onicomicosis','tina','pie de atleta','hongos','fungil'],
    categoria: 'Antimicótico (tópico y oral)',
    uso_principal: 'Hongos en uñas (onicomicosis), pie de atleta, tiña',
    dosis_adulto: 'Oral: 250 mg una vez al día por 6 semanas (uñas manos) o 12 semanas (uñas pies). Tópica: 1% dos veces al día por 1-2 semanas.',
    dosis_nino: 'Oral solo bajo supervisión médica',
    contraindicaciones: 'Enfermedad hepática grave. Alergia a terbinafina.',
    efectos_secundarios: 'Náuseas, dolor abdominal, rash (oral). Ardor local (tópico).',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '37.50-78.50 C$ (según presentación tópica)',
    embarazo: 'Categoría B — Crema generalmente segura; oral consultar médico'
  },
  {
    id: 88,
    nombre_es: 'Ketoconazol',
    nombre_en: 'Ketoconazole',
    nombres_comerciales: ['Nizoral','Ketoconazol MK','Ketoderm','Ketogin','Ketosol'],
    sinonimos: ['nizoral','ketoderm','para la caspa','hongo cuero cabelludo','seborreico','hongos','ketogin','ketosol'],
    categoria: 'Antimicótico tópico',
    uso_principal: 'Caspa, dermatitis seborreica, tiña del cuero cabelludo, hongos en la piel',
    dosis_adulto: 'Champú 2%: aplicar 2 veces por semana por 4 semanas. Crema 2%: una vez al día por 2-4 semanas.',
    dosis_nino: 'Bajo supervisión médica',
    contraindicaciones: 'Alergia al ketoconazol. Evitar contacto con ojos.',
    efectos_secundarios: 'Irritación local, resequedad del cuero cabelludo.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '34-110 C$ (según presentación: crema 34-45C$, champú 110C$)',
    embarazo: 'Categoría C — Uso tópico con precaución'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 11 — CORTICOIDES
  // ════════════════════════════════════════════════════════
  {
    id: 37,
    nombre_es: 'Dexametasona',
    nombre_en: 'Dexamethasone',
    nombres_comerciales: ['Decadron','Oradexon','Dexametasona MK','Dexona','Dexacort'],
    sinonimos: ['decadron','corticoide','cortisona','para la inflamacion','para la alergia grave','dexona','dexacort'],
    categoria: 'Corticosteroide potente',
    uso_principal: 'Inflamación severa, reacciones alérgicas graves, edema cerebral, crup',
    dosis_adulto: '0.5-24 mg/día según indicación médica',
    dosis_nino: 'Solo bajo supervisión médica',
    contraindicaciones: 'Infecciones fúngicas sistémicas. Precaución en diabetes, HTA, úlcera.',
    efectos_secundarios: 'Con uso prolongado: aumento de peso, diabetes, osteoporosis, inmunosupresión.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '31-176.50 C$ (según presentación: tabletas 31-117.50C$, inyectable 75-91.50C$, óvulos 176.50C$)',
    embarazo: 'Categoría C — Usar solo si beneficio supera el riesgo'
  },
  {
    id: 38,
    nombre_es: 'Prednisona',
    nombre_en: 'Prednisone',
    nombres_comerciales: ['Deltasone','Meticorten','Prednisona MK'],
    sinonimos: ['meticorten','cortisona oral','prednisona','para alergia severa','para artritis'],
    categoria: 'Corticosteroide oral',
    uso_principal: 'Enfermedades autoinmunes, alergias graves, asma severo, inflamación crónica',
    dosis_adulto: '5-60 mg/día según condición (tomar con comida)',
    dosis_nino: '0.5-2 mg/kg/día (consultar médico)',
    contraindicaciones: 'Infecciones no tratadas, úlcera péptica activa. No suspender bruscamente.',
    efectos_secundarios: 'Aumento de peso, hipertensión, diabetes, osteoporosis con uso crónico.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '90-322 C$ (según presentación)',
    embarazo: 'Categoría C — Consultar médico'
  },
  {
    id: 101,
    nombre_es: 'Prednisolona',
    nombre_en: 'Prednisolone',
    nombres_comerciales: ['Prelone','Pediapred','Prednisolona MK'],
    sinonimos: ['prelone','pediapred','corticoide jarabe','cortisona jarabe para nino','para asma nino','inflamacion pediatrica'],
    categoria: 'Corticosteroide oral (jarabe y tabletas)',
    uso_principal: 'Crisis asmática en niños, alergias graves, crup laríngeo, inflamación severa pediátrica',
    dosis_adulto: '5-60 mg/día según condición',
    dosis_nino: '1-2 mg/kg/día (MÁX 40 mg). Jarabe ideal para niños.',
    contraindicaciones: 'Infecciones no tratadas, úlcera péptica activa. No suspender bruscamente.',
    efectos_secundarios: 'Con uso prolongado: aumento de peso, hiperglucemia, inmunosupresión.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '144.50-263.50 C$ (jarabe)',
    embarazo: 'Categoría C — Consultar médico'
  },
  {
    id: 99,
    nombre_es: 'Betametasona crema',
    nombre_en: 'Betamethasone cream',
    nombres_comerciales: ['Diprolene','Betnovate','Betametasona MK 0.1%','Arcocort','Betacrim'],
    sinonimos: ['betnovate','diprolene','crema para picazon fuerte','corticoide topico potente','dermatitis severa','psoriasis','arcocort','betacrim'],
    categoria: 'Corticosteroide tópico potente',
    uso_principal: 'Dermatitis atópica, psoriasis, eccema severo, inflamación cutánea moderada a grave',
    dosis_adulto: 'Fina capa 1-2 veces al día. MÁX 2-4 semanas. NO en cara ni pliegues.',
    dosis_nino: 'Extrema precaución. Dosis mínima, tiempo breve.',
    contraindicaciones: 'Infecciones cutáneas no tratadas, acné. NO en cara, axilas, ingle sin indicación.',
    efectos_secundarios: 'Con uso prolongado: atrofia de piel, estrías, despigmentación.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '41.50-101 C$ (según presentación)',
    embarazo: 'Categoría C — Uso mínimo y breve'
  },
  {
    id: 55,
    nombre_es: 'Hidrocortisona crema',
    nombre_en: 'Hydrocortisone cream',
    nombres_comerciales: ['Cortaid','Hytone','Hidrocortisona MK 1%','Corgentisol'],
    sinonimos: ['cortaid','crema cortisona','para la picazon','eczema','dermatitis','alergia en la piel','corgentisol'],
    categoria: 'Corticosteroide tópico leve',
    uso_principal: 'Eccema, dermatitis, picazón, erupciones cutáneas inflamatorias leves',
    dosis_adulto: 'Fina capa 2-3 veces al día. No usar más de 2 semanas sin indicación médica.',
    dosis_nino: 'Usar con precaución. Dosis mínima efectiva.',
    contraindicaciones: 'Infecciones cutáneas por virus, hongos o bacterias sin antibiótico. Evitar en cara y pliegues en niños.',
    efectos_secundarios: 'Con uso prolongado: adelgazamiento de la piel, estrías.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '35.50-47.50 C$ (tubo)',
    embarazo: 'Categoría C — Usar solo si es necesario, mínima cantidad'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 12 — VITAMINAS Y SUPLEMENTOS
  // ════════════════════════════════════════════════════════
  {
    id: 51,
    nombre_es: 'Vitamina C',
    nombre_en: 'Ascorbic Acid',
    nombres_comerciales: ['Redoxon','Ce-Vita','Celin','Vitamina C MK','Cebion'],
    sinonimos: ['vitamina c','acido ascorbico','redoxon','ce vita','para las defensas','efervescente','cebion'],
    categoria: 'Vitamina / Suplemento',
    uso_principal: 'Prevención y tratamiento del escorbuto, refuerzo del sistema inmune, antioxidante',
    dosis_adulto: '500-1000 mg una vez al día',
    dosis_nino: '250 mg una vez al día',
    contraindicaciones: 'Cálculos renales de oxalato con dosis altas. En general muy segura.',
    efectos_secundarios: 'Diarrea con dosis muy altas (más de 2 g al día).',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '100-1000 C$ (según presentación: gotas 100C$, tabletas 793-1000C$, efervescente 118C$)',
    embarazo: 'Categoría A — Segura y recomendada'
  },
  {
    id: 52,
    nombre_es: 'Vitamina B12',
    nombre_en: 'Cyanocobalamin',
    nombres_comerciales: ['Bedoyecta','Neurobion','Cianocobalamina MK','B12','Vitalgia','Nervisel','Dexa Vitalgia'],
    sinonimos: ['b12','cianocobalamina','bedoyecta','neurobion','para la anemia','para los nervios','vitamina nervios','vitalgia','nervisel','dexa vitalgia'],
    categoria: 'Vitamina B12 / Antianémico',
    uso_principal: 'Anemia megaloblástica, neuropatía periférica, deficiencia en vegetarianos y ancianos',
    dosis_adulto: '1000 mcg al día (oral) o 1000 mcg IM semanal (inyectable)',
    dosis_nino: 'Según deficiencia (consultar médico)',
    contraindicaciones: 'Alergia a cobalaminas. En general muy segura.',
    efectos_secundarios: 'Rarísimos efectos adversos.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '16.50-400 C$ (según presentación: ampolla 16.50-62C$, tabletas 222-400C$)',
    embarazo: 'Categoría A — Segura y recomendada'
  },
  {
    id: 139,
    nombre_es: 'Complejo B',
    nombre_en: 'B Complex',
    nombres_comerciales: ['Neurobion','Vitalgia','Bedoyecta','Dolo-Neurobion'],
    sinonimos: ['complejo b','vitaminas b','neurobion','vitalgia','nervios','dolo neurobion'],
    categoria: 'Vitamina B / Suplemento',
    uso_principal: 'Deficiencia de vitaminas B, neuropatía, apoyo energético',
    dosis_adulto: '1 tableta al día O 1 ampolla IM semanal',
    dosis_nino: 'Consultar médico pediátrico',
    contraindicaciones: 'Alergia a componentes',
    efectos_secundarios: 'Orina amarilla brillante (normal)',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '41-1595 C$ (según presentación)',
    embarazo: 'Categoría A — Seguro y recomendado'
  },
  {
    id: 140,
    nombre_es: 'Hierro + Ácido Fólico',
    nombre_en: 'Iron + Folic Acid',
    nombres_comerciales: ['Fer-In-Sol','Folamil Ferro','Intrafer','Gotas Intrafer'],
    sinonimos: ['hierro','acido folico','anemia','embarazo','ferro','intrafer'],
    categoria: 'Suplemento prenatal / Antianémico',
    uso_principal: 'Anemia ferropénica, suplemento prenatal',
    dosis_adulto: '1 tableta al día',
    dosis_nino: 'Según peso (consultar médico)',
    contraindicaciones: 'Hemocromatosis, anemia no ferropénica',
    efectos_secundarios: 'Heces negras, estreñimiento, náuseas',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '142-419 C$ (según presentación)',
    embarazo: 'Categoría A — RECOMENDADO'
  },
  {
    id: 53,
    nombre_es: 'Calcio Carbonato',
    nombre_en: 'Calcium Carbonate',
    nombres_comerciales: ['Caltrate','Os-Cal','Calcibon','Calcium Sandoz','Blodin Calcio'],
    sinonimos: ['calcio','para los huesos','osteoporosis','calcibon','caltrate','antiacido','blodin calcio'],
    categoria: 'Suplemento de calcio / Antiacido',
    uso_principal: 'Suplemento de calcio, osteoporosis, antiácido para acidez estomacal',
    dosis_adulto: 'Antiacido: 500-1500 mg según necesidad. Suplemento: 500-1000 mg dos veces al día.',
    dosis_nino: 'Según edad (consultar médico)',
    contraindicaciones: 'Hipercalcemia, cálculos renales de calcio. No tomar con antibióticos (tetraciclinas, quinolonas).',
    efectos_secundarios: 'Estreñimiento, gases, flatulencia.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '143-202 C$ (según presentación)',
    embarazo: 'Categoría A — Recomendado en embarazo'
  },
  {
    id: 119,
    nombre_es: 'Vitamina A',
    nombre_en: 'Vitamin A / Retinol',
    nombres_comerciales: ['Arovit','Vitamina A MK','Vit ADK'],
    sinonimos: ['vitamina a','retinol','arovit','para la vista','deficiencia vitamina a','ceguera nocturna','vit adk'],
    categoria: 'Vitamina liposoluble',
    uso_principal: 'Deficiencia de vitamina A, ceguera nocturna, salud ocular, inmunidad',
    dosis_adulto: '5000-50000 UI según deficiencia. No exceder 10000 UI/día en uso prolongado.',
    dosis_nino: 'Programa de suplementación MINSA según edad',
    contraindicaciones: 'Hipervitaminosis A (tóxica en exceso). Embarazo: NO exceder 10000 UI/día.',
    efectos_secundarios: 'Con sobredosis: dolor de cabeza, vómitos, daño hepático.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '136-401.50 C$ (según presentación)',
    embarazo: 'Categoría A (dosis baja) — NO exceder 10000 UI/día en embarazo'
  },
  {
    id: 120,
    nombre_es: 'Vitamina E',
    nombre_en: 'Vitamin E / Tocopherol',
    nombres_comerciales: ['Ephynal','Vitamina E MK','Evion'],
    sinonimos: ['vitamina e','tocoferol','ephynal','evion','antioxidante','para la piel','capsula vitamina'],
    categoria: 'Vitamina liposoluble / Antioxidante',
    uso_principal: 'Deficiencia de vitamina E, antioxidante, salud cardiovascular',
    dosis_adulto: '200-400 UI una vez al día',
    dosis_nino: 'Según deficiencia (consultar médico)',
    contraindicaciones: 'Anticoagulantes (aumenta efecto). Evitar dosis >1000 UI/día.',
    efectos_secundarios: 'Con dosis altas: náuseas, diarrea, riesgo de sangrado.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '215 C$ (60 cápsulas)',
    embarazo: 'Categoría A — Segura en dosis normales'
  },
  {
    id: 96,
    nombre_es: 'Multivitamínico',
    nombre_en: 'Multivitamin',
    nombres_comerciales: ['Centrum','Supradyn','Pharmaton','Multibionta','Complejo B','Vit asym','Macrovitam','Lemovit'],
    sinonimos: ['centrum','supradyn','pharmaton','complejo b','vitaminas','multivitaminas','suplemento vitaminas','vitaminas complejo','vitasym','macrovitam','lemovit'],
    categoria: 'Suplemento vitamínico / Multimineral',
    uso_principal: 'Suplementación vitamínica general, prevención de deficiencias, apoyo al sistema inmune',
    dosis_adulto: '1 tableta al día con comida',
    dosis_nino: 'Formulas infantiles: 1 tableta masticable al día (según edad)',
    contraindicaciones: 'Evitar dosis múltiples. Hipervitaminosis con sobredosis de vitaminas A y D.',
    efectos_secundarios: 'Náuseas si se toma en ayunas. Orina amarilla brillante (vitamina B2, normal).',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '50-443 C$ (según presentación)',
    embarazo: 'Categoría A — Recomendado (formulas prenatales específicas)'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 13 — ANTIGRIPALES Y COMBINADOS
  // ════════════════════════════════════════════════════════
  {
    id: 141,
    nombre_es: 'Paracetamol + Cafeína',
    nombre_en: 'Paracetamol + Caffeine',
    nombres_comerciales: ['Tabcin','Dolartrin','Panadol Extra'],
    sinonimos: ['tabcin','dolartrin','antigripal','dolor cabeza','fiebre'],
    categoria: 'Analgésico combinado',
    uso_principal: 'Dolor de cabeza, fiebre, síntomas gripales',
    dosis_adulto: '2 tabletas cada 6-8 horas (MÁX 8 al día)',
    dosis_nino: 'Consultar según edad',
    contraindicaciones: 'Enfermedad hepática, alergia',
    efectos_secundarios: 'Náuseas, insomnio (por cafeína)',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '55-475 C$ (según presentación)',
    embarazo: 'Categoría B — Consultar médico'
  },
  {
    id: 142,
    nombre_es: 'Paracetamol + Clorfeniramina + Fenilefrina',
    nombre_en: 'Paracetamol + Chlorpheniramine + Phenylephrine',
    nombres_comerciales: ['Tabcin Gripe y Tos','Virogrip','Frenadol'],
    sinonimos: ['gripe y tos','antigripal','resfriado','congestion','virogrip'],
    categoria: 'Antigripal combinado',
    uso_principal: 'Síntomas de gripe: fiebre, congestión, tos',
    dosis_adulto: '1 tableta/cápula cada 6-8 horas',
    dosis_nino: 'Formulación pediátrica según edad',
    contraindicaciones: 'Hipertensión no controlada, glaucoma',
    efectos_secundarios: 'Somnolencia, boca seca, mareos',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '78-526 C$ (según presentación)',
    embarazo: 'Categoría C — Consultar médico'
  },
  {
    id: 83,
    nombre_es: 'Dimenhidrinato',
    nombre_en: 'Dimenhydrinate',
    nombres_comerciales: ['Dramamine','Dimenhidrinato MK','Vertirosan'],
    sinonimos: ['dramamine','vertirosan','para el mareo','mareo en carro','mareo en bus','vomitos de viaje','nauseas viaje'],
    categoria: 'Antivomitivo / Antimareo',
    uso_principal: 'Mareo por movimiento (carro, barco, avión), náuseas y vómitos, vértigo',
    dosis_adulto: '50-100 mg cada 4-6 horas. Tomar 30 min antes de viajar.',
    dosis_nino: 'Mayores de 2 años: 1-1.5 mg/kg cada 6-8 horas.',
    contraindicaciones: 'Glaucoma, asma, retención urinaria. No conducir (causa sueño).',
    efectos_secundarios: 'Somnolencia, boca seca, visión borrosa. Causa sueño.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '10-25 C$ (tabletas)',
    embarazo: 'Categoría B — Consultar médico'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 15 — PRODUCTOS TÓPICOS Y DESINFECTANTES
  // ════════════════════════════════════════════════════════
  {
    id: 89,
    nombre_es: 'Iodopovidona',
    nombre_en: 'Povidone-Iodine',
    nombres_comerciales: ['Betadine','Isodine','Iodopovidona MK','Yodalin','Yodo Blanco'],
    sinonimos: ['betadine','isodine','yodalin','yodo','antiseptico','para heridas','para desinfectar','yodo blanco'],
    categoria: 'Antiséptico tópico',
    uso_principal: 'Desinfección de heridas, quemaduras, cortes, preparación quirúrgica de la piel',
    dosis_adulto: 'Aplicar directamente en la herida o zona a desinfectar. Dejar secar.',
    dosis_nino: 'Usar con precaución en neonatos.',
    contraindicaciones: 'Alergia al yodo, hipotiroidismo. No usar en heridas profundas sin indicación médica.',
    efectos_secundarios: 'Irritación o quemadura en piel sensible. Tiñe la piel de café/marrón (temporal).',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '35.50-65 C$ (según presentación)',
    embarazo: 'Categoría D — Evitar en embarazo y lactancia'
  },
  {
    id: 153,
    nombre_es: 'Yodo Povidona',
    nombre_en: 'Povidone-Iodine',
    nombres_comerciales: ['Betadine','Isodine','Yodo MK'],
    sinonimos: ['yodo','povidona','betadine','isodine','desinfectante','heridas'],
    categoria: 'Antiséptico tópico',
    uso_principal: 'Desinfección de heridas, cortes, preparación quirúrgica',
    dosis_adulto: 'Aplicar directamente en herida, dejar secar',
    dosis_nino: 'Usar con precaución en neonatos',
    contraindicaciones: 'Alergia al yodo, hipotiroidismo',
    efectos_secundarios: 'Irritación, tinción marrón temporal',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '35.50-65 C$ (según presentación)',
    embarazo: 'Categoría D — Evitar en embarazo y lactancia'
  },
  {
    id: 154,
    nombre_es: 'Alcohol 70%',
    nombre_en: 'Alcohol 70%',
    nombres_comerciales: ['Alcohol MK','Alcohol medicinal','Dermalcol'],
    sinonimos: ['alcohol','alcohol 70','desinfectante','antiséptico','dermalcol'],
    categoria: 'Antiséptico / Desinfectante',
    uso_principal: 'Desinfección de piel, superficies, instrumental',
    dosis_adulto: 'Aplicar tópicamente según necesidad',
    dosis_nino: 'Supervisión adulta requerida',
    contraindicaciones: 'Heridas abiertas profundas, ojos',
    efectos_secundarios: 'Sequedad de piel, irritación',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '17-204 C$ (según presentación: 2oz-32oz)',
    embarazo: 'Categoría A — Seguro en uso tópico'
  },
  {
    id: 143,
    nombre_es: 'Óxido de Zinc',
    nombre_en: 'Zinc Oxide',
    nombres_comerciales: ['Pasta al Agua','Hipoglos','Zepol'],
    sinonimos: ['oxido de zinc','pasta al agua','zepol','pañal','rozadura'],
    categoria: 'Protector cutáneo',
    uso_principal: 'Dermatitis del pañal, rozaduras, protección de piel',
    dosis_adulto: 'Aplicar capa generosa en zona afectada',
    dosis_nino: 'Aplicar en cada cambio de pañal',
    contraindicaciones: 'Alergia a componentes',
    efectos_secundarios: 'Ninguno significativo',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '18.50-183 C$ (según presentación)',
    embarazo: 'Categoría A — Totalmente seguro'
  },
  {
    id: 144,
    nombre_es: 'Alcohol + Alcanfor + Mentol',
    nombre_en: 'Alcohol + Camphor + Menthol',
    nombres_comerciales: ['Vick Vaporub','Manzatin','Zepol'],
    sinonimos: ['vick','manzatin','zepol','para el pecho','tos','congestion'],
    categoria: 'Descongestionante tópico',
    uso_principal: 'Congestión nasal, tos, alivio respiratorio',
    dosis_adulto: 'Aplicar en pecho y cuello 2-3 veces al día',
    dosis_nino: 'Mayores de 2 años, evitar cara',
    contraindicaciones: 'Menores de 2 años, heridas abiertas',
    efectos_secundarios: 'Irritación local leve',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '39.50-562 C$ (según presentación)',
    embarazo: 'Categoría C — Uso tópico limitado'
  },
  {
    id: 118,
    nombre_es: 'Calamina loción',
    nombre_en: 'Calamine Lotion',
    nombres_comerciales: ['Calamina MK','Caladermina'],
    sinonimos: ['calamina','para picazon','para varicela','para quemadura de sol','urticaria topica','ronchas','sarpullido','caladermina'],
    categoria: 'Astringente / Antiprurítico tópico',
    uso_principal: 'Picazón por varicela, urticaria, quemaduras leves de sol, sarpullidos',
    dosis_adulto: 'Aplicar sobre zona afectada limpia y seca. Dejar secar. Repetir según necesidad.',
    dosis_nino: 'Seguro desde lactantes. Muy usado en varicela pediátrica.',
    contraindicaciones: 'Alergia a los componentes. No aplicar en heridas abiertas.',
    efectos_secundarios: 'Ninguno significativo.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '38-49 C$ (loción 120 mL)',
    embarazo: 'Categoría A — Totalmente segura en uso tópico'
  },
  {
    id: 100,
    nombre_es: 'Mupirocina',
    nombre_en: 'Mupirocin',
    nombres_comerciales: ['Bactroban','Mupiral','Mupirocina MK','Mupirocina Selectpharma'],
    sinonimos: ['bactroban','mupiral','antibiotico topico','para impetigo','infeccion de piel','herida infectada','mupirocina selectpharma'],
    categoria: 'Antibiótico tópico (anti-Staphylococcus)',
    uso_principal: 'Impétigo, infecciones cutáneas por Staphylococcus aureus, heridas infectadas superficiales',
    dosis_adulto: 'Aplicar 3 veces al día por 5-10 días',
    dosis_nino: 'Igual que adulto (mayores de 2 meses)',
    contraindicaciones: 'Alergia a mupirocina.',
    efectos_secundarios: 'Ardor o picazón leve local.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '103.50-204 C$ (ungüento 15-20 g)',
    embarazo: 'Categoría B — Segura en uso tópico'
  },
  {
    id: 93,
    nombre_es: 'Bacitracina',
    nombre_en: 'Bacitracin',
    nombres_comerciales: ['Bacitracina MK','Bacitracin Plus','Neosporin','Triple Antibiotico'],
    sinonimos: ['bacitracina','neosporin','pomada antibiotica','para heridas','para cortadas','antibiotico topico','triple antibiotico'],
    categoria: 'Antibiótico tópico',
    uso_principal: 'Prevención de infecciones en heridas menores, cortes, quemaduras superficiales',
    dosis_adulto: 'Aplicar fina capa en la herida 1-3 veces al día y cubrir con vendaje',
    dosis_nino: 'Igual que adulto. Seguro en niños.',
    contraindicaciones: 'Alergia a bacitracina o neomicina. Heridas profundas o mordeduras de animales requieren evaluación médica.',
    efectos_secundarios: 'Erupción alérgica (raro), irritación local.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '20-72.50 C$ (tubo de pomada)',
    embarazo: 'Categoría C — Uso tópico generalmente aceptado'
  },
  {
    id: 157,
    nombre_es: 'Lidocaína',
    nombre_en: 'Lidocaine',
    nombres_comerciales: ['Lidocaína MK','Xylocaine','Panesia'],
    sinonimos: ['lidocaina','anestesico','dolor local','panesia'],
    categoria: 'Anestésico local',
    uso_principal: 'Anestesia local, dolor superficial, procedimientos menores',
    dosis_adulto: '2-5% tópico o inyectable según procedimiento',
    dosis_nino: 'Según peso y procedimiento',
    contraindicaciones: 'Alergia a anestésicos amida, bloqueo cardíaco',
    efectos_secundarios: 'Ardor temporal, reacciones alérgicas',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '36.50-54 C$ (según presentación)',
    embarazo: 'Categoría B — Generalmente seguro'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 16 — ANTIÁCIDOS Y PROTECTORES GÁSTRICOS
  // ════════════════════════════════════════════════════════
  {
    id: 155,
    nombre_es: 'Hidróxido de Aluminio + Hidróxido de Magnesio',
    nombre_en: 'Aluminum Hydroxide + Magnesium Hydroxide',
    nombres_comerciales: ['Alumin Plus','Alumin Simple','Melox'],
    sinonimos: ['alumin','antiacido','acidez','estomago','gastritis','melox'],
    categoria: 'Antiácido',
    uso_principal: 'Acidez estomacal, gastritis, reflujo leve',
    dosis_adulto: '10-20 mL después de comidas y al acostarse',
    dosis_nino: '5-10 mL según edad',
    contraindicaciones: 'Insuficiencia renal grave',
    efectos_secundarios: 'Estreñimiento (aluminio), diarrea (magnesio)',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '37.50-195 C$ (según presentación)',
    embarazo: 'Categoría B — Generalmente seguro'
  },
  {
    id: 75,
    nombre_es: 'Simeticona',
    nombre_en: 'Simethicone',
    nombres_comerciales: ['Gas-X','Luftal','Simeticona MK','Mylanta Gas','Baros'],
    sinonimos: ['gas-x','luftal','baros','para los gases','flatulencia','hinchazon de estomago','colicos gases'],
    categoria: 'Antiflatulento / Antiespumante',
    uso_principal: 'Gases, flatulencia, hinchazón abdominal, cólicos por gases en bebés',
    dosis_adulto: '40-125 mg después de comidas y al acostarse',
    dosis_nino: 'Bebés y niños: 20-40 mg después de cada comida y al acostarse',
    contraindicaciones: 'Alergia a simeticona. Generalmente muy segura.',
    efectos_secundarios: 'Ninguno significativo. Es químicamente inerte.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '15-58.50 C$ (tabletas masticables o gotas)',
    embarazo: 'Categoría C — Generalmente segura, consultar médico'
  },
  {
    id: 74,
    nombre_es: 'Famotidina',
    nombre_en: 'Famotidine',
    nombres_comerciales: ['Pepcid','Famotidina MK','Pepcidine'],
    sinonimos: ['pepcid','pepcidine','para la acidez','antiulceroso','gastritis','reflujo'],
    categoria: 'Antiulceroso (antagonista H2)',
    uso_principal: 'Acidez, gastritis, reflujo gastroesofágico, úlcera gástrica',
    dosis_adulto: '20 mg dos veces al día o 40 mg en la noche',
    dosis_nino: '0.5 mg/kg dos veces al día (consultar médico)',
    contraindicaciones: 'Alergia a famotidina o antihistamínicos H2.',
    efectos_secundarios: 'Dolor de cabeza, mareos, diarrea o estreñimiento. Generalmente bien tolerado.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '20-50 C$ (tabletas)',
    embarazo: 'Categoría B — Consultar médico'
  },
  {
    id: 113,
    nombre_es: 'Pantoprazol',
    nombre_en: 'Pantoprazole',
    nombres_comerciales: ['Protonix','Pantocal','Pantoprazol MK'],
    sinonimos: ['protonix','pantocal','para la gastritis','para el reflujo','ibp','alternativa omeprazol'],
    categoria: 'Inhibidor de Bomba de Protones (IBP)',
    uso_principal: 'Gastritis, reflujo gastroesofágico, úlcera. Alternativa al omeprazol con menos interacciones.',
    dosis_adulto: '40 mg una vez al día, 30 min antes del desayuno',
    dosis_nino: 'Bajo supervisión médica',
    contraindicaciones: 'Alergia a IBP.',
    efectos_secundarios: 'Dolor de cabeza, diarrea, náuseas. Bien tolerado.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '119-177 C$ (14-100 tabletas)',
    embarazo: 'Categoría B — Generalmente seguro'
  },
  {
    id: 81,
    nombre_es: 'Subsalicilato de Bismuto',
    nombre_en: 'Bismuth Subsalicylate',
    nombres_comerciales: ['Pepto-Bismol','Bismuto MK'],
    sinonimos: ['pepto bismol','bismuto','para el estomago','nauseas','diarrea','malestar estomacal'],
    categoria: 'Antidiarreico / Antiemético / Antiacido',
    uso_principal: 'Diarrea leve, náuseas, indigestión, malestar estomacal, diarrea del viajero',
    dosis_adulto: '525 mg cada 30-60 min según necesidad. MÁX 8 dosis al día.',
    dosis_nino: 'Mayores de 12 años: dosis adulto. NO en menores de 12 años (riesgo síndrome de Reye).',
    contraindicaciones: 'Menores de 12 años, alergia a salicilatos, anticoagulantes, úlcera activa.',
    efectos_secundarios: 'Heces y lengua negra (NORMAL), estreñimiento, tinnitus con dosis altas.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '80.50-145 C$ (según presentación)',
    embarazo: 'Categoría C — Evitar en tercer trimestre'
  },
  {
    id: 82,
    nombre_es: 'Bisacodilo',
    nombre_en: 'Bisacodyl',
    nombres_comerciales: ['Dulcolax','Bisacodilo MK','Laxoberon','Laxifen'],
    sinonimos: ['dulcolax','laxoberon','laxante','para el estrenimiento','constipacion','laxifen'],
    categoria: 'Laxante estimulante',
    uso_principal: 'Estreñimiento ocasional, preparación para exámenes médicos',
    dosis_adulto: '5-10 mg oral en la noche (efecto en 6-12 h) o 10 mg supositorios (efecto en 15-60 min)',
    dosis_nino: 'Mayores de 6 años: 5 mg oral. Mayores de 10 años: dosis adulto.',
    contraindicaciones: 'Dolor abdominal agudo desconocido, náuseas, vómitos, íleo. No uso crónico.',
    efectos_secundarios: 'Calambres abdominales, diarrea, náuseas. No usar más de 7 días seguidos.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '15-260 C$ (según presentación)',
    embarazo: 'Categoría C — Usar con precaución'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 17 — GINECOLOGÍA / ANTICONCEPCIÓN
  // ════════════════════════════════════════════════════════
  {
    id: 58,
    nombre_es: 'Anticonceptivo oral combinado',
    nombre_en: 'Combined Oral Contraceptive',
    nombres_comerciales: ['Microgynon','Nordette','Levofem','Yasmin','Belara','Segura Plus','Norgylen'],
    sinonimos: ['pastillas anticonceptivas','pastillas para no embarazarse','microgynon','nordette','levofem','yasmin','planificacion familiar','segura plus','norgylen'],
    categoria: 'Anticonceptivo hormonal oral',
    uso_principal: 'Anticoncepción, regulación del ciclo menstrual, síndrome de ovario poliquístico',
    dosis_adulto: '1 tableta al día, comenzar el primer día de la menstruación',
    dosis_nino: 'Solo para adolescentes con menstruación, bajo supervisión médica',
    contraindicaciones: 'Fumadoras mayores de 35 años, trombosis, migraña con aura, hepatitis, embarazo.',
    efectos_secundarios: 'Náuseas (primeras semanas), manchado intermenstrual, cambios de humor.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '33-108 C$ (ciclo mensual)',
    embarazo: 'Categoría X — No usar en embarazo'
  },
  {
    id: 59,
    nombre_es: 'Anticonceptivo de emergencia',
    nombre_en: 'Emergency Contraception',
    nombres_comerciales: ['Postinor','Plan B','Levonorgestrel MK','NorLevo'],
    sinonimos: ['pastilla del dia siguiente','postinor','plan b','anticoncepcion de emergencia','levonorgestrel'],
    categoria: 'Anticoncepción de emergencia',
    uso_principal: 'Prevención de embarazo después de relación sexual sin protección (máx 72 horas)',
    dosis_adulto: '1.5 mg (una tableta) lo antes posible, dentro de las 72 horas',
    dosis_nino: 'Solo para adolescentes con menstruación',
    contraindicaciones: 'No es abortivo. No usar como método regular. Embarazo confirmado.',
    efectos_secundarios: 'Náuseas, vómitos, sangrado irregular, dolor de cabeza.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '80-150 C$ (tableta)',
    embarazo: 'No aplica (no es abortivo)'
  },
  {
    id: 159,
    nombre_es: 'Anticonceptivo Oral',
    nombre_en: 'Oral Contraceptive',
    nombres_comerciales: ['Microgynon','Nordette','Segura Plus'],
    sinonimos: ['pastillas','anticonceptivo','microgynon','nordette','planificacion'],
    categoria: 'Anticonceptivo hormonal',
    uso_principal: 'Prevención de embarazo, regulación menstrual',
    dosis_adulto: '1 tableta diaria por 21-28 días según marca',
    dosis_nino: 'Solo adolescentes con menstruación',
    contraindicaciones: 'Embarazo, trombosis, migraña con aura, fumadoras >35',
    efectos_secundarios: 'Náuseas, manchado, cambios de humor',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '33-108 C$ (ciclo mensual)',
    embarazo: 'Categoría X — NO usar en embarazo'
  },
  {
    id: 160,
    nombre_es: 'Condones',
    nombre_en: 'Condoms',
    nombres_comerciales: ['Vive','Prudence','Durex'],
    sinonimos: ['condones','preservativo','vive','prudence','proteccion'],
    categoria: 'Barrera anticonceptiva / ITS',
    uso_principal: 'Prevención de embarazo y enfermedades de transmisión sexual',
    dosis_adulto: '1 unidad por relación sexual',
    dosis_nino: 'No aplica',
    contraindicaciones: 'Alergia al látex (usar poliuretano)',
    efectos_secundarios: 'Ninguno, posible irritación por látex',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '45-768 C$ (según presentación)',
    embarazo: 'No aplica — Método de barrera'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 18 — MATERIAL MÉDICO Y DESCARTABLES
  // ════════════════════════════════════════════════════════
  {
    id: 165,
    nombre_es: 'Jeringas Descartables',
    nombre_en: 'Disposable Syringes',
    nombres_comerciales: ['Jeringa MK','Descartables'],
    sinonimos: ['jeringa','inyeccion','descartable','3ml','5ml','10ml'],
    categoria: 'Material médico descartable',
    uso_principal: 'Administración de medicamentos inyectables',
    dosis_adulto: 'Según volumen necesario (3ml, 5ml, 10ml)',
    dosis_nino: 'Según peso y medicamento',
    contraindicaciones: 'No reutilizar',
    efectos_secundarios: 'Ninguno si se usa correctamente',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '201-365 C$ (caja x100)',
    embarazo: 'No aplica'
  },
  {
    id: 166,
    nombre_es: 'Algodón Estéril',
    nombre_en: 'Sterile Cotton',
    nombres_comerciales: ['Algodón MK','Algodón estéril'],
    sinonimos: ['algodon','esteril','curacion','heridas','limpieza'],
    categoria: 'Material médico descartable',
    uso_principal: 'Curaciones, limpieza de heridas, aplicación de medicamentos',
    dosis_adulto: 'Según necesidad',
    dosis_nino: 'Según necesidad',
    contraindicaciones: 'Ninguna',
    efectos_secundarios: 'Ninguno',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '7.50-243.25 C$ (según presentación)',
    embarazo: 'No aplica'
  },
  {
    id: 167,
    nombre_es: 'Gasas Estériles',
    nombre_en: 'Sterile Gauze',
    nombres_comerciales: ['Gasa MK','Gasas estériles'],
    sinonimos: ['gasas','esteril','curacion','heridas','venda'],
    categoria: 'Material médico descartable',
    uso_principal: 'Curaciones, protección de heridas',
    dosis_adulto: 'Según tamaño de herida',
    dosis_nino: 'Según tamaño de herida',
    contraindicaciones: 'Ninguna',
    efectos_secundarios: 'Ninguno',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '213 C$ (caja x100)',
    embarazo: 'No aplica'
  },
  {
    id: 168,
    nombre_es: 'Guantes de Látex',
    nombre_en: 'Latex Gloves',
    nombres_comerciales: ['Guantes MK','Guantes látex'],
    sinonimos: ['guantes','latex','proteccion','curacion','examen'],
    categoria: 'Material médico descartable / Protección',
    uso_principal: 'Protección en curaciones, exámenes, manipulación',
    dosis_adulto: '1 par por procedimiento',
    dosis_nino: 'No aplica',
    contraindicaciones: 'Alergia al látex',
    efectos_secundarios: 'Reacción alérgica en sensibles',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '12.50-240 C$ (según presentación)',
    embarazo: 'No aplica'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 19 — PRUEBAS DIAGNÓSTICAS RÁPIDAS
  // ════════════════════════════════════════════════════════
  {
    id: 169,
    nombre_es: 'Prueba de Embarazo',
    nombre_en: 'Pregnancy Test',
    nombres_comerciales: ['Prueba Embarazo','Clearblue','Response'],
    sinonimos: ['embarazo','prueba','test','response','cassette'],
    categoria: 'Prueba diagnóstica rápida',
    uso_principal: 'Detección de embarazo (hCG en orina)',
    dosis_adulto: '1 prueba, preferiblemente con primera orina',
    dosis_nino: 'No aplica',
    contraindicaciones: 'Ninguna',
    efectos_secundarios: 'Ninguno',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '15-27 C$',
    embarazo: 'No aplica — Para detectar embarazo'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 20 — PRODUCTOS PARA DIABÉTICOS
  // ════════════════════════════════════════════════════════
  {
    id: 170,
    nombre_es: 'Tiras Reactivas para Glucómetro',
    nombre_en: 'Glucose Test Strips',
    nombres_comerciales: ['WellSensor','Accu-Chek','OneTouch'],
    sinonimos: ['tiras','glucometro','azucar','diabetes','wellsensor'],
    categoria: 'Insumo para monitoreo de glucosa',
    uso_principal: 'Medición de glucosa en sangre para diabéticos',
    dosis_adulto: '1 tira por medición según indicación médica',
    dosis_nino: 'Según protocolo médico',
    contraindicaciones: 'Ninguna',
    efectos_secundarios: 'Ninguno',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '470-539 C$ (25-50 tiras)',
    embarazo: 'No aplica — Para monitoreo'
  },
  {
    id: 171,
    nombre_es: 'Glucómetro',
    nombre_en: 'Glucometer',
    nombres_comerciales: ['WellSensor','Accu-Chek','OneTouch'],
    sinonimos: ['glucometro','azucar','diabetes','medidor'],
    categoria: 'Dispositivo médico',
    uso_principal: 'Medición de glucosa en sangre',
    dosis_adulto: 'Según necesidad (varias veces al día)',
    dosis_nino: 'Según protocolo médico',
    contraindicaciones: 'Ninguna',
    efectos_secundarios: 'Ninguno',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '740 C$ (kit completo)',
    embarazo: 'No aplica — Para monitoreo'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 21 — PRODUCTOS PARA HIPERTENSOS
  // ════════════════════════════════════════════════════════
  {
    id: 172,
    nombre_es: 'Tensiómetro',
    nombre_en: 'Blood Pressure Monitor',
    nombres_comerciales: ['Tensiómetro MK','Omron','Beurer'],
    sinonimos: ['tensiometro','presion','arterial','omron','medidor'],
    categoria: 'Dispositivo médico',
    uso_principal: 'Medición de presión arterial',
    dosis_adulto: 'Según indicación médica (1-3 veces al día)',
    dosis_nino: 'Con manguito pediátrico',
    contraindicaciones: 'Ninguna',
    efectos_secundarios: 'Ninguno',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '520.50 C$ (kit con estetoscopio)',
    embarazo: 'No aplica — Para monitoreo'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 22 — PRODUCTOS DE HIGIENE FEMENINA
  // ════════════════════════════════════════════════════════
  {
    id: 173,
    nombre_es: 'Toallas Sanitarias',
    nombre_en: 'Sanitary Pads',
    nombres_comerciales: ['Kotex','Saba','Always'],
    sinonimos: ['toallas','sanitarias','kotex','saba','menstruacion'],
    categoria: 'Higiene femenina',
    uso_principal: 'Absorción de flujo menstrual',
    dosis_adulto: 'Cambiar cada 4-6 horas',
    dosis_nino: 'No aplica (adolescentes con menstruación)',
    contraindicaciones: 'Ninguna',
    efectos_secundarios: 'Posible irritación (cambiar frecuentemente)',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '24.75-48.50 C$ (según presentación)',
    embarazo: 'No aplica'
  },
  {
    id: 174,
    nombre_es: 'Protectores Diarios',
    nombre_en: 'Panty Liners',
    nombres_comerciales: ['Kotex','Saba','Always'],
    sinonimos: ['protectores','diarios','kotex','saba','higiene'],
    categoria: 'Higiene femenina',
    uso_principal: 'Protección diaria, flujo ligero',
    dosis_adulto: 'Cambiar según necesidad',
    dosis_nino: 'No aplica',
    contraindicaciones: 'Ninguna',
    efectos_secundarios: 'Ninguno',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '24-32 C$ (15 unidades)',
    embarazo: 'No aplica'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 23 — CUIDADO DE BEBÉS
  // ════════════════════════════════════════════════════════
  {
    id: 175,
    nombre_es: 'Pañales para Adulto',
    nombre_en: 'Adult Diapers',
    nombres_comerciales: ['Cotidian','Tena','Always Discreet'],
    sinonimos: ['pañales','adulto','incontinencia','cotidian'],
    categoria: 'Cuidado de incontinencia',
    uso_principal: 'Incontinencia urinaria/fecal en adultos',
    dosis_adulto: 'Cambiar según necesidad',
    dosis_nino: 'No aplica',
    contraindicaciones: 'Ninguna',
    efectos_secundarios: 'Posible irritación (cambiar frecuentemente)',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '196.50 C$ (10 unidades)',
    embarazo: 'No aplica'
  },
  {
    id: 176,
    nombre_es: 'Toallitas Húmedas',
    nombre_en: 'Wet Wipes',
    nombres_comerciales: ['Huggies','Baby Astros','Pampers'],
    sinonimos: ['toallitas','humedas','huggies','bebe','limpieza'],
    categoria: 'Higiene de bebé',
    uso_principal: 'Limpieza de bebé, cambio de pañal',
    dosis_adulto: 'Según necesidad',
    dosis_nino: 'Según necesidad',
    contraindicaciones: 'Alergia a componentes',
    efectos_secundarios: 'Posible irritación en piel sensible',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '43-69 C$ (según presentación)',
    embarazo: 'No aplica'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 24 — NEBULIZACIÓN Y RESPIRATORIO
  // ════════════════════════════════════════════════════════
  {
    id: 177,
    nombre_es: 'Nebulizador',
    nombre_en: 'Nebulizer',
    nombres_comerciales: ['Medimax','Omron','Philips'],
    sinonimos: ['nebulizador','asma','bronquitis','respiratorio','medimax'],
    categoria: 'Dispositivo médico',
    uso_principal: 'Administración de medicamentos inhalados',
    dosis_adulto: 'Según prescripción médica',
    dosis_nino: 'Según prescripción médica',
    contraindicaciones: 'Ninguna',
    efectos_secundarios: 'Ninguno',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '880 C$',
    embarazo: 'No aplica — Dispositivo'
  },
  {
    id: 178,
    nombre_es: 'Mascarilla para Nebulizar',
    nombre_en: 'Nebulizer Mask',
    nombres_comerciales: ['Mascarilla Nebulizador','Allpro','Viamed'],
    sinonimos: ['mascarilla','nebulizador','asma','respiratorio'],
    categoria: 'Accesorio médico',
    uso_principal: 'Administración de medicamentos inhalados',
    dosis_adulto: 'Adulto o pediátrica según edad',
    dosis_nino: 'Pediátrica para niños',
    contraindicaciones: 'Ninguna',
    efectos_secundarios: 'Ninguno',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '50 C$',
    embarazo: 'No aplica'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 25 — TERMÓMETROS
  // ════════════════════════════════════════════════════════
  {
    id: 179,
    nombre_es: 'Termómetro Digital',
    nombre_en: 'Digital Thermometer',
    nombres_comerciales: ['Termómetro Wellpro','Omron','Beurer'],
    sinonimos: ['termometro','digital','fiebre','temperatura','wellpro'],
    categoria: 'Dispositivo médico',
    uso_principal: 'Medición de temperatura corporal',
    dosis_adulto: 'Según necesidad',
    dosis_nino: 'Según necesidad',
    contraindicaciones: 'Ninguna',
    efectos_secundarios: 'Ninguno',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '105-151 C$',
    embarazo: 'No aplica — Dispositivo'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 26 — PRODUCTOS PEDIÁTRICOS ESPECÍFICOS
  // ════════════════════════════════════════════════════════
  {
    id: 158,
    nombre_es: 'Paracetamol Pediátrico',
    nombre_en: 'Pediatric Paracetamol',
    nombres_comerciales: ['Tempra Niños','Panadol Niños','Acetaminofén jarabe'],
    sinonimos: ['paracetamol niño','acetaminofen jarabe','fiebre niño','tempra'],
    categoria: 'Analgésico/Antipirético pediátrico',
    uso_principal: 'Fiebre y dolor en niños',
    dosis_adulto: 'No aplica',
    dosis_nino: '10-15 mg/kg cada 6 horas (MÁX 5 dosis/24h)',
    contraindicaciones: 'Enfermedad hepática, alergia',
    efectos_secundarios: 'Raro: daño hepático con sobredosis',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '25-64 C$ (según presentación)',
    embarazo: 'No aplica (uso pediátrico)'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 27 — INFUSIONES Y TÉS MEDICINALES
  // ════════════════════════════════════════════════════════
  {
    id: 181,
    nombre_es: 'Té de Manzanilla',
    nombre_en: 'Chamomile Tea',
    nombres_comerciales: ['Manzate','Té Manzanilla'],
    sinonimos: ['manzanilla','te','digestion','calmante','dormir'],
    categoria: 'Infusión herbal',
    uso_principal: 'Digestión, cólicos, relajación, dormir',
    dosis_adulto: '1-2 tazas al día',
    dosis_nino: 'Seguro en todas las edades',
    contraindicaciones: 'Alergia a asteráceas',
    efectos_secundarios: 'Ninguno significativo',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '48-170 C$ (según presentación)',
    embarazo: 'Categoría A — Seguro en moderación'
  },
  {
    id: 182,
    nombre_es: 'Té de Jengibre',
    nombre_en: 'Ginger Tea',
    nombres_comerciales: ['Té Jengibre/Limón','Manzate Jengibre'],
    sinonimos: ['jengibre','te','nauseas','digestion','gripe'],
    categoria: 'Infusión herbal',
    uso_principal: 'Náuseas, digestión, gripe, antiinflamatorio',
    dosis_adulto: '1-3 tazas al día',
    dosis_nino: 'Consultar según edad',
    contraindicaciones: 'Anticoagulantes, úlcera activa',
    efectos_secundarios: 'Acidez en dosis altas',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '68.50-79 C$',
    embarazo: 'Categoría A — Seguro en moderación'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 28 — PRODUCTOS DE HIGIENE Y CUIDADO
  // ════════════════════════════════════════════════════════
  {
    id: 162,
    nombre_es: 'Jabón Medicinal',
    nombre_en: 'Medicinal Soap',
    nombres_comerciales: ['Jabón Avena','Jabón Azufre','Jabón Neutro','Grissi'],
    sinonimos: ['jabon','avena','azufre','piel','acne','grissi'],
    categoria: 'Higiene / Cuidado de piel',
    uso_principal: 'Limpieza de piel, acné, dermatitis',
    dosis_adulto: 'Usar 1-2 veces al día en ducha',
    dosis_nino: 'Seguro para todas las edades',
    contraindicaciones: 'Alergia a componentes',
    efectos_secundarios: 'Sequedad de piel (usar hidratante)',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '31.50-43.50 C$',
    embarazo: 'Categoría A — Seguro'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 30 — NEUROLÓGICOS / PSIQUIATRÍA ADICIONAL
  // ════════════════════════════════════════════════════════
  {
    id: 111,
    nombre_es: 'Gabapentina',
    nombre_en: 'Gabapentin',
    nombres_comerciales: ['Neurontin','Gabarin','Gabex Plus','Gabapentina MK'],
    sinonimos: ['neurontin','gabarin','para dolor de nervios','neuropatia','dolor neuropatico','fibromialgia','nervio ciatico','gabex plus'],
    categoria: 'Anticonvulsivante / Analgésico neuropático',
    uso_principal: 'Dolor neuropático (neuropatía diabética, ciática, neuralgia posherpética), epilepsia, fibromialgia',
    dosis_adulto: '300-1200 mg tres veces al día (iniciar con 300 mg/noche, titular lentamente)',
    dosis_nino: '10-15 mg/kg/día dividido tres veces (epilepsia, bajo supervisión)',
    contraindicaciones: 'Alergia. Ajustar dosis en insuficiencia renal.',
    efectos_secundarios: 'Somnolencia, mareos, aumento de peso. Iniciar con dosis baja.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '85-473 C$ (según dosis)',
    embarazo: 'Categoría C — Consultar médico'
  },
  {
    id: 28,
    nombre_es: 'Diazepam',
    nombre_en: 'Diazepam',
    nombres_comerciales: ['Valium','Ansiolin','Diazepam MK'],
    sinonimos: ['valium','para los nervios','ansiedad','calmante','tranquilizante','convulsiones'],
    categoria: 'Benzodiazepina / Ansiolítico',
    uso_principal: 'Ansiedad grave, convulsiones, espasmos musculares, abstinencia alcohólica',
    dosis_adulto: '2-10 mg 2-4 veces al día (según indicación médica)',
    dosis_nino: 'Solo bajo supervisión médica estricta',
    contraindicaciones: 'Insuficiencia respiratoria grave, apnea del sueño. Dependencia con uso prolongado.',
    efectos_secundarios: 'Somnolencia, mareos, dependencia física. No conducir.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '5-20 C$ (tabletas)',
    embarazo: 'Categoría D — Evitar, especialmente primer trimestre'
  },
  {
    id: 31,
    nombre_es: 'Fluoxetina',
    nombre_en: 'Fluoxetine',
    nombres_comerciales: ['Prozac','Fluoxac','Fontex','Fluoxetina MK'],
    sinonimos: ['prozac','antidepresivo','para la depresion','isrs','para la ansiedad'],
    categoria: 'Antidepresivo ISRS',
    uso_principal: 'Depresión, trastorno obsesivo-compulsivo, trastorno de pánico, bulimia',
    dosis_adulto: '20-60 mg una vez al día (mañana)',
    dosis_nino: 'Solo bajo supervisión psiquiátrica',
    contraindicaciones: 'No combinar con inhibidores de MAO. Precaución en epilepsia.',
    efectos_secundarios: 'Náuseas (primeras semanas), insomnio, disfunción sexual. Efecto tarda 2-4 semanas.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '30-80 C$ (cápsulas)',
    embarazo: 'Categoría C — Consultar médico'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 31 — ENDOCRINOLOGÍA ADICIONAL
  // ════════════════════════════════════════════════════════
  {
    id: 34,
    nombre_es: 'Glibenclamida',
    nombre_en: 'Glibenclamide',
    nombres_comerciales: ['Daonil','Euglucon','Glibenclamida MK'],
    sinonimos: ['daonil','euglucon','para la diabetes','hipoglucemiante','antidiabetico'],
    categoria: 'Hipoglucemiante oral (Sulfonilurea)',
    uso_principal: 'Diabetes tipo 2 cuando dieta y metformina no son suficientes',
    dosis_adulto: '2.5-15 mg al día con el desayuno (iniciar con dosis baja)',
    dosis_nino: 'No usar en diabetes tipo 1 ni en niños',
    contraindicaciones: 'Diabetes tipo 1, insuficiencia renal o hepática grave, embarazo.',
    efectos_secundarios: 'Hipoglucemia si no come. Aumento de peso.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '35.50-56.50 C$ (100 tabletas)',
    embarazo: 'Categoría C — Contraindicado, usar insulina en embarazo'
  },
  {
    id: 35,
    nombre_es: 'Insulina NPH',
    nombre_en: 'NPH Insulin / Isophane Insulin',
    nombres_comerciales: ['Insulina Lilly NPH','Insulatard','Humulin N'],
    sinonimos: ['insulina','insulina nph','para la diabetes','insulina lenta','inyeccion para diabetes'],
    categoria: 'Insulina de acción intermedia',
    uso_principal: 'Diabetes tipo 1, diabetes tipo 2 mal controlada, diabetes en embarazo',
    dosis_adulto: 'Individualizada según glucemia (prescripción médica obligatoria)',
    dosis_nino: 'Solo bajo supervisión médica pediátrica',
    contraindicaciones: 'Hipoglucemia activa. Técnica de inyección y dosis individualizadas.',
    efectos_secundarios: 'Hipoglucemia (azúcar baja — mareos, sudor, temblor), lipodistrofia.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '120-250 C$ (frasco/vial)',
    embarazo: 'Categoría B — Primera elección en embarazo diabético'
  },
  {
    id: 36,
    nombre_es: 'Levotiroxina',
    nombre_en: 'Levothyroxine',
    nombres_comerciales: ['Eutirox','Synthroid','Levotiroxina MK'],
    sinonimos: ['eutirox','synthroid','tiroides','hipotiroidismo','hormona tiroidea','t4'],
    categoria: 'Hormona tiroidea',
    uso_principal: 'Hipotiroidismo, bocio, tras extirpación de tiroides',
    dosis_adulto: '25-200 mcg una vez al día (en ayunas, 30 min antes del desayuno)',
    dosis_nino: 'Según peso y edad (consultar médico)',
    contraindicaciones: 'Tirotoxicosis no tratada. Iniciar con dosis baja en ancianos y cardiopatía.',
    efectos_secundarios: 'Con dosis excesiva: palpitaciones, nerviosismo, pérdida de peso, insomnio.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '20-60 C$ (tabletas)',
    embarazo: 'Categoría A — Necesaria y segura en embarazo'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 32 — DERMATOLOGÍA ADICIONAL
  // ════════════════════════════════════════════════════════
  {
    id: 90,
    nombre_es: 'Ácido Salicílico',
    nombre_en: 'Salicylic Acid',
    nombres_comerciales: ['Verutex','Acido salicilico MK','Keralyt','Saliderm'],
    sinonimos: ['acido salicilico','para las verrugas','para los callos','verrugas','callosidades','queratolitico'],
    categoria: 'Queratolítico tópico',
    uso_principal: 'Verrugas, callos, durezas, psoriasis, seborrea, acné (concentraciones bajas)',
    dosis_adulto: 'Verrugas/callos: aplicar solución 17-40% directamente en la lesión una vez al día.',
    dosis_nino: 'Consultar médico. Evitar en niños pequeños en áreas extensas.',
    contraindicaciones: 'Heridas abiertas, infecciones. No aplicar en piel sana alrededor de la lesión.',
    efectos_secundarios: 'Irritación local, descamación de la piel tratada.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '15-40 C$ (solución o crema)',
    embarazo: 'Categoría C — Uso tópico limitado con precaución'
  },
  {
    id: 91,
    nombre_es: 'Minoxidil',
    nombre_en: 'Minoxidil',
    nombres_comerciales: ['Rogaine','Regaine','Minoxidil MK','Loniten topico'],
    sinonimos: ['rogaine','regaine','para la calvicie','para el cabello','alopecia','caida del cabello'],
    categoria: 'Estimulante capilar tópico',
    uso_principal: 'Alopecia androgenética (calvicie común en hombres y mujeres)',
    dosis_adulto: '1 mL (2% o 5%) aplicar en cuero cabelludo dos veces al día. Resultado en 3-6 meses.',
    dosis_nino: 'No recomendado en menores de 18 años',
    contraindicaciones: 'Alergia. No usar si hay infección o irritación en el cuero cabelludo.',
    efectos_secundarios: 'Irritación local, prurito, crecimiento de vello en cara (mujeres con 5%).',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '100-250 C$ (frasco)',
    embarazo: 'Categoría C — Contraindicado durante embarazo'
  },
  {
    id: 124,
    nombre_es: 'Finasteride',
    nombre_en: 'Finasteride',
    nombres_comerciales: ['Proscar','Propecia','Finasteride MK'],
    sinonimos: ['proscar','propecia','para la prostata','para la calvicie','alopecia masculina','hiperplasia prostatica'],
    categoria: 'Inhibidor 5-alfa reductasa',
    uso_principal: 'Hiperplasia prostática benigna (5 mg), alopecia androgenética masculina (1 mg)',
    dosis_adulto: 'Próstata: 5 mg/día. Calvicie: 1 mg/día. Efecto en 3-6 meses.',
    dosis_nino: 'NO usar en menores de 18 años ni en mujeres.',
    contraindicaciones: 'Mujeres (especialmente embarazadas — malformaciones fetales). Menores de 18 años.',
    efectos_secundarios: 'Disfunción sexual (~2%), ginecomastia (raro).',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '577 C$ (100 tabletas)',
    embarazo: 'Categoría X — PROHIBIDO en mujeres embarazadas (ni tocar el comprimido)'
  },
  {
    id: 92,
    nombre_es: 'Lágrimas Artificiales',
    nombre_en: 'Artificial Tears',
    nombres_comerciales: ['Systane','Refresh Tears','Lagrimas Artificiales MK','Visine Tears'],
    sinonimos: ['systane','refresh tears','para los ojos secos','sequedad ocular','ardor de ojos','ojos rojos secos'],
    categoria: 'Lubricante ocular',
    uso_principal: 'Ojos secos, irritación ocular por viento, polvo, humo o uso de pantallas',
    dosis_adulto: '1-2 gotas en cada ojo según necesidad',
    dosis_nino: 'Seguro en todas las edades bajo supervisión',
    contraindicaciones: 'Alergia a los componentes. No usar lentes de contacto blandos al aplicar (excepto fórmulas especiales).',
    efectos_secundarios: 'Visión borrosa transitoria inmediatamente después de aplicar (normal).',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '40-120 C$ (frasco gotero)',
    embarazo: 'Categoría A — Seguras durante embarazo'
  },
  {
    id: 95,
    nombre_es: 'Suero Fisiológico Nasal',
    nombre_en: 'Nasal Saline Solution',
    nombres_comerciales: ['Sterimar','Fisiomer','Salinase','Suero nasal MK','Nasal Mist'],
    sinonimos: ['sterimar','fisiomer','salinase','lavado nasal','para la nariz','solucion salina nasal','nariz tapada'],
    categoria: 'Descongestionante nasal (solución salina)',
    uso_principal: 'Congestión nasal, limpieza nasal, rinitis, resfriado, alergias nasales, niños con moco',
    dosis_adulto: '1-2 atomizaciones por fosa nasal según necesidad. Sin límite de uso.',
    dosis_nino: 'Seguro desde recién nacidos. Aplicar antes de amamantar o comer.',
    contraindicaciones: 'Ninguna. Es simplemente agua con sal al 0.9%.',
    efectos_secundarios: 'Ninguno. Totalmente seguro.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '40-100 C$ (atomizador)',
    embarazo: 'Categoría A — Totalmente seguro'
  },
  {
    id: 123,
    nombre_es: 'Ketotifeno',
    nombre_en: 'Ketotifen',
    nombres_comerciales: ['Zaditor','Ketomax','Ketofen','Ketotifeno MK'],
    sinonimos: ['zaditor','ketomax','ketofen','para ojos alergicos','conjuntivitis alergica','ojos rojos por alergia'],
    categoria: 'Antialérgico ocular y sistémico',
    uso_principal: 'Conjuntivitis alérgica (gotas), prevención de asma alérgica (oral)',
    dosis_adulto: 'Gotas: 1 gota en cada ojo dos veces al día. Oral: 1 mg dos veces al día.',
    dosis_nino: 'Mayores de 3 años: igual que adulto',
    contraindicaciones: 'Alergia al ketotifeno.',
    efectos_secundarios: 'Oral: somnolencia, aumento de peso. Gotas: ardor leve transitorio.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '51 C$ (tabletas 50), 168 C$ (solución oftálmica)',
    embarazo: 'Categoría C — Consultar médico'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 33 — ANALGESIA ADICIONAL
  // ════════════════════════════════════════════════════════
  {
    id: 71,
    nombre_es: 'Ácido Mefenámico',
    nombre_en: 'Mefenamic Acid',
    nombres_comerciales: ['Ponstel','Ponstan','Acido mefenamico MK'],
    sinonimos: ['ponstan','ponstel','para los colicos menstruales','dolor menstrual','dismenorrea'],
    categoria: 'AINE (analgésico y antiinflamatorio)',
    uso_principal: 'Cólicos menstruales (dismenorrea), dolor leve a moderado, fiebre',
    dosis_adulto: '500 mg tres veces al día con comida. MÁX 7 días.',
    dosis_nino: 'Mayores de 12 años: misma dosis que adulto',
    contraindicaciones: 'Úlcera péptica, insuficiencia renal o hepática, embarazo. SIEMPRE con comida.',
    efectos_secundarios: 'Malestar gastrointestinal, diarrea, náuseas. Tomar con comida.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '15-35 C$ (cápsulas)',
    embarazo: 'Categoría C — Contraindicado en 3er trimestre'
  },
  {
    id: 72,
    nombre_es: 'Naproxeno',
    nombre_en: 'Naproxen',
    nombres_comerciales: ['Aleve','Naprosyn','Naproxeno MK','Flanax'],
    sinonimos: ['aleve','naprosyn','flanax','para el dolor','antiinflamatorio','dolor muscular','artritis'],
    categoria: 'AINE (analgésico antiinflamatorio de larga duración)',
    uso_principal: 'Dolor muscular, artritis, cólicos menstruales, dolor dental, fiebre',
    dosis_adulto: '250-500 mg dos veces al día con comida. Duración larga (12 horas).',
    dosis_nino: 'Mayores de 12 años: 250 mg dos veces al día',
    contraindicaciones: 'Úlcera, insuficiencia renal o cardíaca, embarazo avanzado. SIEMPRE con comida.',
    efectos_secundarios: 'Malestar gástrico, retención de líquidos. Tomar con comida.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '10-30 C$ (tabletas)',
    embarazo: 'Categoría C — Contraindicado en 3er trimestre'
  },
  {
    id: 73,
    nombre_es: 'Ergotamina',
    nombre_en: 'Ergotamine',
    nombres_comerciales: ['Cafergot','Ergotamina MK','Ergoton'],
    sinonimos: ['cafergot','ergotamina','para la migrana','jaqueca fuerte','migrena'],
    categoria: 'Antimigrañoso / Vasoconstrictor',
    uso_principal: 'Tratamiento del ataque agudo de migraña o jaqueca intensa',
    dosis_adulto: '1-2 mg al inicio del ataque. MÁX 6 mg por ataque y 10 mg por semana.',
    dosis_nino: 'No recomendado en menores de 12 años',
    contraindicaciones: 'Hipertensión, enfermedad coronaria, vasculopatía periférica, embarazo, sepsis.',
    efectos_secundarios: 'Náuseas, vómitos, hormigueo en extremidades. No usar frecuentemente.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '20-60 C$ (tabletas)',
    embarazo: 'Categoría X — CONTRAINDICADO'
  },
  {
    id: 42,
    nombre_es: 'Alopurinol',
    nombre_en: 'Allopurinol',
    nombres_comerciales: ['Zyloric','Zyloprim','Alopurinol MK'],
    sinonimos: ['zyloric','para la gota','acido urico alto','hiperuricemia','gota'],
    categoria: 'Antigotoso',
    uso_principal: 'Gota crónica, hiperuricemia, prevención de ataques de gota',
    dosis_adulto: '100-300 mg una vez al día (con mucha agua)',
    dosis_nino: 'Solo bajo supervisión médica',
    contraindicaciones: 'Ataque agudo de gota activo (no iniciar durante crisis). Alergia.',
    efectos_secundarios: 'Sarpullido (suspender si aparece), náuseas, crisis de gota al inicio.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '173.50 C$ (100 tabletas)',
    embarazo: 'Categoría C — Consultar médico'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 34 — HEMATOLOGÍA
  // ════════════════════════════════════════════════════════
  {
    id: 26,
    nombre_es: 'Sulfato Ferroso',
    nombre_en: 'Ferrous Sulfate',
    nombres_comerciales: ['Fer-In-Sol','Ferodan','Hierro MK','Sulfato ferroso'],
    sinonimos: ['hierro','para la anemia','ferodan','sulfato de hierro','anemia ferropenica'],
    categoria: 'Antianémico / Suplemento de hierro',
    uso_principal: 'Anemia ferropénica, embarazo, lactancia, pérdida de sangre',
    dosis_adulto: '300 mg (60 mg hierro elemental) 1-3 veces al día, con jugo de naranja',
    dosis_nino: '3-6 mg/kg/día de hierro elemental',
    contraindicaciones: 'Hemocromatosis, anemia no ferropénica. No tomar con leche o té.',
    efectos_secundarios: 'Heces negras (normal), estreñimiento, náuseas. Tomar con jugo de naranja.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '10-25 C$ (tabletas o jarabe)',
    embarazo: 'Categoría A — Recomendado en embarazo'
  },
  {
    id: 27,
    nombre_es: 'Warfarina',
    nombre_en: 'Warfarin',
    nombres_comerciales: ['Coumadin','Warfarina MK'],
    sinonimos: ['coumadin','anticoagulante','para la trombosis','para los coagulos'],
    categoria: 'Anticoagulante oral',
    uso_principal: 'Trombosis venosa profunda, fibrilación auricular, válvulas cardíacas artificiales',
    dosis_adulto: '2-10 mg al día (ajustar según INR — examen de sangre)',
    dosis_nino: 'Solo bajo supervisión hematológica',
    contraindicaciones: 'Sangrado activo, embarazo, hipertensión no controlada. MUCHAS interacciones.',
    efectos_secundarios: 'Sangrado (principal riesgo). Evitar cambios bruscos de dieta con vitamina K.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '20-50 C$ (tabletas)',
    embarazo: 'Categoría X — CONTRAINDICADO'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 35 — NEUROLOGÍA / PSIQUIATRÍA ADICIONAL
  // ════════════════════════════════════════════════════════
  {
    id: 29,
    nombre_es: 'Carbamazepina',
    nombre_en: 'Carbamazepine',
    nombres_comerciales: ['Tegretol','Carbatrol','Carbamazepina MK'],
    sinonimos: ['tegretol','para la epilepsia','antiepiletico','convulsiones','neuralgia'],
    categoria: 'Anticonvulsivante / Antiepiléptico',
    uso_principal: 'Epilepsia, neuralgia del trigémino, trastorno bipolar',
    dosis_adulto: '200-400 mg dos veces al día',
    dosis_nino: '10-20 mg/kg/día dividido en 2-3 dosis',
    contraindicaciones: 'Bloqueo AV, alergia. Muchas interacciones medicamentosas.',
    efectos_secundarios: 'Mareos, visión doble, náuseas, sarpullido (suspender si aparece).',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '20-60 C$ (tabletas)',
    embarazo: 'Categoría D — Riesgo de malformaciones fetales'
  },
  {
    id: 30,
    nombre_es: 'Ácido Valproico',
    nombre_en: 'Valproic Acid',
    nombres_comerciales: ['Depakote','Valcote','Acido valproico MK','Epival'],
    sinonimos: ['depakote','valcote','para la epilepsia','antiepiletico','para el bipolar'],
    categoria: 'Anticonvulsivante / Estabilizador del ánimo',
    uso_principal: 'Epilepsia, trastorno bipolar, prevención de migraña',
    dosis_adulto: '250-500 mg dos o tres veces al día',
    dosis_nino: '15-30 mg/kg/día dividido en 2-3 dosis',
    contraindicaciones: 'Enfermedad hepática, embarazo (alto riesgo), alergia.',
    efectos_secundarios: 'Aumento de peso, caída de cabello, temblor, daño hepático.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '40-100 C$ (tabletas)',
    embarazo: 'Categoría D — Riesgo alto de defectos del tubo neural'
  },
  {
    id: 32,
    nombre_es: 'Amitriptilina',
    nombre_en: 'Amitriptyline',
    nombres_comerciales: ['Triptizol','Amitriptilina MK','Laroxyl'],
    sinonimos: ['triptizol','antidepresivo','para el dolor cronico','neuropatia','para dormir'],
    categoria: 'Antidepresivo tricíclico',
    uso_principal: 'Depresión, dolor neuropático crónico, fibromialgia, migraña (prevención)',
    dosis_adulto: '25-150 mg al día (iniciar con 25 mg en la noche)',
    dosis_nino: 'Solo bajo supervisión médica',
    contraindicaciones: 'Infarto reciente, glaucoma, retención urinaria, arritmias. No con IMAO.',
    efectos_secundarios: 'Somnolencia, boca seca, estreñimiento, aumento de peso.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '10-30 C$ (tabletas)',
    embarazo: 'Categoría C — Consultar médico'
  },
  {
    id: 33,
    nombre_es: 'Haloperidol',
    nombre_en: 'Haloperidol',
    nombres_comerciales: ['Haldol','Serenase','Haloperidol MK'],
    sinonimos: ['haldol','antipsicotico','para la psicosis','para la agitacion'],
    categoria: 'Antipsicótico típico',
    uso_principal: 'Esquizofrenia, psicosis aguda, agitación severa, delirio',
    dosis_adulto: '0.5-5 mg dos o tres veces al día',
    dosis_nino: 'Solo bajo supervisión psiquiátrica',
    contraindicaciones: 'Parkinson, coma, depresión grave del SNC.',
    efectos_secundarios: 'Rigidez muscular, temblor, somnolencia, movimientos involuntarios.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '10-30 C$ (tabletas)',
    embarazo: 'Categoría C — Consultar médico'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 36 — GINECOLOGÍA / OBSTETRICIA
  // ════════════════════════════════════════════════════════
  {
    id: 60,
    nombre_es: 'Oxitocina',
    nombre_en: 'Oxytocin',
    nombres_comerciales: ['Pitocin','Syntocinon','Oxitocina MK'],
    sinonimos: ['pitocin','syntocinon','para el parto','inductor del parto','para el sangrado postparto'],
    categoria: 'Uterotónico / Hormona',
    uso_principal: 'Inducción del trabajo de parto, prevención de hemorragia postparto',
    dosis_adulto: 'Administración hospitalaria exclusiva (IV o IM según protocolo)',
    dosis_nino: 'No aplica',
    contraindicaciones: 'Uso exclusivamente hospitalario bajo supervisión médica. Desproporción cefalopélvica.',
    efectos_secundarios: 'Contracciones intensas, hipotensión, intoxicación hídrica con dosis altas.',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '30-80 C$ (ampolla)',
    embarazo: 'Uso hospitalario exclusivo'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 37 — ALERGIAS ADICIONALES
  // ════════════════════════════════════════════════════════
  {
    id: 61,
    nombre_es: 'Difenhidramina',
    nombre_en: 'Diphenhydramine',
    nombres_comerciales: ['Benadryl','Difenhidramina MK','Nytol','Unisom'],
    sinonimos: ['benadryl','para la alergia','para dormir','antihistaminico','picazon','urticaria','nytol'],
    categoria: 'Antihistamínico (1ra generación / sedante)',
    uso_principal: 'Alergias, urticaria, picazón, ayuda para dormir, náuseas por movimiento',
    dosis_adulto: '25-50 mg cada 6-8 horas. Causa mucho sueño — no conducir.',
    dosis_nino: 'Mayores de 2 años: 1 mg/kg cada 6 horas (consultar médico).',
    contraindicaciones: 'Glaucoma, retención urinaria, asma. Menores de 2 años. No conducir.',
    efectos_secundarios: 'Somnolencia intensa, boca seca, visión borrosa, confusión en ancianos.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '15-117.50 C$ (según presentación)',
    embarazo: 'Categoría B — Consultar médico'
  },
  {
    id: 62,
    nombre_es: 'Fexofenadina',
    nombre_en: 'Fexofenadine',
    nombres_comerciales: ['Allegra','Fexofenadina MK','Telfast'],
    sinonimos: ['allegra','telfast','para la alergia','antihistaminico sin sueno','alergia nasal','sin somnolencia'],
    categoria: 'Antihistamínico (2da generación, NO causa sueño)',
    uso_principal: 'Rinitis alérgica, urticaria crónica. NO causa somnolencia.',
    dosis_adulto: '120-180 mg una vez al día',
    dosis_nino: 'Mayores de 6 años: 30 mg dos veces al día (consultar médico)',
    contraindicaciones: 'Alergia a fexofenadina. No tomar con jugo de naranja o toronja.',
    efectos_secundarios: 'Dolor de cabeza, náuseas. Generalmente muy bien tolerado.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '30-70 C$ (tabletas)',
    embarazo: 'Categoría C — Consultar médico'
  },
  {
    id: 63,
    nombre_es: 'Cetirizina',
    nombre_en: 'Cetirizine',
    nombres_comerciales: ['Zyrtec','Cetirizina MK','Reactine','Alerlisin'],
    sinonimos: ['zyrtec','reactine','alerlisin','para la alergia','antihistaminico','rinitis','urticaria'],
    categoria: 'Antihistamínico (2da generación, leve somnolencia)',
    uso_principal: 'Rinitis alérgica, urticaria, ojos llorosos, estornudos. Puede causar algo de sueño.',
    dosis_adulto: '10 mg una vez al día (preferible en la noche)',
    dosis_nino: '5 mg una vez al día (mayores de 2 años)',
    contraindicaciones: 'Alergia a cetirizina o hidroxizina. Precaución en insuficiencia renal.',
    efectos_secundarios: 'Somnolencia leve, boca seca. Mejor tolerado que clorfeniramina.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '15-97 C$ (según presentación)',
    embarazo: 'Categoría B — Consultar médico'
  },
  {
    id: 97,
    nombre_es: 'Desloratadina',
    nombre_en: 'Desloratadine',
    nombres_comerciales: ['Clarinex','Aerius','Desloratadina MK','Larien'],
    sinonimos: ['clarinex','aerius','larien','para la alergia','antihistaminico sin sueno','alergia nasal','estornudos'],
    categoria: 'Antihistamínico (3ra generación, NO causa sueño)',
    uso_principal: 'Rinitis alérgica, urticaria crónica, alergias en general. NO causa somnolencia.',
    dosis_adulto: '5 mg una vez al día',
    dosis_nino: 'Jarabe: 1-5 años 1.25 mg/día; 6-11 años 2.5 mg/día',
    contraindicaciones: 'Alergia a desloratadina o loratadina.',
    efectos_secundarios: 'Dolor de cabeza leve. Muy bien tolerado.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '67.50-294.50 C$ (según presentación)',
    embarazo: 'Categoría C — Consultar médico'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 38 — RESPIRATORIO ADICIONAL
  // ════════════════════════════════════════════════════════
  {
    id: 64,
    nombre_es: 'Ambroxol',
    nombre_en: 'Ambroxol',
    nombres_comerciales: ['Mucosolvan','Ambroxol MK','Mucoflux','Bisolvon'],
    sinonimos: ['mucosolvan','mucoflux','bisolvon','para la tos con flema','expectorante','mucolitico','flema'],
    categoria: 'Mucolítico / Expectorante',
    uso_principal: 'Tos productiva con flema, bronquitis, EPOC, infecciones respiratorias con moco',
    dosis_adulto: '30 mg tres veces al día (tableta) o 15 mL jarabe tres veces al día',
    dosis_nino: 'Jarabe: hasta 2 años 2.5 mL dos veces al día; 2-5 años 2.5 mL tres veces; 5-12 años 5 mL tres veces',
    contraindicaciones: 'Alergia al ambroxol. No usar en menores de 2 años sin indicación médica.',
    efectos_secundarios: 'Náuseas, diarrea leve, boca seca. Generalmente bien tolerado.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '20-55 C$ (según presentación)',
    embarazo: 'Categoría B — Evitar en primer trimestre'
  },
  {
    id: 65,
    nombre_es: 'Bromhexina',
    nombre_en: 'Bromhexine',
    nombres_comerciales: ['Bisolvon','Bromhexina MK','Broncleer'],
    sinonimos: ['bisolvon','broncleer','mucolitico','para la flema','tos con flema','expectorante'],
    categoria: 'Mucolítico',
    uso_principal: 'Tos con secreciones espesas, bronquitis, sinusitis con congestión',
    dosis_adulto: '8 mg tres veces al día',
    dosis_nino: 'Jarabe: 4 mg tres veces al día (2-12 años)',
    contraindicaciones: 'Alergia a bromhexina. Precaución en úlcera péptica.',
    efectos_secundarios: 'Náuseas, malestar gastrointestinal leve.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '15-35 C$ (tabletas o jarabe)',
    embarazo: 'Categoría C — Evitar en primer trimestre'
  },
  {
    id: 180,
    nombre_es: 'Guaifenesina',
    nombre_en: 'Guaifenesin',
    nombres_comerciales: ['Robitussin','Guaifenesina MK','Humibid'],
    sinonimos: ['robitussin','expectorante','para la tos seca','para aflojar la flema','guayacolato'],
    categoria: 'Expectorante',
    uso_principal: 'Aflojar y expulsar el moco en tos seca o con poca flema, resfriado, bronquitis',
    dosis_adulto: '200-400 mg cada 4-6 horas. Tomar con mucha agua.',
    dosis_nino: 'Jarabe: según peso (consultar indicación del producto)',
    contraindicaciones: 'Alergia. Tos persistente (más de 1 semana) requiere evaluación médica.',
    efectos_secundarios: 'Náuseas, vómitos si se toma en ayunas. Beber mucha agua.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '15-40 C$ (tabletas o jarabe)',
    embarazo: 'Categoría C — Consultar médico'
  },
  {
    id: 67,
    nombre_es: 'Dextrometorfano',
    nombre_en: 'Dextromethorphan',
    nombres_comerciales: ['Robitussin DM','Dextrometorfano MK','Vick 44','DM'],
    sinonimos: ['vick 44','dm','para la tos seca','antitusivo','supresor de tos','tos sin flema'],
    categoria: 'Antitusivo (supresor de tos)',
    uso_principal: 'Tos seca irritativa que no produce flema, tos nocturna molesta',
    dosis_adulto: '15-30 mg cada 6-8 horas. NO usar si hay flema.',
    dosis_nino: 'Mayores de 6 años: 7.5-15 mg cada 6-8 horas. NO en menores de 2 años.',
    contraindicaciones: 'Tos con flema, asma, no combinar con antidepresivos IMAO. Menores de 2 años.',
    efectos_secundarios: 'Náuseas, mareo, somnolencia leve.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '20-45 C$ (tabletas o jarabe)',
    embarazo: 'Categoría C — Consultar médico'
  },
  {
    id: 68,
    nombre_es: 'Oximetazolina',
    nombre_en: 'Oxymetazoline',
    nombres_comerciales: ['Afrin','Nasivin','Oximetazolina MK','Vicks Sinex'],
    sinonimos: ['afrin','nasivin','para la nariz tapada','descongestionante nasal','spray nasal'],
    categoria: 'Descongestionante nasal tópico',
    uso_principal: 'Congestión nasal por resfriado, rinitis alérgica, sinusitis. Alivio rápido.',
    dosis_adulto: '2-3 gotas o 1-2 atomizaciones en cada fosa nasal, 2 veces al día. MÁX 5 días.',
    dosis_nino: 'Mayores de 6 años con formulación pediátrica. NO en menores de 6 años.',
    contraindicaciones: 'No usar más de 5 días (efecto rebote). Hipertensión, glaucoma. Menores de 6 años.',
    efectos_secundarios: 'Ardor nasal, congestión de rebote si se usa más de 5 días.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '30-60 C$ (atomizador)',
    embarazo: 'Categoría C — Evitar si es posible'
  },
  {
    id: 69,
    nombre_es: 'Xilometazolina',
    nombre_en: 'Xylometazoline',
    nombres_comerciales: ['Otrivine','Xilometazolina MK','Olynth'],
    sinonimos: ['otrivine','olynth','para la nariz tapada','spray nasal','congestion nasal'],
    categoria: 'Descongestionante nasal tópico',
    uso_principal: 'Congestión nasal aguda por resfriado o alergia. Alivio rápido de la obstrucción nasal.',
    dosis_adulto: '1-2 atomizaciones por fosa nasal 2-3 veces al día. MÁX 7 días. Solo mayores de 12 años.',
    dosis_nino: 'Formulación pediátrica 0.05% para 2-12 años. NO en menores de 2 años.',
    contraindicaciones: 'No más de 7 días. Hipertensión, glaucoma. Menores de 2 años.',
    efectos_secundarios: 'Ardor, picazón nasal, congestión de rebote con uso prolongado.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '25-55 C$ (atomizador)',
    embarazo: 'Categoría C — Evitar'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 39 — URINARIO / RENAL
  // ════════════════════════════════════════════════════════
  {
    id: 70,
    nombre_es: 'Fenazopiridina',
    nombre_en: 'Phenazopyridine',
    nombres_comerciales: ['Pyridium','Fenazopiridina MK','Uristat'],
    sinonimos: ['pyridium','uristat','para el ardor al orinar','dolor al orinar','infeccion urinaria ardor'],
    categoria: 'Analgésico urinario',
    uso_principal: 'Alivio del ardor, dolor y urgencia urinaria (NO trata la infección — solo alivia el síntoma)',
    dosis_adulto: '200 mg tres veces al día después de comidas. MÁX 2 días.',
    dosis_nino: 'Consultar médico',
    contraindicaciones: 'Insuficiencia renal, hepática. ADVERTENCIA: tiñe la orina de naranja/rojo (es normal).',
    efectos_secundarios: 'Orina anaranjada/roja (NORMAL, no alarmarse), náuseas. Puede manchar ropa.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '20-50 C$ (tabletas)',
    embarazo: 'Categoría B — Consultar médico'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 40 — ENZIMAS DIGESTIVAS
  // ════════════════════════════════════════════════════════
  {
    id: 84,
    nombre_es: 'Pancreatina',
    nombre_en: 'Pancreatin / Pancrelipase',
    nombres_comerciales: ['Pankreatan','Creon','Pancreatina MK','Nutrizym'],
    sinonimos: ['pankreatan','creon','enzimas digestivas','para la digestion','mala digestion','dispepsia'],
    categoria: 'Enzima digestiva',
    uso_principal: 'Insuficiencia pancreática exocrina, mala digestión de grasas, heces grasosas',
    dosis_adulto: '1-3 cápsulas con cada comida principal',
    dosis_nino: 'Bajo supervisión médica',
    contraindicaciones: 'Alergia a proteínas de porcino. Pancreatitis aguda.',
    efectos_secundarios: 'Molestia abdominal, náuseas, diarrea con dosis altas.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '50-120 C$ (cápsulas)',
    embarazo: 'Categoría C — Consultar médico'
  },
  {
    id: 76,
    nombre_es: 'Carbón Activado',
    nombre_en: 'Activated Charcoal',
    nombres_comerciales: ['Carbon activado MK','Norit','Carbophos'],
    sinonimos: ['carbon activado','para los gases','intoxicacion','diarrea con gases','norit'],
    categoria: 'Antiflatulento / Adsorbente gastrointestinal',
    uso_principal: 'Gases intestinales, flatulencia, coadyuvante en intoxicaciones (solo bajo supervisión médica)',
    dosis_adulto: '520 mg tres veces al día entre comidas',
    dosis_nino: 'Solo bajo supervisión médica para intoxicaciones',
    contraindicaciones: 'Obstrucción intestinal. Para intoxicaciones: solo bajo supervisión médica.',
    efectos_secundarios: 'Heces negras (normal), estreñimiento.',
    disponible_nicaragua: true,
    requiere_receta: false,
    precio_aproximado: '10-25 C$ (tabletas o cápsulas)',
    embarazo: 'Categoría C — Consultar médico'
  },
  // ════════════════════════════════════════════════════════
  //  GRUPO 41 — ANTIMALÁRICOS
  // ════════════════════════════════════════════════════════
  {
    id: 50,
    nombre_es: 'Cloroquina',
    nombre_en: 'Chloroquine',
    nombres_comerciales: ['Aralen','Cloroquina MK'],
    sinonimos: ['aralen','para el paludismo','malaria','antimalarico'],
    categoria: 'Antimalárico',
    uso_principal: 'Prevención y tratamiento de malaria por Plasmodium vivax',
    dosis_adulto: 'Tratamiento: 600 mg inicio, 300 mg a las 6h, 300 mg/día por 2 días más.',
    dosis_nino: '10 mg/kg inicio, 5 mg/kg a las 6h (consultar médico)',
    contraindicaciones: 'Alergia, retinopatía, epilepsia. Resistencia en algunas áreas geográficas.',
    efectos_secundarios: 'Náuseas, visión borrosa con uso prolongado, prurito (picazón).',
    disponible_nicaragua: true,
    requiere_receta: true,
    precio_aproximado: '20-50 C$ (tabletas)',
    embarazo: 'Categoría C — Uso permitido para malaria en embarazo'
  },
];

// ═══════════════════════════════════════════════════════════════
//  🤒 SÍNTOMAS — SINÓNIMOS INCLUIDOS
// ═══════════════════════════════════════════════════════════════
export const SINTOMAS = [
  {
    id: 1,
    nombre: 'Dolor de cabeza',
    categoria: 'Dolor',
    sinonimos: ['cefalea','migrana','jaqueca','dolor cabeza','cabeza me duele','me duele la cabeza','dolor en la cabeza'],
    descripcion: 'El dolor de cabeza es una de las molestias más comunes. Puede ser tensional, migraña o por otras causas.',
    causas_comunes: ['Estrés','Deshidratación','Falta de sueño','Tensión muscular','Cambios hormonales','Presión arterial alta'],
    cuidados_casa: [
      'Descansa en un lugar oscuro y silencioso',
      'Aplica compresas frías en la frente',
      'Mantente hidratado (agua, suero oral)',
      'Masajea suavemente sienes y cuello',
      'Evita pantallas y luces brillantes'
    ],
    cuando_consultar: [
      'Dolor súbito y muy severo ("el peor de tu vida")',
      'Después de un golpe en la cabeza',
      'Con fiebre alta, rigidez de cuello o confusión',
      'Si dura más de 3 días seguidos',
      'Si te despierta en la noche'
    ],
    urgencia_default: 'BAJA',
    requiere_atencion: false
  },
  {
    id: 2,
    nombre: 'Fiebre',
    categoria: 'Temperatura',
    sinonimos: ['temperatura','calentura','fiebre alta','febrilis','me siento caliente','tengo fiebre','febril'],
    descripcion: 'La fiebre es una respuesta natural del cuerpo a infecciones. Se considera fiebre a partir de 38 °C (100.4 °F).',
    causas_comunes: ['Infecciones virales','Infecciones bacterianas','Gripe','COVID-19','Infecciones urinarias'],
    cuidados_casa: [
      'Mantente hidratado (agua, suero, caldos)',
      'Descansa adecuadamente',
      'Usa ropa ligera',
      'Aplica compresas tibias en frente y axilas',
      'Puedes tomar paracetamol (ver dosis)'
    ],
    cuando_consultar: [
      'Fiebre mayor a 39.5 °C (103 °F)',
      'Fiebre que dura más de 3 días',
      'Con dificultad para respirar o erupción en la piel',
      'En bebés menores de 3 meses (cualquier temperatura)'
    ],
    urgencia_default: 'MEDIA',
    requiere_atencion: false
  },
  {
    id: 3,
    nombre: 'Náuseas',
    categoria: 'Digestivo',
    sinonimos: ['nausea','asco','ganas de vomitar','me dan ganas de vomitar','mareo estomacal','malestar estomago'],
    descripcion: 'Las náuseas son la sensación de querer vomitar. Pueden tener múltiples causas.',
    causas_comunes: ['Gastroenteritis','Mareo por movimiento','Embarazo','Ansiedad','Alimentos en mal estado'],
    cuidados_casa: [
      'Toma líquidos en pequeños sorbos frecuentes',
      'Evita alimentos grasos o picantes',
      'Come galletas saladas o pan tostado',
      'Descansa sentado o recostado',
      'Prueba té de jengibre o menta'
    ],
    cuando_consultar: [
      'Vómitos que duran más de 24 horas',
      'No puedes retener líquidos',
      'Vómito con sangre o de color café',
      'Dolor abdominal severo acompañante',
      'Signos de deshidratación (boca seca, poca orina)'
    ],
    urgencia_default: 'BAJA',
    requiere_atencion: false
  },
  {
    id: 4,
    nombre: 'Cansancio',
    categoria: 'General',
    sinonimos: ['fatiga','debilidad','agotamiento','me siento cansado','sin energia','extenuado','sin fuerzas'],
    descripcion: 'El cansancio o fatiga puede ser normal después de esfuerzo, pero si persiste requiere atención.',
    causas_comunes: ['Falta de sueño','Estrés','Anemia','Mala alimentación','Depresión','Infecciones'],
    cuidados_casa: [
      'Duerme 7-8 horas diarias con horario regular',
      'Mantén una alimentación balanceada',
      'Haz ejercicio moderado (caminar 30 min)',
      'Reduce el estrés con técnicas de relajación',
      'Mantente bien hidratado'
    ],
    cuando_consultar: [
      'Cansancio que no mejora con descanso',
      'Dura más de 2 semanas sin causa aparente',
      'Con pérdida de peso inexplicable',
      'Con dificultad para respirar o palpitaciones',
      'Si impide realizar actividades cotidianas'
    ],
    urgencia_default: 'BAJA',
    requiere_atencion: false
  },
  {
    id: 5,
    nombre: 'Dolor de garganta',
    categoria: 'Respiratorio',
    sinonimos: ['garganta','dolor garganta','me duele la garganta','faringitis','amigdalitis','garganta irritada','rasquera en la garganta'],
    descripcion: 'El dolor de garganta es común en infecciones respiratorias. Puede ser viral o bacteriano.',
    causas_comunes: ['Resfriado común','Gripe','Faringitis estreptocócica','Alergias','Aire seco'],
    cuidados_casa: [
      'Haz gárgaras con agua tibia y media cucharadita de sal',
      'Toma líquidos tibios (té con miel y limón)',
      'Usa humidificador si el ambiente es muy seco',
      'Descansa la voz',
      'Pastillas para la garganta o miel pura'
    ],
    cuando_consultar: [
      'Dolor severo que dura más de 5 días',
      'Dificultad para tragar o respirar',
      'Fiebre alta (más de 38.5 °C)',
      'Manchas blancas o pus en la garganta',
      'Ganglios inflamados en el cuello'
    ],
    urgencia_default: 'BAJA',
    requiere_atencion: false
  },
  {
    id: 6,
    nombre: 'Tos',
    categoria: 'Respiratorio',
    sinonimos: ['tosiendo','tos seca','tos con flema','tos persistente','no puedo dejar de toser','tos fuerte'],
    descripcion: 'La tos es un reflejo para limpiar las vías respiratorias. Puede ser seca o con flema.',
    causas_comunes: ['Resfriado','Gripe','Alergias','Asma','Reflujo','COVID-19'],
    cuidados_casa: [
      'Mantente bien hidratado',
      'Miel pura (adultos y niños mayores de 1 año)',
      'Evita irritantes: humo, polvo, perfumes',
      'Usa humidificador o inhala vapor de agua tibia',
      'Eleva la cabeza al dormir'
    ],
    cuando_consultar: [
      'Tos que dura más de 3 semanas',
      'Con sangre o esputo verde/amarillo abundante',
      'Con dificultad para respirar o silbidos',
      'Con fiebre alta prolongada',
      'En niños menores de 3 meses'
    ],
    urgencia_default: 'BAJA',
    requiere_atencion: false
  },
  {
    id: 7,
    nombre: 'Dolor abdominal',
    categoria: 'Digestivo',
    sinonimos: ['dolor de barriga','dolor de estomago','dolor estomacal','dolor abdomen','colicos','me duele el estomago','me duele la barriga'],
    descripcion: 'El dolor abdominal puede tener muchas causas, desde leves hasta graves.',
    causas_comunes: ['Gases','Indigestión','Gastroenteritis','Estreñimiento','Menstruación'],
    cuidados_casa: [
      'Aplica calor suave en el abdomen (no si hay fiebre)',
      'Toma líquidos claros y descansa',
      'Evita alimentos grasos o irritantes',
      'Come alimentos suaves: arroz, plátano cocido, caldo'
    ],
    cuando_consultar: [
      'Dolor severo y súbito que no cede',
      'Dolor en la parte inferior derecha (posible apendicitis)',
      'Con vómitos prolongados o sangre en heces',
      'Abdomen duro o muy inflamado',
      'No puedes evacuar ni expulsar gases por más de 24h'
    ],
    urgencia_default: 'MEDIA',
    requiere_atencion: false
  },
  {
    id: 8,
    nombre: 'Diarrea',
    categoria: 'Digestivo',
    sinonimos: ['evacuaciones liquidas','heces liquidas','soltura','vientre suelto','deposiciones frecuentes','colitis'],
    descripcion: 'La diarrea son evacuaciones líquidas frecuentes. El principal riesgo es la deshidratación.',
    causas_comunes: ['Infecciones virales','Alimentos en mal estado','Intolerancias','Medicamentos','Estrés','Parásitos'],
    cuidados_casa: [
      'Toma suero oral o agua con sal y azúcar frecuentemente',
      'Come alimentos suaves: arroz, plátano, pan tostado',
      'Evita lácteos, cafeína, jugos y grasas',
      'Lávate las manos frecuentemente con jabón',
      'Descansa'
    ],
    cuando_consultar: [
      'Diarrea que dura más de 2 días en adultos',
      'Signos de deshidratación: boca seca, poca orina, mareo',
      'Sangre o moco en las heces',
      'Fiebre mayor a 38.5 °C',
      'En niños menores de 2 años con más de 6 evacuaciones al día'
    ],
    urgencia_default: 'BAJA',
    requiere_atencion: false
  },
  {
    id: 9,
    nombre: 'Gripe',
    categoria: 'Respiratorio',
    sinonimos: ['influenza','resfriado','catarro','congestion nasal','rinitis','moqueo','nariz tapada','nariz mocosa','congestionado'],
    descripcion: 'La gripe es una infección viral del sistema respiratorio. Suele resolverse en 5-7 días con reposo.',
    causas_comunes: ['Virus influenza A o B','Adenovirus','Rhinovirus (resfriado común)','COVID-19'],
    cuidados_casa: [
      'Reposo en cama los primeros días',
      'Líquidos abundantes: agua, caldos, jugos naturales',
      'Paracetamol para fiebre y dolores (ver dosis)',
      'Lavados nasales con agua salina',
      'Ambiente húmedo y ventilado'
    ],
    cuando_consultar: [
      'Fiebre mayor a 39 °C que no baja con paracetamol',
      'Dificultad para respirar o dolor en el pecho',
      'Síntomas que duran más de 7-10 días o empeoran',
      'En adultos mayores de 65 años, embarazadas o con enfermedades crónicas',
      'En niños muy pequeños con dificultad para respirar'
    ],
    urgencia_default: 'BAJA',
    requiere_atencion: false
  },
  {
    id: 10,
    nombre: 'Alergia',
    categoria: 'Inmunológico',
    sinonimos: ['alergias','reaccion alergica','urticaria','picazon','ronchas','sarpullido','estornudos','ojos llorosos','ojos rojos'],
    descripcion: 'Las alergias son reacciones del sistema inmune a sustancias normalmente inofensivas (alérgenos).',
    causas_comunes: ['Polen','Polvo y ácaros','Pelo de animales','Alimentos (mariscos, maní)','Medicamentos','Picaduras de insectos'],
    cuidados_casa: [
      'Identifica y evita el alérgeno desencadenante',
      'Antihistamínico oral (loratadina) sin receta para síntomas leves',
      'Compresas frías en zonas de picazón',
      'Mantén ventanas cerradas en temporada de polen',
      'Lávate las manos y cambia de ropa al llegar a casa'
    ],
    cuando_consultar: [
      'Dificultad para respirar o hinchazón de garganta',
      'Reacción alérgica severa (anafilaxia): mareo, dificultad para tragar',
      'Urticaria que no mejora con antihistamínico en 24 horas',
      'Reacción a medicamento recetado',
      'Primera vez que te ocurre sin causa conocida'
    ],
    urgencia_default: 'BAJA',
    requiere_atencion: false
  },
  {
    id: 11,
    nombre: 'Dolor de espalda',
    categoria: 'Dolor',
    sinonimos: ['dolor espalda','lumbalgia','dolor lumbar','me duele la espalda','espalda baja','dolor de cintura','rigidez espalda'],
    descripcion: 'El dolor de espalda es muy común. La mayoría de los casos son musculares y mejoran con reposo y movimiento moderado.',
    causas_comunes: ['Malas posturas','Esfuerzo excesivo','Sedentarismo','Sobrepeso','Estrés muscular'],
    cuidados_casa: [
      'Aplica calor en la zona dolorosa por 15-20 minutos',
      'Evita reposo absoluto; camina suavemente',
      'Duerme de lado con almohada entre las rodillas',
      'Evita cargar peso hasta que mejore',
      'Ibuprofeno o paracetamol para el dolor (ver dosis)'
    ],
    cuando_consultar: [
      'Dolor que irradia hacia la pierna (ciática)',
      'Debilidad o entumecimiento en piernas',
      'Dificultad para orinar o controlar esfínteres',
      'Dolor que empeora de noche o en reposo',
      'Después de un golpe o caída'
    ],
    urgencia_default: 'BAJA',
    requiere_atencion: false
  },
  {
    id: 12,
    nombre: 'Mareo',
    categoria: 'Neurológico',
    sinonimos: ['vertigo','me siento mareado','sensacion de giro','inestabilidad','perdida de equilibrio','cabeza que da vueltas'],
    descripcion: 'El mareo puede ser una sensación de inestabilidad o de que todo gira. Puede tener causas benignas o más serias.',
    causas_comunes: ['Deshidratación','Bajada de presión arterial al pararse','Laberintitis','Anemia','Problemas del oído interno'],
    cuidados_casa: [
      'Siéntate o acuéstate lentamente para evitar caídas',
      'Toma agua o suero oral si sospechas deshidratación',
      'Levántate lentamente de la cama o silla',
      'Evita movimientos bruscos de cabeza',
      'Descansa en un lugar fresco y tranquilo'
    ],
    cuando_consultar: [
      'Mareo súbito muy severo sin causa aparente',
      'Con dolor de cabeza intenso, visión doble o dificultad para hablar',
      'Con pérdida del conocimiento o casi-desmayo',
      'Si dura más de 48 horas',
      'En personas mayores o con hipertensión'
    ],
    urgencia_default: 'MEDIA',
    requiere_atencion: false
  }
];

// ═══════════════════════════════════════════════════════════════
//  🚑 EMERGENCIAS
// ═══════════════════════════════════════════════════════════════
export const EMERGENCIAS = [
  { nombre: 'Emergencias Nacionales (Bomberos)',   numero: '128',       descripcion: 'Línea de emergencias gratuita 24h — Nicaragua',              disponible: true },
  { nombre: 'Policía Nacional',                    numero: '118',       descripcion: 'Emergencias policiales',                                      disponible: true },
  { nombre: 'Cruz Roja Nicaragüense — Granada',    numero: '2552-5555', descripcion: 'Ambulancias y primeros auxilios en Granada',                  disponible: true },
  { nombre: 'Hospital Amistad Japón Nicaragua',    numero: '2552-7050', descripcion: 'Hospital Departamental — urgencias 24h gratuitas',            disponible: true },
  { nombre: 'Hospital SERMESA Granada',            numero: '2552-4444', descripcion: 'Hospital privado — urgencias INSS y particular',              disponible: true },
  { nombre: 'SILAIS Granada',                      numero: '2552-0450', descripcion: 'Sistema Local de Atención Integral en Salud Granada',         disponible: true }
];

// ═══════════════════════════════════════════════════════════════
//  📍 BARRIOS DE GRANADA
// ═══════════════════════════════════════════════════════════════
export const BARRIOS_GRANADA = [
  'Centro','Parque Central','Barrio San Antonio','Barrio El Calvario',
  'Barrio Simeón Rivas','Barrio La Antigua','Barrio Guadalupe',
  'Calle La Calzada','Mercado Municipal','Carretera a Masaya',
  'Calle Atravesada','Pista de Jardines','Barrio San José',
  'Reparto San Francisco','Reparto Las Colinas','Gandera','Pueblo Nuevo'
];

// ═══════════════════════════════════════════════════════════════
//  FUNCIONES DE DISTANCIA (CANÓNICA — no duplicar en app.js)
// ═══════════════════════════════════════════════════════════════
export function calcularDistancia(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000; // metros
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return Math.round(6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// ═══════════════════════════════════════════════════════════════
//  FUNCIONES DE BÚSQUEDA
// ═══════════════════════════════════════════════════════════════
export function obtenerTodosLosCentros() {
  return [...HOSPITALES, ...CLINICAS, ...FARMACIAS, ...LABORATORIOS].filter(c => c.disponible);
}

export function buscarCentrosPorCategoria(categoria: string) {
  return obtenerTodosLosCentros().filter(c => c.categoria === categoria);
}

export function buscarCentrosPorBarrio(barrio: string) {
  return obtenerTodosLosCentros().filter(c =>
    c.barrio?.toLowerCase().includes(barrio.toLowerCase())
  );
}

export function buscarCentrosCercanos(lat: number, lng: number, radioMetros = 2000) {
  return obtenerTodosLosCentros()
    .map(c => ({ ...c, distance: calcularDistancia(lat, lng, c.lat, c.lng) }))
    .filter(c => c.distance <= radioMetros)
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Busca un medicamento por nombre, sinónimos o nombres comerciales.
 * v7.1: incluye búsqueda ampliada en campo `sinonimos` y normaliza tildes.
 */
export function buscarMedicamento(nombre: string) {
  const results = buscarMultiplesMedicamentos(nombre);
  return results.length > 0 ? results[0] : null;
}

/**
 * Busca todos los medicamentos que coincidan con el término.
 */
export function buscarMultiplesMedicamentos(nombre: string) {
  const lower = normalizar(nombre);
  if (lower.length < 3) return [];

  // Create an array of words from the user input for exact matching
  const words = lower.split(/\s+/);

  const results = MEDICAMENTOS.filter(m => {
    const n_es = normalizar(m.nombre_es);
    const n_en = normalizar(m.nombre_en);

    // Check if any normalized medication name, commercial name, or synonym
    // exactly matches a word in the user input, or if the user input
    // contains the entire medication name.

    const isExactMatch = (target: string) => {
       if (!target) return false;
       const targetNormalized = normalizar(target);
       if (targetNormalized.length < 3) return false;

       // check if the user query contains the whole phrase of the drug name.
       // we use word boundaries (\b) which work fine here because normalizar()
       // removes accents and leaves standard latin word characters.

       // Escape special characters in the target phrase
       const escapedTarget = targetNormalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

       // If the target is short (<= 4 chars) and the user input is a sentence (>3 words),
       // do not match it even if it's a word boundary match.
       // e.g. "tos" shouldn't trigger the drug card if the user writes "tengo tos y me pasaba todo el dia"
       if (targetNormalized.length <= 4 && words.length > 3) {
           return false;
       }

       const regex = new RegExp(`\\b${escapedTarget}\\b`);
       if (regex.test(lower)) return true;

       return false;
     };

    const matchesName = isExactMatch(n_es) ||
                        isExactMatch(n_en) ||
                        m.nombres_comerciales.some(n => isExactMatch(normalizar(n))) ||
                        (m.sinonimos && m.sinonimos.some(s => isExactMatch(normalizar(s))));

    if (matchesName) return true;

    // Also allow searching by general symptom or use case if the query is a direct request
    // like "un medicamento para la tos" -> "tos"
    const isDirectRequest = lower.includes("medicamento para") || lower.includes("pastilla para") || lower.includes("algo para") || lower.includes("jarabe para") || lower.includes("remedio para");
    if (isDirectRequest) {
      // Extract the key symptom by removing the common prefix
      let intent = lower.replace(/.*(medicamento|pastilla|algo|jarabe|remedio) para\s+(el|la|las|los)?\s*/i, "").trim();
      // Remove any trailing noise like "por favor"
      intent = intent.replace(/ por favor.*/, "");

      // Use exact match via \b to prevent matching random partial words in the uses string
      if (intent.length >= 3) {
        const intentEscaped = normalizar(intent).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const usageRegex = new RegExp(`\\b${intentEscaped}\\b`);
        if (usageRegex.test(normalizar(m.uso_principal))) {
           return true;
        }
      }
    }

    return false;
  });

  // Limit to 1 recommendation if it's a generic symptom request, to avoid spam
  // (e.g., matching "tos" might otherwise return 5 different syrups).
  const isGeneric = lower.includes("medicamento para") || lower.includes("pastilla para") || lower.includes("algo para") || lower.includes("jarabe para") || lower.includes("remedio para");
  if (isGeneric && results.length > 0) {
     return [results[0]];
  }

  return results;
}

export function obtenerTodosLosMedicamentos() { return MEDICAMENTOS; }

/**
 * buscarSintoma — v6: fuzzy matching + sinónimos.
 * Orden de prioridad:
 * 1. Coincidencia exacta en nombre
 * 2. Coincidencia en algún sinónimo
 * 3. El texto contiene el nombre del síntoma
 * 4. El nombre del síntoma está contenido en el texto
 */
export function buscarSintoma(texto: string) {
  const results = buscarMultiplesSintomas(texto);
  return results.length > 0 ? results[0] : null;
}

/**
 * Busca todos los síntomas que coincidan con el término.
 */
export function buscarMultiplesSintomas(texto: string) {
  const lower = normalizar(texto);
  if (lower.length < 3) return [];
  
  return SINTOMAS.filter(s => {
    const n = normalizar(s.nombre);
    const inName = n === lower || lower.includes(n) || n.includes(lower);
    const inSynonyms = s.sinonimos && s.sinonimos.some(sin => {
      const sn = normalizar(sin);
      return sn === lower || lower.includes(sn) || sn.includes(lower);
    });
    return inName || inSynonyms;
  });
}

export function obtenerTodosLosSintomas() { return SINTOMAS; }

export function obtenerMedicamentosEmbarazadas() {
  return MEDICAMENTOS.filter(m =>
    m.categoria.includes('Prenatal') ||
    m.categoria.includes('Embarazo') ||
    (m.embarazo && (m.embarazo.includes('Categoría A') || m.embarazo.includes('Categoría B')))
  );
}

export function obtenerEmergencias() {
  return EMERGENCIAS.filter(e => e.disponible);
}

export function obtenerEstadisticasBD() {
  return {
    version: VERSION_BASE_DATOS,
    ultima_actualizacion: ULTIMA_ACTUALIZACION,
    total_centros: obtenerTodosLosCentros().length,
    total_medicamentos: MEDICAMENTOS.length,
    total_sintomas: SINTOMAS.length,
    hospitales: HOSPITALES.length,
    clinicas: CLINICAS.length,
    farmacias: FARMACIAS.length,
    emergencias: EMERGENCIAS.length,
    barrios_cubiertos: BARRIOS_GRANADA.length
  };
}

// ─────────────────────────────────────────────
//  UTILIDAD INTERNA: normalizar texto (sin tildes, minúsculas)
// ─────────────────────────────────────────────
export function normalizar(str: string) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // eliminar diacríticos
    .trim();
}