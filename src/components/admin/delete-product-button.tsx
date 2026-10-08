"use client";

import { deleteProduct } from "@/app/admin/actions";

export function DeleteProductButton({
  id,
  title,
  className,
  action = deleteProduct,
  warning,
}: {
  id: string;
  title: string;
  className?: string;
  /** Server action that deletes by `id` (defaults to deleting a product). */
  action?: (formData: FormData) => Promise<void>;
  /** Extra sentence shown in the confirm dialog. */
  warning?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        const extra = warning ? ` ${warning}` : "";
        if (!confirm(`Delete “${title}”?${extra} This can't be undone.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className={`rounded-lg border border-red-200 font-medium text-red-600 transition-colors hover:bg-red-50 ${className ?? ""}`}
      >
        Delete
      </button>
    </form>
  );
}
