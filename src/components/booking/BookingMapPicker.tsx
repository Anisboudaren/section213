import { useEffect, useState, type ComponentType } from "react";

import type { BookingMapPickerProps } from "@/components/booking/BookingMapInner";

export function BookingMapPicker(props: BookingMapPickerProps) {
  const [MapInner, setMapInner] = useState<ComponentType<BookingMapPickerProps> | null>(null);

  useEffect(() => {
    void import("@/components/booking/BookingMapInner").then((mod) => {
      setMapInner(() => mod.BookingMapInner);
    });
  }, []);

  if (!MapInner) {
    return (
      <div className="space-y-4">
        <div className="flex h-[420px] items-center justify-center rounded-xl border border-border bg-muted/30">
          <p className="text-sm text-muted-foreground">Loading map…</p>
        </div>
      </div>
    );
  }

  return <MapInner {...props} />;
}
