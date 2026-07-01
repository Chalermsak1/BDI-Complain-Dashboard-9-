"use client";

import { useEffect, useState } from "react";
import { Radio } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface RecentItem {
  cid: string;
  text: string;
  district: string;
  category: string;
  received: string;
}

export default function Ticker() {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${API}/recent?limit=8`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setItems(data);
      } catch {
        // เงียบไว้ — ไม่ให้ ticker ทำหน้าเว็บพังถ้า API ล้ม
      }
    }

    load();
    const interval = setInterval(load, 15000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  if (items.length === 0) return null;

  // วน items 2 รอบเพื่อให้ scroll วนต่อกันได้แบบไม่มีช่องว่าง
  const looped = [...items, ...items];

  return (
    <div className="bg-[#0D1117] text-white overflow-hidden h-9 flex items-center shrink-0 border-b border-black/20">
      <div className="flex items-center gap-1.5 bg-[#0057FF] h-full px-3 text-[11px] font-700 uppercase tracking-wider shrink-0">
        <Radio size={12} className="animate-pulse" /> Live
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="flex gap-10 whitespace-nowrap animate-ticker">
          {looped.map((item, i) => (
            <span key={`${item.cid}-${i}`} className="text-[12.5px] text-[#CBD5E1] inline-flex items-center gap-2">
              <span className="text-[#94A3B8]">#{item.cid}</span>
              <span className="text-white">{item.text}</span>
              <span className="text-[#64748B]">· {item.district}</span>
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
          padding-left: 1.5rem;
        }
      `}</style>
    </div>
  );
}
