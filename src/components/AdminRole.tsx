import React, { useState } from 'react';
import { 
  Users, Calendar, Bell, Plus, Trash2, Search, ToggleLeft, ToggleRight, 
  Sparkles, ShieldAlert, Check, CheckCircle2, UserPlus, FileText, Dumbbell,
  Crown, DollarSign, Activity, FileDown, PlusCircle, ToggleLeft as ToggleOff, Lock, UserCheck, ShieldX,
  Video, Play, QrCode, RefreshCw, Key
} from 'lucide-react';
import { Client, GymClass, Announcement, Plan, Staff, Payment, CheckIn, WorkoutRoutine, QrAccess } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface AdminRoleProps {
  clients: Client[];
  classes: GymClass[];
  announcements: Announcement[];
  plans: Plan[];
  staff: Staff[];
  payments: Payment[];
  checkIns: CheckIn[];
  onAddClient: (client: Omit<Client, 'id' | 'completedWorkouts' | 'streakDays' | 'weightHistory'> & { initialWeight: number }) => void;
  onDeleteClient: (id: string) => void;
  onToggleClientStatus: (id: string) => void;
  onAddClass: (newClass: Omit<GymClass, 'id' | 'bookedCount'>) => void;
  onDeleteClass: (id: string) => void;
  onPublishAnnouncement: (title: string, content: string, important: boolean) => void;
  onDeleteAnnouncement: (id: string) => void;
  onAddPlan: (newPlan: Omit<Plan, 'id'>) => void;
  onEditPlan: (id: string, updated: Partial<Plan>) => void;
  onTogglePlanStatus: (id: string) => void;
  onAddStaff: (newStaff: Omit<Staff, 'id'>) => void;
  onToggleStaffStatus: (id: string) => void;
  routines: WorkoutRoutine[];
  qrAccesses: QrAccess[];
  onAddRoutine: (newRoutine: Omit<WorkoutRoutine, 'id' | 'uploadedBy' | 'date'>) => void;
  onDeleteRoutine: (id: string) => void;
  onGenerateQrAccess: (clientId: string, schedule: string, expiresAt: string) => void;
  onToggleQrAccessStatus: (id: string) => void;
}

type AdminTab = 'metrics' | 'plans' | 'staff' | 'socios' | 'reports' | 'announcements' | 'qr_access' | 'workout_routines';

