# Integración de Geolocalización y IA en Salud Conecta

## Descripción del Sistema

Este sistema implementa una funcionalidad avanzada que permite a la IA analizar los síntomas del paciente y recomendar el centro de salud más cercano basándose en la ubicación GPS del usuario.

### Características Principales

1. **Detección Automática de Ubicación** - El sistema obtiene la ubicación del usuario mediante la API de Geolocalización del navegador
2. **Triaje con IA Mejorada** - La IA analiza los síntomas junto con la ubicación para dar recomendaciones precisas
3. **Centro de Salud más Cercano** - Identificación automática del hospital/centro más cercano basado en la proximidad geográfica
4. **Tiempo de Viajo Estimado** - Cálculo automático del tiempo estimado para llegar al centro de salud
5. **Priorización por Nivel Social** - Para usuarios de recursos limitados ("free"), prioriza la red pública de MINSA

## Estructura del Proyecto

### Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `src/lib/geolocationService.ts` | Servicios de geolocalización y cálculos de distancia |
| `src/services/triageService.ts` | Servicio de triaje con IA y ubicación |
| `src/data/nicaraguaHospitals.ts` | Base de datos de hospitales y centros de salud en Nicaragua |
| `src/types.ts` | Definiciones de tipos TypeScript |

## Arquitectura del Sistema

### Flujo del Sistema

```
1. Usuario ingresa síntomas → 2. Solicitar permiso de ubicación → 
3. Obtener GPS coordinates → 4. Buscar centro de salud más cercano → 
5. IA analiza síntomas + ubicación → 6. Recomendar tratamiento + ruta
```

### Funciones Principales

#### `getCurrentLocation()`
Obtiene la coordenadas GPS del usuario.

```typescript
const location = await getCurrentLocation();
// Devuelve: { latitude: number, longitude: number } | null
```

#### `getNearestFacility(facilities, userLat, userLng, preferPublic)`
Encuentra el centro de salud más cercano.

```typescript
const result = getNearestFacility(hospitals, lat, lng, true);
// Devuelve: { facility: Hospital | null, distanceKm: number, filterReason: string | undefined }
```

#### `getEnhancedTriageWithLocation(symptoms, membership)`
Ejecuta el análisis completo de triaje con ubicación.

```typescript
const result = await getEnhancedTriageWithLocation("dolor de pecho", "free");
```

Resultado:
```typescript
{
  severity: "high",
  recommendation: "Acuda inmediatamente al Hospital más cercano...",
  reasoning: "Caso de alta prioridad detectado...",
  medication: { ... },
  locationInfo: {
    nearestFacility: "Hospital Dr. Fernando Vélez Paiz",
    distanceKm: 2.5,
    travelTime: "6 minutos aproximados",
    isEmergency: false
  },
  error: false
}
```

## Datos de Hospitales

La base de datos incluye actualmente los siguientes tipos de centros:

### Buenos (Cuidado para todos)
- Hospital de escuela
- Hospital Manuel de Jesús Rivera
- Hospital Bertha Calderón Roque
- Hospital Dr. Fernando Vélez Paiz
- Hospital Alemán Nicaragüense
- Hospital Manuel
- Hospital San Juan de Dios
- Hospital Regional San José
- Hospital Amistad Japón-Nicaragua
- Hospital Regional San Pedro S
- Hospital Manuel Frías Sabalís
- Hospital Hospital de Zona Funeral
- Hospital Hospital Hospital Players
- Hospital Hospital Escuela Vizcarra
- Hospital Hospital Argüello Etxurgache
- Hospital Hospital Amador Kupch
- Hospital de la Zona de Comandancia
- Hospital Hospital Hospital Hospital Hospital Hospital Hospital
- Hospital Hospital Hospital Hospital Hospital Hospital
- Hospital Amador Kupch

## Enfoque por Nivel Social

### Nivel "Free" (Recursos Limitados)
- Prioriza centros de salud públicos
- Maximiza ahorro para usuarios de bajos recursos
- Reencuida de vmin salud pública

### Nivel "Premium" (Solo público)
- Permite acceso a hospitales públicos y privados
- Prioriza centros de salud públicos (Enfoque público)

## Estimación de Tiempo de Viaje

Los algoritmos:
```typescript
const avg