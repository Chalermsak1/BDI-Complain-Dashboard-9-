"use client";

import { useEffect, useState } from "react";
import { CalendarRange, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import SectionHeader from "@/components/section-header";
import EmptyState from "@/components/empty-state";
import { SkeletonCard } from "@/components/skeleton";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface MonthRow {
  month: string;
  this_year: number;
  last_year: number;
  pct_change: number | null;
}

interface Yoy {
  this_year_label: string;
  last_year_label: string;
  months: MonthRow[];
  total_this_year: number;
  total_last_year: number;
  overall_pct_change: number | null;
}

export default function YoyPage() {
  const [data, setData]       = useState<Yoy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/yoy`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "เชื่อมต่อ API ไม่ได้"))
      .finally(() => setLoading(false));
  }, []);

  const hasData = data && (data.total_this_year > 0 || data.total_last_year > 0);

  return (
    <div>
      <SectionHeader icon={<CalendarRange />} title="เทียบจำนวนคำร้องรายปี" badge="YoY" />

      {loading && <SkeletonCard height="h-80" />}

      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[13px] text-red-700">
          <AlertTriangle size={15} className="shrink-0 text-red-500 mt-0.5" /> {error}
        </div>
      )}

      {!loading && !error && data && !hasData && (
        <EmptyState
          icon={<CalendarRange size={22} />}
          title="ยังไม่มีข้อมูลเพียงพอสำหรับเทียบรายปี"
          hint="ต้องมีข้อมูลคำร้องของปีนี้และปีก่อนหน้าอย่างน้อย 1 เดือน"
        />
      )}

      {!loading && !error && data && hasData && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <SummaryCard label={`พ.ศ. ${data.this_year_label}`} value={data.total_this_year} highlight />
            <SummaryCard label={`พ.ศ. ${data.last_year_label}`} value={data.total_last_year} />
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
              <p className="text-[11px] text-[#94A3B8] uppercase tracking-wider font-700 mb-1">เปลี่ยนแปลง</p>
              {data.overall_pct_change === null ? (
                <p className="text-[20px] font-800 text-[#94A3B8]">—</p>
              ) : (
                <p className={`text-[20px] font-800 flex items-center gap-1.5 ${
                  data.overall_pct_change > 0 ? "text-red-600" : "text-emerald-600"
                }`}>
                  {data.overall_pct_change > 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                  {data.overall_pct_change > 0 ? "+" : ""}{data.overall_pct_change}%
                </p>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data.months}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="last_year" name={`พ.ศ. ${data.last_year_label}`} stroke="#CBD5E1" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="this_year" name={`พ.ศ. ${data.this_year_label}`} stroke="#0057FF" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 border ${highlight ? "bg-[#0057FF] border-[#0057FF] text-white" : "bg-white border-[#E2E8F0]"}`}>
      <p className={`text-[11px] uppercase tracking-wider font-700 mb-1 ${highlight ? "text-white/70" : "text-[#94A3B8]"}`}>{label}</p>
      <p className="text-[26px] font-800">{value.toLocaleString()} <span className="text-[13px] font-500">รายการ</span></p>
    </div>
  );
}
