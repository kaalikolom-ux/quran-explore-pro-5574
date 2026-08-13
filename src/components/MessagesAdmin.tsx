import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { usePrefs } from "@/lib/prefs";
import { Button } from "@/components/ui/button";

export function MessagesAdmin() {
  const { t } = usePrefs();
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: ["admin-contact-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-contact-messages"] });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  if (!list.data?.length) {
    return <p className="card-soft p-6 text-sm text-muted-foreground">{t("noMessages")}</p>;
  }

  return (
    <div className="space-y-3">
      {list.data.map((m) => (
        <div key={m.id} className={`card-soft p-4 ${m.is_read ? "" : "border-primary/40"}`}>
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">
                {m.name} · <span className="text-muted-foreground">{m.email}</span>
              </p>
              {m.subject && <p className="text-sm">{m.subject}</p>}
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{m.message}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(m.created_at).toLocaleString("en-GB")}
                {m.email_sent ? ` · ${t("emailForwarded")}` : ` · ${t("emailNotForwarded")}`}
              </p>
            </div>
            {!m.is_read && (
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("markRead")}
                title={t("markRead")}
                onClick={() => markRead.mutate(m.id)}
              >
                <Check className="size-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("delete")}
              onClick={() => remove.mutate(m.id)}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
