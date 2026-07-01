"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Map as MapIcon, AlertTriangle, Info } from "lucide-react";
import SectionHeader from "@/components/section-header";
import { SkeletonCard } from "@/components/skeleton";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// react-leaflet ใช้ window/document — ต้องปิด SSR ไม่งั้น build จะ error
const KhonKaenMap = dynamic(() => import("@/components/khonkaen-map"), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center text-[13px] text-[#94A3B8]">กำลังโหลดแผนที่...</div>,
});

interface DistrictPoint {
  district: string;
  total: number;
  pending: number;
  done: number;
  completion_rate: number;
}

interface MapData {
  districts: DistrictPoint[];
  unspecified_count: number;
}

export default function MapPage() {
  const [data, setData]       = useState<MapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/map-data`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "เชื่อมต่อ API ไม่ได้"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <SectionHeader icon={<MapIcon />} title="แผนที่คำร้องเรียนรายเขต" badge="MAP" />

      <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6 text-[13px] text-blue-700">
        <Info size={15} className="shrink-0 mt-0.5" />
        <span>
          ตำแหน่งจุดเป็น<strong>ค่าประมาณ</strong>เพื่อกระจายให้เห็นภาพรวมเชิงพื้นที่ ไม่ใช่ขอบเขตเขตที่เป๊ะตามประกาศจริง
          (ยังไม่มีไฟล์ขอบเขตเขตที่เป็นทางการในระบบ) ขนาดจุด = จำนวนคำร้อง, สีจุด = อัตราความสำเร็จ
        </span>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 text-[13px] text-red-700">
          <AlertTriangle size={15} className="shrink-0 text-red-500 mt-0.5" /> {error}
        </div>
      )}

      {loading ? (
        <SkeletonCard height="h-[480px]" />
      ) : (
        <div className="h-[480px] rounded-2xl overflow-hidden border border-[#E2E8F0]">
          {data && <KhonKaenMap data={data.districts} />}
        </div>
      )}

      {!loading && data && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5">
            {data.districts.map((d) => (
              <div key={d.district} className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 text-center">
                <p className="text-[12px] font-700 text-[#0D1117]">{d.district}</p>
                <p className="text-[20px] font-800 text-[#0057FF] mt-1">{d.total}</p>
                <p className="text-[11px] text-[#94A3B8]">คำร้อง · {d.completion_rate}% เสร็จ</p>
              </div>
            ))}
          </div>

          {data.unspecified_count > 0 && (
            <p className="text-[12px] text-[#94A3B8] mt-4 text-center">
              + คำร้องอีก {data.unspecified_count} รายการที่ไม่ได้ระบุเขต (ไม่แสดงบนแผนที่)
            </p>
          )}

          <div className="flex items-center justify-center gap-5 mt-4 text-[11.5px] text-[#64748B]">
            <span className="flex items-center gap-1.5"><Dot color="#00B37E" /> เสร็จ ≥95%</span>
            <span className="flex items-center gap-1.5"><Dot color="#E8960C" /> เสร็จ 85–94%</span>
            <span className="flex items-center gap-1.5"><Dot color="#E5484D" /> เสร็จ &lt;85%</span>
          </div>
        </>
      )}
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: color }} />;
}
