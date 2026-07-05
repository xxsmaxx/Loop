import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    desc: "Best for students and small projects.",
    features: ["Basic feedback tracking", "Simple analytics", "5 reports/month"],
    button: "Start Free",
  },
  {
    name: "Pro",
    price: "₹999",
    desc: "Best for startups and growing teams.",
    features: ["AI feedback assistant", "Advanced analytics", "Unlimited reports"],
    button: "Choose Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Best for companies with large feedback data.",
    features: ["Team access", "Priority support", "Custom integrations"],
    button: "Contact Sales",
  },
];

export default function Pricing() {
  return (
    <section className="px-8 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm text-blue-400">Pricing</p>

          <h2 className="mt-3 text-4xl font-bold">
            Simple plans for every team
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Start free and upgrade when your feedback system grows.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 transition hover:-translate-y-1 ${
                plan.popular
                  ? "border-blue-500 bg-blue-600/10 shadow-lg shadow-blue-600/20"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            >
              {plan.popular && (
                <span className="absolute right-5 top-5 rounded-full bg-blue-600 px-3 py-1 text-xs">
                  Popular
                </span>
              )}

              <h3 className="text-xl font-bold">{plan.name}</h3>

              <p className="mt-3 text-sm text-slate-400">{plan.desc}</p>

              <h2 className="mt-6 text-4xl font-bold">{plan.price}</h2>

              <div className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-emerald-400" />
                    <p className="text-sm text-slate-300">{feature}</p>
                  </div>
                ))}
              </div>

              <button className="mt-8 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500">
                {plan.button}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}