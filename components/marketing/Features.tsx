import { Bot, BarChart3, MessageSquare, FileText } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Feedback Management",
    desc: "Collect and manage customer feedback in one clean dashboard.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Track feedback trends, sentiment, and customer behavior.",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    desc: "Use AI to summarize feedback and suggest improvements.",
  },
  {
    icon: FileText,
    title: "Smart Reports",
    desc: "Generate weekly feedback and sentiment reports easily.",
  },
];

export default function Features() {
  return (
    <section className="px-8 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm text-blue-400">Powerful Features</p>

          <h2 className="mt-3 text-4xl font-bold">
            Everything you need to understand customers
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            LOOP helps teams collect feedback, analyze sentiment, and take action faster.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-blue-500/50"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-lg font-bold">{item.title}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}