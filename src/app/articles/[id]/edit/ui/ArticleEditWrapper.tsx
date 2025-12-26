"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { ArticleEditor, type ArticleFormData } from "../../../new/ui/ArticleEditor";
import { updateArticle, type SaveArticleState } from "../../../new/actions";

const initialState: SaveArticleState = { ok: false, message: "" };

export function ArticleEditWrapper({
  userEmail,
  articleId,
  initialData,
}: {
  userEmail: string;
  articleId: string;
  initialData: ArticleFormData;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    updateArticle.bind(null, articleId),
    initialState
  );

  useEffect(() => {
    if (state.ok && state.articleId) {
      setTimeout(() => {
        router.push(`/articles/${state.articleId}`);
      }, 1500);
    }
  }, [state, router]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-black/[.06] bg-white px-4 py-3 dark:border-white/[.08] dark:bg-zinc-950">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Signed in as <span className="font-medium">{userEmail}</span>
        </p>
      </div>

      {state.message && (
        <div
          className={[
            "rounded-lg border px-4 py-3 text-sm",
            state.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100"
              : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100",
          ].join(" ")}
        >
          {state.message}
        </div>
      )}

      <form action={formAction}>
        <ArticleEditor
          mode="edit"
          initialData={initialData}
          isPending={isPending}
        />
      </form>
    </div>
  );
}
