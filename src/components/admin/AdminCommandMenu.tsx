import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { adminNavSections } from "@/lib/admin/navigation";

type AdminCommandMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AdminCommandMenu({ open, onOpenChange }: AdminCommandMenuProps) {
  const navigate = useNavigate();

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages..." />
      <CommandList>
        <CommandEmpty>No pages found.</CommandEmpty>
        {adminNavSections.map((section, index) => (
          <div key={section.label}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup heading={section.label}>
              {section.items.map((item) => (
                <CommandItem
                  key={item.url}
                  value={`${section.label} ${item.title}`}
                  onSelect={() => {
                    onOpenChange(false);
                    navigate({ to: item.url });
                  }}
                >
                  <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

export function useAdminCommandMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return { open, setOpen };
}
