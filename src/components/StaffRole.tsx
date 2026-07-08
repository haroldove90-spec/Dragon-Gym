import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Search, CheckCircle2, AlertCircle, UserPlus, CreditCard, 
  RefreshCw, Laptop, ShieldCheck, Dumbbell, Sparkles, Smartphone, QrCode
} from 'lucide-react';
import { Client, Plan, Payment, CheckIn, QrAccess } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface StaffRoleProps {
  clients: Client[];
  plans: Plan[];
  payments: Payment[];
  checkIns: CheckIn[];
  onAddClient: (newC: {
    name: string;
    email: string;
    phone: string;
    planId: string;
    status: 'Activo' | 'Inactivo';
    avatar: string;
    joinDate: string;
    expirationDate: string;
    debt: number;
    emergencyContact: string;
    initialWeight: number;
  }) => void;
  onRecordPayment: (
    clientId: string,
    planId: string,
    amount: number,
    method: 'Efectivo' | 'Tarjeta' | 'Transferencia'
  ) => void;
  onAddCheckIn: (checkIn: Omit<CheckIn, 'id'>) => void;
  qrAccesses: QrAccess[];
  onGenerateQrAccess: (clientId: string, schedule: string, expiresAt: string) => void;
  onToggleQrAccessStatus: (id: string) => void;
}

type StaffTab = 'checkin' | 'socios' | 'caja' | 'qr_access';

