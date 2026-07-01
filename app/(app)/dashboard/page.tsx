import { ClipboardList, CheckCircle, Clock, Timer, Trophy, Gauge, ClipboardPlus, Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import KpiCard from "@/components/kpi-card";
import ChartCard from "@/components/chart-card";
import TrendWithFilter from "@/components/charts/trend-with-filter";
import VBar from "@/components/charts/v-bar";
import HBar from "@/components/charts/h-bar";
import Donut from "@/components/charts/donut";

import summary from "@/public/data/summary.json";
import trend from "@/public/data/trend.json";
import status from "@/public/data/status.json";
import priority from "@/public/data/priority.json";
import districts from "@/public/data/districts.json";

const PRIORITY_COLORS: Record<string, string> = {
  "สูง": "#E5484D", "กลาง": "#E8960C", "ต่ำ": "#00B37E",
};

export default function OverviewPage() {
  const distRate = districts
    .map((d) => ({ name: d.name, value: d.rate }))
    .sort((a, b) => a.value - b.value);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-[#0D1117] tracking-tight">
          ภาพรวมระบบคำร้องเรียน
        </h1>
        <p className="text-[14px] text-[#334155] mt-1">
          เทศบาลนครขอนแก่น &nbsp;·&nbsp; Smart City Complaint Intelligence Platform
        </p>
      </div>

      {/* CTA สำหรับประชาชน — สิ่งที่คนส่วนใหญ่เข้ามาทำจริงๆ ไม่ใช่ดูกราฟ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Link
          href="/submit"
          className="group flex items-center gap-4 bg-[#0057FF] hover:bg-[#0046CC] transition-colors rounded-2xl px-5 py-4 text-white"
        >
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <ClipboardPlus size={20} />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-700">ยื่นคำร้องใหม่</p>
            <p className="text-[12.5px] text-white/75">แจ้งปัญหาที่พบในพื้นที่ของคุณ ใช้เวลาไม่ถึง 1 นาที</p>
          </div>
          <ArrowRight size={18} className="shrink-0 opacity-70 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/track"
          className="group flex items-center gap-4 bg-white hover:bg-[#F8FAFC] transition-colors rounded-2xl px-5 py-4 border border-[#E2E8F0]"
        >
          <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
            <Search size={20} className="text-[#0057FF]" />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-700 text-[#0D1117]">ติดตามคำร้องของคุณ</p>
            <p className="text-[12.5px] text-[#94A3B8]">กรอกเลขคำร้องเพื่อดูสถานะล่าสุด</p>
          </div>
          <ArrowRight size={18} className="shrink-0 text-[#94A3B8] group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KpiCard icon={<ClipboardList size={20} />} label="คำร้องทั้งหมด"     value={summary.total.toLocaleString()}    color="#0057FF" description="จำนวนคำร้องทั้งหมดที่ได้รับในระบบตั้งแต่เริ่มต้นเก็บข้อมูล" />
        <KpiCard icon={<CheckCircle size={20} />}   label="ดำเนินการเสร็จ"    value={summary.done.toLocaleString()}     color="#00B37E" description="คำร้องที่ดำเนินการเสร็จสิ้นและปิดเรื่องแล้ว" />
        <KpiCard icon={<Clock size={20} />}         label="รอดำเนินการ"        value={summary.pending.toLocaleString()}  color="#E8960C" description="คำร้องที่ยังอยู่ระหว่างดำเนินการหรือรอรับเรื่อง" />
        <KpiCard icon={<Timer size={20} />}         label="เฉลี่ยวันดำเนินการ" value={summary.avg_sla}                   color="#00C2CB" description="จำนวนวันเฉลี่ยที่ใช้ดำเนินการคำร้องแต่ละเรื่องจนเสร็จ" />
        <KpiCard icon={<Trophy size={20} />}        label="ประเภทที่พบมากสุด"  value={summary.top_category.slice(0, 12)} color="#7B2FFF" description={`ประเภทคำร้องที่ประชาชนร้องเรียนเข้ามามากที่สุด ได้แก่ ${summary.top_category}`} />
        <KpiCard icon={<Gauge size={20} />}         label="อัตราเสร็จสิ้น"     value={`${summary.completion_rate}%`}
          color={summary.completion_rate >= 90 ? "#00B37E" : "#E8960C"}
          description="สัดส่วนคำร้องที่ดำเนินการเสร็จสิ้นแล้วต่อคำร้องทั้งหมด เป้าหมายคือ 90% ขึ้นไป" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <div className="lg:col-span-3">
          <ChartCard title="แนวโน้มคำร้องรายเดือน" sub="จำนวนคำร้องที่เข้ามาแต่ละเดือน">
            <TrendWithFilter data={trend} height={220} />
          </ChartCard>
        </div>
        <div className="lg:col-span-2">
          <ChartCard title="สถานะคำร้อง" sub="การกระจายตามสถานะปัจจุบัน">
            <HBar data={status} color="#0057FF" height={260} />
          </ChartCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="ระดับความสำคัญ" sub="จัดลำดับจากคำร้องเร่งด่วน">
          <Donut
            data={priority}
            colors={priority.map((p) => PRIORITY_COLORS[p.name] ?? "#94A3B8")}
            height={240}
          />
        </ChartCard>
        <ChartCard title="Completion Rate ตามเขต" sub="อัตราดำเนินการเสร็จแต่ละพื้นที่">
          <VBar data={distRate} color="#00B37E" height={240} unit="%" />
        </ChartCard>
      </div>
    </div>
  );
}
