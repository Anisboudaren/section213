import { MAP_LOCATIONS, type MapLocation, type MapPin } from "@/lib/booking/mock-data";

export function getMapSelectionLabel(
  mapLocationId: string,
  mapPin: MapPin | null,
): string {
  const preset = MAP_LOCATIONS.find((l) => l.id === mapLocationId);
  if (preset) return `${preset.name}, ${preset.region}`;
  if (mapPin) {
    return `${mapPin.lat.toFixed(4)}°, ${mapPin.lng.toFixed(4)}°`;
  }
  return "—";
}

export function getMapSelectionDetail(
  mapLocationId: string,
  mapPin: MapPin | null,
): MapLocation | MapPin | undefined {
  const preset = MAP_LOCATIONS.find((l) => l.id === mapLocationId);
  if (preset) return preset;
  if (mapPin) return mapPin;
  return undefined;
}
