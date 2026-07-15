import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/db";

const signupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  workspaceName: z.string().min(2).max(80).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed.", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const name = parsed.data.name.trim();
    const email = parsed.data.email.toLowerCase().trim();
    const password = parsed.data.password;
    const workspaceName =
      parsed.data.workspaceName?.trim() || `${name}'s Workspace`;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists. Please login." },
        { status: 409 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: workspaceName,
        },
      });

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: Role.ADMIN,
          workspaceId: workspace.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          workspaceId: true,
        },
      });

      return { user, workspace };
    });

    return NextResponse.json(
      {
        message: "Signup successful.",
        user: result.user,
        workspace: result.workspace,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log("SIGNUP_ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Signup failed." },
      { status: 500 }
    );
  }
}
