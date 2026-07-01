"use client";

import { useState } from "react";
import {
  Search, CheckCircle2, Clock, AlertTriangle, MapPin,
  Building2, Calendar, ImageOff, Loader2, Sparkles,
} from "lucide-react";
import SectionHeader from "@/components/section-header";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface Status {
  cid: string;
  text: string;
  category: string;
  department: string;
  district: string;
  community: string;
  status: string;
  done: boolean;
  photo: string | null;
  received: string | null;
  completed: string | null;
  predicted_days?: number;
  expected_done?: string | null;
  overdue?: boolean;
  confidence?: "สูง" | "กลาง" | "ต่ำ";
  sample_size?: number;
  confidence_basis?: string;
  priority?: string;
  ai_assessed?: boolean;
  closed_by?: string | null;
}

export default function TrackPage() {
  const [cid, setCid]         = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [result, setResult]   = useState<Status | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!cid.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API}/complaints/${encodeURIComponent(cid.trim())}`);
      if (res.status === 404) {
        setError(`ไม่พบคำร้องเลขที่ "${cid.trim()}" กรุณาตรวจสอบเลขคำร้องอีกครั้ง`);
        return;
      }
      if (!res.ok) throw new Error(`เกิดข้อผิดพลาด (HTTP ${res.status})`);
      setResult(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "เชื่อมต่อ API ไม่ได้");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <SectionHeader icon={<Search />} title="ติดตามสถานะคำร้อง" badge="PUBLIC" />

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          value={cid}
          onChange={(e) => setCid(e.target.value)}
          placeholder="กรอกเลขคำร้อง เช่น 0463/69"
          className="flex-1 border border-[#E2E8F0] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0057FF]/30 focus:border-[#0057FF]"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-[#0057FF] text-white rounded-xl px-6 py-3 text-[14px] font-600 hover:bg-[#0046CC] transition-colors disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          ค้นหา
        </button>
      </form>

      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[13px] text-red-700">
          <AlertTriangle size={15} className="shrink-0 text-red-500 mt-0.5" />
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-5">
          {/* Header row */}
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-[11px] text-[#94A3B8] uppercase tracking-wider font-700">เลขคำร้อง</p>
              <p className="text-[22px] font-800 text-[#0D1117]">{result.cid}</p>
            </div>
            <StatusBadge done={result.done} overdue={result.overdue} status={result.status} />
          </div>

          <p className="text-[15px] text-[#334155] leading-relaxed border-t border-[#F1F5F9] pt-4">
            {result.text}
          </p>

          {/* Meta grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[13px]">
            <Meta icon={<Building2 size={14} />} label="ประเภท" value={result.category} />
            <Meta icon={<Building2 size={14} />} label="หน่วยงาน" value={result.department} />
            <Meta icon={<MapPin size={14} />} label="เขต / ชุมชน" value={`${result.district}${result.community ? " · " + result.community : ""}`} />
            <Meta icon={<Calendar size={14} />} label="วันที่รับเรื่อง" value={result.received ?? "-"} />
          </div>

          {result.priority && (
            <div className="flex items-center gap-2 text-[13px]">
              <span className="text-[#94A3B8]">ความสำคัญ:</span>
              <span className="font-600 text-[#0D1117]">{result.priority}</span>
              {result.ai_assessed && (
                <span className="inline-flex items-center gap-1 text-[11px] text-[#0057FF] bg-[#EFF6FF] rounded-full px-2 py-0.5">
                  <Sparkles size={10} /> ประเมินโดย AI
                </span>
              )}
            </div>
          )}

          {/* Timeline */}
          <div className="border-t border-[#F1F5F9] pt-4">
            <p className="text-[12px] font-700 text-[#94A3B8] uppercase tracking-wider mb-3">ความคืบหน้า</p>
            <div className="flex items-center gap-2">
              <TimelineDot active label="รับเรื่อง" />
              <TimelineLine active={result.done} />
              <TimelineDot active={result.done} label={result.done ? "ดำเนินการเสร็จสิ้น" : "กำลังดำเนินการ"} />
            </div>
          </div>

          {/* Prediction (only if pending) */}
          {!result.done && result.expected_done && (
            <div className={`rounded-xl px-4 py-3 text-[13px] flex items-start gap-2.5 ${
              result.overdue ? "bg-red-50 border border-red-200 text-red-700" : "bg-blue-50 border border-blue-200 text-blue-700"
            }`}>
              {result.overdue
                ? <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                : <Clock size={15} className="shrink-0 mt-0.5" />}
              <div>
                <span>
                  {result.overdue
                    ? <>คำร้องนี้ <strong>ค้างเกินกำหนด</strong> — คาดว่าควรเสร็จภายใน {result.expected_done} (จากค่าเฉลี่ยของคำร้องประเภทเดียวกัน)</>
                    : <>คาดว่าจะดำเนินการเสร็จภายใน <strong>{result.expected_done}</strong> (ประมาณ {result.predicted_days} วัน จากวันที่รับเรื่อง)</>}
                </span>
                {result.confidence && (
                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-current/15 text-[11.5px] opacity-80">
                    <ConfidenceDot level={result.confidence} />
                    ความมั่นใจ<strong>{result.confidence}</strong>
                    {result.sample_size !== undefined && ` (อิงจาก ${result.sample_size} คำร้อง · ${result.confidence_basis})`}
                  </div>
                )}
              </div>
            </div>
          )}

          {result.done && result.completed && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-[13px] text-emerald-700 flex items-center gap-2.5">
              <CheckCircle2 size={15} className="shrink-0" />
              <span>
                ดำเนินการเสร็จสิ้นเมื่อ <strong>{result.completed}</strong>
                {result.closed_by && <> · ดำเนินการโดย <strong>{result.closed_by}</strong></>}
              </span>
            </div>
          )}

          {/* Photo */}
          <div className="border-t border-[#F1F5F9] pt-4">
            <p className="text-[12px] font-700 text-[#94A3B8] uppercase tracking-wider mb-3">รูปภาพที่แนบ</p>
            {result.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`${API}${result.photo}`} alt="รูปคำร้อง" className="rounded-xl max-h-72 object-cover border border-[#E2E8F0]" />
            ) : (
              <div className="flex items-center gap-2 text-[13px] text-[#94A3B8]">
                <ImageOff size={15} /> ไม่มีรูปภาพแนบ
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ConfidenceDot({ level }: { level: "สูง" | "กลาง" | "ต่ำ" }) {
  const color = level === "สูง" ? "bg-emerald-500" : level === "กลาง" ? "bg-amber-500" : "bg-red-400";
  return <span className={`w-1.5 h-1.5 rounded-full ${color} mr-1`} />;
}

function StatusBadge({ done, overdue, status }: { done: boolean; overdue?: boolean; status: string }) {
  if (done) return <Badge color="emerald" icon={<CheckCircle2 size={13} />} label={status || "เสร็จสิ้น"} />;
  if (overdue) return <Badge color="red" icon={<AlertTriangle size={13} />} label="ค้างเกินกำหนด" />;
  return <Badge color="amber" icon={<Clock size={13} />} label={status || "รอดำเนินการ"} />;
}

function Badge({ color, icon, label }: { color: "emerald" | "red" | "amber"; icon: React.ReactNode; label: string }) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red:     "bg-red-50 text-red-700 border-red-200",
    amber:   "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-700 border ${colors[color]}`}>
      {icon}{label}
    </span>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[#94A3B8] text-[11px] font-700 uppercase tracking-wider mb-1">
        {icon}{label}
      </p>
      <p className="text-[#0D1117] font-500">{value}</p>
    </div>
  );
}

function TimelineDot({ active, label }: { active?: boolean; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <div className={`w-3.5 h-3.5 rounded-full border-2 ${active ? "bg-[#0057FF] border-[#0057FF]" : "bg-white border-[#CBD5E1]"}`} />
      <span className={`text-[11px] text-center ${active ? "text-[#0D1117] font-600" : "text-[#94A3B8]"}`}>{label}</span>
    </div>
  );
}

function TimelineLine({ active }: { active?: boolean }) {
  return <div className={`h-0.5 flex-1 -mt-5 ${active ? "bg-[#0057FF]" : "bg-[#E2E8F0]"}`} />;
}
