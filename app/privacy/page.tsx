import { Navbar } from "@/components/landing/Navbar";
import Link from "next/link";

export const metadata = { title: "Privacy Policy · AISeen" };

const LAST_UPDATED = "June 25, 2025";
const CONTACT_EMAIL = "privacy@aiseen.io";

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-10">
          <p className="text-xs text-muted-foreground mb-2">Last updated {LAST_UPDATED}</p>
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            AISeen (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) operates the AISeen service.
            This policy explains what data we collect, how we use it, and your rights.
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed">
          <Section title="1. Data We Collect">
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li><strong className="text-foreground">Account data</strong> — your email address, used solely to authenticate you via magic link.</li>
              <li><strong className="text-foreground">Project data</strong> — brand name, domain, and category you provide when creating a project.</li>
              <li><strong className="text-foreground">Audit inputs</strong> — brand name, domain, and category submitted on the free audit page.</li>
              <li><strong className="text-foreground">Usage data</strong> — IP address (for rate limiting only, not stored long-term), plan, timestamps of checks.</li>
              <li><strong className="text-foreground">Billing data</strong> — handled entirely by Stripe. We never store card numbers or payment details.</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Data">
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li>To deliver the AI visibility tracking service and generate audit reports.</li>
              <li>To send you magic-link sign-in emails via Resend.</li>
              <li>To process payments and manage subscriptions via Stripe.</li>
              <li>To enforce free-tier rate limits (3 audits/day per IP).</li>
              <li>We do not sell your data. We do not use it for advertising.</li>
            </ul>
          </Section>

          <Section title="3. Third-Party Services">
            <p className="text-muted-foreground mb-3">
              To deliver the service, we send your brand/domain data to the following providers:
            </p>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Provider</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {[
                    ["Neon (PostgreSQL)", "Database — stores accounts, projects, checks"],
                    ["Resend", "Transactional email — magic links"],
                    ["Stripe", "Payment processing and subscription management"],
                    ["OpenAI", "ChatGPT visibility queries"],
                    ["Perplexity", "Perplexity AI visibility queries"],
                    ["DataForSEO", "Google AI Overview visibility queries"],
                  ].map(([p, u]) => (
                    <tr key={p}>
                      <td className="px-4 py-2.5 font-medium">{p}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{u}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground mt-3">
              Each provider operates under their own privacy policy and data processing terms.
            </p>
          </Section>

          <Section title="4. Data Retention">
            <p className="text-muted-foreground">
              Account and project data is retained for as long as your account is active.
              Free-audit IP rate-limit counters reset every 24 hours and are not persisted to disk.
              You may request deletion of your account and all associated data at any time by emailing us.
            </p>
          </Section>

          <Section title="5. Cookies &amp; Tracking">
            <p className="text-muted-foreground">
              We use a single secure HTTP-only session cookie for authentication (NextAuth.js JWT).
              We do not use analytics cookies, tracking pixels, or third-party ad cookies.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <p className="text-muted-foreground mb-2">
              Depending on your jurisdiction (GDPR, CCPA, etc.) you may have the right to:
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data.</li>
              <li>Object to or restrict processing of your data.</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              To exercise any of these rights, email <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>.
            </p>
          </Section>

          <Section title="7. Security">
            <p className="text-muted-foreground">
              Data in transit is encrypted via TLS. Data at rest is encrypted by our database provider (Neon).
              We use passwordless authentication to eliminate password-related attack vectors.
              Despite these measures, no internet transmission is 100% secure.
            </p>
          </Section>

          <Section title="8. Changes to This Policy">
            <p className="text-muted-foreground">
              We may update this policy from time to time. When we do, we will update the &ldquo;last updated&rdquo;
              date at the top. Continued use of the service after changes constitutes acceptance.
            </p>
          </Section>

          <Section title="9. Contact">
            <p className="text-muted-foreground">
              Questions about this policy? Email us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>.
            </p>
          </Section>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">← Back to AISeen</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service →</Link>
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
