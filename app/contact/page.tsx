import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Yash about senior software engineering opportunities and technical work.",
};

export default function ContactPage() {
  return (
    <article className="page-stack inner-page contact-page">
      <header className="page-intro">
        <h1 className="display-title">contact me.</h1>
        <p>
          The best fit is senior backend or full-stack work involving Java,
          distributed systems, platform engineering, or applied AI.
        </p>
      </header>

      <ContactForm />

      <section className="direct-contact" aria-label="Direct contact details">
        <a href="mailto:yashk.code@gmail.com"><span>email</span><strong>yashk.code@gmail.com</strong></a>
        <a href="tel:+919113358078"><span>phone</span><strong>+91 91133 58078</strong></a>
        <p><span>location</span><strong>Hyderabad, India</strong></p>
      </section>
    </article>
  );
}
