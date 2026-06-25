import { Navbar } from "@/components/landing/Navbar";
import Link from "next/link";

export const metadata = { title: "Terms of Service · AISeen" };

const LAST_UPDATED = "June 25, 2025";
const CONTACT_EMAIL = "legal@aiseen.io";

export default function TermsPage() {
  return (
    <div className="min-h-dvh">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-10">
          <p className="text-xs text-muted-foreground mb-2">Last updated {LAST_UPDATED}</p>
          <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            By accessing or using AISeen you agree to these terms. Please read them carefully.
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed">
          <Section title="1. Acceptance of Terms">
            <p className="text-muted-foreground">
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of AISeen
              (&ldquo;Service&rdquo;), provided by AISeen (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By creating an account or
              using the Service (including the free audit tool), you agree to be bound by these Terms.
              If you do not agree, do not use the Service.
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p className="text-muted-foreground">
              AISeen is a B2B SaaS tool that tracks brand and domain visibility across AI-powered search
              engines including ChatGPT, Perplexity, and Google AI Overviews. The Service queries these
              engines with prompts you define and reports whether your brand is mentioned.
            </p>
          </Section>

          <Section title="3. Accounts &amp; Access">
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li>You must provide a valid email address to create an account.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
              <li>You must be at least 16 years old to use the Service.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
            </ul>
          </Section>

          <Section title="4. Acceptable Use">
            <p className="text-muted-foreground mb-2">You agree not to:</p>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li>Use the Service to track brands or domains you do not own or have no legitimate interest in.</li>
              <li>Attempt to circumvent rate limits through multiple accounts or IP rotation.</li>
              <li>Reverse engineer, decompile, or scrape the Service.</li>
              <li>Use the Service for any unlawful purpose or to violate third-party rights.</li>
              <li>Resell or sublicense access to the Service without written permission.</li>
            </ul>
          </Section>

          <Section title="5. Subscriptions &amp; Billing">
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li>Paid plans (Indie, Pro) are billed monthly through Stripe.</li>
              <li>Subscriptions renew automatically until cancelled.</li>
              <li>You may cancel at any time via the billing portal; access continues until the end of the current billing period.</li>
              <li>We do not offer refunds for partial billing periods unless required by applicable law.</li>
              <li>We reserve the right to change pricing with 30 days&rsquo; notice.</li>
            </ul>
          </Section>

          <Section title="6. Free Tier &amp; Rate Limits">
            <p className="text-muted-foreground">
              The free audit tool is limited to 3 audits per day per IP address. Free accounts are
              subject to usage limits described on the pricing page. We may adjust these limits at any time.
            </p>
          </Section>

          <Section title="7. Accuracy of Results">
            <p className="text-muted-foreground">
              AI engine responses are non-deterministic and change frequently. AISeen provides
              best-effort snapshots of AI visibility at the time of each check. Results are for
              informational purposes only and we make no warranties about their accuracy, completeness,
              or fitness for any particular purpose.
            </p>
          </Section>

          <Section title="8. Intellectual Property">
            <p className="text-muted-foreground">
              The Service, including its design, code, and content, is owned by AISeen and protected
              by applicable intellectual property laws. You retain ownership of the brand data you provide.
              You grant us a limited license to process that data solely to deliver the Service.
            </p>
          </Section>

          <Section title="9. Limitation of Liability">
            <p className="text-muted-foreground">
              To the maximum extent permitted by law, AISeen shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, including loss of profits or data,
              arising from your use of the Service. Our total liability to you for any claim shall not
              exceed the amount you paid us in the 3 months prior to the claim.
            </p>
          </Section>

          <Section title="10. Disclaimer of Warranties">
            <p className="text-muted-foreground">
              The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind,
              express or implied, including merchantability, fitness for a particular purpose, or
              non-infringement. We do not warrant that the Service will be uninterrupted or error-free.
            </p>
          </Section>

          <Section title="11. Termination">
            <p className="text-muted-foreground">
              We may suspend or terminate your access to the Service at any time, with or without cause,
              with or without notice. You may stop using the Service at any time. Upon termination,
              provisions of these Terms that by their nature should survive (including liability
              limitations) will survive.
            </p>
          </Section>

          <Section title="12. Changes to Terms">
            <p className="text-muted-foreground">
              We may update these Terms at any time. We will update the &ldquo;last updated&rdquo; date above and,
              for material changes, notify you by email. Continued use after changes constitutes acceptance.
            </p>
          </Section>

          <Section title="13. Governing Law">
            <p className="text-muted-foreground">
              These Terms are governed by the laws of the jurisdiction where AISeen is incorporated,
              without regard to conflict of law principles. Any disputes shall be resolved in the
              courts of that jurisdiction.
            </p>
          </Section>

          <Section title="14. Contact">
            <p className="text-muted-foreground">
              Questions about these Terms? Email us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>.
            </p>
          </Section>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">← Back to AISeen</Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy →</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}