export default function StaffRole({
  clients,
  plans,
  payments,
  checkIns,
  onAddClient,
  onRecordPayment,
  onAddCheckIn,
  qrAccesses,
  onGenerateQrAccess,
  onToggleQrAccessStatus
}: StaffRoleProps) {
  const [activeTab, setActiveTab] = useState<StaffTab>('checkin');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Alert visual state for access
  const [scanResult, setScanResult] = useState<{
    show: boolean;
    status: 'Permitido' | 'Denegado';
    client?: Client;
    daysLeft?: number;
    debt?: number;
  } | null>(null);

  // Form states for new member
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newEmergency, setNewEmergency] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [initialWeight, setInitialWeight] = useState('75');
  const [capturedPhoto, setCapturedPhoto] = useState<string>('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Payment form states
  const [payClientId, setPayClientId] = useState('');
  const [payPlanId, setPayPlanId] = useState('');
  const [payMethod, setPayMethod] = useState<'Efectivo' | 'Tarjeta' | 'Transferencia'>('Efectivo');
  const [payAmount, setPayAmount] = useState(0);
  const [paySuccess, setPaySuccess] = useState(false);

  // Camera handling for scanner & profile picture
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Calculate days remaining helper
  const getDaysRemaining = (expDateStr: string) => {
    const exp = new Date(expDateStr);
    const today = new Date('2026-07-06'); // App calibrated date
    const diffTime = exp.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Start Camera
  const startCamera = async () => {
    setCameraError('');
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error(err);
      setCameraError('No se pudo acceder a la cámara. Concede permisos o usa la simulación.');
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Set default plan
  useEffect(() => {
    if (plans.length > 0 && !selectedPlanId) {
      setSelectedPlanId(plans[0].id);
    }
  }, [plans]);

  // Handle plan price auto-fill
  useEffect(() => {
    const plan = plans.find(p => p.id === payPlanId);
    if (plan) {
      setPayAmount(plan.price);
    }
  }, [payPlanId, plans]);

  // Trigger check-in flow (Green / Red Alert)
  const triggerCheckIn = (client: Client) => {
    const daysLeft = getDaysRemaining(client.expirationDate);
    const isExpired = daysLeft < 0 || client.status === 'Inactivo';
    
    const status = isExpired ? 'Denegado' : 'Permitido';
    const debt = isExpired ? (client.debt > 0 ? client.debt : 50) : 0;

    // Save check-in log
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    onAddCheckIn({
      clientId: client.id,
      clientName: client.name,
      time: timeStr,
      date: '2026-07-06',
      status
    });

    setScanResult({
      show: true,
      status,
      client,
      daysLeft,
      debt
    });

    // Auto close alert after 5 seconds
    setTimeout(() => {
      setScanResult(null);
    }, 5000);
  };

  // Capture Photo from Camera for registration
  const captureSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Center crop snapshot
        ctx.drawImage(videoRef.current, 80, 0, 480, 480, 0, 0, 300, 300);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  // Register Member submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      setRegError('El nombre y el teléfono son obligatorios.');
      return;
    }

    const plan = plans.find(p => p.id === selectedPlanId);
    if (!plan) return;

    // Calculate dates
    const todayStr = '2026-07-06';
    const exp = new Date(todayStr);
    exp.setDate(exp.getDate() + plan.durationDays);
    const expStr = exp.toISOString().split('T')[0];

    const weightVal = parseFloat(initialWeight) || 75;

    // Use default avatar if none captured
    const avatarToUse = capturedPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';

    onAddClient({
      name: newName,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '')}@dragongym.com`,
      phone: newPhone,
      planId: selectedPlanId,
      status: 'Activo', // Auto-active because they are registering with a plan
      avatar: avatarToUse,
      joinDate: todayStr,
      expirationDate: expStr,
      debt: 0,
      emergencyContact: newEmergency || 'No especificado',
      initialWeight: weightVal
    });

    setRegSuccess(true);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewEmergency('');
    setCapturedPhoto('');
    setRegError('');
    
    setTimeout(() => {
      setRegSuccess(false);
    }, 3000);
  };

  // Process Quick Payment / Renewal
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payClientId || !payPlanId) return;

    onRecordPayment(payClientId, payPlanId, payAmount, payMethod);
    setPaySuccess(true);
    setPayClientId('');
    setPayPlanId('');
    
    setTimeout(() => {
      setPaySuccess(false);
    }, 3000);
  };

  // Manual search client match
  const filteredSearchClients = searchQuery.trim() === ''
    ? []
    : clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.id === searchQuery);

  return (
    <div className="flex flex-col h-full bg-[#050505] relative overflow-hidden">
      
      {/* Top Banner */}
      <div className="bg-[#111] px-4 py-3 border-b border-[#222] shrink-0">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="text-[9px] font-mono text-[#7A724E] uppercase tracking-widest font-bold">RECEPCIÓN Y ACCESOS</span>
              <h3 className="text-sm font-black text-white tracking-tight font-display">DRAGON DESK v2.6</h3>
            </div>
            <div className="bg-[#7A724E]/10 text-[#7A724E] border border-[#7A724E]/30 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full font-mono">
              STAFF AUTORIZADO
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#050505] border border-[#222] rounded-xl p-2 text-center">
              <span className="text-[8px] text-neutral-400 uppercase font-mono block">Check-ins hoy</span>
              <span className="text-xs font-bold text-[#7A724E] font-mono">{checkIns.filter(c => c.date === '2026-07-06').length}</span>
            </div>
            <div className="bg-[#050505] border border-[#222] rounded-xl p-2 text-center">
              <span className="text-[8px] text-neutral-400 uppercase font-mono block">Caja hoy</span>
              <span className="text-xs font-bold text-white font-mono">
                ${payments.filter(p => p.date === '2026-07-06').reduce((sum, p) => sum + p.amount, 0)}
              </span>
            </div>
            <div className="bg-[#050505] border border-[#222] rounded-xl p-2 text-center">
              <span className="text-[8px] text-neutral-400 uppercase font-mono block">Planes</span>
              <span className="text-xs font-bold text-white font-mono">{plans.filter(p => p.status === 'Activo').length} Activos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto scrollbar-none pb-24">
        <div className="max-w-3xl mx-auto w-full px-6 py-4">

          {/* CHECK-IN ACCESS SCREEN */}
          {activeTab === 'checkin' && (
            <div className="space-y-5 animate-fade-in">
              
              {/* ACCESOS POPUP - BIG GREEN/RED SCREEN */}
              <AnimatePresence>
                {scanResult && scanResult.show && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`fixed inset-x-4 top-20 bottom-24 rounded-[32px] p-6 z-50 flex flex-col justify-between shadow-2xl overflow-hidden border ${
                      scanResult.status === 'Permitido' 
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-100' 
                        : 'bg-red-950 border-red-500 text-red-100'
                    }`}
                  >
                    {/* Glowing effect inside alert */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none ${
                      scanResult.status === 'Permitido' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                    }`}></div>

                    {/* Top indicator */}
                    <div className="flex justify-between items-center z-10">
                      <span className="text-xs font-mono uppercase tracking-widest bg-black/40 px-3.5 py-1 rounded-full border border-white/10">
                        Resultado de Escaneo
                      </span>
                      <button 
                        onClick={() => setScanResult(null)}
                        className="text-white/60 hover:text-white bg-white/10 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold active:scale-95 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Center details */}
                    <div className="flex flex-col items-center text-center my-6 z-10">
                      <div className="relative mb-5">
                        <img 
                          src={scanResult.client?.avatar} 
                          alt="Socio" 
                          className={`w-28 h-28 rounded-full object-cover border-4 ${
                            scanResult.status === 'Permitido' ? 'border-emerald-400' : 'border-red-400'
                          }`}
                        />
                        <div className={`absolute bottom-0 right-0 p-2 rounded-full shadow-lg ${
                          scanResult.status === 'Permitido' ? 'bg-emerald-500' : 'bg-red-500'
                        }`}>
                          {scanResult.status === 'Permitido' ? (
                            <CheckCircle2 className="w-5 h-5 text-black" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-black" />
                          )}
                        </div>
                      </div>

                      <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-1">
                        {scanResult.client?.name}
                      </h2>
                      <p className="text-sm opacity-80 font-mono">
                        Socio ID: #{scanResult.client?.id}
                      </p>

                      <div className="mt-6 text-3xl font-black tracking-widest uppercase">
                        {scanResult.status === 'Permitido' ? '🟩 ACCESO PERMITIDO' : '🟥 ACCESO DENEGADO'}
                      </div>
                    </div>

                    {/* Bottom Status Panel */}
                    <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-center z-10">
                      {scanResult.status === 'Permitido' ? (
                        <div>
                          <p className="text-xs text-emerald-300 font-mono uppercase tracking-wider mb-1">Suscripción Vigente</p>
                          <div className="text-xl font-bold text-white">
                            Quedan <span className="text-[#7A724E]">{scanResult.daysLeft} días</span>
                          </div>
                          <p className="text-[10px] opacity-60 mt-1">Vence el {scanResult.client?.expirationDate}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-red-300 font-mono uppercase tracking-wider mb-1">Membresía Vencida o Inactiva</p>
                          <div className="text-xl font-bold text-white">
                            Adeudo: <span className="text-red-400 font-mono">${scanResult.debt} MXN</span>
                          </div>
                          <p className="text-[11px] opacity-80 mt-1">
                            Exige renovación inmediata para permitir el ingreso.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Direct action button within alert */}
                    {scanResult.status === 'Denegado' && (
                      <button
                        onClick={() => {
                          if (scanResult.client) {
                            setPayClientId(scanResult.client.id);
                            const activePlan = plans[0]?.id || 'p1';
                            setPayPlanId(activePlan);
                            setActiveTab('caja');
                            setScanResult(null);
                          }
                        }}
                        className="w-full bg-[#7A724E] hover:bg-[#91875d] text-black font-extrabold uppercase py-3 rounded-xl tracking-wider text-xs transition-all active:scale-95 cursor-pointer z-10"
                      >
                        Cobrar Renovación Ahora
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* QR Scanner Module */}
              <div className="bg-[#111] border border-[#222] rounded-[32px] p-5 shadow-lg relative overflow-hidden">
                <h4 className="text-xs text-neutral-400 uppercase tracking-wider font-mono mb-3">ESCÁNER QR DE ACCESOS</h4>
                
                <div className="relative aspect-video max-w-md mx-auto rounded-2xl overflow-hidden bg-black border border-neutral-800 flex flex-col items-center justify-center">
                  {cameraActive ? (
                    <>
                      <video 
                        ref={videoRef} 
                        className="w-full h-full object-cover" 
                        playsInline
                        muted
                      />
                      {/* Interactive scanning laser line */}
                      <div className="absolute inset-x-0 h-0.5 bg-[#7A724E] opacity-80 shadow-[0_0_10px_rgba(122,114,78,1)] animate-bounce top-1/4"></div>
                      <div className="absolute inset-8 border-2 border-[#7A724E]/40 rounded-xl pointer-events-none">
                        {/* Target reticle corners */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#7A724E]"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#7A724E]"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#7A724E]"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#7A724E]"></div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6 space-y-3">
                      <div className="w-16 h-16 rounded-full bg-[#7A724E]/10 flex items-center justify-center text-[#7A724E] mx-auto border border-[#7A724E]/20 animate-pulse">
                        <QrCode className="w-8 h-8" />
                      </div>
                      <p className="text-xs text-neutral-400">Escáner desactivado. Usa la cámara de la tablet para leer credenciales QR.</p>
                      <button 
                        onClick={startCamera}
                        className="bg-[#7A724E] hover:bg-[#91875d] text-black text-xs font-black uppercase tracking-wider py-2 px-4 rounded-xl cursor-pointer"
                      >
                        Activar Cámara Escáner
                      </button>
                    </div>
                  )}

                  {cameraActive && (
                    <button 
                      onClick={stopCamera}
                      className="absolute bottom-2 right-2 bg-black/80 hover:bg-black text-neutral-400 hover:text-white text-[10px] font-mono py-1 px-2.5 rounded-lg"
                    >
                      Apagar Cámara
                    </button>
                  )}
                </div>

                {cameraError && (
                  <p className="text-[11px] text-red-400 text-center mt-2 font-mono">{cameraError}</p>
                )}

                {/* Simulation Control Panel - CRITICAL FOR PREVIEW TESTING */}
                <div className="mt-4 pt-4 border-t border-[#222]">
                  <span className="text-[10px] text-[#7A724E] font-mono uppercase tracking-widest block mb-2 text-center">
                    Simulación de Escáner QR de Clientes (Pruebas)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {clients.map(client => {
                      const days = getDaysRemaining(client.expirationDate);
                      const isExp = days < 0;
                      return (
                        <button
                          key={client.id}
                          onClick={() => triggerCheckIn(client)}
                          className="flex items-center gap-2 p-2 bg-[#1a1a1a] border border-[#2c2c2c] hover:border-[#7A724E]/30 rounded-xl text-left text-xs text-white transition-all active:scale-95 cursor-pointer"
                        >
                          <img src={client.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold truncate text-[11px]">{client.name}</p>
                            <span className={`text-[9px] font-mono block ${isExp ? 'text-red-400' : 'text-emerald-400'}`}>
                              {isExp ? `Vencido (${client.planId})` : `${days} d restantes`}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Manual Search Fallback */}
              <div className="bg-[#111] border border-[#222] rounded-[32px] p-5 shadow-lg">
                <h4 className="text-xs text-neutral-400 uppercase tracking-wider font-mono mb-2">BÚSQUEDA MANUAL ALTERNATIVA</h4>
                <p className="text-[11px] text-neutral-500 mb-3">Ingresa el nombre del socio si no cuenta con su código QR.</p>
                
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Buscar por nombre o número de ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-neutral-600 outline-none transition-all"
                  />
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                </div>

                {filteredSearchClients.length > 0 && (
                  <div className="mt-3 bg-[#050505] border border-[#222] rounded-xl divide-y divide-[#222] overflow-hidden">
                    {filteredSearchClients.map(c => {
                      const days = getDaysRemaining(c.expirationDate);
                      const isExpired = days < 0;
                      return (
                        <div key={c.id} className="p-3 flex items-center justify-between hover:bg-neutral-900/40">
                          <div className="flex items-center gap-3">
                            <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover border border-[#222]" />
                            <div>
                              <h5 className="text-xs font-bold text-white">{c.name}</h5>
                              <p className="text-[9px] text-neutral-400 font-mono">ID: #{c.id} • {c.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                              isExpired ? 'bg-red-950 text-red-400 border border-red-900' : 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                            }`}>
                              {isExpired ? 'VENCIDO' : 'ACTIVO'}
                            </span>
                            <button
                              onClick={() => triggerCheckIn(c)}
                              className="bg-[#7A724E] hover:bg-[#91875d] text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-lg cursor-pointer"
                            >
                              Check-In
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent Check-Ins Log */}
              <div className="bg-[#111] border border-[#222] rounded-[32px] p-5 shadow-lg">
                <h4 className="text-xs text-neutral-400 uppercase tracking-wider font-mono mb-3">HISTORIAL DE INGRESOS (HOY)</h4>
                
                <div className="space-y-2.5 max-h-[180px] overflow-y-auto scrollbar-none">
                  {checkIns.filter(ck => ck.date === '2026-07-06').length === 0 ? (
                    <p className="text-xs text-neutral-600 italic py-2 text-center">No se registran accesos hoy.</p>
                  ) : (
                    checkIns.filter(ck => ck.date === '2026-07-06').map(ck => (
                      <div key={ck.id} className="flex justify-between items-center p-2.5 rounded-xl bg-[#050505] border border-[#1e1e1e]">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${ck.status === 'Permitido' ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                          <span className="text-xs font-bold text-white">{ck.clientName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-neutral-400 font-mono">{ck.time}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                            ck.status === 'Permitido' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                          }`}>
                            {ck.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {/* REGISTER MEMBER & ASSIGN PLAN */}
          {activeTab === 'socios' && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-[#111] border border-[#222] rounded-[32px] p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <UserPlus className="w-5 h-5 text-[#7A724E]" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-display">Inscripción / Nuevo Socio</h3>
                </div>

                {regSuccess && (
                  <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2 mb-4 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>¡Socio registrado exitosamente y membresía activada!</span>
                  </div>
                )}

                {regError && (
                  <div className="bg-red-950/80 border border-red-500 text-red-300 p-3 rounded-xl text-xs flex items-center gap-2 mb-4 font-bold">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  
                  {/* Photo Capture Area */}
                  <div>
                    <label className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest block mb-2">FOTOGRAFÍA DE PERFIL (CÁMARA TABLET)</label>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="w-32 h-32 rounded-2xl bg-black border border-neutral-800 relative overflow-hidden flex items-center justify-center shrink-0">
                        {capturedPhoto ? (
                          <img src={capturedPhoto} alt="Snapshot" className="w-full h-full object-cover" />
                        ) : cameraActive ? (
                          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                        ) : (
                          <Camera className="w-8 h-8 text-neutral-700" />
                        )}
                        
                        {cameraActive && (
                          <div className="absolute inset-x-2 bottom-2 bg-black/80 text-[8px] text-center text-[#7A724E] uppercase font-mono tracking-wider p-0.5 rounded">
                            Transmitiendo...
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 w-full">
                        <p className="text-[11px] text-neutral-500 leading-relaxed">
                          Captura una fotografía instantánea del socio usando la cámara del dispositivo móvil para vincularla a su cuenta Dragon.
                        </p>
                        <div className="flex gap-2">
                          {!cameraActive ? (
                            <button
                              type="button"
                              onClick={startCamera}
                              className="bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] font-bold uppercase py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>Encender Cámara</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={captureSnapshot}
                              className="bg-[#7A724E] hover:bg-[#91875d] text-black text-[10px] font-black uppercase py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(122,114,78,0.3)]"
                            >
                              <Camera className="w-3.5 h-3.5 text-black" />
                              <span>Capturar Foto</span>
                            </button>
                          )}
                          {capturedPhoto && (
                            <button
                              type="button"
                              onClick={() => setCapturedPhoto('')}
                              className="bg-red-950/60 hover:bg-red-950 text-red-400 border border-red-900/50 text-[10px] font-bold py-1.5 px-3 rounded-lg cursor-pointer"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest block mb-1">Nombre Completo *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Juan Pérez Gil"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-xl py-2 px-3 text-xs font-semibold text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest block mb-1">Teléfono Móvil *</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="Ej. +34 600 000 111"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-xl py-2 px-3 text-xs font-semibold text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest block mb-1">Email (Opcional)</label>
                      <input 
                        type="email" 
                        placeholder="Dejar vacío para autogenerar"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-xl py-2 px-3 text-xs font-semibold text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest block mb-1">Contacto de Emergencia</label>
                      <input 
                        type="text" 
                        placeholder="Ej. Madre María - +34 600 222 333"
                        value={newEmergency}
                        onChange={(e) => setNewEmergency(e.target.value)}
                        className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-xl py-2 px-3 text-xs font-semibold text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Weight and Plan selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest block mb-1">Plan de Membresía Asignado</label>
                      <select
                        value={selectedPlanId}
                        onChange={(e) => setSelectedPlanId(e.target.value)}
                        className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-xl py-2 px-3 text-xs font-semibold text-white outline-none"
                      >
                        {plans.filter(p => p.status === 'Activo').map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} — ${p.price} ({p.durationDays} días)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest block mb-1">Peso Corporal Inicial (kg)</label>
                      <input 
                        type="number" 
                        placeholder="75"
                        value={initialWeight}
                        onChange={(e) => setInitialWeight(e.target.value)}
                        className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-xl py-2 px-3 text-xs font-semibold text-white outline-none font-mono"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#7A724E] hover:bg-[#91875d] text-black font-extrabold uppercase py-3 rounded-xl tracking-wider text-xs transition-all active:scale-95 cursor-pointer shadow-lg mt-2"
                  >
                    Registrar e Inscribir Socio
                  </button>

                </form>
              </div>
            </div>
          )}

          {/* CAJA / RENOVACIONES RAPIDAS */}
          {activeTab === 'caja' && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-[#111] border border-[#222] rounded-[32px] p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-[#7A724E]" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-display">Caja Rápida y Renovaciones</h3>
                </div>

                {paySuccess && (
                  <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2 mb-4 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>¡Pago registrado con éxito! La membresía se ha activado automáticamente.</span>
                  </div>
                )}

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  
                  {/* Select Client */}
                  <div>
                    <label className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest block mb-1">Seleccionar Socio</label>
                    <select
                      value={payClientId}
                      onChange={(e) => setPayClientId(e.target.value)}
                      required
                      className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-xl py-2 px-3 text-xs font-semibold text-white outline-none"
                    >
                      <option value="">-- Elige un socio a cobrar o renovar --</option>
                      {clients.map(c => {
                        const days = getDaysRemaining(c.expirationDate);
                        const isExp = days < 0;
                        return (
                          <option key={c.id} value={c.id}>
                            {c.name} {isExp ? `[VENCIDO - Adeudo ${c.debt ? `$${c.debt}` : '$50'}]` : '[VIGENTE]'}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Select Plan to renew */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest block mb-1">Elegir Plan de Renovación</label>
                      <select
                        value={payPlanId}
                        onChange={(e) => setPayPlanId(e.target.value)}
                        required
                        className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-xl py-2 px-3 text-xs font-semibold text-white outline-none"
                      >
                        <option value="">-- Selecciona el Plan --</option>
                        {plans.filter(p => p.status === 'Activo').map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} (${p.price} MXN)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest block mb-1">Método de Pago</label>
                      <select
                        value={payMethod}
                        onChange={(e) => setPayMethod(e.target.value as any)}
                        required
                        className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-xl py-2 px-3 text-xs font-semibold text-white outline-none"
                      >
                        <option value="Efectivo">💵 Efectivo</option>
                        <option value="Tarjeta">💳 Tarjeta Bancaria</option>
                        <option value="Transferencia">📲 Transferencia Electrónica</option>
                      </select>
                    </div>
                  </div>

                  {/* Amount calculated */}
                  <div>
                    <label className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest block mb-1">Monto de Renovación (MXN)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        readOnly
                        value={payAmount}
                        className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl py-2 px-3 text-sm font-black text-white font-mono outline-none cursor-not-allowed"
                      />
                      <span className="absolute right-3 top-2 text-xs font-mono text-neutral-500 font-semibold">CÁLCULO AUTOMÁTICO</span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={!payClientId || !payPlanId}
                    className={`w-full font-extrabold uppercase py-3 rounded-xl tracking-wider text-xs transition-all active:scale-95 cursor-pointer shadow-lg mt-2 ${
                      !payClientId || !payPlanId
                        ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed border border-neutral-900'
                        : 'bg-[#7A724E] hover:bg-[#91875d] text-black'
                    }`}
                  >
                    Registrar Cobro y Activar de Inmediato
                  </button>

                </form>
              </div>

              {/* Today's Transactions Box */}
              <div className="bg-[#111] border border-[#222] rounded-[32px] p-5 shadow-lg">
                <h4 className="text-xs text-neutral-400 uppercase tracking-wider font-mono mb-3">ÚLTIMAS TRANSACCIONES REGISTRADAS</h4>
                
                <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-none">
                  {payments.length === 0 ? (
                    <p className="text-xs text-neutral-600 italic py-2 text-center">No hay cobros registrados en esta sesión.</p>
                  ) : (
                    payments.slice().reverse().map(pay => (
                      <div key={pay.id} className="p-3 bg-[#050505] border border-[#1e1e1e] rounded-xl flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-black text-white">{pay.clientName}</span>
                            <span className="text-[8px] bg-white/5 border border-white/10 text-neutral-400 px-1.5 py-0.5 rounded font-mono uppercase font-bold tracking-widest">
                              {pay.method}
                            </span>
                          </div>
                          <span className="text-[9px] text-neutral-500 font-mono mt-0.5 block">
                            Membresía: {pay.planName} • Folio: {pay.folio}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-[#7A724E] font-mono">${pay.amount}</span>
                          <span className="text-[8px] text-neutral-500 font-mono block">{pay.date}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB: ACCESOS QR */}
          {activeTab === 'qr_access' && (
            <div className="space-y-5 animate-fade-in text-left">
              <div className="bg-[#111] border border-[#222] rounded-[32px] p-5 shadow-lg">
                <div className="flex items-center gap-1.5 mb-3">
                  <QrCode className="w-4 h-4 text-[#7A724E]" />
                  <h4 className="text-xs text-white uppercase tracking-wider font-bold">Generador de Acceso QR para Clientes</h4>
                </div>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const clientId = formData.get('clientId') as string;
                    const schedule = formData.get('schedule') as string;
                    const expiresAt = formData.get('expiresAt') as string;
                    if (!clientId) return;
                    onGenerateQrAccess(clientId, schedule, expiresAt);
                    e.currentTarget.reset();
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Seleccionar Socio</label>
                      <select 
                        name="clientId"
                        required
                        className="w-full bg-[#050505] border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#7A724E]"
                      >
                        <option value="">-- Elige un Socio --</option>
                        {clients.map(c => (
                          <option key={c.id} value={c.id}>{c.name} (Socio #{c.id})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Horario Autorizado</label>
                      <select 
                        name="schedule"
                        required
                        className="w-full bg-[#050505] border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#7A724E]"
                      >
                        <option value="Todos los días (06:00 - 23:00)">Todos los días (06:00 - 23:00)</option>
                        <option value="Lunes a Viernes (06:00 - 22:00)">Lunes a Viernes (06:00 - 22:00)</option>
                        <option value="Lunes a Sábado (06:00 - 22:00)">Lunes a Sábado (06:00 - 22:00)</option>
                        <option value="Fines de Semana (08:00 - 18:00)">Fines de Semana (08:00 - 18:00)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Fecha de Expiración del Pase</label>
                    <input 
                      type="date"
                      name="expiresAt"
                      required
                      defaultValue="2027-01-15"
                      className="w-full bg-[#050505] border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#7A724E]"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#7A724E] text-black font-extrabold uppercase py-3 rounded-xl text-xs transition-all active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Emitir y Generar Pase QR Sincronizado</span>
                  </button>
                </form>
              </div>

              {/* QR list of active codes */}
              <div className="bg-[#111] border border-[#222] rounded-[32px] p-5 shadow-lg">
                <h4 className="text-xs text-neutral-400 uppercase tracking-wider font-mono mb-3">PASES QR DE ACCESO EMITIDOS ({qrAccesses.length})</h4>
                <div className="space-y-3">
                  {qrAccesses.length === 0 ? (
                    <p className="text-xs text-neutral-600 italic text-center py-2">No hay pases QR de acceso emitidos.</p>
                  ) : (
                    qrAccesses.map(qr => {
                      const isSuspendido = qr.status === 'Suspendido';
                      return (
                        <div key={qr.id} className="p-3.5 rounded-2xl border border-neutral-800 bg-[#050505] flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                              isSuspendido ? 'bg-red-950/20 border-red-900/40 text-red-400' : 'bg-[#7A724E]/10 border-[#7A724E]/20 text-[#7A724E]'
                            }`}>
                              <QrCode className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-white">{qr.clientName}</h5>
                              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1 text-[10px] text-neutral-400 font-mono">
                                <span className="text-[#7A724E] font-bold">{qr.code}</span>
                                <span>•</span>
                                <span>Vence: {qr.expiresAt}</span>
                              </div>
                              <span className="text-[9px] text-neutral-500 font-mono block mt-0.5">{qr.schedule}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onToggleQrAccessStatus(qr.id)}
                              className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                                isSuspendido 
                                  ? 'bg-red-950 text-red-400 border-red-900/40 hover:bg-red-900/20' 
                                  : 'bg-[#7A724E]/10 text-[#7A724E] border-[#7A724E]/20 hover:bg-[#7A724E]/20'
                              }`}
                              title={isSuspendido ? 'Activar Pase de Acceso' : 'Suspender Pase de Acceso'}
                            >
                              {isSuspendido ? 'Suspendido' : 'Activo'}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Reception Staff Navigation Tabs */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-[#111111]/95 backdrop-blur-lg border-t border-[#222] flex items-center justify-center px-4 z-30">
        <div className="max-w-xl mx-auto w-full flex items-center justify-around">
          
          <button 
            id="btn-staff-tab-checkin"
            onClick={() => { stopCamera(); setActiveTab('checkin'); }}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === 'checkin' ? 'text-[#7A724E]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[9px] font-mono uppercase font-bold tracking-wider">Check-In</span>
          </button>

          <button 
            id="btn-staff-tab-socios"
            onClick={() => { stopCamera(); setActiveTab('socios'); }}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === 'socios' ? 'text-[#7A724E]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <UserPlus className="w-5 h-5" />
            <span className="text-[9px] font-mono uppercase font-bold tracking-wider">Inscripción</span>
          </button>

          <button 
            id="btn-staff-tab-caja"
            onClick={() => { stopCamera(); setActiveTab('caja'); }}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === 'caja' ? 'text-[#7A724E]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-[9px] font-mono uppercase font-bold tracking-wider">Caja Rápida</span>
          </button>

          <button 
            id="btn-staff-tab-qr"
            onClick={() => { stopCamera(); setActiveTab('qr_access'); }}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === 'qr_access' ? 'text-[#7A724E]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <QrCode className="w-5 h-5" />
            <span className="text-[9px] font-mono uppercase font-bold tracking-wider">Pases QR</span>
          </button>

        </div>
      </div>

    </div>
  );
}
