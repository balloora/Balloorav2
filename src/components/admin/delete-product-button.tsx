"use client";

import { deleteProduct } from "@/app/admin/actions";

export function DeleteProductButton({
  id,
  title,
  className,
  action = deleteProduct,
}: {
  id: string;
  title: string;
  className?: string;
  /** Server action that deletes by `id` (defaults to deleting a product). */
  action?: (formData: FormData) => Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete “${title}”? This can't be undone.`)) e.preventDefault();
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
