import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { SITE } from "@/lib/utils";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  inquiryType: z.enum(["wholesale", "compliance", "press", "general"]),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form submission" }, { status: 400 });
  }

  const { name, email, company, inquiryType, message } = parsed.data;
  const subject = `[Pernikus] ${inquiryType.toUpperCase()} — ${name}`;
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company ?? "—"}`,
    `Inquiry: ${inquiryType}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? SITE.email;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Pernikus Contact <onboarding@resend.dev>";

  if (!apiKey) {
    console.log("[contact] (no RESEND_API_KEY set — logging instead of sending)");
    console.log({ to, from, subject, body });
    return NextResponse.json({ ok: true, mode: "logged" });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject,
      text: body,
    });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true, mode: "sent" });
  } catch (e) {
    console.error("[contact] send failed", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Email send failed" },
      { status: 500 }
    );
  }
}
