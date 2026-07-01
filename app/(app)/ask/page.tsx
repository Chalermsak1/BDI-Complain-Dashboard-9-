"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2, Bot, User, Info } from "lucide-react";
import SectionHeader from "@/components/section-header";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface Msg {
  role: "user" | "ai";
  text: string;
  mode?: "ai" | "fallback";
}

const SUGGESTIONS = [
  "เขตไหนมีคำร้องเรียนมากที่สุด",
  "ประเภทคำร้องที่พบบ่อยที่สุดคืออะไร",
  "ฝ่ายไหนใช้เวลาดำเนินการนานที่สุด",
  "สรุปภาพรวมคำร้องทั้งหมดให้ฟัง",
];

export default function AskPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(question: string) {
    if (!question.trim() || loading) return;
    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail ?? `HTTP ${res.status}`);
      setMessages((m) => [...m, { role: "ai", text: data.answer, mode: data.mode }]);
    } catch (err) {
      setMessages((m) => [...m, {
        role: "ai",
        text: err instanceof Error ? `เกิดข้อผิดพลาด: ${err.message}` : "เชื่อมต่อ API ไม่ได้",
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <SectionHeader icon={<Sparkles />} title="ถามตอบกับข้อมูล (AI)" badge="BETA" />

      <div className="flex-1 overflow-y-auto bg-white border border-[#E2E8F0] rounded-2xl p-5 mb-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <Bot size={32} className="text-[#CBD5E1] mb-3" />
            <p className="text-[14px] text-[#64748B] mb-4">ลองถามคำถามเกี่ยวกับข้อมูลคำร้องเรียนได้เลย</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[12.5px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-full px-3.5 py-1.5 text-[#334155] hover:bg-[#EFF6FF] hover:text-[#0057FF] hover:border-[#0057FF]/30 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "ai" && (
              <div className="w-8 h-8 rounded-full bg-[#0057FF] flex items-center justify-center shrink-0">
                <Bot size={15} className="text-white" />
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-[13.5px] whitespace-pre-line leading-relaxed ${
              m.role === "user" ? "bg-[#0057FF] text-white" : "bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0]"
            }`}>
              {m.text}
              {m.mode === "fallback" && (
                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-[#E2E8F0] text-[11px] text-[#94A3B8]">
                  <Info size={11} /> ตอบแบบสรุปสถิติ (ยังไม่ได้เชื่อม AI จริง)
                </div>
              )}
            </div>
            {m.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-[#334155] flex items-center justify-center shrink-0">
                <User size={15} className="text-white" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0057FF] flex items-center justify-center shrink-0">
              <Bot size={15} className="text-white" />
            </div>
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-3 flex items-center gap-2 text-[13px] text-[#94A3B8]">
              <Loader2 size={14} className="animate-spin" /> กำลังวิเคราะห์...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="flex gap-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="พิมพ์คำถามเกี่ยวกับข้อมูลคำร้อง..."
          className="flex-1 border border-[#E2E8F0] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0057FF]/30 focus:border-[#0057FF]"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex items-center gap-2 bg-[#0057FF] text-white rounded-xl px-5 py-3 text-[14px] font-600 hover:bg-[#0046CC] transition-colors disabled:opacity-50"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
