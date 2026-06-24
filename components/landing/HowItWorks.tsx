const steps = [
  {
    step: "1",
    title: "Add your brand",
    description: "Enter your brand name, domain, and product category. We auto-generate the prompts people actually ask AI.",
  },
  {
    step: "2",
    title: "We run the prompts daily",
    description: "AISeen queries ChatGPT, Perplexity, and Google AI Overviews every morning and records whether you appear.",
  },
  {
    step: "3",
    title: "Get alerts on changes",
    description: "When your visibility changes — gained or lost — we email you immediately so you can act fast.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-muted/40">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.step} className="flex flex-col items-start">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mb-4">
                {s.step}
              </div>
              <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
