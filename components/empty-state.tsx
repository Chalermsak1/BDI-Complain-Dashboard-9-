import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  hint?: string;
}

export default function EmptyState({ icon, title, hint }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] dark:bg-white/5 flex items-center justify-center text-[#CBD5E1] mb-4">
        {icon ?? <Inbox size={24} />}
      </div>
      <p className="text-[14px] font-600 text-[#334155] mb-1">{title}</p>
      {hint && <p className="text-[12.5px] text-[#94A3B8] max-w-xs">{hint}</p>}
    </div>
  );
}
