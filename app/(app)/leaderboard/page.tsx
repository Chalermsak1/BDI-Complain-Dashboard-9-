"use client";

import { useEffect, useState } from "react";
import { Trophy, AlertTriangle, Zap, Trophy as TrophyEmpty } from "lucide-react";
import SectionHeader from "@/components/section-header";
import EmptyState from "@/components/empty-state";
import { SkeletonList } from "@/components/skeleton";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface Entry {
  name: string;
  total: number;
  done: number;
  completion_rate: number;
  avg_days: number | null;
}

interface Leaderboard {
  department: Entry[];
  district: Entry[];
}

export default function LeaderboardPage() {
  const [data, setData]       = useState<Leaderboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [tab, setTab]         = useState<"department" | "district">("department");

  useEffect(() => {
    fetch(`${API}/leaderboard`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "เชื่อมต่อ API ไม่ได้"))
      .finally(() => setLoading(false));
  }, []);

  const list = data ? data[tab] : [];
  const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

  return (
    <div>
      <SectionHeader icon={<Trophy />} title="Leaderboard ประสิทธิภาพการทำงาน" badge="LIVE" />

      <div className="flex gap-2 mb-6">
        <TabButton active={tab === "department"} onClick={() => setTab("department")}>จัดอันดับตามฝ่าย</TabButton>
        <TabButton active={tab === "district"} onClick={() => setTab("district")}>จัดอันดับตามเขต</TabButton>
      </div>

      {loading && <SkeletonList rows={6} />}

      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[13px] text-red-700">
          <AlertTriangle size={15} className="shrink-0 text-red-500 mt-0.5" /> {error}
        </div>
      )}

      {!loading && !error && list.length === 0 && (
        <EmptyState
          icon={<TrophyEmpty size={22} />}
          title="ยังไม่มีข้อมูลเพียงพอสำหรับจัดอันดับ"
          hint="ต้องมีคำร้องอย่างน้อย 3 รายการต่อกลุ่มจึงจะคำนวณอันดับได้"
        />
      )}

      {!loading && !error && list.length > 0 && (
        <div className="space-y-3">
          {list.map((entry, i) => (
            <div
              key={entry.name}
              className="bg-white border border-[#E2E8F0] rounded-2xl px-5 py-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-800 shrink-0"
                style={{
                  backgroundColor: i < 3 ? `${medalColors[i]}22` : "#F1F5F9",
                  color: i < 3 ? medalColors[i] : "#94A3B8",
                }}
              >
                {i + 1}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-700 text-[#0D1117] truncate">{entry.name}</p>
                <p className="text-[12px] text-[#94A3B8]">
                  {entry.done}/{entry.total} เรื่อง เสร็จแล้ว
                </p>
              </div>

              <div className="text-right">
                <p className="text-[16px] font-800 text-[#0057FF]">{entry.completion_rate}%</p>
                <p className="text-[11px] text-[#94A3B8]">completion rate</p>
              </div>

              {entry.avg_days !== null && (
                <div className="text-right hidden sm:block w-24">
                  <p className="text-[14px] font-700 text-[#0D1117] flex items-center justify-end gap-1">
                    <Zap size={12} className="text-amber-500" /> {entry.avg_days}
                  </p>
                  <p className="text-[11px] text-[#94A3B8]">วันเฉลี่ย</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-[13px] font-600 transition-colors ${
        active ? "bg-[#0057FF] text-white" : "bg-white border border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC] transition-colors"
      }`}
    >
      {children}
    </button>
  );
}