export default function AdminRole({
  clients,
  classes,
  announcements,
  plans,
  staff,
  payments,
  checkIns,
  onAddClient,
  onDeleteClient,
  onToggleClientStatus,
  onAddClass,
  onDeleteClass,
  onPublishAnnouncement,
  onDeleteAnnouncement,
  onAddPlan,
  onEditPlan,
  onTogglePlanStatus,
  onAddStaff,
  onToggleStaffStatus,
  routines,
  qrAccesses,
  onAddRoutine,
  onDeleteRoutine,
  onGenerateQrAccess,
  onToggleQrAccessStatus
}: AdminRoleProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('metrics');
  
  // Search state for members
  const [memberSearch, setMemberSearch] = useState('');

  // Form states for adding member
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberPlanId, setMemberPlanId] = useState('');
  const [memberWeight, setMemberWeight] = useState('75');
  const [memberEmergency, setMemberEmergency] = useState('');
  const [memberError, setMemberError] = useState('');

  // Form states for classes
  const [showAddClass, setShowAddClass] = useState(false);
  const [className, setClassName] = useState('');
  const [classInstructor, setClassInstructor] = useState('');
  const [classTime, setClassTime] = useState('');
  const [classDay, setClassDay] = useState<'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo'>('Lunes');
  const [classCapacity, setClassCapacity] = useState('15');
  const [classError, setClassError] = useState('');

  // Form states for plans catálogo
  const [showAddPlanForm, setShowAddPlanForm] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState('');
  const [newPlanDays, setNewPlanDays] = useState('');
  const [planError, setPlanError] = useState('');

  // Form states for Staff
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'Recepcionista' | 'Entrenador' | 'Administrador'>('Recepcionista');
  const [newStaffUser, setNewStaffUser] = useState('');
  const [staffError, setStaffError] = useState('');

  // Form states for announcements
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annImportant, setAnnImportant] = useState(false);
  const [annSuccessMsg, setAnnSuccessMsg] = useState('');

  // Date range filter for Reports
  const [reportStartDate, setReportStartDate] = useState('2026-07-01');
  const [reportEndDate, setReportEndDate] = useState('2026-07-07');

  // Plan editing helper
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');

  // Auxiliary state for search filter
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  // Expiration helper logic
  const getDaysRemaining = (expDateStr: string) => {
    const exp = new Date(expDateStr);
    const today = new Date('2026-07-06'); // App calibrated reference date
    const diffTime = exp.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Real-time metrics calculations
  const totalClients = clients.length;
  const activeClients = clients.filter(c => {
    const days = getDaysRemaining(c.expirationDate);
    return days >= 0 && c.status === 'Activo';
  }).length;

  const nearExpirationClients = clients.filter(c => {
    const days = getDaysRemaining(c.expirationDate);
    return days >= 0 && days <= 7 && c.status === 'Activo';
  }).length;

  const expiredClients = clients.filter(c => {
    const days = getDaysRemaining(c.expirationDate);
    return days < 0 || c.status === 'Inactivo';
  }).length;

  const averageStreak = clients.length > 0 
    ? Math.round(clients.reduce((acc, c) => acc + c.streakDays, 0) / clients.length) 
    : 0;

  // Assistance Flow (Today's check-ins)
  const todayCheckIns = checkIns.filter(ck => ck.date === '2026-07-06');
  const todayCheckInsCount = todayCheckIns.length;
  
  // Total Income (This month / Total ledger)
  const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);

  // Proyección de recaudación basada en membresías por vencer (nearExpirationClients and expiredClients that would renew)
  // We estimate renewing those near expiration + expired to active plans (using average active plan price, say $130)
  const projectedRevenue = (nearExpirationClients * 130) + (expiredClients * 130);

  // Handle member submit
  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberEmail.trim()) {
      setMemberError('Por favor ingresa nombre y correo');
      return;
    }
    
    const activePlanId = memberPlanId || (plans[0]?.id || 'p1');
    const selectedPlan = plans.find(p => p.id === activePlanId);
    if (!selectedPlan) return;

    // Calculate expiration based on plan days
    const today = new Date('2026-07-06');
    today.setDate(today.getDate() + selectedPlan.durationDays);
    const expDateStr = today.toISOString().split('T')[0];

    onAddClient({
      name: memberName,
      email: memberEmail,
      phone: memberPhone || '+34 600 000 000',
      planId: activePlanId,
      status: 'Activo',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      joinDate: '2026-07-06',
      expirationDate: expDateStr,
      debt: 0,
      emergencyContact: memberEmergency || 'No especificado',
      initialWeight: parseFloat(memberWeight) || 75
    });

    setMemberName('');
    setMemberEmail('');
    setMemberPhone('');
    setMemberPlanId('');
    setMemberWeight('75');
    setMemberEmergency('');
    setMemberError('');
    setShowAddMember(false);
  };

  // Handle class submit
  const handleAddClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim() || !classInstructor.trim() || !classTime.trim()) {
      setClassError('Completa el nombre, instructor y horario');
      return;
    }
    const capacityVal = parseInt(classCapacity);
    if (isNaN(capacityVal) || capacityVal <= 1) {
      setClassError('Capacidad debe ser un número válido');
      return;
    }

    onAddClass({
      name: className,
      instructor: classInstructor,
      time: classTime,
      day: classDay,
      capacity: capacityVal,
      iconName: 'Flame'
    });

    setClassName('');
    setClassInstructor('');
    setClassTime('');
    setClassDay('Lunes');
    setClassCapacity('15');
    setClassError('');
    setShowAddClass(false);
  };

  // Handle Plan Create
  const handleAddPlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName.trim() || !newPlanPrice.trim() || !newPlanDays.trim()) {
      setPlanError('Completa todos los campos del plan');
      return;
    }
    const priceVal = parseFloat(newPlanPrice);
    const daysVal = parseInt(newPlanDays);

    if (isNaN(priceVal) || priceVal < 0) {
      setPlanError('Precio inválido');
      return;
    }
    if (isNaN(daysVal) || daysVal <= 0) {
      setPlanError('Vigencia en días inválida');
      return;
    }

    onAddPlan({
      name: newPlanName,
      price: priceVal,
      durationDays: daysVal,
      status: 'Activo'
    });

    setNewPlanName('');
    setNewPlanPrice('');
    setNewPlanDays('');
    setPlanError('');
    setShowAddPlanForm(false);
  };

  // Handle Staff Create
  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffUser.trim()) {
      setStaffError('Completa todos los campos');
      return;
    }

    onAddStaff({
      name: newStaffName,
      role: newStaffRole,
      username: newStaffUser.toLowerCase().replace(/\s+/g, ''),
      status: 'Activo'
    });

    setNewStaffName('');
    setNewStaffUser('');
    setStaffError('');
    setShowAddStaffForm(false);
  };

  // Handle announcement publish
  const handleAnnPublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    
    onPublishAnnouncement(annTitle, annContent, annImportant);
    setAnnTitle('');
    setAnnContent('');
    setAnnImportant(false);
    setAnnSuccessMsg('¡Anuncio publicado correctamente!');
    setTimeout(() => {
      setAnnSuccessMsg('');
    }, 3000);
  };

  // Export files handler (Simulates CSV / JSON download to clipboard or mock file trigger)
  const triggerExportClients = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(clients, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "dragon_gym_socios_export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    alert('Listado de socios exportado y descargado exitosamente como JSON.');
  };

  const triggerExportLedger = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payments, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "dragon_gym_caja_export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    alert('Historial financiero de caja exportado y descargado exitosamente como JSON.');
  };

  // Filter payments for reports audit
  const auditedPayments = payments.filter(p => {
    return p.date >= reportStartDate && p.date <= reportEndDate;
  });

  return (
    <div className="flex flex-col h-full bg-[#050505] relative overflow-hidden">
      
      {/* Top Banner */}
      <div className="bg-[#111] px-4 py-3 border-b border-[#222] shrink-0">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex justify-between items-center mb-2.5">
            <div>
              <span className="text-[9px] font-mono text-[#7A724E] uppercase tracking-widest font-bold">Consola Global del Propietario</span>
              <h3 className="text-sm font-black text-white tracking-tight font-display flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-[#7A724E]" />
                <span>SUPERADMIN: ALEJANDRO MARTÍNEZ</span>
              </h3>
            </div>
            <div className="bg-[#7A724E] text-black text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full font-mono">
              PROPIETARIO L1
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Area */}
      <div className="flex-1 overflow-y-auto scrollbar-none pb-20">
        <div className="max-w-3xl mx-auto w-full px-6 py-4">

          {/* TAB 1: METRICS (DASHBOARD GLOBAL) */}
          {activeTab === 'metrics' && (
            <div className="space-y-5 animate-fade-in">
              
              {/* Real-time Statistics grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#111] border border-[#222] rounded-2xl p-3 text-center shadow-md">
                  <span className="text-[9px] text-emerald-400 uppercase font-mono font-bold block mb-1">Socios Activos</span>
                  <span className="text-xl font-black text-white font-mono">{activeClients}</span>
                </div>
                <div className="bg-[#111] border border-[#222] rounded-2xl p-3 text-center shadow-md">
                  <span className="text-[9px] text-yellow-500 uppercase font-mono font-bold block mb-1">Por Vencer (7d)</span>
                  <span className="text-xl font-black text-[#7A724E] font-mono">{nearExpirationClients}</span>
                </div>
                <div className="bg-[#111] border border-[#222] rounded-2xl p-3 text-center shadow-md">
                  <span className="text-[9px] text-red-500 uppercase font-mono font-bold block mb-1">Socios Vencidos</span>
                  <span className="text-xl font-black text-neutral-400 font-mono">{expiredClients}</span>
                </div>
              </div>

              {/* Attendance Tracker */}
              <div className="bg-[#111] border border-[#222] rounded-[24px] p-4 shadow-lg">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-[#7A724E]" />
                    <h4 className="text-xs text-white uppercase tracking-wider font-bold">Flujo de Socios Hoy (Check-Ins)</h4>
                  </div>
                  <span className="text-[10px] font-mono text-[#7A724E] font-bold">Ref: 2026-07-06</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-[#050505] border border-[#222] rounded-xl p-3 text-center shrink-0 min-w-[100px]">
                    <span className="text-[28px] font-black text-[#7A724E] font-display block leading-none">
                      {todayCheckInsCount}
                    </span>
                    <span className="text-[9px] text-neutral-400 font-mono uppercase tracking-wider mt-1 block">Asistencias Hoy</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      El flujo actual diario representa un <strong className="text-white">{(todayCheckInsCount / Math.max(1, activeClients) * 100).toFixed(0)}%</strong> de asistencia de socios activos ingresados hoy.
                    </p>
                    <div className="w-full bg-[#222] h-2 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="bg-[#7A724E] h-full rounded-full shadow-[0_0_8px_rgba(122,114,78,0.5)]"
                        style={{ width: `${Math.min(100, (todayCheckInsCount / Math.max(1, activeClients) * 100))}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Summary & Projections */}
              <div className="bg-[#111] border border-[#222] rounded-[24px] p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4.5 h-4.5 text-[#7A724E]" />
                    <h4 className="text-xs text-white uppercase tracking-wider font-bold">Resumen y Proyección Financiera</h4>
                  </div>
                </div>

                {/* SVG Mock Chart representing Monthly Income */}
                <div className="bg-[#050505] border border-[#1e1e1e] rounded-xl p-3 mb-4">
                  <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider mb-2 text-center">Historico de Ingresos Mensuales (MXN)</p>
                  
                  {/* Styled CSS/SVG chart container */}
                  <div className="h-32 flex items-end justify-around pt-4 pb-1 px-2">
                    <div className="flex flex-col items-center flex-1">
                      <span className="text-[8px] text-neutral-500 font-mono font-bold">$1.2k</span>
                      <div className="w-8 bg-[#222] hover:bg-[#333] transition-all rounded-t h-[40px]"></div>
                      <span className="text-[9px] text-neutral-400 font-mono mt-1">May</span>
                    </div>
                    <div className="flex flex-col items-center flex-1">
                      <span className="text-[8px] text-neutral-400 font-mono font-bold">$3.4k</span>
                      <div className="w-8 bg-[#222] hover:bg-[#333] transition-all rounded-t h-[80px]"></div>
                      <span className="text-[9px] text-neutral-400 font-mono mt-1">Jun</span>
                    </div>
                    <div className="flex flex-col items-center flex-1">
                      <span className="text-[8px] text-[#7A724E] font-mono font-bold">${totalIncome}</span>
                      <div className="w-8 bg-[#7A724E] hover:bg-[#91875d] transition-all rounded-t h-[110px] shadow-[0_0_10px_rgba(122,114,78,0.3)]"></div>
                      <span className="text-[9px] text-white font-mono font-bold mt-1">Jul *</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#050505] border border-[#222] rounded-xl p-3">
                    <span className="text-[9px] text-neutral-400 font-mono uppercase tracking-wider block mb-1">Recaudado Total</span>
                    <span className="text-lg font-black text-white font-mono">${totalIncome}</span>
                  </div>
                  <div className="bg-[#050505] border border-[#222] rounded-xl p-3">
                    <span className="text-[9px] text-[#7A724E] font-mono uppercase tracking-wider block mb-1">Proyección Renovaciones</span>
                    <span className="text-lg font-black text-[#7A724E] font-mono">${projectedRevenue}</span>
                  </div>
                </div>
                <p className="text-[10px] text-neutral-500 mt-2.5 italic text-center">
                  * La proyección financiera se calcula estimando la renovación automática de los socios vencidos y los próximos a vencer en su mismo nivel de plan.
                </p>
              </div>

              {/* ACCESOS RÁPIDOS / MÓDULOS DE ADMINISTRACIÓN */}
              <div className="bg-[#111] border border-[#222] rounded-[24px] p-4 shadow-lg text-left">
                <div className="flex items-center gap-1.5 mb-3">
                  <Sparkles className="w-4 h-4 text-[#7A724E]" />
                  <h4 className="text-xs text-white uppercase tracking-wider font-bold">Herramientas Especiales</h4>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button 
                    onClick={() => setActiveTab('qr_access')}
                    className="flex items-center gap-2.5 bg-[#050505] hover:bg-[#1a1a1a] active:scale-98 border border-neutral-800 hover:border-[#7A724E]/40 p-3 rounded-xl transition-all text-left cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#7A724E]/10 flex items-center justify-center text-[#7A724E] shrink-0">
                      <QrCode className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-white block">Pases QR</span>
                      <span className="text-[8.5px] text-neutral-400 block font-mono">Emitir accesos</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveTab('workout_routines')}
                    className="flex items-center gap-2.5 bg-[#050505] hover:bg-[#1a1a1a] active:scale-98 border border-neutral-800 hover:border-[#7A724E]/40 p-3 rounded-xl transition-all text-left cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#7A724E]/10 flex items-center justify-center text-[#7A724E] shrink-0">
                      <Video className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-white block">Subir Rutinas</span>
                      <span className="text-[8.5px] text-neutral-400 block font-mono">Videos de YouTube</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveTab('reports')}
                    className="flex items-center gap-2.5 bg-[#050505] hover:bg-[#1a1a1a] active:scale-98 border border-neutral-800 hover:border-[#7A724E]/40 p-3 rounded-xl transition-all text-left cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-950/20 flex items-center justify-center text-indigo-400 border border-indigo-900/30 shrink-0">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-white block">Auditoría</span>
                      <span className="text-[8.5px] text-neutral-400 block font-mono">Reporte de pagos</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveTab('announcements')}
                    className="flex items-center gap-2.5 bg-[#050505] hover:bg-[#1a1a1a] active:scale-98 border border-neutral-800 hover:border-[#7A724E]/40 p-3 rounded-xl transition-all text-left cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-950/20 flex items-center justify-center text-amber-500 border border-amber-900/30 shrink-0">
                      <Bell className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-white block">Avisos</span>
                      <span className="text-[8.5px] text-neutral-400 block font-mono">Alertas generales</span>
                    </div>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MEMBERSHIP PLANS CONFIGURATION */}
          {activeTab === 'plans' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h4 className="text-xs text-neutral-400 uppercase tracking-wider font-mono">Catálogo</h4>
                  <h3 className="text-sm font-bold text-white">Configuración de Membresías</h3>
                </div>
                <button 
                  onClick={() => setShowAddPlanForm(!showAddPlanForm)}
                  className="bg-[#7A724E] hover:bg-[#91875d] text-black text-[10px] font-extrabold uppercase tracking-wide py-1.5 px-3 rounded-xl flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-lg w-max shrink-0"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Nuevo Plan</span>
                </button>
              </div>

              {/* Add Plan Form */}
              {showAddPlanForm && (
                <div className="bg-[#111] border border-[#7A724E]/30 rounded-[24px] p-4 shadow-xl">
                  <h4 className="text-xs font-mono text-[#7A724E] uppercase tracking-wider mb-3">CREAR PLAN DE MEMBRESÍA</h4>
                  {planError && <p className="text-[11px] text-red-400 mb-2 font-mono font-bold">{planError}</p>}
                  <form onSubmit={handleAddPlanSubmit} className="space-y-3">
                    <div>
                      <label className="text-[9px] text-neutral-400 font-mono uppercase block mb-0.5">Nombre del Plan</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Plan Semestral"
                        value={newPlanName}
                        onChange={(e) => setNewPlanName(e.target.value)}
                        className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-lg py-1.5 px-2.5 text-xs text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] text-neutral-400 font-mono uppercase block mb-0.5">Costo (MXN)</label>
                        <input 
                          type="number" 
                          required
                          placeholder="250"
                          value={newPlanPrice}
                          onChange={(e) => setNewPlanPrice(e.target.value)}
                          className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-lg py-1.5 px-2.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-neutral-400 font-mono uppercase block mb-0.5">Vigencia (Días)</label>
                        <input 
                          type="number" 
                          required
                          placeholder="180"
                          value={newPlanDays}
                          onChange={(e) => setNewPlanDays(e.target.value)}
                          className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-lg py-1.5 px-2.5 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 justify-end">
                      <button 
                        type="button" 
                        onClick={() => setShowAddPlanForm(false)} 
                        className="bg-neutral-800 text-neutral-300 text-[10px] uppercase font-bold py-1.5 px-3 rounded-lg"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        className="bg-[#7A724E] text-black text-[10px] uppercase font-black py-1.5 px-4 rounded-lg"
                      >
                        Crear Plan
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Plans List */}
              <div className="grid grid-cols-1 gap-3">
                {plans.map(p => {
                  const isEditing = editingPlanId === p.id;
                  return (
                    <div key={p.id} className="bg-[#111] border border-[#222] hover:border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white truncate">{p.name}</h4>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded shrink-0 ${p.status === 'Activo' ? 'bg-emerald-950 text-emerald-400' : 'bg-neutral-900 text-neutral-500'}`}>
                            {p.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 font-mono mt-1 truncate">
                          Vigencia: {p.durationDays} días • ID: #{p.id}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-[#222] pt-3 sm:pt-0 w-full sm:w-auto">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input 
                              type="number" 
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="bg-[#050505] border border-[#7A724E] focus:outline-none rounded w-16 text-xs py-0.5 px-1.5 text-white font-mono text-center"
                            />
                            <button 
                              onClick={() => {
                                const val = parseFloat(editPrice);
                                if (!isNaN(val) && val >= 0) {
                                  onEditPlan(p.id, { price: val });
                                }
                                setEditingPlanId(null);
                              }}
                              className="bg-[#7A724E] text-black text-[9px] font-extrabold p-1 rounded"
                            >
                              ✓
                            </button>
                          </div>
                        ) : (
                          <div className="text-right">
                            <span className="text-sm font-black text-[#7A724E] font-mono block">${p.price}</span>
                            <button 
                              onClick={() => {
                                setEditingPlanId(p.id);
                                setEditPrice(p.price.toString());
                              }}
                              className="text-[9px] text-neutral-400 underline hover:text-white"
                            >
                              Editar Costo
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() => onTogglePlanStatus(p.id)}
                          className={`text-xs p-1.5 rounded-lg border ${p.status === 'Activo' ? 'border-[#7A724E]/40 text-[#7A724E] bg-[#7A724E]/5' : 'border-neutral-800 text-neutral-500 bg-black/5'}`}
                          title={p.status === 'Activo' ? 'Desactivar plan' : 'Activar plan'}
                        >
                          {p.status === 'Activo' ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: STAFF MANAGEMENT */}
          {activeTab === 'staff' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h4 className="text-xs text-neutral-400 uppercase tracking-wider font-mono">Personal</h4>
                  <h3 className="text-sm font-bold text-white">Gestión de Staff y Permisos</h3>
                </div>
                <button 
                  onClick={() => setShowAddStaffForm(!showAddStaffForm)}
                  className="bg-[#7A724E] hover:bg-[#91875d] text-black text-[10px] font-extrabold uppercase tracking-wide py-1.5 px-3 rounded-xl flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-lg w-max shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Agregar Staff</span>
                </button>
              </div>

              {/* Add Staff form */}
              {showAddStaffForm && (
                <div className="bg-[#111] border border-[#7A724E]/30 rounded-[24px] p-4 shadow-xl">
                  <h4 className="text-xs font-mono text-[#7A724E] uppercase tracking-wider mb-3">REGISTRAR NUEVO EMPLEADO</h4>
                  {staffError && <p className="text-[11px] text-red-400 mb-2 font-mono font-bold">{staffError}</p>}
                  <form onSubmit={handleAddStaffSubmit} className="space-y-3">
                    <div>
                      <label className="text-[9px] text-neutral-400 font-mono uppercase block mb-0.5">Nombre Completo</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Lucía Gómez"
                        value={newStaffName}
                        onChange={(e) => setNewStaffName(e.target.value)}
                        className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-lg py-1.5 px-2.5 text-xs text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] text-neutral-400 font-mono uppercase block mb-0.5">Rol Laboral</label>
                        <select
                          value={newStaffRole}
                          onChange={(e) => setNewStaffRole(e.target.value as any)}
                          className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-lg py-1.5 px-2 text-xs text-white"
                        >
                          <option value="Recepcionista">Recepcionista</option>
                          <option value="Entrenador">Entrenador</option>
                          <option value="Administrador">Administrador</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-neutral-400 font-mono uppercase block mb-0.5">Nombre de Usuario (Login)</label>
                        <input 
                          type="text" 
                          required
                          placeholder="lucia.recep"
                          value={newStaffUser}
                          onChange={(e) => setNewStaffUser(e.target.value)}
                          className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-lg py-1.5 px-2.5 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 justify-end">
                      <button 
                        type="button" 
                        onClick={() => setShowAddStaffForm(false)} 
                        className="bg-neutral-800 text-neutral-300 text-[10px] uppercase font-bold py-1.5 px-3 rounded-lg"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        className="bg-[#7A724E] text-black text-[10px] uppercase font-black py-1.5 px-4 rounded-lg"
                      >
                        Guardar Staff
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Staff Grid list */}
              <div className="space-y-3">
                {staff.map(s => {
                  const isSuspended = s.status === 'Inactivo';
                  return (
                    <div key={s.id} className="bg-[#111] border border-[#222] rounded-2xl p-3.5 flex flex-col sm:flex-row gap-3 sm:items-center justify-between hover:border-neutral-800">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border font-black text-sm shrink-0 ${
                          isSuspended ? 'bg-red-950/20 text-red-500 border-red-900/30' : 'bg-white/5 text-[#7A724E] border-[#222]'
                        }`}>
                          {s.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className={`text-xs font-bold truncate ${isSuspended ? 'text-neutral-500 line-through' : 'text-white'}`}>{s.name}</h4>
                            <span className="text-[8px] bg-white/5 border border-white/10 text-neutral-400 px-1.5 py-0.5 rounded font-mono font-bold tracking-wider uppercase shrink-0">
                              {s.role}
                            </span>
                          </div>
                          <span className="text-[9px] text-neutral-500 font-mono block mt-0.5 truncate">
                            Usuario: @{s.username} • ID: #{s.id}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 border-[#222] pt-2.5 sm:pt-0 w-full sm:w-auto">
                        {isSuspended ? (
                          <span className="text-[10px] text-red-400 font-mono font-bold flex items-center gap-1 bg-red-950/20 border border-red-900/40 py-1 px-2 rounded-lg shrink-0">
                            <ShieldX className="w-3 h-3 text-red-400" />
                            <span>SUSPENDIDO</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1 bg-emerald-950/20 border border-emerald-900/40 py-1 px-2 rounded-lg shrink-0">
                            <UserCheck className="w-3 h-3 text-emerald-400" />
                            <span>ACTIVO</span>
                          </span>
                        )}

                        <button
                          onClick={() => onToggleStaffStatus(s.id)}
                          className={`text-[10px] font-black uppercase py-1.5 px-3 rounded-lg transition-all shrink-0 ${
                            isSuspended 
                              ? 'bg-[#7A724E] hover:bg-[#91875d] text-black cursor-pointer' 
                              : 'bg-red-950/40 hover:bg-red-950 text-red-400 border border-red-900/40 cursor-pointer'
                          }`}
                        >
                          {isSuspended ? 'Reactivar' : 'Suspender'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: MEMBER DIRECTORY & CLASSES */}
          {activeTab === 'socios' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h4 className="text-xs text-neutral-400 uppercase tracking-wider font-mono">Directorio</h4>
                  <h3 className="text-sm font-bold text-white">Socios del Dragon Gym</h3>
                </div>
                <button 
                  onClick={() => setShowAddMember(!showAddMember)}
                  className="bg-[#7A724E] hover:bg-[#91875d] text-black text-[10px] font-extrabold uppercase py-1.5 px-3 rounded-xl flex items-center gap-1 cursor-pointer w-max shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Nuevo Socio</span>
                </button>
              </div>

              {/* Sliding Form to Add Member */}
              {showAddMember && (
                <div className="bg-[#111] border border-[#7A724E]/30 rounded-[24px] p-4 shadow-xl">
                  <h4 className="text-xs font-mono text-[#7A724E] uppercase tracking-wider mb-2">REGISTRAR NUEVO SOCIO</h4>
                  {memberError && <p className="text-[11px] text-red-400 mb-2 font-mono font-bold">{memberError}</p>}
                  <form onSubmit={handleAddClientSubmit} className="space-y-3">
                    <div>
                      <label className="text-[9px] text-neutral-400 font-mono uppercase block mb-0.5">Nombre Completo</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Carlos Mendoza"
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-lg py-1.5 px-2.5 text-xs text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] text-neutral-400 font-mono uppercase block mb-0.5">Correo Electrónico</label>
                        <input 
                          type="email" 
                          required
                          placeholder="carlos@gym.com"
                          value={memberEmail}
                          onChange={(e) => setMemberEmail(e.target.value)}
                          className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-lg py-1.5 px-2.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-neutral-400 font-mono uppercase block mb-0.5">Teléfono Celular</label>
                        <input 
                          type="text" 
                          placeholder="+34 600 000 000"
                          value={memberPhone}
                          onChange={(e) => setMemberPhone(e.target.value)}
                          className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-lg py-1.5 px-2.5 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] text-neutral-400 font-mono uppercase block mb-0.5">Asignar Plan</label>
                        <select
                          value={memberPlanId}
                          onChange={(e) => setMemberPlanId(e.target.value)}
                          className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-lg py-1 px-2 text-xs text-white"
                        >
                          {plans.map(p => (
                            <option key={p.id} value={p.id}>{p.name} — ${p.price}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-neutral-400 font-mono uppercase block mb-0.5">Peso Inicial (kg)</label>
                        <input 
                          type="number" 
                          value={memberWeight}
                          onChange={(e) => setMemberWeight(e.target.value)}
                          className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-lg py-1.5 px-2.5 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] text-neutral-400 font-mono uppercase block mb-0.5">Contacto de Emergencia</label>
                      <input 
                        type="text" 
                        placeholder="Ej. Madre - +34 600 111 222"
                        value={memberEmergency}
                        onChange={(e) => setMemberEmergency(e.target.value)}
                        className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-lg py-1.5 px-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="flex gap-2 pt-1 justify-end">
                      <button 
                        type="button" 
                        onClick={() => setShowAddMember(false)} 
                        className="bg-neutral-800 text-neutral-300 text-[10px] uppercase font-bold py-1.5 px-3 rounded-lg"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        className="bg-[#7A724E] text-black text-[10px] uppercase font-black py-1.5 px-4 rounded-lg"
                      >
                        Guardar Socio
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Search Bar */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar socio por nombre o correo..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] focus:border-[#7A724E]/50 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-neutral-500 outline-none transition-all"
                />
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
              </div>

              {/* Members List */}
              <div className="space-y-3">
                {filteredClients.map(c => {
                  const days = getDaysRemaining(c.expirationDate);
                  const isExp = days < 0 || c.status === 'Inactivo';
                  return (
                    <div key={c.id} className="bg-[#111] border border-[#222] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover border border-[#222]" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-white">{c.name}</h4>
                            <span className="text-[8px] bg-neutral-800 text-neutral-400 px-1.5 py-0.2 rounded font-mono">ID: #{c.id}</span>
                          </div>
                          <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">
                            Plan: {plans.find(p => p.id === c.planId)?.name || 'Especial'} • Tel: {c.phone}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-[#222] pt-2 sm:pt-0">
                        <div className="text-left sm:text-right">
                          <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                            isExp ? 'bg-red-950 text-red-400 border border-red-900' : 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                          }`}>
                            {isExp ? 'VENCIDO' : `${days} DÍAS RESTANTES`}
                          </span>
                          <span className="text-[8px] text-neutral-500 font-mono block mt-1">Exp: {c.expirationDate}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onToggleClientStatus(c.id)}
                            className="p-1 text-neutral-400 hover:text-white transition-all"
                            title="Alternar estado de suscripción"
                          >
                            {c.status === 'Activo' ? (
                              <ToggleRight className="w-6 h-6 text-[#7A724E]" />
                            ) : (
                              <ToggleLeft className="w-6 h-6 text-neutral-600" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => {
                              if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente a ${c.name}?`)) {
                                onDeleteClient(c.id);
                              }
                            }}
                            className="p-1 text-red-500/70 hover:text-red-400 hover:bg-red-950/20 rounded transition-all"
                            title="Eliminar socio"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 5: REPORTS & AUDITING */}
          {activeTab === 'reports' && (
            <div className="space-y-4 animate-fade-in text-left">
              <button 
                onClick={() => setActiveTab('metrics')}
                className="flex items-center gap-2 text-[10px] text-neutral-400 hover:text-white uppercase font-mono font-bold bg-[#111] border border-[#222] py-2 px-3.5 rounded-xl cursor-pointer transition-all active:scale-95 mb-1"
              >
                <span>← Volver al Dashboard (Métricas)</span>
              </button>
              <div className="bg-[#111] border border-[#222] rounded-[32px] p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-[#7A724E]" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-display">Reportes y Auditoría de Ingresos</h3>
                </div>

                {/* Date range filters */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest block mb-1">Fecha Inicial</label>
                    <input 
                      type="date"
                      value={reportStartDate}
                      onChange={(e) => setReportStartDate(e.target.value)}
                      className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-xl py-2 px-3 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest block mb-1">Fecha Final</label>
                    <input 
                      type="date"
                      value={reportEndDate}
                      onChange={(e) => setReportEndDate(e.target.value)}
                      className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-xl py-2 px-3 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                {/* Export data section */}
                <div className="bg-[#050505] border border-[#222] rounded-2xl p-4 mb-4">
                  <h4 className="text-[11px] text-[#7A724E] font-mono uppercase tracking-widest mb-3">Descargas y Auditoría del Sistema</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={triggerExportClients}
                      className="bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border border-[#222] text-xs font-bold uppercase p-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                    >
                      <FileDown className="w-4 h-4 text-[#7A724E]" />
                      <span>Exportar Socios</span>
                    </button>
                    <button
                      onClick={triggerExportLedger}
                      className="bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border border-[#222] text-xs font-bold uppercase p-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                    >
                      <FileDown className="w-4 h-4 text-[#7A724E]" />
                      <span>Exportar Caja</span>
                    </button>
                  </div>
                </div>

                {/* Ledger Table */}
                <h4 className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider mb-2">Transacciones en el Período seleccionado ({auditedPayments.length})</h4>
                <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-none">
                  {auditedPayments.length === 0 ? (
                    <p className="text-xs text-neutral-600 italic py-2 text-center">No hay registros de transacciones para este rango de fechas.</p>
                  ) : (
                    auditedPayments.map(pay => (
                      <div key={pay.id} className="p-3 bg-[#050505] border border-[#222] rounded-xl flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-black text-white">{pay.clientName}</span>
                            <span className="text-[8px] bg-[#7A724E]/10 text-[#7A724E] px-1 rounded font-mono font-bold">{pay.method}</span>
                          </div>
                          <p className="text-[9px] text-neutral-500 font-mono mt-0.5">
                            Membresía: {pay.planName} • Folio: {pay.folio}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-[#7A724E] font-mono">${pay.amount}</span>
                          <span className="text-[8px] text-neutral-500 font-mono block">{pay.date}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Ledger Summation */}
                <div className="mt-4 pt-3 border-t border-[#222] flex justify-between items-center px-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">Total Recaudado Auditado</span>
                  <span className="text-sm font-black text-[#7A724E] font-mono">
                    ${auditedPayments.reduce((sum, p) => sum + p.amount, 0)} MXN
                  </span>
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: GLOBAL ANNOUNCEMENTS & RECRUITMENT */}
          {activeTab === 'announcements' && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-[#111] border border-[#222] rounded-[32px] p-5 shadow-lg">
                <div className="flex items-center gap-1.5 mb-3">
                  <Bell className="w-4 h-4 text-[#7A724E]" />
                  <h4 className="text-xs text-white uppercase tracking-wider font-bold">Publicar Aviso en el Muro (PWA Socio)</h4>
                </div>
                {annSuccessMsg && (
                  <div className="bg-emerald-950/50 border border-emerald-900 text-emerald-400 p-2.5 rounded-xl text-xs flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{annSuccessMsg}</span>
                  </div>
                )}
                <form onSubmit={handleAnnPublish} className="space-y-3">
                  <div>
                    <label className="text-[9px] text-neutral-400 font-mono uppercase block mb-0.5">Título del Comunicado</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej. Clases de Yoga Suspendidas Temporalmente"
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                      className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-lg py-1.5 px-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-neutral-400 font-mono uppercase block mb-0.5">Contenido del Mensaje</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Describe a detalle las fechas, horarios, o pautas del comunicado..."
                      value={annContent}
                      onChange={(e) => setAnnContent(e.target.value)}
                      className="w-full bg-[#050505] border border-[#222] focus:border-[#7A724E]/50 rounded-lg py-1.5 px-2.5 text-xs text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="important-chk"
                      checked={annImportant}
                      onChange={(e) => setAnnImportant(e.target.checked)}
                      className="accent-[#7A724E]"
                    />
                    <label htmlFor="important-chk" className="text-[10px] text-neutral-300 font-mono select-none">
                      Marcar como Urgente (Resaltar en Rojo en PWA)
                    </label>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-[#7A724E] text-black font-extrabold uppercase py-2.5 rounded-xl text-xs transition-all active:scale-95 cursor-pointer shadow-md"
                  >
                    Publicar Aviso en Dragon Muro
                  </button>
                </form>
              </div>

              {/* Active notice list */}
              <div className="bg-[#111] border border-[#222] rounded-[32px] p-5 shadow-lg">
                <h4 className="text-xs text-neutral-400 uppercase tracking-wider font-mono mb-3">COMUNICADOS ACTIVOS ({announcements.length})</h4>
                <div className="space-y-3">
                  {announcements.map(ann => (
                    <div key={ann.id} className={`p-3.5 rounded-xl border ${ann.important ? 'bg-red-950/20 border-red-900/40' : 'bg-[#050505] border-neutral-800'} flex justify-between gap-4`}>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-white truncate">{ann.title}</h5>
                          {ann.important && <span className="text-[8px] bg-red-950 text-red-400 font-mono font-bold px-1.5 rounded uppercase">URGENTE</span>}
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed mt-1">{ann.content}</p>
                        <span className="text-[8px] text-neutral-500 font-mono mt-1 block">{ann.date}</span>
                      </div>
                      <button
                        onClick={() => onDeleteAnnouncement(ann.id)}
                        className="text-red-500/70 hover:text-red-400 shrink-0 self-start p-1 bg-black/40 rounded border border-neutral-800"
                        title="Borrar aviso"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ACCESOS QR */}
          {activeTab === 'qr_access' && (
            <div className="space-y-5 animate-fade-in text-left">
              <button 
                onClick={() => setActiveTab('metrics')}
                className="flex items-center gap-2 text-[10px] text-neutral-400 hover:text-white uppercase font-mono font-bold bg-[#111] border border-[#222] py-2 px-3.5 rounded-xl cursor-pointer transition-all active:scale-95 mb-1"
              >
                <span>← Volver al Dashboard (Métricas)</span>
              </button>
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
                  {qrAccesses.map(qr => {
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
                            {qr.status}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SUBIR RUTINAS */}
          {activeTab === 'workout_routines' && (
            <div className="space-y-5 animate-fade-in text-left">
              <button 
                onClick={() => setActiveTab('metrics')}
                className="flex items-center gap-2 text-[10px] text-neutral-400 hover:text-white uppercase font-mono font-bold bg-[#111] border border-[#222] py-2 px-3.5 rounded-xl cursor-pointer transition-all active:scale-95 mb-1"
              >
                <span>← Volver al Dashboard (Métricas)</span>
              </button>
              <div className="bg-[#111] border border-[#222] rounded-[32px] p-5 shadow-lg">
                <div className="flex items-center gap-1.5 mb-3">
                  <Video className="w-4 h-4 text-[#7A724E]" />
                  <h4 className="text-xs text-white uppercase tracking-wider font-bold">Subir Nueva Rutina de Video (Link YouTube)</h4>
                </div>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const title = formData.get('title') as string;
                    const level = formData.get('level') as 'Principiante' | 'Intermedio' | 'Avanzado';
                    const durationMin = parseInt(formData.get('durationMin') as string) || 45;
                    const videoUrl = formData.get('videoUrl') as string;
                    const description = formData.get('description') as string;
                    
                    if (!title || !videoUrl) return;

                    const exercises = [
                      { name: 'Ejercicio Principal A', sets: 4, reps: '8-10', weight: 'Moderado' },
                      { name: 'Ejercicio Principal B', sets: 3, reps: '10-12', weight: 'Moderado' },
                      { name: 'Ejercicio Secundario C', sets: 3, reps: '12-15', weight: 'Ligero' }
                    ];

                    onAddRoutine({
                      title,
                      level,
                      durationMin,
                      videoUrl,
                      description,
                      exercises
                    });

                    e.currentTarget.reset();
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Título de la Rutina</label>
                      <input 
                        type="text"
                        name="title"
                        required
                        placeholder="Ej. Rutina de Espalda y Bíceps Brutal"
                        className="w-full bg-[#050505] border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#7A724E]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Nivel del Socio</label>
                      <select 
                        name="level"
                        className="w-full bg-[#050505] border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#7A724E]"
                      >
                        <option value="Principiante">Principiante</option>
                        <option value="Intermedio">Intermedio</option>
                        <option value="Avanzado">Avanzado</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Duración del Entrenamiento (Minutos)</label>
                      <input 
                        type="number"
                        name="durationMin"
                        defaultValue={45}
                        required
                        className="w-full bg-[#050505] border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#7A724E]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Enlace de YouTube (Video de Demostración)</label>
                      <input 
                        type="url"
                        name="videoUrl"
                        required
                        placeholder="Ej. https://www.youtube.com/watch?v=..."
                        className="w-full bg-[#050505] border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#7A724E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Descripción / Recomendaciones de la Rutina</label>
                    <textarea 
                      name="description"
                      rows={2}
                      placeholder="Ej. Calienta 5 min antes. Mantén los codos pegados al cuerpo..."
                      className="w-full bg-[#050505] border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#7A724E] resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#7A724E] text-black font-extrabold uppercase py-3 rounded-xl text-xs transition-all active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Publicar Video de Rutina para Socios</span>
                  </button>
                </form>
              </div>

              {/* Published routines list */}
              <div className="bg-[#111] border border-[#222] rounded-[32px] p-5 shadow-lg">
                <h4 className="text-xs text-neutral-400 uppercase tracking-wider font-mono mb-3">RUTINAS DE VIDEO PUBLICADAS ({routines.length})</h4>
                <div className="space-y-4">
                  {routines.map(routine => (
                    <div key={routine.id} className="p-3.5 rounded-2xl border border-neutral-800 bg-[#050505] flex flex-col gap-3">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[8px] font-black uppercase font-mono px-2 py-0.5 rounded ${
                              routine.level === 'Principiante' ? 'bg-emerald-950 text-emerald-400' :
                              routine.level === 'Intermedio' ? 'bg-amber-950 text-amber-400' : 'bg-red-950 text-red-400'
                            }`}>
                              {routine.level}
                            </span>
                            <span className="text-[9px] text-neutral-500 font-mono">{routine.durationMin} Min</span>
                          </div>
                          <h5 className="text-xs font-bold text-white mt-1.5 uppercase">{routine.title}</h5>
                          {routine.description && <p className="text-[10px] text-neutral-400 leading-relaxed mt-1">{routine.description}</p>}
                          <span className="text-[9px] text-[#7A724E] font-mono block mt-1 truncate max-w-[220px]">{routine.videoUrl}</span>
                        </div>
                        
                        <button
                          onClick={() => onDeleteRoutine(routine.id)}
                          className="text-red-500/70 hover:text-red-400 p-2 bg-black/40 border border-neutral-800 rounded-xl"
                          title="Eliminar rutina"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Display dynamic exercise tags count */}
                      <div className="bg-black/30 border border-neutral-900 rounded-lg p-2.5">
                        <span className="text-[8px] font-mono text-neutral-500 block uppercase mb-1">Tabla de Ejercicios de Muestra ({routine.exercises.length})</span>
                        <div className="flex flex-wrap gap-1.5">
                          {routine.exercises.map((ex, idx) => (
                            <span key={idx} className="text-[8.5px] bg-[#7A724E]/10 border border-[#7A724E]/20 text-neutral-300 font-mono px-2 py-0.5 rounded-full">
                              {ex.name} ({ex.sets}x{ex.reps})
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* SuperAdmin Navigation tabs (Perfect layout inside frame) */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-[#111111]/95 backdrop-blur-lg border-t border-[#222] flex items-center justify-center px-4 z-30">
        <div className="max-w-xl mx-auto w-full flex items-center justify-between overflow-x-auto scrollbar-none py-1">
          
          <button 
            id="btn-admin-tab-metrics"
            onClick={() => setActiveTab('metrics')}
            className={`flex flex-col items-center gap-1 transition-all shrink-0 px-2 cursor-pointer ${activeTab === 'metrics' ? 'text-[#7A724E]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <Activity className="w-4 h-4" />
            <span className="text-[8px] font-mono uppercase font-black tracking-wider">Métricas</span>
          </button>

          <button 
            id="btn-admin-tab-plans"
            onClick={() => setActiveTab('plans')}
            className={`flex flex-col items-center gap-1 transition-all shrink-0 px-2 cursor-pointer ${activeTab === 'plans' ? 'text-[#7A724E]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <DollarSign className="w-4 h-4" />
            <span className="text-[8px] font-mono uppercase font-black tracking-wider">Precios</span>
          </button>

          <button 
            id="btn-admin-tab-staff"
            onClick={() => setActiveTab('staff')}
            className={`flex flex-col items-center gap-1 transition-all shrink-0 px-2 cursor-pointer ${activeTab === 'staff' ? 'text-[#7A724E]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[8px] font-mono uppercase font-black tracking-wider">Personal</span>
          </button>

          <button 
            id="btn-admin-tab-socios"
            onClick={() => setActiveTab('socios')}
            className={`flex flex-col items-center gap-1 transition-all shrink-0 px-2 cursor-pointer ${activeTab === 'socios' ? 'text-[#7A724E]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <UserCheck className="w-4 h-4" />
            <span className="text-[8px] font-mono uppercase font-black tracking-wider">Socios</span>
          </button>

          <button 
            id="btn-admin-tab-qr-access"
            onClick={() => setActiveTab('qr_access')}
            className={`flex flex-col items-center gap-1 transition-all shrink-0 px-2 cursor-pointer ${activeTab === 'qr_access' ? 'text-[#7A724E]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <QrCode className="w-4 h-4 text-[#7A724E]" />
            <span className="text-[8px] font-mono uppercase font-black tracking-wider">Pases QR</span>
          </button>

          <button 
            id="btn-admin-tab-workout-routines"
            onClick={() => setActiveTab('workout_routines')}
            className={`flex flex-col items-center gap-1 transition-all shrink-0 px-2 cursor-pointer ${activeTab === 'workout_routines' ? 'text-[#7A724E]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <Video className="w-4 h-4 text-[#7A724E]" />
            <span className="text-[8px] font-mono uppercase font-black tracking-wider">Rutinas</span>
          </button>

          <button 
            id="btn-admin-tab-reports"
            onClick={() => setActiveTab('reports')}
            className={`flex flex-col items-center gap-1 transition-all shrink-0 px-2 cursor-pointer ${activeTab === 'reports' ? 'text-[#7A724E]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-[8px] font-mono uppercase font-black tracking-wider">Auditoría</span>
          </button>

          <button 
            id="btn-admin-tab-announcements"
            onClick={() => setActiveTab('announcements')}
            className={`flex flex-col items-center gap-1 transition-all shrink-0 px-2 cursor-pointer ${activeTab === 'announcements' ? 'text-[#7A724E]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <Bell className="w-4 h-4" />
            <span className="text-[8px] font-mono uppercase font-black tracking-wider">Avisos</span>
          </button>

        </div>
      </div>

    </div>
  );
}
