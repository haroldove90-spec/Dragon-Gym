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
          <button 
            id={`btn-back-role-${activeRole}`}
            onClick={onNavigateHome}
            className="flex items-center gap-1 text-xs font-semibold text-[#ccff00] hover:text-[#dfff54] transition-all py-1.5 px-2.5 rounded-lg bg-white/5 active:scale-95 cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Cerrar Sesión</span>
            <span className="xs:hidden">Salir</span>
          </button>
          
          <div className="flex-1 flex items-center justify-center">
            <img 
              src="https://appdesignproyectos.com/dragongymlogo.png" 
              alt="Dragon Gym" 
              className="h-6 md:h-7 object-contain max-w-[120px] select-none"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="flex items-center gap-1 text-[9px] text-neutral-400 uppercase tracking-wider font-mono font-bold shrink-0">
            {activeRole === 'client' ? (
              <span className="bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] px-2 py-0.5 rounded-md text-[8px] font-bold">Atleta</span>
            ) : activeRole === 'staff' ? (
              <span className="bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] px-2 py-0.5 rounded-md text-[8px] font-bold">Staff</span>
            ) : (
              <span className="bg-red-500/10 border border-red-500/30 text-red-400 px-2 py-0.5 rounded-md text-[8px] font-bold">Admin</span>
            )}
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
