"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Mail,
  MapPin,
  Package,
  Phone,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { BookingMapPicker } from "@/components/booking/BookingMapPicker";
import { cn } from "@/lib/utils";
import { getMapSelectionLabel } from "@/lib/booking/location-label";
import {
  formatBookingDate,
  generateBookingRef,
  isDateBookable,
  SHOOT_PACKAGES,
  TIME_SLOTS,
  type MapPin as BookingMapPin,
  type ShootPackage,
} from "@/lib/booking/mock-data";

const STEPS = [
  { id: "date", label: "Date", icon: CalendarDays },
  { id: "package", label: "Package", icon: Package },
  { id: "location", label: "Location", icon: MapPin },
  { id: "details", label: "Your info", icon: User },
] as const;

const contactSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(8, "Enter a valid phone number"),
  company: z.string().optional(),
  notes: z.string().optional(),
});

type ContactValues = z.infer<typeof contactSchema>;

type BookingState = {
  date: Date | undefined;
  timeSlotId: string;
  packageId: string;
  locationMode: "address" | "map";
  address: string;
  mapLocationId: string;
  mapPin: BookingMapPin | null;
  contact: ContactValues;
};

const initialContact: ContactValues = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  notes: "",
};

export function BookingWizard() {
  const wizardTopRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [booking, setBooking] = useState<BookingState>({
    date: undefined,
    timeSlotId: "morning",
    packageId: "",
    locationMode: "address",
    address: "",
    mapLocationId: "",
    mapPin: null,
    contact: initialContact,
  });

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: initialContact,
  });

  const prevStep = useRef(step);
  const prevSubmitted = useRef(submitted);

  useEffect(() => {
    const stepChanged = prevStep.current !== step;
    const submittedChanged = prevSubmitted.current !== submitted;
    prevStep.current = step;
    prevSubmitted.current = submitted;

    if (stepChanged || submittedChanged) {
      wizardTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step, submitted]);

  const progress = submitted ? 100 : ((step + 1) / STEPS.length) * 100;
  const selectedPackage = SHOOT_PACKAGES.find((p) => p.id === booking.packageId);
  const mapSelectionLabel = getMapSelectionLabel(booking.mapLocationId, booking.mapPin);
  const selectedSlot = TIME_SLOTS.find((s) => s.id === booking.timeSlotId);

  const canContinue = () => {
    switch (step) {
      case 0:
        return Boolean(booking.date && booking.timeSlotId);
      case 1:
        return Boolean(booking.packageId);
      case 2:
        return booking.locationMode === "address"
          ? booking.address.trim().length >= 10
          : Boolean(booking.mapLocationId || booking.mapPin);
      case 3:
        return true;
      default:
        return false;
    }
  };

  const goNext = async () => {
    if (step === 3) {
      const valid = await form.trigger();
      if (!valid) return;
      const values = form.getValues();
      setBooking((prev) => ({ ...prev, contact: values }));
      setBookingRef(generateBookingRef());
      setSubmitted(true);
      toast.success("Shoot request received — we'll confirm within 24 hours.");
      return;
    }
    if (!canContinue()) {
      toast.error("Please complete this step before continuing.");
      return;
    }
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (submitted) return;
    setStep((s) => Math.max(0, s - 1));
  };

  if (submitted && booking.date && selectedPackage) {
    return (
      <div ref={wizardTopRef} className="mx-auto w-full max-w-3xl scroll-mt-24">
        <ConfirmationView
          bookingRef={bookingRef}
          date={booking.date}
          timeSlot={selectedSlot}
          pkg={selectedPackage}
          locationMode={booking.locationMode}
          address={booking.address}
          mapSelectionLabel={mapSelectionLabel}
          contact={booking.contact}
        />
      </div>
    );
  }

  return (
    <div ref={wizardTopRef} className="mx-auto w-full max-w-3xl scroll-mt-24">
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Step {step + 1} of {STEPS.length}
          </p>
          <p className="font-display text-sm tracking-wider text-ink">{STEPS[step].label}</p>
        </div>
        <Progress value={progress} className="h-1.5 bg-ink/10 [&>div]:bg-gold" />
        <div className="mt-6 grid grid-cols-4 gap-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            const done = i < step;
            return (
              <div
                key={s.id}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-center transition",
                  active && "border-gold/50 bg-gold/5",
                  done && "border-gold/30 bg-gold/5",
                  !active && !done && "border-border bg-card",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    active || done ? "bg-gold text-gold-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Card className="border-border/80 shadow-lg">
        <CardContent className="p-6 md:p-8">
          {step === 0 && (
            <DateStep
              date={booking.date}
              timeSlotId={booking.timeSlotId}
              onDateChange={(date) => setBooking((p) => ({ ...p, date }))}
              onSlotChange={(timeSlotId) => setBooking((p) => ({ ...p, timeSlotId }))}
            />
          )}
          {step === 1 && (
            <PackageStep
              selectedId={booking.packageId}
              onSelect={(packageId) => setBooking((p) => ({ ...p, packageId }))}
            />
          )}
          {step === 2 && (
            <LocationStep
              mode={booking.locationMode}
              address={booking.address}
              mapLocationId={booking.mapLocationId}
              mapPin={booking.mapPin}
              onModeChange={(locationMode) => setBooking((p) => ({ ...p, locationMode }))}
              onAddressChange={(address) => setBooking((p) => ({ ...p, address }))}
              onSelectCity={(mapLocationId) =>
                setBooking((p) => ({ ...p, mapLocationId, mapPin: null }))
              }
              onDropPin={(mapPin) =>
                setBooking((p) => ({ ...p, mapPin, mapLocationId: "" }))
              }
            />
          )}
          {step === 3 && (
            <DetailsStep
              form={form}
              summary={{
                date: booking.date,
                timeSlot: selectedSlot,
                pkg: selectedPackage,
                locationMode: booking.locationMode,
                address: booking.address,
                mapSelectionLabel,
              }}
            />
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={goBack}
          disabled={step === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button type="button" variant="gold" onClick={goNext} className="gap-2">
          {step === 3 ? "Submit request" : "Continue"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function DateStep({
  date,
  timeSlotId,
  onDateChange,
  onSlotChange,
}: {
  date: Date | undefined;
  timeSlotId: string;
  onDateChange: (date: Date | undefined) => void;
  onSlotChange: (id: string) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl tracking-wide text-ink md:text-3xl">
          Pick your <span className="text-gold">shoot date</span>
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Available dates are highlighted. We hold your slot for 24 hours after you submit.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="booking-calendar mx-auto rounded-xl border border-border bg-card p-4 shadow-sm lg:mx-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            disabled={(d) => !isDateBookable(d)}
            modifiers={{ available: (d) => isDateBookable(d) }}
            modifiersClassNames={{
              available:
                "relative font-medium after:absolute after:bottom-1 after:left-1/2 after:size-1.5 after:-translate-x-1/2 after:rounded-full after:bg-gold",
            }}
            className="[--cell-size:2.75rem]"
            classNames={{
              today: "bg-gold/15 text-ink font-semibold rounded-md",
              selected:
                "bg-gold text-gold-foreground rounded-md hover:bg-gold hover:text-gold-foreground focus:bg-gold focus:text-gold-foreground",
              disabled: "text-muted-foreground/40 line-through opacity-40",
            }}
          />
          <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-gold" />
              Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded border border-border bg-muted/50" />
              Unavailable
            </span>
            {date && (
              <span className="ml-auto font-medium text-ink">
                {formatBookingDate(date)}
              </span>
            )}
          </div>
        </div>

        <div className="w-full max-w-xs space-y-3 lg:pt-2">
          <Label className="flex items-center gap-2 text-ink">
            <Clock className="h-4 w-4 text-gold" />
            Preferred time window
          </Label>
          <RadioGroup value={timeSlotId} onValueChange={onSlotChange} className="space-y-2">
            {TIME_SLOTS.map((slot) => (
              <label
                key={slot.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition",
                  timeSlotId === slot.id
                    ? "border-gold/60 bg-gold/5"
                    : "border-border hover:border-gold/30",
                )}
              >
                <RadioGroupItem value={slot.id} />
                <div>
                  <p className="text-sm font-semibold text-ink">{slot.label}</p>
                  <p className="text-xs text-muted-foreground">{slot.time}</p>
                </div>
              </label>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}

function PackageStep({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl tracking-wide text-ink md:text-3xl">
          Choose your <span className="text-gold">package</span>
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          All packages include color grading, delivery gallery, and usage rights for marketing.
        </p>
      </div>

      <div className="grid gap-4">
        {SHOOT_PACKAGES.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            selected={selectedId === pkg.id}
            onSelect={() => onSelect(pkg.id)}
          />
        ))}
      </div>
    </div>
  );
}

function PackageCard({
  pkg,
  selected,
  onSelect,
}: {
  pkg: ShootPackage;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative w-full rounded-xl border p-5 text-left transition",
        selected
          ? "border-gold bg-gold/5 ring-1 ring-gold/40"
          : "border-border bg-card hover:border-gold/30",
        pkg.highlight && !selected && "border-gold/20",
      )}
    >
      {pkg.badge && (
        <span className="absolute -top-2.5 right-4 rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-foreground">
          {pkg.badge}
        </span>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl tracking-wider text-ink">{pkg.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{pkg.duration}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-ink">{pkg.priceLabel}</p>
          {selected && (
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-gold">
              <Check className="h-3 w-3" /> Selected
            </span>
          )}
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{pkg.description}</p>
      <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-ink/80">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
            {f}
          </li>
        ))}
      </ul>
    </button>
  );
}

function LocationStep({
  mode,
  address,
  mapLocationId,
  mapPin,
  onModeChange,
  onAddressChange,
  onSelectCity,
  onDropPin,
}: {
  mode: "address" | "map";
  address: string;
  mapLocationId: string;
  mapPin: BookingMapPin | null;
  onModeChange: (mode: "address" | "map") => void;
  onAddressChange: (address: string) => void;
  onSelectCity: (id: string) => void;
  onDropPin: (pin: BookingMapPin) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl tracking-wide text-ink md:text-3xl">
          Where should we <span className="text-gold">shoot?</span>
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the property address or click anywhere on the map to drop a pin.
        </p>
      </div>

      <div className="flex rounded-lg border border-border p-1">
        {(["address", "map"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onModeChange(m)}
            className={cn(
              "flex-1 rounded-md px-4 py-2 text-sm font-semibold transition",
              mode === m ? "bg-ink text-white" : "text-muted-foreground hover:text-ink",
            )}
          >
            {m === "address" ? "Type address" : "Pick on map"}
          </button>
        ))}
      </div>

      {mode === "address" ? (
        <div className="space-y-2">
          <Label htmlFor="shoot-address">Property or shoot address</Label>
          <Textarea
            id="shoot-address"
            placeholder="e.g. 12 Boulevard de la Soummam, Oran 31000 — villa with pool, gate code 4521"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            className="min-h-[120px] resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Include city, landmarks, and access notes so our crew arrives prepared.
          </p>
        </div>
      ) : (
        <BookingMapPicker
          selectedId={mapLocationId}
          mapPin={mapPin}
          onSelectCity={onSelectCity}
          onDropPin={onDropPin}
        />
      )}
    </div>
  );
}

function DetailsStep({
  form,
  summary,
}: {
  form: ReturnType<typeof useForm<ContactValues>>;
  summary: {
    date: Date | undefined;
    timeSlot: (typeof TIME_SLOTS)[number] | undefined;
    pkg: ShootPackage | undefined;
    locationMode: "address" | "map";
    address: string;
    mapSelectionLabel: string;
  };
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl tracking-wide text-ink md:text-3xl">
          Your <span className="text-gold">details</span>
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We'll send a confirmation email and reach out if we need anything else.
        </p>
      </div>

      <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 text-sm">
        <p className="mb-3 font-semibold text-ink">Booking summary</p>
        <dl className="grid gap-2 text-muted-foreground sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide">Date</dt>
            <dd className="font-medium text-ink">
              {summary.date ? format(summary.date, "MMM d, yyyy") : "—"}
              {summary.timeSlot ? ` · ${summary.timeSlot.label}` : ""}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide">Package</dt>
            <dd className="font-medium text-ink">{summary.pkg?.name ?? "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide">Location</dt>
            <dd className="font-medium text-ink">
              {summary.locationMode === "address"
                ? summary.address || "—"
                : summary.mapSelectionLabel}
            </dd>
          </div>
        </dl>
      </div>

      <Form {...form}>
        <form className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-9" placeholder="Karim Benali" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-9" type="email" placeholder="you@agency.com" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-9" type="tel" placeholder="+213 555 123 456" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>
                  Company / agency <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Oran Realty Group" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>
                  Shoot notes <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Listing type, must-have shots, branding guidelines…"
                    className="min-h-[80px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}

function ConfirmationView({
  bookingRef,
  date,
  timeSlot,
  pkg,
  locationMode,
  address,
  mapSelectionLabel,
  contact,
}: {
  bookingRef: string;
  date: Date;
  timeSlot: (typeof TIME_SLOTS)[number] | undefined;
  pkg: ShootPackage;
  locationMode: "address" | "map";
  address: string;
  mapSelectionLabel: string;
  contact: ContactValues;
}) {
  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/15">
        <Check className="h-8 w-8 text-gold" />
      </div>
      <h2 className="font-display text-3xl tracking-wide text-ink">
        You're <span className="text-gold">booked</span>
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Reference <span className="font-mono font-semibold text-ink">{bookingRef}</span> — we'll
        confirm within 24 hours at {contact.email}.
      </p>

      <Card className="mt-8 text-left">
        <CardContent className="space-y-4 p-6 text-sm">
          <div className="flex justify-between gap-4 border-b border-border pb-4">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium text-ink text-right">
              {formatBookingDate(date)}
              {timeSlot ? ` · ${timeSlot.label}` : ""}
            </span>
          </div>
          <div className="flex justify-between gap-4 border-b border-border pb-4">
            <span className="text-muted-foreground">Package</span>
            <span className="font-medium text-ink">{pkg.name} · {pkg.priceLabel}</span>
          </div>
          <div className="flex justify-between gap-4 border-b border-border pb-4">
            <span className="text-muted-foreground">Location</span>
            <span className="font-medium text-ink text-right max-w-[60%]">
              {locationMode === "address" ? address : mapSelectionLabel}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Contact</span>
            <span className="font-medium text-ink text-right">
              {contact.fullName}
              <br />
              {contact.phone}
            </span>
          </div>
        </CardContent>
      </Card>

      <Button asChild variant="gold" className="mt-8">
        <a href="/">Back to home</a>
      </Button>
    </div>
  );
}
