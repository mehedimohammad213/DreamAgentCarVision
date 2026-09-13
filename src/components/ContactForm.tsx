"use client";

import { FormEvent, useMemo, useState } from "react";
import type { CmsFormBuilder, CmsFormBuilderElement } from "@/lib/cms";

const CMS_API_URL =
  process.env.NEXT_PUBLIC_CMS_API_URL || "http://127.0.0.1:8000/api";
const CMS_SITE_KEY = process.env.NEXT_PUBLIC_CMS_SITE_KEY || "";

const fallbackElements: CmsFormBuilderElement[] = [
  {
    name: "firstName",
    label: "First Name",
    placeholder: "First name",
    element_type: "input",
    input_type: "text",
    required: true,
    width: "half",
  },
  {
    name: "lastName",
    label: "Last Name",
    placeholder: "Last name",
    element_type: "input",
    input_type: "text",
    required: true,
    width: "half",
  },
  {
    name: "phone",
    label: "Phone Number",
    placeholder: "Your phone number",
    element_type: "input",
    input_type: "tel",
    required: true,
    width: "half",
  },
  {
    name: "email",
    label: "Email Address",
    placeholder: "you@example.com",
    element_type: "input",
    input_type: "email",
    required: true,
    width: "half",
  },
  {
    name: "message",
    label: "Message",
    placeholder: "Tell us about your inquiry...",
    element_type: "textarea",
    required: true,
    width: "full",
  },
  {
    name: "submit",
    label: "CONTACT US",
    placeholder: "CONTACT US",
    element_type: "button",
    input_type: "submit",
    width: "full",
  },
];

const fieldClassName =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

function fieldName(element: CmsFormBuilderElement, index: number) {
  if (element.name) return element.name;
  if (element.label) {
    return element.label.toLowerCase().replace(/\s+/g, "_");
  }
  return `field_${index}`;
}

async function submitForm(
  formId: number,
  formData: Record<string, string>,
): Promise<{ ok: boolean; message?: string }> {
  if (!CMS_SITE_KEY) return { ok: false, message: "CMS site key missing" };

  try {
    const res = await fetch(`${CMS_API_URL}/form-submission`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Headless-Site-Key": CMS_SITE_KEY,
      },
      body: JSON.stringify({
        form_id: formId,
        form_type: "contact",
        form_data: formData,
        status: "new",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      return { ok: false, message: err?.message || "Failed to submit form" };
    }

    return { ok: true };
  } catch {
    return { ok: false, message: "Network error while submitting form" };
  }
}

export default function ContactForm({
  form,
}: {
  form?: CmsFormBuilder | null;
}) {
  const elements = useMemo(
    () =>
      (form?.elements?.length ? form.elements : fallbackElements).filter(
        Boolean,
      ),
    [form],
  );

  const inputElements = elements.filter(
    (el) => (el.element_type || el.type) !== "button",
  );
  const submitElement = elements.find(
    (el) =>
      (el.element_type || el.type) === "button" && el.input_type === "submit",
  );

  const [values, setValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateValue(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formId = form?.id;
    if (formId) {
      const result = await submitForm(formId, values);
      if (!result.ok) {
        setError(result.message || "Failed to submit form");
        setSubmitting(false);
        return;
      }
    }

    setSubmitted(true);
    setSubmitting(false);
  }

  const submitLabel =
    submitElement?.placeholder ||
    submitElement?.label ||
    form?.attributes?.submit_text ||
    "CONTACT US";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {inputElements.map((element, index) => {
          const name = fieldName(element, index);
          const elementType = element.element_type || element.type;
          const isFull =
            element.width === "full" || elementType === "textarea";

          return (
            <div
              key={element.updated_on || name}
              className={isFull ? "sm:col-span-2" : undefined}
            >
              <label htmlFor={name} className="block text-sm font-medium">
                {element.label}
              </label>
              {elementType === "textarea" ? (
                <textarea
                  id={name}
                  name={name}
                  required={!!element.required}
                  rows={5}
                  value={values[name] || ""}
                  onChange={(e) => updateValue(name, e.target.value)}
                  className={`${fieldClassName} resize-none`}
                  placeholder={element.placeholder}
                />
              ) : (
                <input
                  id={name}
                  name={name}
                  type={element.input_type || "text"}
                  required={!!element.required}
                  value={values[name] || ""}
                  onChange={(e) => updateValue(name, e.target.value)}
                  className={fieldClassName}
                  placeholder={element.placeholder}
                />
              )}
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={submitted || submitting}
        className="rounded-lg bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {submitted ? "Message Sent!" : submitting ? "Sending..." : submitLabel}
      </button>

      {error ? <p className="text-sm text-primary">{error}</p> : null}
      {submitted ? (
        <p className="text-sm text-primary-dark">
          Thank you! We&apos;ll get back to you soon.
        </p>
      ) : null}
    </form>
  );
}
