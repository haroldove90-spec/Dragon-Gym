import React from 'react';
import { ShieldAlert, Dumbbell, Crown, Laptop, User, Download, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeSelectorProps {
  onSelectRole: (role: 'client' | 'staff' | 'admin') => void;
  onInstallClick: () => void;
  isInstalled: boolean;
}

export default function HomeSelector({ onSelectRole, onInstallClick, isInstalled }: HomeSelectorProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505] px-6 py-8 relative overflow-y-auto overflow-x-hidden">
      {/* Background premium glows */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full bg-[#7A724E]/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-150px] right-[-100px] w-[350px] h-[350px] rounded-full bg-[#7A724E]/5 blur-[150px] pointer-events-none"></div>

      {/* Responsive Content Wrapper */}
      <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col justify-start gap-6 z-10">
        
        {/* Top Brand Logo / Aesthetic */}
        <div className="flex flex-col items-center pt-2 gap-2">
          <img 
            src="https://appdesignproyectos.com/dragongymlogo.png" 
            alt="Dragon Gym Logo" 
            className="h-16 md:h-20 object-contain select-none"
            referrerPolicy="no-referrer"
          />
          <p className="text-[9px] text-neutral-400 tracking-[0.3em] uppercase font-mono mt-1 text-center">
            ELITE PERFORMANCE, RECOVERY & ADMINISTRATION
          </p>
        </div>

        {/* PWA Install Banner */}
        {!isInstalled && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2.5"
          >
            {/* The Card */}
            <div className="bg-gradient-to-r from-neutral-950 to-[#111] border border-[#7A724E]/25 rounded-[24px] p-4 flex items-center gap-3.5 shadow-[0_8px_30px_rgba(122,114,78,0.03)]">
              <div className="w-10 h-10 rounded-xl bg-[#7A724E]/10 flex items-center justify-center text-[#7A724E] shrink-0 border border-[#7A724E]/20">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Aplicación Dragon Gym
                  <span className="text-[7px] font-bold px-1.5 py-0.5 rounded bg-[#7A724E] text-black font-mono uppercase tracking-wider">PWA</span>
                </h4>
                <p className="text-[10px] text-neutral-400 mt-0.5">Instala la app en tu pantalla de inicio móvil para un acceso rápido.</p>
              </div>
            </div>
            
            {/* Install Button below the card */}
            <button 
              onClick={onInstallClick}
              className="w-full bg-[#7A724E] hover:bg-[#91875d] text-black text-xs font-extrabold uppercase tracking-widest py-3 rounded-xl transition-all active:scale-95 cursor-pointer shadow-[0_4px_12px_rgba(122,114,78,0.25)] flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Instalar Aplicación</span>
            </button>
          </motion.div>
        )}

        {/* Center Image Banner resembling the middle phone screen */}
        <div className="relative group">
          <div className="relative h-[200px] md:h-[240px] rounded-[32px] overflow-hidden border border-[#222] shadow-2xl bg-[#111]">
            {/* Gym Athlete Background Image */}
            <img 
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800" 
              alt="Gym Athlete" 
              className="w-full h-full object-cover object-center opacity-60 filter contrast-125 saturate-50 transition-all duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Dark Premium Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
            
            {/* Subtle Accent Ambient Filter */}
            <div className="absolute inset-0 bg-[#7A724E]/5 mix-blend-color"></div>

            {/* Floating Badge */}
            <div className="absolute top-3 xs:top-4 right-3 xs:right-4 bg-[#7A724E] text-black text-[7px] xs:text-[8px] font-black uppercase tracking-widest px-2 xs:px-2.5 py-0.5 xs:py-1 rounded-full shadow-[0_4px_12px_rgba(122,114,78,0.3)] font-mono">
              SISTEMA INTEGRADO 2026
            </div>

            {/* Overlaid message */}
            <div className="absolute bottom-3 xs:bottom-4 left-3 xs:left-4 right-3 xs:right-4 bg-[#7A724E] text-black p-3 xs:p-4 rounded-[16px] xs:rounded-[20px] shadow-lg">
              <h4 className="text-[10px] xs:text-[12px] font-black uppercase tracking-wider text-black font-display">
                MÁXIMA EFICIENCIA OPERATIVA
              </h4>
              <p className="text-[9px] xs:text-[10px] md:text-xs text-black/80 mt-1 leading-snug font-serif italic">
                "Control financiero global, gestión ágil de caja en recepción, y acceso seguro por QR para todos nuestros atletas."
              </p>
            </div>
          </div>
        </div>

        {/* Role Selection Block - "los roles por separado" with Icons */}
        <div className="flex flex-col gap-4">
          <div className="text-center mb-1">
            <h3 className="text-xs text-neutral-400 uppercase tracking-[0.2em] font-mono">
              SELECCIONA TU ROL DE ACCESO
            </h3>
            <p className="text-[11px] text-neutral-500">Toca uno de los portales para iniciar operaciones</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* SuperAdmin Access Card */}
            <motion.button
              id="btn-access-admin"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectRole('admin')}
              className="flex flex-col justify-between p-5 rounded-[24px] bg-[#111111] border border-[#222] hover:border-[#7A724E]/50 transition-all duration-300 text-left group cursor-pointer shadow-lg relative overflow-hidden h-[180px]"
            >
              <div className="absolute top-0 right-0 w-[80px] h-[80px] rounded-bl-full bg-[#7A724E]/5 group-hover:bg-[#7A724E]/10 transition-all"></div>
              
              <div className="w-12 h-12 rounded-2xl bg-[#7A724E]/15 flex items-center justify-center text-[#7A724E] border border-[#7A724E]/35 group-hover:bg-[#7A724E] group-hover:text-black transition-all duration-300">
                <Crown className="w-6 h-6" />
              </div>
              
              <div className="mt-4">
                <span className="text-[9px] text-[#7A724E] font-bold tracking-widest uppercase font-mono block">
                  C-SUITE / PROPIETARIO
                </span>
                <h4 className="text-sm font-black text-white tracking-wide group-hover:text-[#7A724E] transition-all">
                  SuperAdmin
                </h4>
                <p className="text-[10px] text-neutral-400 mt-1 leading-snug">
                  Métricas globales, caja mayor, planes y staff.
                </p>
              </div>
            </motion.button>

            {/* Staff / Reception Access Card */}
            <motion.button
              id="btn-access-staff"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectRole('staff')}
              className="flex flex-col justify-between p-5 rounded-[24px] bg-[#111111] border border-[#222] hover:border-[#7A724E]/50 transition-all duration-300 text-left group cursor-pointer shadow-lg relative overflow-hidden h-[180px]"
            >
              <div className="absolute top-0 right-0 w-[80px] h-[80px] rounded-bl-full bg-[#7A724E]/5 group-hover:bg-[#7A724E]/10 transition-all"></div>
              
              <div className="w-12 h-12 rounded-2xl bg-[#7A724E]/10 flex items-center justify-center text-[#7A724E] border border-[#7A724E]/20 group-hover:bg-[#7A724E] group-hover:text-black transition-all duration-300">
                <Laptop className="w-6 h-6" />
              </div>
              
              <div className="mt-4">
                <span className="text-[9px] text-neutral-400 font-bold tracking-widest uppercase font-mono block">
                  MOSTRADOR / TABLET
                </span>
                <h4 className="text-sm font-black text-white tracking-wide group-hover:text-[#7A724E] transition-all">
                  Staff / Recepción
                </h4>
                <p className="text-[10px] text-neutral-400 mt-1 leading-snug">
                  Check-in con QR, registro de socios, cobros inmediatos.
                </p>
              </div>
            </motion.button>

            {/* Client Access Card */}
            <motion.button
              id="btn-access-client"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectRole('client')}
              className="flex flex-col justify-between p-5 rounded-[24px] bg-[#111111] border border-[#222] hover:border-[#7A724E]/50 transition-all duration-300 text-left group cursor-pointer shadow-lg relative overflow-hidden h-[180px]"
            >
              <div className="absolute top-0 right-0 w-[80px] h-[80px] rounded-bl-full bg-[#7A724E]/5 group-hover:bg-[#7A724E]/10 transition-all"></div>
              
              <div className="w-12 h-12 rounded-2xl bg-[#7A724E]/10 flex items-center justify-center text-neutral-400 border border-neutral-800 group-hover:bg-[#7A724E] group-hover:text-black transition-all duration-300">
                <User className="w-6 h-6" />
              </div>
              
              <div className="mt-4">
                <span className="text-[9px] text-neutral-400 font-bold tracking-widest uppercase font-mono block">
                  APLICACIÓN PWA SOCIO
                </span>
                <h4 className="text-sm font-black text-white tracking-wide group-hover:text-[#7A724E] transition-all">
                  Socio / Cliente
                </h4>
                <p className="text-[10px] text-neutral-400 mt-1 leading-snug">
                  Credencial QR, estatus de plan, rutinas y recibos.
                </p>
              </div>
            </motion.button>

          </div>
        </div>

        {/* Footer Details */}
        <div className="flex items-center justify-between text-[9px] text-[#444] uppercase font-mono mt-auto pt-4 border-t border-[#222]">
          <span>Dragon Gym Core Infrastructure</span>
          <span>● ST_ONLINE</span>
        </div>

      </div>
    </div>
  );
}
