"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, BarChart2, Timer, Map, Building2, BrainCircuit, Menu, X,
  ClipboardPlus, Search, Trophy, Flame, Sparkles, CalendarRange, ShieldCheck, MapPinned,
} from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";

const NAV_GROUPS = [
  {
    label: "สำหรับประชาชน",
    items: [
      { href: "/submit", label: "ยื่นคำร้อง",       icon: ClipboardPlus },
      { href: "/track",  label: "ติดตามคำร้อง",      icon: Search        },
      { href: "/ask",    label: "ถามตอบกับข้อมูล",   icon: Sparkles      },
    ],
  },
  {
    label: "วิเคราะห์ข้อมูล",
    items: [
      { href: "/dashboard",   label: "ภาพรวม",              icon: LayoutDashboard },
      { href: "/map",         label: "แผนที่",               icon: MapPinned       },
      { href: "/complaints",  label: "วิเคราะห์คำร้อง",     icon: BarChart2       },
      { href: "/performance", label: "ประสิทธิภาพ & SLA",    icon: Timer           },
      { href: "/district",    label: "วิเคราะห์แยกตามเขต",  icon: Map             },
      { href: "/yoy",         label: "เทียบรายปี",           icon: CalendarRange   },
      { href: "/leaderboard", label: "Leaderboard",         icon: Trophy          },
      { href: "/hotspot",     label: "พยากรณ์จุดเสี่ยง",     icon: Flame           },
      { href: "/predict",     label: "ลงคะแนนคำร้อง",       icon: BrainCircuit    },
    ],
  },
  {
    label: "เจ้าหน้าที่",
    items: [
      { href: "/admin", label: "จัดการคำร้อง", icon: ShieldCheck },
    ],
  },
];

export default function Sidebar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <button
          aria-label="ปิด sidebar"
          className="fixed inset-0 bg-black/40 z-20 lg:hidden w-full cursor-default border-0 p-0"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static z-30 lg:z-auto
        w-[240px] shrink-0 bg-white dark:bg-[#0F1620] border-r border-[#E2E8F0] dark:border-[#1F2937]
        flex flex-col h-screen
        transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#E2E8F0] dark:border-[#1F2937] flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0057FF] flex items-center justify-center shrink-0">
              <Building2 size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[13px] font-800 text-[#0D1117] dark:text-[#F1F5F9] leading-tight">
                Complaint Intelligence
              </p>
              <p className="text-[11px] text-[#94A3B8] leading-tight mt-0.5">
                เทศบาลนครขอนแก่น · v1.0
              </p>
            </div>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-[#94A3B8] hover:text-[#334155] p-1 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.label} className={gi > 0 ? "mt-5" : ""}>
              <p className="px-3 mb-1.5 text-[10.5px] font-700 uppercase tracking-wider text-[#CBD5E1] dark:text-[#475569]">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ href, label, icon: Icon }) => {
                  const active = path === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => window.innerWidth < 1024 && setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-500 transition-colors ${
                        active
                          ? "bg-[#EFF6FF] dark:bg-[#0057FF]/15 text-[#0057FF]"
                          : "text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0D1117] transition-colors"
                      }`}
                    >
                      <Icon size={16} className={active ? "text-[#0057FF]" : "text-[#94A3B8]"} />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E2E8F0] dark:border-[#1F2937] flex items-center justify-between">
          <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
            Smart City Platform<br />Khon Kaen
          </p>
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile menu button — สังเกตเห็นง่ายกว่า drawer tab เดิม (วางขวาบน กันชนกับ LIVE ticker ฝั่งซ้าย) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="เปิดเมนู"
          className="fixed top-12 right-3 z-40 lg:hidden
                     bg-white dark:bg-[#0F1620] border border-[#E2E8F0] dark:border-[#1F2937]
                     rounded-xl shadow-md p-2.5 flex items-center gap-1.5"
        >
          <Menu size={18} className="text-[#334155] dark:text-[#CBD5E1]" />
        </button>
      )}
    </>
  );
}
