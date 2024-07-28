import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getStreams, GetStreamsProps } from "@/lib/feed-service";
import {
  ResultCard,
  ResultCardSkeleton,
} from "@/app/(browse)/(home)/result-card";

export const Results = async (): Promise<React.JSX.Element> => {
  const data: GetStreamsProps[] = await getStreams();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Streams we think you&apos;ll like
      </h2>
      {data.length === 0 && (
        <div className="text-muted-foreground text-sm">No streams found.</div>
      )}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {data.map((result) => (
          <ResultCard key={result.id} data={result} />
        ))}
      </div>
    </div>
  );
};

export function ResultsSkeleton(): React.JSX.Element {
  return (
    <div>
      <Skeleton className="h-8 w-[290px] mb-4" />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {[...Array(4)].map((_, i) => (
          <ResultCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
