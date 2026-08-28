import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const bodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(1).max(4000),
  token: z.string().trim().max(3000).optional().default(""),
});

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let parsed;
        try {
          parsed = bodySchema.parse(await request.json());
        } catch {
          return Response.json({ error: "invalid_input" }, { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: settings } = await supabaseAdmin
          .from("site_settings")
          .select("key, value")
          .in("key", ["turnstile", "turnstile_secret"]);

        const get = (key: string) =>
          (settings?.find((s) => s.key === key)?.value ?? {}) as Record<string, unknown>;
        const turnstile = get("turnstile");
        const secret = String(get("turnstile_secret")["secret_key"] ?? "");

        if (turnstile["enabled"] && secret) {
          if (!parsed.token) {
            return Response.json({ error: "captcha_required" }, { status: 400 });
          }
          const form = new URLSearchParams({ secret, response: parsed.token });
          const ip = request.headers.get("cf-connecting-ip");
          if (ip) form.set("remoteip", ip);
          const verify = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            { method: "POST", body: form },
          );
          const result = (await verify.json()) as { success?: boolean };
          if (!result.success) {
            return Response.json({ error: "captcha_failed" }, { status: 400 });
          }
        }

        const { error: insertError } = await supabaseAdmin
          .from("contact_messages")
          .insert({
            name: parsed.name,
            email: parsed.email,
            subject: parsed.subject || null,
            message: parsed.message,
          });

        if (insertError) {
          return Response.json({ error: "store_failed" }, { status: 500 });
        }

        return Response.json({ ok: true, emailSent: true });
      },
    },
  },
});
