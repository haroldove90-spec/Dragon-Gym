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
        <div className="h-14 bg-[#050505] px-6 flex items-center justify-between border-b border-[#111] shrink-0 z-30">
          <button 
            id={`btn-back-role-${activeRole}`}
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#ccff00] hover:text-[#dfff54] transition-all py-1.5 px-3 rounded-lg bg-white/5 active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
          
          <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 uppercase tracking-widest font-mono font-bold">
            {activeRole === 'client' ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse"></span>
                <Dumbbell className="w-3.5 h-3.5 text-[#ccff00]" />
                <span>Portal Atleta</span>
              </>
            ) : activeRole === 'staff' ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse"></span>
                <ShieldAlert className="w-3.5 h-3.5 text-[#ccff00]" />
                <span>Recepción Staff</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse"></span>
                <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                <span>SuperAdmin</span>
              </>
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
