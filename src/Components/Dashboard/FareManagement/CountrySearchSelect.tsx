import { useState, useRef } from "react";
import { Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { ALL_COUNTRIES } from "./constants";

interface CountrySearchSelectProps {
  value: string;
  onChange: (v: string) => void;
}

const CountrySearchSelect = ({ value, onChange }: CountrySearchSelectProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = ALL_COUNTRIES.filter((c) =>
    c.toLowerCase().startsWith(query.toLowerCase())
  );

  const handleSelect = (country: string) => {
    onChange(country);
    setQuery("");
    setOpen(false);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setQuery("");
    if (next) setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div
          className="flex items-center border border-[#E5E5E5] bg-[#F5F5F5] rounded-lg px-3 gap-2 cursor-pointer"
          onClick={() => handleOpenChange(true)}
        >
          <span
            className={`flex-1 py-2.5 text-sm select-none ${
              value ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {value || "Select a country"}
          </span>
          <Search className="size-4 text-muted-foreground shrink-0" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 w-[var(--radix-popover-trigger-width)] overflow-hidden"
        align="start"
        sideOffset={4}
        onWheel={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-[#E5E5E5] px-3">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search country..."
            className="flex-1 py-2.5 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div
          className="overflow-y-scroll py-1"
          style={{ maxHeight: "224px" }}
          onWheel={(e) => e.stopPropagation()}
        >
          {filtered.length === 0 ? (
            <p className="px-4 py-2 text-sm text-muted-foreground">No results</p>
          ) : (
            filtered.map((country) => (
              <div
                key={country}
                onMouseDown={() => handleSelect(country)}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-accent ${
                  value === country ? "font-semibold bg-accent" : ""
                }`}
              >
                {country}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CountrySearchSelect;
