"use client";

import { useEffect, useState } from "react";
import { Mail, MessageCircle, Phone, X } from "lucide-react";
import { siteConfig } from "@/config/site";

function whatsAppUrl(phone: string, message?: string) {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("880")
    ? digits
    : `880${digits.replace(/^0/, "")}`;
  const base = `https://wa.me/${normalized}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

const MESSENGER_URL = "https://m.me/DreamAgentCarVision";

interface InquireContactButtonProps {
  carLabel?: string;
  className?: string;
}

export default function InquireContactButton({
  carLabel,
  className = "inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3.5 font-semibold text-white transition-colors hover:bg-primary-dark",
}: InquireContactButtonProps) {
  const [open, setOpen] = useState(false);
  const { phone, email } = siteConfig.contact;
  const inquiryMessage = carLabel
    ? `Hello, I would like to inquire about: ${carLabel}`
    : undefined;

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        Inquire / Order
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="inquire-contact-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <h2
              id="inquire-contact-title"
              className="pr-8 text-lg font-bold sm:text-xl"
            >
              Contact us to inquire or order
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Please contact us using WhatsApp, Messenger, or email — we will
              help you with this vehicle.
            </p>

            <p className="mt-5 flex items-center gap-2 text-base font-semibold text-foreground">
              <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              {phone}
            </p>

            <ul className="mt-6 flex flex-col gap-3">
              <li>
                <a
                  href={whatsAppUrl(phone, inquiryMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3.5 font-medium transition-colors hover:border-primary hover:bg-primary-light/40"
                >
                  <MessageCircle className="h-5 w-5 shrink-0 text-[#25D366]" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={MESSENGER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3.5 font-medium transition-colors hover:border-primary hover:bg-primary-light/40"
                >
                  <MessageCircle className="h-5 w-5 shrink-0 text-[#0084FF]" />
                  Messenger
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}${carLabel ? `?subject=${encodeURIComponent(`Inquiry: ${carLabel}`)}` : ""}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3.5 font-medium transition-colors hover:border-primary hover:bg-primary-light/40"
                >
                  <Mail className="h-5 w-5 shrink-0 text-primary-dark" />
                  Email — {email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
