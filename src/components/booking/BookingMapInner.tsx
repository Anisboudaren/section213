import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";

import { cn } from "@/lib/utils";
import {
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  MAP_LOCATIONS,
  type MapPin,
} from "@/lib/booking/mock-data";

import "leaflet/dist/leaflet.css";

export type BookingMapPickerProps = {
  selectedId: string;
  mapPin: MapPin | null;
  onSelectCity: (id: string) => void;
  onDropPin: (pin: MapPin) => void;
};

const cityIcon = L.divIcon({
  className: "booking-map-marker",
  html: `<span class="booking-map-marker__dot booking-map-marker__dot--city"></span>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const cityIconActive = L.divIcon({
  className: "booking-map-marker",
  html: `<span class="booking-map-marker__dot booking-map-marker__dot--city booking-map-marker__dot--active"></span>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const pinIcon = L.divIcon({
  className: "booking-map-marker",
  html: `<span class="booking-map-marker__pin"></span>`,
  iconSize: [28, 36],
  iconAnchor: [14, 36],
});

function MapClickHandler({ onDropPin }: { onDropPin: (pin: MapPin) => void }) {
  useMapEvents({
    click(event) {
      onDropPin({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });
  return null;
}

function FlyToSelection({
  selectedId,
  mapPin,
}: {
  selectedId: string;
  mapPin: MapPin | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (mapPin) {
      map.flyTo([mapPin.lat, mapPin.lng], 11, { duration: 0.8 });
      return;
    }

    const city = MAP_LOCATIONS.find((loc) => loc.id === selectedId);
    if (city) {
      map.flyTo([city.lat, city.lng], 10, { duration: 0.8 });
    }
  }, [map, mapPin, selectedId]);

  return null;
}

export function BookingMapInner({
  selectedId,
  mapPin,
  onSelectCity,
  onDropPin,
}: BookingMapPickerProps) {
  const selectionLabel = mapPin
    ? `${mapPin.lat.toFixed(4)}°, ${mapPin.lng.toFixed(4)}°`
    : MAP_LOCATIONS.find((l) => l.id === selectedId)?.name;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border shadow-sm">
        <MapContainer
          center={[MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng]}
          zoom={MAP_DEFAULT_ZOOM}
          scrollWheelZoom
          className="booking-leaflet-map z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onDropPin={onDropPin} />
          <FlyToSelection selectedId={selectedId} mapPin={mapPin} />

          {MAP_LOCATIONS.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={selectedId === loc.id && !mapPin ? cityIconActive : cityIcon}
              eventHandlers={{
                click: () => onSelectCity(loc.id),
              }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{loc.name}</p>
                  <p className="text-muted-foreground">{loc.region}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {mapPin && (
            <Marker position={[mapPin.lat, mapPin.lng]} icon={pinIcon}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">Custom shoot location</p>
                  <p className="text-muted-foreground">
                    {mapPin.lat.toFixed(4)}°, {mapPin.lng.toFixed(4)}°
                  </p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {selectionLabel && (
        <p className="text-sm text-muted-foreground">
          Selected: <span className="font-semibold text-ink">{selectionLabel}</span>
          {mapPin && (
            <span className="ml-1 text-xs">(click the map to move the pin)</span>
          )}
        </p>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        {MAP_LOCATIONS.map((loc) => (
          <button
            key={loc.id}
            type="button"
            onClick={() => onSelectCity(loc.id)}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition",
              selectedId === loc.id && !mapPin
                ? "border-gold/60 bg-gold/5"
                : "border-border hover:border-gold/30",
            )}
          >
            <span
              className={cn(
                "size-2.5 shrink-0 rounded-full",
                selectedId === loc.id && !mapPin ? "bg-gold" : "bg-ink/40",
              )}
            />
            <div>
              <p className="text-sm font-semibold text-ink">{loc.name}</p>
              <p className="text-xs text-muted-foreground">{loc.region}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
