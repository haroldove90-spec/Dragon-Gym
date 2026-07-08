import React, { useState } from 'react';
import { 
  QrCode, Calendar, Bell, CreditCard, User, Dumbbell, Sparkles, 
  CheckCircle2, AlertCircle, Smartphone, Sun, Users, Receipt, ShieldCheck,
  Video, Play, Trophy, Flame, TrendingUp, Check, ExternalLink, RefreshCw
} from 'lucide-react';
import { Client, GymClass, Announcement, Plan, Payment, WorkoutRoutine, QrAccess } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ClientRoleProps {
  clients: Client[];
  classes: GymClass[];
  announcements: Announcement[];
  bookings: { classId: string; date: string }[];
  plans: Plan[];
  payments: Payment[];
  onBookClass: (classId: string) => void;
  onCancelBooking: (classId: string) => void;
  onAddWeightRecord: (clientId: string, weight: number, date: string) => void;
  onCompleteWorkout: (clientId: string) => void;
  activeClientId: string;
  onChangeClient: (id: string) => void;
  routines: WorkoutRoutine[];
  qrAccesses: QrAccess[];
}

type ClientTab = 'credencial' | 'membresia' | 'sesiones' | 'rutinas' | 'avisos' | 'perfil';

export default function ClientRole({
  clients,
  classes,
  announcements,
  bookings,
  plans,
  payments,
  onBookClass,
  onCancelBooking,
  onAddWeightRecord,
  onCompleteWorkout,
  activeClientId,
  onChangeClient,
  routines,
  qrAccesses
}: ClientRoleProps) {
  const [activeTab, setActiveTab] = useState<ClientTab>('credencial');
  
  // High Visibility screen simulation state
  const [highVisibility, setHighVisibility] = useState(false);

  // Find current logged-in client
  const client = clients.find(c => c.id === activeClientId) || clients[0];

  // Expiration helper logic
  const getDaysRemaining = (expDateStr: string) => {
    const exp = new Date(expDateStr);
    const today = new Date('2026-07-06'); // Reference app date
    const diffTime = exp.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = getDaysRemaining(client.expirationDate);
  const isExpired = daysRemaining < 0 || client.status === 'Inactivo';

  // Find current plan details
  const currentPlan = plans.find(p => p.id === client.planId);

  // Find generated QR code for this client
  const clientQr = qrAccesses.find(q => q.clientId === client.id);

  // Filter receipts for this client
  const clientPayments = payments.filter(p => p.clientId === client.id);

  // Simulated contracted plans history
  const contractedHistory = [
    { name: currentPlan?.name || 'Membresía Activa', date: client.joinDate, price: currentPlan?.price || 50, status: 'Vigente' },
    ...(client.id === '1' ? [
      { name: 'Pase del Día', date: '2025-11-10', price: 10, status: 'Vencido' },
      { name: 'Mensual', date: '2025-12-01', price: 50, status: 'Vencido' }
    ] : [])
  ];

  return (
    <div className={`flex flex-col h-full text-gray-100 relative overflow-hidden transition-all duration-500 ${
      highVisibility ? 'bg-[#111]' : 'bg-[#050505]'
    }`}>
      
      {/* High Visibility Simulation Screen Overlay */}
      <AnimatePresence>
        {highVisibility && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setHighVisibility(false)}
            className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="absolute top-4 right-4 text-xs font-mono text-neutral-500">Toca en cualquier parte para cerrar</div>
            
            <div className="bg-white text-black p-8 rounded-[36px] shadow-[0_0_50px_rgba(255,255,255,0.4)] flex flex-col items-center max-w-xs w-full animate-scale-up">
              <span className="text-[9px] font-mono font-black tracking-widest text-[#555] uppercase mb-4">
                BRILLO AL MÁXIMO ACTIVADO
              </span>
              
              {/* High visibility glowing QR */}
              <div className="bg-white p-3 rounded-2xl border-4 border-black mb-4">
                <div className="w-48 h-48 bg-neutral-100 flex items-center justify-center relative">
                  {/* Mock high contrast QR */}
                  <div className="absolute inset-0 p-4 flex flex-wrap content-between justify-between">
                    {[...Array(36)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-5 h-5 ${
                          (i % 2 === 0 && i % 3 === 0) || i < 6 || i % 7 === 0 || i > 30 ? 'bg-black' : 'bg-transparent'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <div className="bg-white p-1 rounded z-10">
                    <Dumbbell className="w-6 h-6 text-black" strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-black uppercase tracking-tight text-black">{client.name}</h3>
              <p className="text-[10px] font-mono text-neutral-500 mt-1">Socio ID: #{client.id}</p>
              
              <div className="mt-5 bg-[#7A724E] text-black text-[10px] font-black uppercase py-1.5 px-4 rounded-full tracking-wider">
                LISTO PARA ESCANEAR
              </div>
            </div>
            
            <button 
              onClick={() => setHighVisibility(false)}
              className="mt-6 text-xs text-[#7A724E] border border-[#7A724E]/40 bg-[#7A724E]/5 py-2 px-5 rounded-full hover:bg-[#7A724E] hover:text-black transition-all cursor-pointer"
            >
              Cerrar Modo Escáner
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Profile Selection Dropdown for Testing / Demo */}
      <div className="bg-[#111] px-4 py-2 border-b border-[#222] shrink-0 z-10">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">Demo: Cuenta de Socio</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-[#7A724E] font-mono font-bold">Cambiar Socio:</span>
            <select
              value={activeClientId}
              onChange={(e) => onChangeClient(e.target.value)}
              className="bg-black border border-[#333] text-[10px] text-white py-0.5 px-1.5 rounded outline-none font-mono"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name.split(' ')[0]} ({c.status})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Dynamic Header */}
      <div className="px-6 pt-4 pb-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={client.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover border border-[#222]" />
            <div>
              <span className="text-[9px] font-mono text-[#7A724E] uppercase tracking-widest font-bold">Bienvenido de vuelta</span>
              <h3 className="text-sm font-black text-white tracking-tight">{client.name}</h3>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${isExpired ? 'bg-red-500 animate-pulse' : 'bg-[#7A724E] animate-pulse'}`}></div>
        </div>
      </div>

      {/* Tab Contents Area */}
      <div className="flex-1 overflow-y-auto scrollbar-none pb-20">
        <div className="px-6 py-2 space-y-5">

          {/* TAB 1: CRENDENCIAL (QR CODE) */}
          {activeTab === 'credencial' && (
            <div className="space-y-4 text-center animate-fade-in py-2">
              
              {/* QR Holder Card */}
              <div className="bg-[#111] border border-[#222] rounded-[36px] p-6 max-w-sm mx-auto shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[120px] h-[120px] rounded-bl-full bg-[#7A724E]/5 pointer-events-none"></div>
                
                <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block mb-4">
                  Credencial Digital de Acceso
                </span>

                {/* Main QR Code container with micro-interactions */}
                <div 
                  onClick={() => setHighVisibility(true)}
                  className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl inline-block relative cursor-pointer group hover:border-[#7A724E]/40 transition-all duration-300"
                  title="Tocar para ampliar brillo"
                >
                  <div className="bg-white p-3.5 rounded-2xl inline-block shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    <div className="w-36 h-36 relative flex items-center justify-center bg-white">
                      {/* Generar QR con ID */}
                      <div className="absolute inset-0 p-2.5 flex flex-wrap content-between justify-between">
                        {[...Array(25)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-4 h-4 ${
                              (i % 2 === 0 && i % 3 === 0) || i < 4 || i % 5 === 0 || i > 20 ? 'bg-black' : 'bg-transparent'
                            }`}
                          ></div>
                        ))}
                      </div>
                      <div className="bg-white p-1 rounded z-10 shadow border border-neutral-100">
                        <Dumbbell className="w-5 h-5 text-black" strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>

                  {/* Absolute click indicator button */}
                  <div className="absolute bottom-2 inset-x-0 mx-auto w-max bg-black/80 text-[8px] font-mono text-[#7A724E] uppercase tracking-widest py-1 px-3 rounded-full flex items-center gap-1.5 opacity-85 group-hover:opacity-100 transition-opacity">
                    <Sun className="w-2.5 h-2.5 animate-spin" />
                    <span>Tocar para Brillo Escáner</span>
                  </div>
                </div>

                <div className="mt-5 space-y-1.5">
                  <span className="text-[10px] text-[#7A724E] font-mono font-bold uppercase tracking-wider bg-[#7A724E]/10 py-0.5 px-2 rounded-full inline-block">
                    {clientQr ? `Código QR Sincronizado: ${clientQr.code}` : `Código Temporal: DG-${client.name.split(' ')[0].toUpperCase()}-TEMP`}
                  </span>
                  <h4 className="text-sm font-bold text-white tracking-wide uppercase">
                    {clientQr ? 'Pase de Acceso Generado' : 'Socio Activo Dragon Gym'}
                  </h4>
                  {clientQr && (
                    <p className="text-[11px] text-neutral-400 font-mono">
                      Horario: {clientQr.schedule}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Alert Summary / Sync Badge */}
              <div className={`p-4 rounded-2xl max-w-sm mx-auto flex items-center gap-3 border text-left ${
                isExpired 
                  ? 'bg-red-950/20 border-red-900/40 text-red-400' 
                  : (clientQr && clientQr.status === 'Suspendido')
                    ? 'bg-amber-950/20 border-amber-900/40 text-amber-400'
                    : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400'
              }`}>
                {isExpired ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                    <div className="text-xs">
                      <strong className="text-white block uppercase font-black">Acceso Bloqueado</strong>
                      Tu membresía ha vencido. Por favor, acude a recepción para renovar tu plan.
                    </div>
                  </>
                ) : (clientQr && clientQr.status === 'Suspendido') ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    <div className="text-xs">
                      <strong className="text-white block uppercase font-black">Pase Suspendido temporalmente</strong>
                      El administrador ha desactivado tu acceso. Consulta en recepción.
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-pulse" />
                    <div className="text-xs">
                      <strong className="text-white block uppercase font-black">
                        {clientQr ? '¡Pase de Acceso Activo!' : 'Membresía Vigente'}
                      </strong>
                      {clientQr 
                        ? `Tu pase QR fue emitido por el Admin. Escanéalo para entrar.` 
                        : 'Aproxima tu QR al lector de la recepción al ingresar para registrar tu check-in.'}
                    </div>
                  </>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: MEMBERSHIP & ESTATUS */}
          {activeTab === 'membresia' && (
            <div className="space-y-4 animate-fade-in">
              
              {/* Membership Main Panel */}
              <div className="bg-[#111] border border-[#222] rounded-[28px] p-5 shadow-lg relative overflow-hidden">
                <span className="text-[8px] font-mono text-[#7A724E] uppercase tracking-widest block mb-2 font-bold">ESTADO DE MEMBRESÍA</span>
                
                <h3 className="text-lg font-black text-white">{currentPlan?.name || 'Membresía Plan'}</h3>
                
                <div className="mt-4 flex items-center gap-5">
                  {/* Visual progress wheel */}
                  <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                    <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-neutral-800"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={isExpired ? 'text-red-500' : 'text-[#7A724E]'}
                        strokeDasharray={`${Math.max(0, Math.min(100, (daysRemaining / Math.max(1, currentPlan?.durationDays || 30)) * 100))}, 100`}
                        strokeWidth="3"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="text-center z-10">
                      <span className="text-lg font-black text-white font-mono leading-none">
                        {Math.max(0, daysRemaining)}
                      </span>
                      <span className="text-[7px] text-neutral-400 font-mono uppercase block">Días</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <p className="text-xs text-neutral-300">
                      Tu plan actual tiene <strong className="text-white font-bold">{daysRemaining > 0 ? `${daysRemaining} días` : '0 días'}</strong> de validez restantes.
                    </p>
                    <div className="text-[11px] text-neutral-400 font-mono">
                      Próximo Pago: <span className={isExpired ? 'text-red-400 font-bold' : 'text-[#7A724E] font-bold'}>{client.expirationDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contraction History */}
              <div className="bg-[#111] border border-[#222] rounded-[28px] p-5 shadow-lg">
                <h4 className="text-xs text-neutral-400 uppercase tracking-wider font-mono mb-3">HISTORIAL DE CONTRATACIÓN</h4>
                
                <div className="space-y-2">
                  {contractedHistory.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2.5 rounded-xl bg-[#050505] border border-[#1e1e1e]">
                      <div>
                        <span className="text-xs font-bold text-white block">{item.name}</span>
                        <span className="text-[9px] text-neutral-500 font-mono">Fecha: {item.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#7A724E] font-mono block">${item.price}</span>
                        <span className={`text-[8px] font-bold uppercase font-mono px-1.5 py-0.2 rounded ${
                          item.status === 'Vigente' ? 'bg-emerald-950 text-emerald-400' : 'bg-neutral-900 text-neutral-500'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: AVISOS (TABLÓN DE ANUNCIOS) */}
          {activeTab === 'avisos' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-[#7A724E]" />
                <h3 className="text-xs text-neutral-400 uppercase tracking-wider font-mono">Muro de Comunicados</h3>
              </div>

              {announcements.length === 0 ? (
                <p className="text-xs text-neutral-600 italic py-4 text-center">No hay anuncios publicados en este momento.</p>
              ) : (
                <div className="space-y-3">
                  {announcements.map(ann => (
                    <div 
                      key={ann.id} 
                      className={`p-4 rounded-2xl border transition-all ${
                        ann.important 
                          ? 'bg-red-950/20 border-red-500/30 shadow-[0_4px_15px_rgba(239,68,68,0.1)]' 
                          : 'bg-[#111] border-neutral-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h4 className="text-xs font-bold text-white">{ann.title}</h4>
                        {ann.important && (
                          <span className="text-[8px] bg-red-500 text-black font-mono font-black px-2 py-0.5 rounded-full uppercase">
                            Urgente
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed">{ann.content}</p>
                      <span className="text-[8px] text-neutral-500 font-mono mt-2 block text-right">{ann.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RECIBOS (PAGOS) */}
          {activeTab === 'recibos' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#7A724E]" />
                <h3 className="text-xs text-neutral-400 uppercase tracking-wider font-mono">Historial de Recibos</h3>
              </div>

              {clientPayments.length === 0 ? (
                <p className="text-xs text-neutral-600 italic py-4 text-center">No posees recibos de pago anteriores en el sistema.</p>
              ) : (
                <div className="space-y-3">
                  {clientPayments.map(pay => (
                    <div key={pay.id} className="bg-[#111] border border-neutral-800 rounded-2xl p-4 flex justify-between items-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-[60px] h-[60px] rounded-bl-full bg-[#7A724E]/5"></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white font-mono">{pay.folio}</span>
                          <span className="text-[8px] bg-white/5 border border-white/10 text-neutral-400 px-1 rounded uppercase font-mono">
                            {pay.method}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 font-mono mt-1.5">
                          Concepto: Membresía {pay.planName} • Fecha: {pay.date}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-[#7A724E] font-mono block">${pay.amount} MXN</span>
                        <span className="text-[8px] text-neutral-500 font-mono block">Comprobante Digital</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PERFIL (DATOS BASICOS) */}
          {activeTab === 'perfil' && (
            <div className="space-y-4 animate-fade-in">
              
              {/* Profile Details (Basic info only to prevent overwhelming user) */}
              <div className="bg-[#111] border border-[#222] rounded-[28px] p-5 shadow-lg space-y-4">
                <div className="text-center pb-2 border-b border-[#222]">
                  <img src={client.avatar} alt="Foto" className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-[#7A724E] mb-2" />
                  <h4 className="text-sm font-bold text-white">{client.name}</h4>
                  <span className="text-[9px] text-neutral-400 font-mono block uppercase">Socio ID: #{client.id}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/40 border border-neutral-900 rounded-xl p-2.5">
                    <span className="text-[8px] text-neutral-500 font-mono uppercase block mb-0.5">Móvil</span>
                    <span className="text-xs font-semibold text-white truncate block">{client.phone}</span>
                  </div>
                  <div className="bg-black/40 border border-neutral-900 rounded-xl p-2.5">
                    <span className="text-[8px] text-neutral-500 font-mono uppercase block mb-0.5">Correo</span>
                    <span className="text-xs font-semibold text-white truncate block">{client.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/40 border border-neutral-900 rounded-xl p-2.5">
                    <span className="text-[8px] text-neutral-500 font-mono uppercase block mb-0.5">Fecha Ingreso</span>
                    <span className="text-xs font-semibold text-white block">{client.joinDate}</span>
                  </div>
                  <div className="bg-black/40 border border-neutral-900 rounded-xl p-2.5">
                    <span className="text-[8px] text-neutral-500 font-mono uppercase block mb-0.5">Adeudos</span>
                    <span className={`text-xs font-bold block ${client.debt > 0 ? 'text-red-400 font-mono' : 'text-emerald-400 font-mono'}`}>
                      {client.debt > 0 ? `$${client.debt} MXN` : 'Sin adeudos'}
                    </span>
                  </div>
                </div>

                <div className="bg-black/40 border border-neutral-900 rounded-xl p-2.5">
                  <span className="text-[8px] text-neutral-500 font-mono uppercase block mb-0.5">Contacto Emergencia</span>
                  <p className="text-xs text-neutral-300 font-semibold">{client.emergencyContact}</p>
                </div>
              </div>

            </div>
          )}

          {/* TAB: SESIONES */}
          {activeTab === 'sesiones' && (
            <div className="space-y-4 animate-fade-in text-left">
              {/* Stats Card */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-[#111] to-[#1a1a1a] border border-[#222] rounded-3xl p-4 flex items-center gap-3 relative overflow-hidden">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[8px] text-neutral-400 font-mono uppercase block">Racha Actual</span>
                    <span className="text-lg font-black text-white font-mono">{client.streakDays} Días</span>
                  </div>
                  <div className="absolute top-0 right-0 w-8 h-8 rounded-bl-full bg-amber-500/5"></div>
                </div>
                
                <div className="bg-gradient-to-br from-[#111] to-[#1a1a1a] border border-[#222] rounded-3xl p-4 flex items-center gap-3 relative overflow-hidden">
                  <div className="w-10 h-10 rounded-2xl bg-[#7A724E]/10 border border-[#7A724E]/20 flex items-center justify-center text-[#7A724E] shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[8px] text-neutral-400 font-mono uppercase block">Total Sesiones</span>
                    <span className="text-lg font-black text-white font-mono">{client.completedWorkouts}</span>
                  </div>
                  <div className="absolute top-0 right-0 w-8 h-8 rounded-bl-full bg-[#7A724E]/5"></div>
                </div>
              </div>

              {/* Workout Checklist or Quick Logger */}
              <div className="bg-[#111] border border-[#222] rounded-[28px] p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[120px] h-[120px] rounded-bl-full bg-[#7A724E]/5 pointer-events-none"></div>
                <span className="text-[8px] font-mono text-[#7A724E] uppercase tracking-widest block mb-1 font-bold">REGISTRO DIARIO</span>
                <h3 className="text-sm font-bold text-white tracking-tight">Sesión de Entrenamiento</h3>
                <p className="text-xs text-neutral-400 mt-1">Registra tu rutina completada hoy en Dragon Gym para sumar a tu racha.</p>

                {/* Simulated Success / Completed State indicator */}
                <div className="mt-5">
                  <button
                    onClick={() => {
                      onCompleteWorkout(client.id);
                    }}
                    className="w-full bg-[#7A724E] hover:bg-[#91875d] text-black text-xs font-black uppercase tracking-widest py-3.5 px-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(122,114,78,0.2)]"
                  >
                    <Dumbbell className="w-4 h-4" />
                    <span>¡Registrar Sesión de Hoy!</span>
                  </button>
                </div>
              </div>

              {/* Weekly Progress Tracker */}
              <div className="bg-[#111] border border-[#222] rounded-[28px] p-5 shadow-lg">
                <h4 className="text-xs text-neutral-400 uppercase tracking-wider font-mono mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#7A724E]" />
                  <span>Seguimiento Semanal</span>
                </h4>
                
                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => {
                    const isDone = idx < (client.streakDays % 7 || 3); // mock some active days based on streak
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <span className="text-[9px] text-neutral-500 font-mono font-bold">{day}</span>
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                          isDone 
                            ? 'bg-[#7A724E] border-[#7A724E] text-black font-black' 
                            : 'bg-black/50 border-neutral-800 text-neutral-600'
                        }`}>
                          {isDone ? <Check className="w-4 h-4" strokeWidth={3} /> : <span className="text-[10px] font-mono">{idx + 1}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-neutral-500 text-center mt-3">Completando sesiones consecutivas incrementas tu racha de constancia.</p>
              </div>
            </div>
          )}

          {/* TAB: RUTINAS (VIDEOS DE YOUTUBE DEL ADMIN) */}
          {activeTab === 'rutinas' && (
            <div className="space-y-4 animate-fade-in text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-[#7A724E]" />
                    <span>RUTINAS DE DRAGON GYM</span>
                  </h3>
                  <p className="text-[10px] text-neutral-400">Videos subidos por Administración</p>
                </div>
                <div className="text-[8px] font-mono text-[#7A724E] bg-[#7A724E]/10 py-0.5 px-2.5 rounded-full uppercase font-bold animate-pulse">
                  {routines.length} Publicadas
                </div>
              </div>

              {routines.length === 0 ? (
                <div className="bg-[#111] border border-[#222] rounded-3xl p-8 text-center text-neutral-500">
                  <Play className="w-8 h-8 mx-auto mb-2.5 opacity-30 text-neutral-500" />
                  <p className="text-xs font-mono">No hay rutinas publicadas en video.</p>
                  <p className="text-[10px] text-neutral-600 mt-1">El administrador subirá rutinas próximamente.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {routines.map((routine) => {
                    const getYoutubeId = (url: string) => {
                      if (!url) return '';
                      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                      const match = url.match(regExp);
                      return (match && match[2].length === 11) ? match[2] : '';
                    };
                    const videoId = getYoutubeId(routine.videoUrl || '');
                    
                    return (
                      <div key={routine.id} className="bg-[#111] border border-[#222] rounded-[28px] overflow-hidden shadow-lg">
                        
                        {/* Video Player */}
                        {videoId ? (
                          <div className="w-full aspect-video bg-black relative">
                            <iframe 
                              className="w-full h-full"
                              src={`https://www.youtube.com/embed/${videoId}`}
                              title={routine.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        ) : (
                          <div className="w-full h-36 bg-gradient-to-br from-neutral-900 to-neutral-950 flex flex-col items-center justify-center border-b border-[#222]">
                            <Video className="w-8 h-8 text-neutral-600 mb-1" />
                            <span className="text-[10px] text-neutral-500 font-mono">Sin reproducción de video directa</span>
                          </div>
                        )}

                        <div className="p-4">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className={`text-[8px] font-bold uppercase tracking-widest font-mono px-2 py-0.5 rounded-full ${
                              routine.level === 'Principiante' ? 'bg-emerald-950 text-emerald-400' :
                              routine.level === 'Intermedio' ? 'bg-amber-950 text-amber-400' : 'bg-red-950 text-red-400'
                            }`}>
                              {routine.level}
                            </span>
                            <span className="text-[9px] text-neutral-500 font-mono">{routine.durationMin} Min</span>
                          </div>

                          <h4 className="text-xs font-bold text-white tracking-wide uppercase">{routine.title}</h4>
                          {routine.description && (
                            <p className="text-[10px] text-neutral-400 leading-relaxed mt-1.5">{routine.description}</p>
                          )}

                          <div className="mt-3.5 pt-3 border-t border-[#222]/60">
                            <span className="text-[8px] font-mono text-neutral-500 block uppercase mb-2">Lista de Ejercicios</span>
                            <div className="space-y-1.5">
                              {routine.exercises.map((ex, exIdx) => (
                                <div key={exIdx} className="flex items-center justify-between bg-black/40 border border-[#1a1a1a] rounded-lg p-2 text-[10px]">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#7A724E] shrink-0"></div>
                                    <span className="text-white font-medium truncate">{ex.name}</span>
                                  </div>
                                  <div className="flex items-center gap-1 font-mono text-neutral-400 shrink-0">
                                    <span>{ex.sets}x{ex.reps}</span>
                                    {ex.weight && <span className="text-[#7A724E]">({ex.weight})</span>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-neutral-900 flex justify-between items-center text-[8px] text-neutral-500 font-mono">
                            <span>Instructor: {routine.uploadedBy || 'Administración'}</span>
                            <span>{routine.date || 'Reciente'}</span>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Bottom PWA Navigation Tabs */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-[#111111]/95 backdrop-blur-lg border-t border-[#222] flex items-center justify-center px-2 z-30">
        <div className="max-w-xl mx-auto w-full flex items-center justify-between">
          
          <button 
            id="btn-client-tab-credencial"
            onClick={() => setActiveTab('credencial')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer flex-1 py-1 ${activeTab === 'credencial' ? 'text-[#7A724E]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <QrCode className="w-4 h-4 xs:w-5 h-5" />
            <span className="text-[7.5px] font-mono uppercase font-black tracking-tighter">Acceso</span>
          </button>

          <button 
            id="btn-client-tab-sesiones"
            onClick={() => setActiveTab('sesiones')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer flex-1 py-1 ${activeTab === 'sesiones' ? 'text-[#7A724E]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <Flame className="w-4 h-4 xs:w-5 h-5 animate-pulse text-amber-500/90" />
            <span className="text-[7.5px] font-mono uppercase font-black tracking-tighter">Sesiones</span>
          </button>

          <button 
            id="btn-client-tab-rutinas"
            onClick={() => setActiveTab('rutinas')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer flex-1 py-1 ${activeTab === 'rutinas' ? 'text-[#7A724E]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <Video className="w-4 h-4 xs:w-5 h-5 text-[#7A724E]" />
            <span className="text-[7.5px] font-mono uppercase font-black tracking-tighter">Rutinas</span>
          </button>

          <button 
            id="btn-client-tab-membresia"
            onClick={() => setActiveTab('membresia')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer flex-1 py-1 ${activeTab === 'membresia' ? 'text-[#7A724E]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <Calendar className="w-4 h-4 xs:w-5 h-5" />
            <span className="text-[7.5px] font-mono uppercase font-black tracking-tighter">Plan</span>
          </button>

          <button 
            id="btn-client-tab-avisos"
            onClick={() => setActiveTab('avisos')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer flex-1 py-1 ${activeTab === 'avisos' ? 'text-[#7A724E]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <Bell className="w-4 h-4 xs:w-5 h-5" />
            <span className="text-[7.5px] font-mono uppercase font-black tracking-tighter">Avisos</span>
          </button>

          <button 
            id="btn-client-tab-recibos"
            onClick={() => setActiveTab('recibos')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer flex-1 py-1 ${activeTab === 'recibos' ? 'text-[#7A724E]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <Receipt className="w-4 h-4 xs:w-5 h-5" />
            <span className="text-[7.5px] font-mono uppercase font-black tracking-tighter">Recibos</span>
          </button>

          <button 
            id="btn-client-tab-perfil"
            onClick={() => setActiveTab('perfil')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer flex-1 py-1 ${activeTab === 'perfil' ? 'text-[#7A724E]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <User className="w-4 h-4 xs:w-5 h-5" />
            <span className="text-[7.5px] font-mono uppercase font-black tracking-tighter">Perfil</span>
          </button>

        </div>
      </div>

    </div>
  );
}
