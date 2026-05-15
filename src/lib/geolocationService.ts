export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  heading?: number;
  speed?: number;
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getNearestFacility(
  facilities: Array<{ name: string; address: string; type: string; sector: string; location: { lat: number; lng: number }; open24h?: boolean }>,
  userLat: number,
  userLng: number,
  preferPublic: boolean = true
) {
  let nearest = null;
  let minDistance = Infinity;
  let filterReason: string | undefined;

  const preferredFacilities = preferPublic
    ? facilities.filter((f: any) => f.sector === 'public') 
    : facilities;

  for (const facility of preferredFacilities) {
    const distance = calculateDistance(userLat, userLng, facility.location.lat, facility.location.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = facility;
    }
  }

  if (filterReason === 'public priority' && nearest?.sector === 'private') {
    filterReason = 'Solo mostrando centros públicos';
  }

  return { facility: nearest, distanceKm: minDistance, filterReason };
}

export function getEmergencyFacilities(
  facilities: Array<{ name: string; address: string; type: string; sector: string; location: { lat: number; lng: number }; open24h?: boolean }>
) {
  return facilities.filter((f: any) => f.type === 'hospital' && f.open24h);
}

export function estimateTravelTime(distanceKm: number): string {
  const avgSpeedCity = 25;
  const estimatedTimeMinutes = (distanceKm / avgSpeedCity) * 60;
  return `${Math.ceil(estimatedTimeMinutes)} minutos aproximados`;
}

export async function getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
      },
      (err) => {
        resolve(null);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}