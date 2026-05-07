"use client";

import { useFormStatus } from "react-dom";
import { useMessages } from "@/lib/locale-client";

type PendingButtonProps = {
  idleLabel: string;
  pendingLabel: string;
  tone?: "primary" | "danger";
};

function PendingButton({
  idleLabel,
  pendingLabel,
  tone = "primary",
}: PendingButtonProps) {
  const { pending } = useFormStatus();

  const classes =
    tone === "danger"
      ? "border border-rose-300/70 bg-rose-50/90 text-rose-700 hover:border-rose-400 dark:bg-rose-950/40 dark:text-rose-200"
      : "bg-[linear-gradient(135deg,#8fdcc2,#cfe8ff)] text-slate-900 shadow-[0_18px_38px_rgba(143,220,194,0.28)]";

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70 ${classes}`}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}

export function SaveButton() {
  const messages = useMessages();
  return (
    <PendingButton
      idleLabel={messages.admin.editor.save}
      pendingLabel={messages.admin.editor.saving}
    />
  );
}

export function DeleteButton() {
  const messages = useMessages();
  return (
    <PendingButton
      idleLabel={messages.admin.editor.delete}
      pendingLabel={messages.admin.editor.deleting}
      tone="danger"
    />
  );
}

export function LogoutButton() {
  const messages = useMessages();
  return (
    <PendingButton
      idleLabel={messages.admin.editor.logout}
      pendingLabel={messages.admin.editor.loggingOut}
    />
  );
}
