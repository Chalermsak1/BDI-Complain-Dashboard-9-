export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-[#E2E8F0] dark:bg-white/10 rounded-lg ${className}`} />
  );
}

/** แถวสำหรับ leaderboard/list ที่กำลังโหลด */
export function SkeletonRow() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl px-5 py-4 flex items-center gap-4">
      <Skeleton className="w-9 h-9 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-5 w-12" />
    </div>
  );
}

/** การ์ดสำหรับหน้าที่กำลังโหลดข้อมูลกราฟ/สถิติ */
export function SkeletonCard({ height = "h-64" }: { height?: string }) {
  return (
    <div className={`bg-white border border-[#E2E8F0] rounded-2xl p-5 ${height}`}>
      <Skeleton className="h-full w-full" />
    </div>
  );
}

export function SkeletonList({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => <SkeletonRow key={i} />)}
    </div>
  );
}
