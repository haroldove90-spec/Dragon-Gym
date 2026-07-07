import React from 'react';
import { User, ShieldAlert, Dumbbell, Calendar, BarChart3, Settings, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeSelectorProps {
  onSelectRole: (role: 'client' | 'admin') => void;
}

export default function HomeSelector({ onSelectRole }: HomeSelectorProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505] px-6 py-8 relative overflow-y-auto overflow-x-hidden">
      {/* Background premium glows */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full bg-[#ccff00]/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-150px] right-[-100px] w-[350px] h-[350px] rounded-full bg-[#ccff00]/5 blur-[150px] pointer-events-none"></div>

      {/* Responsive Content Wrapper */}
      <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col justify-between gap-8 z-10">
        
        {/* Top Brand Logo / Aesthetic */}
        <div className="flex flex-col items-center pt-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ccff00] flex items-center justify-center shadow-[0_0_15px_rgba(204,255,0,0.4)] animate-pulse">
              <Dumbbell className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black uppercase tracking-[0.15em] text-white">
              IRON <span className="text-[#ccff00]">HAVEN</span>
            </span>
          </div>
          <p className="text-[9px] text-neutral-400 tracking-[0.3em] uppercase font-mono mt-1.5">
            ELITE PERFORMANCE & RECOVERY
          </p>
        </div>

        {/* Center Image Banner resembling the middle phone screen */}
        <div className="relative group">
          <div className="relative h-[260px] md:h-[300px] rounded-[32px] overflow-hidden border border-[#222] shadow-2xl bg-[#111]">
            {/* Gym Athlete Background Image */}
            <img 
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600" 
              alt="Gym Athlete" 
              className="w-full h-full object-cover object-center opacity-60 filter contrast-125 saturate-50 transition-all duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Dark Premium Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
            
            {/* Subtle Accent Ambient Filter */}
            <div className="absolute inset-0 bg-[#ccff00]/5 mix-blend-color"></div>

            {/* Floating Badge */}
            <div className="absolute top-4 right-4 bg-[#ccff00] text-black text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-[0_4px_12px_rgba(204,255,0,0.3)] font-mono">
              LIVE 2026
            </div>

            {/* Overlaid message inside a custom container matching the middle phone's popup block */}
            <div className="absolute bottom-4 left-4 right-4 bg-[#ccff00] text-black p-4 rounded-[20px] shadow-lg">
              <h4 className="text-[12px] font-black uppercase tracking-wider text-black font-display">
                TRANSFORMA TU CUERPO
              </h4>
              <p className="text-[10px] md:text-xs text-black/80 mt-1 leading-snug font-serif italic">
                "Accede a rutinas exclusivas, controla tus marcas y reserva clases con instructores certificados."
              </p>
            </div>
          </div>
        </div>

        {/* Role Selection Block - "los roles por separado" with Icons */}
        <div className="flex flex-col gap-4">
          <div className="text-center mb-1">
            <h3 className="text-xs text-neutral-400 uppercase tracking-[0.2em] font-mono">
              SELECCIONA TU ROL
            </h3>
            <p className="text-[11px] text-neutral-500">Toca un portal para iniciar sesión</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Client Access Card */}
            <motion.button
              id="btn-access-client"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectRole('client')}
              className="flex items-center justify-between p-4 rounded-[24px] bg-[#111111] border border-[#222] hover:border-[#ccff00]/50 transition-all duration-300 text-left group cursor-pointer shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#ccff00]/10 flex items-center justify-center text-[#ccff00] border border-[#ccff00]/20 group-hover:bg-[#ccff00] group-hover:text-black group-hover:shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all duration-300">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-[#ccff00] font-bold tracking-widest uppercase font-mono block">
                    PORTAL DE ATLETAS
                  </span>
                  <h4 className="text-sm font-bold text-white tracking-wide group-hover:text-[#ccff00] transition-all">
                    Ingresar como Cliente
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5 italic font-serif line-clamp-1">
                    Entrenar, peso y reservar clases
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#1e1e1e] flex items-center justify-center group-hover:bg-[#ccff00]/10 group-hover:translate-x-1 transition-all duration-300 shrink-0">
                <span className="text-[#ccff00] font-bold text-sm">→</span>
              </div>
            </motion.button>

            {/* Admin Access Card */}
            <motion.button
              id="btn-access-admin"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectRole('admin')}
              className="flex items-center justify-between p-4 rounded-[24px] bg-[#111111] border border-[#222] hover:border-[#ccff00]/50 transition-all duration-300 text-left group cursor-pointer shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#ccff00]/5 flex items-center justify-center text-white border border-[#444] group-hover:bg-[#ccff00] group-hover:text-black group-hover:shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all duration-300">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 font-bold tracking-widest uppercase font-mono block">
                    CONSOLA DE CONTROL
                  </span>
                  <h4 className="text-sm font-bold text-white tracking-wide group-hover:text-[#ccff00] transition-all">
                    Ingresar como Admin
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5 italic font-serif line-clamp-1">
                    Gestión de socios, clases e informes
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#1e1e1e] flex items-center justify-center group-hover:bg-[#ccff00]/10 group-hover:translate-x-1 transition-all duration-300 shrink-0">
                <span className="text-[#ccff00] font-bold text-sm">→</span>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Footer Details */}
        <div className="flex items-center justify-between text-[9px] text-[#444] uppercase font-mono pt-3 border-t border-[#222]">
          <span>Iron Haven Infrastructure</span>
          <span>● ST_ONLINE</span>
        </div>

      </div>
    </div>
  );
}
