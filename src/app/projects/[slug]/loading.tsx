import { Skeleton } from "@/components/ui/Skeleton";

/** Skeleton of a project page (same layout as page.tsx), shown at once while a navigation to it loads. */
export default function LoadingProject() {
  return (
    <div aria-busy="true" aria-label="Loading the project">
      <header className="border-b border-line">
        <div className="mx-auto max-w-page px-4 pt-10 sm:px-6 md:pt-14">
          <Skeleton className="h-4 w-28" />
          <div className="mt-8 grid items-end gap-10 pb-14 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <Skeleton className="h-3 w-40" />
              <Skeleton className="mt-4 h-14 w-3/4" />
              <Skeleton className="mt-6 h-6 w-full max-w-[46ch]" />
              <Skeleton className="mt-2 h-6 w-2/3" />
              <div className="mt-8 flex gap-3">
                <Skeleton className="h-11 w-36" />
                <Skeleton className="h-11 w-28" />
              </div>
            </div>
            <Skeleton className="aspect-[16/10] w-full rounded-xl" />
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-page px-4 py-14 sm:px-6">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="mt-3 h-5 w-full max-w-3xl" />
        ))}
      </div>
    </div>
  );
}
