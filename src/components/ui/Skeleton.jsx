// Skeleton loader cards for product grids
export function ProductCardSkeleton() {
  return (
    <div className="card-luxury overflow-hidden">
      <div className="h-64 sm:h-72 shimmer-bg" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 shimmer-bg rounded-full" />
        <div className="h-4 w-full shimmer-bg rounded-full" />
        <div className="h-4 w-3/4 shimmer-bg rounded-full" />
        <div className="h-3 w-24 shimmer-bg rounded-full" />
        <div className="h-8 shimmer-bg rounded-xl" />
      </div>
    </div>
  );
}
