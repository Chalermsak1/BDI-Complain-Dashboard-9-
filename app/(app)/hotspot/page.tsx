"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Flame } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import SectionHeader from "@/components/section-header";
import EmptyState from "@/components/empty-state";
import { SkeletonCard, Skeleton } from "@/components/skeleton";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface Forecast {
  district: string;
  recent_avg: number;
  trend: "เพิ่มขึ้น" | "ลดลง" | "คงที่";
  projected_next: number;
}

export default function HotspotPage() {
  const [data, setData]       = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/hotspot-forecast`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "เชื่อมต่อ API ไม่ได้"))
      .finally(() => setLoading(false));
  }, []);

  const top = data[0];

  return (
    <div>
      <SectionHeader icon={<Flame />} title="พยากรณ์จุดเสี่ยงเดือนหน้า" badge="FORECAST" />

      <p className="text-[13px] text-[#64748B] mb-6 leading-relaxed">
        วิเคราะห์แนวโน้มจำนวนคำร้องรายเขตจาก 6 เดือนล่าสุด เพื่อประมาณการว่าเขตใดมีโอกาสมีคำร้องเพิ่มขึ้นในเดือนถัดไป
        (ใช้ linear trend อย่างง่าย เหมาะสำหรับดูภาพรวม ไม่ใช่การพยากรณ์เชิงสถิติที่ซับซ้อน)
      </p>

      {loading && (
        <>
          <SkeletonCard height="h-72" />
          <div className="space-y-2.5 mt-6">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        </>
      )}

      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[13px] text-red-700">
          <AlertTriangle size={15} className="shrink-0 text-red-500 mt-0.5" /> {error}
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <>
          {top && top.trend === "เพิ่มขึ้น" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-[13px] text-amber-800 flex items-start gap-2.5">
              <Flame size={15} className="shrink-0 text-amber-500 mt-0.5" />
              <span>
                <strong>{top.district}</strong> มีแนวโน้มคำร้องเพิ่มขึ้น คาดการณ์เดือนหน้าประมาณ{" "}
                <strong>{top.projected_next}</strong> รายการ — ควรจัดเตรียมกำลังคนเพิ่มในพื้นที่นี้
              </span>
            </div>
          )}

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 mb-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="district" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="recent_avg" name="เฉลี่ย 6 เดือนล่าสุด" fill="#CBD5E1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="projected_next" name="คาดการณ์เดือนหน้า" fill="#0057FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2.5">
            {data.map((f) => (
              <div key={f.district} className="bg-white border border-[#E2E8F0] rounded-xl px-5 py-3.5 flex items-center justify-between">
                <p className="text-[14px] font-700 text-[#0D1117]">{f.district}</p>
                <div className="flex items-center gap-6">
                  <TrendBadge trend={f.trend} />
                  <span className="text-[13px] text-[#64748B] w-28 text-right">
                    คาดการณ์ <strong className="text-[#0D1117]">{f.projected_next}</strong> รายการ
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && !error && data.length === 0 && (
        <EmptyState
          icon={<Flame size={22} />}
          title="ข้อมูลย้อนหลังยังไม่พอสำหรับพยากรณ์"
          hint="ต้องการข้อมูลคำร้องอย่างน้อย 3 เดือนย้อนหลังจึงจะคำนวณแนวโน้มได้"
        />
      )}
    </div>
  );
}

function TrendBadge({ trend }: { trend: Forecast["trend"] }) {
  if (trend === "เพิ่มขึ้น")
    return <span className="flex items-center gap-1 text-[12px] font-700 text-red-600"><TrendingUp size={14} /> เพิ่มขึ้น</span>;
  if (trend === "ลดลง")
    return <span className="flex items-center gap-1 text-[12px] font-700 text-emerald-600"><TrendingDown size={14} /> ลดลง</span>;
  return <span className="flex items-center gap-1 text-[12px] font-700 text-[#94A3B8]"><Minus size={14} /> คงที่</span>;
}
