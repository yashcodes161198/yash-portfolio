"use client";

import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [status, setStatus] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
    setStatus("Opening your email app. No form data is stored here.");
    window.location.href = `mailto:yashk.code@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-row">
        <label>
          Name
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
      </div>
      <label>
        Message
        <textarea name="message" rows={7} required />
      </label>
      <button className="button button-primary" type="submit">Send message</button>
      <p className="form-note" aria-live="polite">
        {status || "Submitting opens your email app. This site does not store your message."}
      </p>
    </form>
  );
}
