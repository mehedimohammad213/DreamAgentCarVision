"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type SearchableOption = {
  value: string;
  label: string;
  count?: number;
};

type SearchableSelectProps = {
  id?: string;
  label: string;
  placeholder: string;
  value: string;
  options: SearchableOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
  className?: string;
};

export default function SearchableSelect({
  id,
  label,
  placeholder,
  value,
  options,
  disabled = false,
  onChange,
  className,
}: SearchableSelectProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = options.find((option) => option.value === value);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(needle),
    );
  }, [options, query]);

  useEffect(() => {
    if (!open) setQuery(selected?.label ?? "");
  }, [open, selected?.label, value]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function openMenu() {
    if (disabled) return;
    setOpen(true);
    setQuery("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function selectOption(next: string) {
    onChange(next);
    setOpen(false);
  }

  function clearSelection(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    onChange("");
    setQuery("");
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && filtered[0]) {
      event.preventDefault();
      selectOption(filtered[0].value);
    }
  }

  const displayValue = open ? query : (selected?.label ?? "");

  return (
    <div ref={rootRef} className={cn("relative min-w-0 flex-1", className)}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div
        className={cn(
          "flex h-12 items-center rounded-xl border bg-[#1a1a1a]/90 transition-colors sm:rounded-full",
          disabled
            ? "cursor-not-allowed border-white/20 bg-[#1a1a1a]/70"
            : open || value
              ? "border-primary"
              : "border-white/25 hover:border-white/40",
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${inputId}-listbox`}
          aria-autocomplete="list"
          aria-disabled={disabled}
          disabled={disabled}
          placeholder={placeholder}
          value={displayValue}
          onChange={(event) => {
            setQuery(event.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={openMenu}
          onClick={openMenu}
          onKeyDown={handleKeyDown}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent px-4 text-left text-sm text-white outline-none placeholder:text-white placeholder:opacity-100 disabled:cursor-not-allowed disabled:opacity-100 disabled:text-white/90 disabled:placeholder:text-white/90",
          )}
        />
        {value && !disabled ? (
          <button
            type="button"
            onClick={clearSelection}
            aria-label={`Clear ${label}`}
            className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/10 text-primary transition-colors hover:bg-white/20"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        ) : (
          <ChevronDown
            className={cn(
              "pointer-events-none mr-3 h-4 w-4 shrink-0 text-white transition-transform",
              open && "rotate-180",
              disabled && "text-white/80",
            )}
          />
        )}
      </div>

      {open && !disabled ? (
        <ul
          id={`${inputId}-listbox`}
          role="listbox"
          aria-label={label}
          className="thin-scrollbar absolute left-0 right-0 z-30 mt-2 max-h-56 overflow-y-auto rounded-xl border border-white/10 bg-[#141414] py-1 shadow-2xl shadow-black/50"
        >
          {filtered.length === 0 ? (
            <li className="px-4 py-3 text-left text-sm text-white/80">
              No matches
            </li>
          ) : (
            filtered.map((option) => {
              const isActive = option.value === value;
              return (
                <li key={option.value} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onClick={() => selectOption(option.value)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                      isActive
                        ? "bg-primary/15 text-primary"
                        : "text-white hover:bg-white/5",
                    )}
                  >
                    <span>{option.label}</span>
                    {typeof option.count === "number" ? (
                      <span
                        className={cn(
                          isActive ? "text-primary" : "text-white/80",
                        )}
                      >
                        ({option.count})
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}
