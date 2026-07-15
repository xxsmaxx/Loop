import { PrismaClient, FeedbackChannel, FeedbackStatus, Sentiment, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const feedbackTexts = [
  "Onboarding takes too long and users are confused after signup.",
  "Payment failed twice during checkout and I had to retry.",
  "The dashboard is clean and easy to understand.",
  "Support response was slow and did not solve my issue.",
  "The mobile experience feels broken on smaller screens.",
  "I love the analytics chart and feedback summary.",
  "Search is helpful but filters should be faster.",
  "The app-store rating flow is confusing.",
  "Customers want better invoice download options.",
  "The product is useful but onboarding needs improvement.",
];

const channels = [
  FeedbackChannel.SUPPORT,
  FeedbackChannel.APP_STORE,
  FeedbackChannel.SURVEY,
  FeedbackChannel.SALES,
  FeedbackChannel.SOCIAL,
  FeedbackChannel.CHAT,
];

const themes = [
  { name: "Onboarding", description: "Signup, setup, and first-time user experience", color: "#3B82F6" },
  { name: "Payments", description: "Checkout, billing, and payment failures", color: "#EF4444" },
  { name: "Dashboard UX", description: "Dashboard usability and visual experience", color: "#22C55E" },
  { name: "Support Quality", description: "Customer support response and resolution", color: "#F59E0B" },
  { name: "Mobile Experience", description: "Mobile layout and responsiveness", color: "#8B5CF6" },
];

async function main() {
  const password = "Demo@123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.embedding.deleteMany();
  await prisma.feedbackTheme.deleteMany();
  await prisma.report.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.theme.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workspace.deleteMany();

  const workspace = await prisma.workspace.create({
    data: {
      name: "Zidio Demo Workspace",
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@loop.com",
      passwordHash,
      role: Role.ADMIN,
      workspaceId: workspace.id,
    },
  });

  await prisma.user.createMany({
    data: [
      {
        name: "Analyst User",
        email: "analyst@loop.com",
        passwordHash,
        role: Role.ANALYST,
        workspaceId: workspace.id,
      },
      {
        name: "Viewer User",
        email: "viewer@loop.com",
        passwordHash,
        role: Role.VIEWER,
        workspaceId: workspace.id,
      },
    ],
  });

  const createdThemes = [];

  for (const theme of themes) {
    const createdTheme = await prisma.theme.create({
      data: {
        ...theme,
        workspaceId: workspace.id,
      },
    });

    createdThemes.push(createdTheme);
  }

  for (let i = 1; i <= 120; i++) {
    const text = feedbackTexts[i % feedbackTexts.length];
    const channel = channels[i % channels.length];
    const theme = createdThemes[i % createdThemes.length];

    const sentiment =
      i % 3 === 0 ? Sentiment.NEG : i % 3 === 1 ? Sentiment.POS : Sentiment.NEU;

    const sentimentScore =
      sentiment === Sentiment.POS ? 0.72 : sentiment === Sentiment.NEG ? -0.65 : 0.05;

    const feedback = await prisma.feedback.create({
      data: {
        content: `${text} Feedback sample #${i}`,
        channel,
        sourceRef: `${channel.toLowerCase()}-${i}`,
        customerLabel: `Customer ${i}`,
        sentiment,
        sentimentScore,
        status:
          i % 4 === 0
            ? FeedbackStatus.REVIEWED
            : i % 5 === 0
            ? FeedbackStatus.ACTIONED
            : FeedbackStatus.NEW,
        featureArea: theme.name,
        workspaceId: workspace.id,
      },
    });

    await prisma.feedbackTheme.create({
      data: {
        feedbackId: feedback.id,
        themeId: theme.id,
        confidence: 0.75,
      },
    });

    await prisma.embedding.create({
      data: {
        feedbackId: feedback.id,
        vectorJson: [0.12, 0.45, 0.78, 0.22, 0.91],
      },
    });
  }

  await prisma.report.create({
    data: {
      title: "Weekly Voice of Customer Report",
      periodStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      periodEnd: new Date(),
      contentJson: {
        summary:
          "Customers are mainly discussing onboarding, payments, dashboard UX, support quality, and mobile experience.",
        topThemes: themes.map((theme) => theme.name),
        recommendedActions: [
          "Improve onboarding flow",
          "Fix payment retry issues",
          "Polish mobile dashboard layout",
        ],
      },
      workspaceId: workspace.id,
      generatedById: admin.id,
    },
  });

  console.log("Seed completed successfully.");
  console.log("Demo credentials:");
  console.log("Admin: admin@loop.com / Demo@123");
  console.log("Analyst: analyst@loop.com / Demo@123");
  console.log("Viewer: viewer@loop.com / Demo@123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
