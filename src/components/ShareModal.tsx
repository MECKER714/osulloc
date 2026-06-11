/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, MessageCircle, Facebook, Clipboard, Check } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
    } catch (e) {
      // fallback
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-300">
      <div 
        className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl transform scale-100 transition-transform duration-300 text-center border border-[#004b41]/10"
      >
        {/* Header */}
        <h3 className="font-display text-2xl font-bold text-[#00322b] mb-2">
          공유하기
        </h3>
        <p className="text-stone-500 font-body text-sm mb-8">
          제주의 아름다운 순간을 전달하세요
        </p>

        {/* Sharing options grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {/* KakaoTalk */}
          <div className="flex flex-col items-center gap-2 cursor-pointer group">
            <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-yellow-900 group-hover:scale-110 transition-transform duration-200">
              <MessageCircle className="w-6 h-6 fill-current text-yellow-950" />
            </div>
            <span className="text-[11px] font-semibold text-stone-600 font-body">카카오톡</span>
          </div>

          {/* Facebook */}
          <div className="flex flex-col items-center gap-2 cursor-pointer group">
            <div className="w-12 h-12 bg-[#1877F2] rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
              <Facebook className="w-6 h-6 fill-current" />
            </div>
            <span className="text-[11px] font-semibold text-stone-600 font-body">페이스북</span>
          </div>

          {/* X */}
          <div className="flex flex-col items-center gap-2 cursor-pointer group">
            <div className="w-12 h-12 bg-stone-900 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
              <span className="font-display text-lg font-black italic">X</span>
            </div>
            <span className="text-[11px] font-semibold text-stone-600 font-body">X</span>
          </div>

          {/* Link Copy */}
          <div onClick={handleCopyLink} className="flex flex-col items-center gap-2 cursor-pointer group">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#004b41] group-hover:scale-110 transition-transform duration-200">
              {copied ? <Check className="w-6 h-6 text-emerald-600" /> : <Clipboard className="w-6 h-6" />}
            </div>
            <span className="text-[11px] font-semibold text-stone-600 font-body">URL 복사</span>
          </div>
        </div>

        {/* Clipboard Success message */}
        <div
          id="copy-success"
          className={`bg-emerald-50 text-emerald-800 border border-emerald-200/50 py-2 px-4 rounded-full text-xs font-semibold inline-block transition-opacity duration-300 ${
            copied ? "opacity-100" : "opacity-0"
          }`}
        >
          링크가 복사되었습니다!
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full mt-6 border border-stone-200 hover:bg-stone-50 py-3 rounded-full text-stone-700 font-bold text-xs transition-colors cursor-pointer"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
