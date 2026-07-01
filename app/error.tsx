"use client";

import { useEffect } from "react";
import { ServerCrash, RotateCcw } from "lucide-react";

export default function Error({
  error, reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // log ไว้ใน console ของ browser เพื่อ debug — ไม่ส่งออกไปไหน
    console.error("Unhandled page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-5">
        <ServerCrash size={28} />
      </div>
      <h2 className="text-[18px] font-800 text-[#0D1117] mb-2">เกิดข้อผิดพลาดบางอย่าง</h2>
      <p className="text-[13.5px] text-[#64748B] max-w-sm mb-1">
        หน้านี้โหลดไม่สำเร็จ มักเกิดจาก backend (FastAPI) ไม่ได้ทำงาน หรือเชื่อมต่อ API ไม่ได้
      </p>
      {error.message && (
        <p className="text-[11.5px] text-[#CBD5E1] mb-6 font-mono max-w-md break-all">{error.message}</p>
      )}
      <button
        onClick={reset}
        className="flex items-center gap-2 bg-[#0057FF] text-white rounded-xl px-5 py-2.5 text-[13.5px] font-600 hover:bg-[#0046CC] transition-colors"
      >
        <RotateCcw size={14} /> ลองใหม่อีกครั้ง
      </button>
    </div>
  );
}
