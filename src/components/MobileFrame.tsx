import React from 'react';
import { ShieldAlert, Dumbbell, ArrowLeft } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  activeRole: 'home' | 'client' | 'staff' | 'admin';
  onNavigateHome: () => void;
}

export default function MobileFrame({ children, activeRole, onNavigateHome }: MobileFrameProps) {
  return (
    <div className="w-full min-h-screen bg-[#000000] flex flex-col relative">
      
      {/* Header quick navigation indicator (If not on Selector Home screen) */}
      {activeRole !== 'home' && (
        <div className="h-14 bg-[#050505] px-4 flex items-center justify-between border-b border-[#111] shrink-0 z-30 gap-2">
          {/* Left Side: Logo + Title */}
          <div className="flex items-center gap-2 min-w-0">
            <img 
              src="https://appdesignproyectos.com/dragongymlogo.png" 
              alt="Dragon Gym" 
              className="h-6 xs:h-7 object-contain select-none shrink-0"
              referrerPolicy="no-referrer"
            />
            <span className="text-xs xs:text-sm font-black tracking-wider text-white uppercase truncate font-sans">
              Dragon GYM
            </span>
          </div>
          
          {/* Right Side: Role Badge + Back Button */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-[9px] text-neutral-400 uppercase font-mono font-bold">
              {activeRole === 'client' ? (
                <span className="bg-[#7A724E]/10 border border-[#7A724E]/30 text-[#7A724E] px-1.5 xs:px-2 py-0.5 rounded-md text-[8px] font-bold">Atleta</span>
              ) : activeRole === 'staff' ? (
                <span className="bg-[#7A724E]/10 border border-[#7A724E]/30 text-[#7A724E] px-1.5 xs:px-2 py-0.5 rounded-md text-[8px] font-bold">Staff</span>
              ) : (
                <span className="bg-red-500/10 border border-red-500/30 text-red-400 px-1.5 xs:px-2 py-0.5 rounded-md text-[8px] font-bold">Admin</span>
              )}
            </div>

            <button 
              id={`btn-back-role-${activeRole}`}
              onClick={onNavigateHome}
              className="flex items-center gap-1 text-[10px] xs:text-xs font-semibold text-[#7A724E] hover:text-[#91875d] transition-all py-1.5 px-2 xs:px-2.5 rounded-lg bg-white/5 active:scale-95 cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Cerrar Sesión</span>
              <span className="xs:hidden">Salir</span>
            </button>
          </div>
        </div>
      )}

      {/* Screen Body */}
      <div className="flex-1 overflow-hidden relative bg-[#050505] text-[#e0e0e0] flex flex-col">
        {children}
      </div>
    </div>
  );
}
