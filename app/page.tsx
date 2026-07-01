import Link from "next/link";
import {
  Building2, ClipboardPlus, Search, Sparkles, Map as MapIcon, Trophy, Flame,
  ShieldCheck, ArrowRight, BarChart2, CalendarRange, BrainCircuit,
} from "lucide-react";

const CITIZEN_FEATURES = [
  { icon: ClipboardPlus, title: "ยื่นคำร้องออนไลน์", desc: "แจ้งปัญหาในพื้นที่พร้อมแนบรูปภาพ ใช้เวลาไม่ถึง 1 นาที" },
  { icon: Search,        title: "ติดตามสถานะได้ตลอด", desc: "กรอกเลขคำร้องเพื่อดูความคืบหน้าและวันที่คาดเสร็จ" },
  { icon: Sparkles,      title: "ถามตอบกับข้อมูลด้วย AI", desc: "ถามคำถามเกี่ยวกับสถิติคำร้องเป็นภาษาพูดธรรมดา" },
];

const ANALYTICS_FEATURES = [
  { icon: MapIcon,     title: "แผนที่เชิงพื้นที่" },
  { icon: BarChart2,   title: "วิเคราะห์คำร้องเชิงลึก" },
  { icon: CalendarRange, title: "เทียบแนวโน้มรายปี" },
  { icon: Trophy,      title: "Leaderboard หน่วยงาน" },
  { icon: Flame,       title: "พยากรณ์จุดเสี่ยง" },
  { icon: BrainCircuit, title: "พยากรณ์วันดำเนินการ" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 lg:px-10 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0057FF] flex items-center justify-center shrink-0">
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <p className="text-[13px] font-800 text-[#0D1117] leading-tight">Complaint Intelligence</p>
            <p className="text-[11px] text-[#94A3B8] leading-tight">เทศบาลนครขอนแก่น</p>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="hidden sm:flex items-center gap-1.5 text-[13px] font-600 text-[#0057FF] hover:text-[#0046CC] transition-colors"
        >
          เข้าใช้งานระบบ <ArrowRight size={14} />
        </Link>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 lg:py-20">
        <span className="inline-flex items-center gap-1.5 text-[11.5px] font-700 uppercase tracking-wider text-[#0057FF] bg-[#EFF6FF] rounded-full px-3.5 py-1.5 mb-6">
          <Sparkles size={12} /> Smart City Complaint Platform
        </span>

        <h1 className="text-[32px] sm:text-[44px] font-800 text-[#0D1117] tracking-tight leading-tight max-w-2xl">
          แจ้งปัญหาในเมือง<br className="hidden sm:block" /> ให้เทศบาลรับเรื่องและแก้ไว ด้วย AI
        </h1>

        <p className="text-[15px] text-[#64748B] max-w-xl mt-5 leading-relaxed">
          ระบบรับเรื่องร้องเรียนของเทศบาลนครขอนแก่น ที่ใช้ปัญญาประดิษฐ์ช่วยจำแนกประเภท
          ประเมินความเร่งด่วน และพยากรณ์วันดำเนินการ ให้ทั้งประชาชนและเจ้าหน้าที่ทำงานง่ายขึ้น
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
          <Link
            href="/submit"
            className="flex items-center gap-2 bg-[#0057FF] hover:bg-[#0046CC] transition-colors text-white rounded-xl px-6 py-3.5 text-[14.5px] font-700"
          >
            <ClipboardPlus size={17} /> ยื่นคำร้องเลย
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-white hover:bg-[#F8FAFC] transition-colors border border-[#E2E8F0] text-[#0D1117] rounded-xl px-6 py-3.5 text-[14.5px] font-700"
          >
            เข้าใช้งานระบบ <ArrowRight size={16} />
          </Link>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-8 mt-10 text-center">
          <div>
            <p className="text-[22px] font-800 text-[#0057FF]">462</p>
            <p className="text-[12px] text-[#94A3B8]">คำร้องในระบบ</p>
          </div>
          <div className="w-px h-8 bg-[#E2E8F0]" />
          <div>
            <p className="text-[22px] font-800 text-[#00B37E]">96%</p>
            <p className="text-[12px] text-[#94A3B8]">อัตราเสร็จสิ้น</p>
          </div>
          <div className="w-px h-8 bg-[#E2E8F0]" />
          <div>
            <p className="text-[22px] font-800 text-[#7B2FFF]">5</p>
            <p className="text-[12px] text-[#94A3B8]">เขตที่ดูแล</p>
          </div>
        </div>
      </section>

      {/* Citizen features */}
      <section className="px-6 lg:px-10 pb-10">
        <p className="text-center text-[11.5px] font-700 uppercase tracking-wider text-[#94A3B8] mb-5">
          สำหรับประชาชน
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {CITIZEN_FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center mb-3">
                <Icon size={18} className="text-[#0057FF]" />
              </div>
              <p className="text-[14px] font-700 text-[#0D1117] mb-1">{title}</p>
              <p className="text-[12.5px] text-[#64748B] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics + staff features */}
      <section className="px-6 lg:px-10 pb-16">
        <p className="text-center text-[11.5px] font-700 uppercase tracking-wider text-[#94A3B8] mb-5">
          วิเคราะห์ข้อมูล &amp; เจ้าหน้าที่
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
          {ANALYTICS_FEATURES.map(({ icon: Icon, title }) => (
            <div key={title} className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center hover:border-[#0057FF]/30 transition-colors">
              <Icon size={18} className="text-[#0057FF] mx-auto mb-2" />
              <p className="text-[12px] font-600 text-[#334155] leading-snug">{title}</p>
            </div>
          ))}
          <Link
            href="/admin"
            className="bg-[#0D1117] rounded-xl p-4 text-center hover:bg-[#1F2937] transition-colors col-span-2 sm:col-span-1"
          >
            <ShieldCheck size={18} className="text-white mx-auto mb-2" />
            <p className="text-[12px] font-600 text-white leading-snug">จัดการคำร้อง (แอดมิน)</p>
          </Link>
        </div>
      </section>

      <footer className="text-center pb-8 text-[12px] text-[#CBD5E1]">
        Smart City Complaint Intelligence Platform · เทศบาลนครขอนแก่น
      </footer>
    </div>
  );
}
