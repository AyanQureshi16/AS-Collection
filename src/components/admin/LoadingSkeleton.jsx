export default function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5"
        >
          <div className="w-16 h-16 rounded-lg shimmer-bg" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 shimmer-bg rounded-full" />
            <div className="h-3 w-32 shimmer-bg rounded-full" />
          </div>
          <div className="h-8 w-24 shimmer-bg rounded-lg" />
        </div>
      ))}
    </div>
  );
}
