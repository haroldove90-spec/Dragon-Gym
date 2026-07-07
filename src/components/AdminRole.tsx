import React, { useState } from 'react';
import { 
  Users, Calendar, Bell, Plus, Trash2, Search, ToggleLeft, ToggleRight, 
  Sparkles, Award, ShieldAlert, Check, CheckCircle2, UserPlus, FileText, Dumbbell
} from 'lucide-react';
import { Client, GymClass, Announcement } from '../types';

interface AdminRoleProps {
  clients: Client[];
  classes: GymClass[];
  announcements: Announcement[];
  onAddClient: (client: Omit<Client, 'id' | 'completedWorkouts' | 'streakDays' | 'weightHistory'> & { initialWeight: number }) => void;
  onDeleteClient: (id: string) => void;
  onToggleClientStatus: (id: string) => void;
  onAddClass: (newClass: Omit<GymClass, 'id' | 'bookedCount'>) => void;
  onDeleteClass: (id: string) => void;
  onPublishAnnouncement: (title: string, content: string, important: boolean) => void;
  onDeleteAnnouncement: (id: string) => void;
}

type AdminTab = 'members' | 'classes' | 'announcements';

export default function AdminRole({
  clients,
  classes,
  announcements,
  onAddClient,
  onDeleteClient,
  onToggleClientStatus,
  onAddClass,
  onDeleteClass,
  onPublishAnnouncement,
  onDeleteAnnouncement
}: AdminRoleProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('members');
  
  // Search state for members
  const [memberSearch, setMemberSearch] = useState('');

  // Add Member form state
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberPlan, setMemberPlan] = useState<'Mensual' | 'Trimestral' | 'Anual'>('Mensual');
  const [memberWeight, setMemberWeight] = useState('');
  const [memberError, setMemberError] = useState('');

  // Add Class form state
  const [showAddClass, setShowAddClass] = useState(false);
  const [className, setClassName] = useState('');
  const [classInstructor, setClassInstructor] = useState('');
  const [classTime, setClassTime] = useState('');
  const [classDay, setClassDay] = useState<'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo'>('Lunes');
  const [classCapacity, setClassCapacity] = useState('15');
  const [classError, setClassError] = useState('');

  // Announcement form state
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annImportant, setAnnImportant] = useState(false);
  const [annSuccessMsg, setAnnSuccessMsg] = useState('');

  // Filter clients based on search
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  // Totals for Dashboard stats
  const totalActive = clients.filter(c => c.status === 'Activo').length;
  const totalMembers = clients.length;
  const averageStreak = clients.length > 0 
    ? Math.round(clients.reduce((acc, c) => acc + c.streakDays, 0) / clients.length) 
    : 0;

  // Handle client submit
  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberEmail.trim()) {
      setMemberError('Por favor ingresa nombre y correo');
      return;
    }
    const weightVal = parseFloat(memberWeight);
    if (isNaN(weightVal) || weightVal <= 20) {
      setMemberError('Ingresa un peso inicial válido (mayor a 20)');
      return;
    }

    onAddClient({
      name: memberName,
      email: memberEmail,
      phone: memberPhone || '+34 600 000 000',
      plan: memberPlan,
      status: 'Activo',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200', // Default clean male/female placeholder
      joinDate: new Date().toLocaleDateString('es-ES'),
      initialWeight: weightVal
    });

    // Reset
    setMemberName('');
    setMemberEmail('');
    setMemberPhone('');
    setMemberPlan('Mensual');
    setMemberWeight('');
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

  return (
    <div className="flex flex-col h-full bg-[#050505] relative overflow-hidden">
      
      {/* Top mini dashboard banner */}
      <div className="bg-[#111] px-4 py-3 border-b border-[#222] shrink-0">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex justify-between items-center mb-2.5">
            <div>
              <span className="text-[9px] font-mono text-[#ccff00] uppercase tracking-widest font-bold">Consola de Control</span>
              <h3 className="text-sm font-black text-white tracking-tight font-display">IRON CONTROL HUB</h3>
            </div>
            <div className="bg-[#ccff00] text-black text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full font-mono">
              SALA ONLINE
            </div>
          </div>

          {/* Real-time Statistics grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#050505] border border-[#222] rounded-xl p-2 text-center">
              <span className="text-[8px] text-neutral-400 uppercase font-mono block">Socios</span>
              <span className="text-xs font-bold text-white font-mono">{totalActive} <span className="text-[9px] text-neutral-500">/ {totalMembers}</span></span>
            </div>
            <div className="bg-[#050505] border border-[#222] rounded-xl p-2 text-center">
              <span className="text-[8px] text-neutral-400 uppercase font-mono block">Clases</span>
              <span className="text-xs font-bold text-[#ccff00] font-mono">{classes.length} hoy</span>
            </div>
            <div className="bg-[#050505] border border-[#222] rounded-xl p-2 text-center">
              <span className="text-[8px] text-neutral-400 uppercase font-mono block">Prom. Racha</span>
              <span className="text-xs font-bold text-white font-mono">{averageStreak} d</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab area */}
      <div className="flex-1 overflow-y-auto scrollbar-none pb-20">
        <div className="max-w-3xl mx-auto w-full px-6 py-4">
        
        {/* TAB 1: MEMBER MANAGEMENT */}
        {activeTab === 'members' && (
          <div className="flex flex-col gap-3 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs text-neutral-400 uppercase tracking-wider font-mono">Directorio</h4>
                <h3 className="text-sm font-bold text-white">Socios Registrados</h3>
              </div>
              <button 
                id="btn-trigger-add-member"
                onClick={() => setShowAddMember(!showAddMember)}
                className="bg-[#ccff00] hover:bg-[#d9ff26] text-black text-[10px] font-extrabold uppercase tracking-wide py-1.5 px-3 rounded-xl flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-lg"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Socio</span>
              </button>
            </div>

            {/* Sliding Form to Add Member */}
            {showAddMember && (
              <div className="bg-[#111] border border-[#ccff00]/30 rounded-[24px] p-4 animate-fade-in shadow-xl">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-mono text-[#ccff00] uppercase tracking-wider">REGISTRAR NUEVO SOCIO</h4>
                  <button 
                    id="btn-close-add-member"
                    onClick={() => setShowAddMember(false)} 
                    className="text-white/40 hover:text-white text-xs font-bold font-mono"
                  >
                    Cerrar
                  </button>
                </div>

                <form onSubmit={handleAddClientSubmit} className="space-y-3">
                  <div>
                    <label className="text-[9px] text-neutral-400 uppercase font-mono block mb-1">Nombre Completo</label>
                    <input 
                      id="form-member-name"
                      type="text" 
                      required
                      placeholder="e.g. Carlos Mendoza"
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      className="w-full bg-black text-white border border-[#222] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ccff00]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-neutral-400 uppercase font-mono block mb-1">Correo Electrónico</label>
                      <input 
                        id="form-member-email"
                        type="email" 
                        required
                        placeholder="carlos@gmail.com"
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                        className="w-full bg-black text-white border border-[#222] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ccff00]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-neutral-400 uppercase font-mono block mb-1">Teléfono</label>
                      <input 
                        id="form-member-phone"
                        type="text" 
                        placeholder="+34 600..."
                        value={memberPhone}
                        onChange={(e) => setMemberPhone(e.target.value)}
                        className="w-full bg-black text-white border border-[#222] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ccff00]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-neutral-400 uppercase font-mono block mb-1">Plan de Suscripción</label>
                      <select 
                        id="form-member-plan"
                        value={memberPlan}
                        onChange={(e) => setMemberPlan(e.target.value as any)}
                        className="w-full bg-black text-white border border-[#222] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ccff00] cursor-pointer text-white"
                      >
                        <option value="Mensual">Mensual</option>
                        <option value="Trimestral">Trimestral</option>
                        <option value="Anual">Anual</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] text-neutral-400 uppercase font-mono block mb-1">Peso Inicial (kg)</label>
                      <input 
                        id="form-member-weight"
                        type="number" 
                        required
                        placeholder="75.5"
                        value={memberWeight}
                        onChange={(e) => setMemberWeight(e.target.value)}
                        className="w-full bg-black text-white border border-[#222] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ccff00]"
                      />
                    </div>
                  </div>

                  {memberError && (
                    <p className="text-red-400 text-[10px] font-mono">{memberError}</p>
                  )}

                  <button 
                    id="btn-submit-add-member"
                    type="submit"
                    className="w-full bg-[#ccff00] hover:bg-[#d9ff26] text-black font-extrabold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-lg"
                  >
                    Guardar Nuevo Socio
                  </button>
                </form>
              </div>
            )}

            {/* Member Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
              <input 
                id="search-member-input"
                type="text" 
                placeholder="Buscar socio por nombre o correo..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full bg-[#111] border border-[#222] rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-[#ccff00] text-white"
              />
            </div>

            {/* Members List */}
            <div className="space-y-2">
              {filteredClients.map(c => (
                <div key={c.id} className="bg-[#111] border border-[#222] rounded-[20px] p-3 flex justify-between items-center group hover:border-neutral-800 transition-all">
                  <div className="flex items-center gap-3">
                    <img 
                      src={c.avatar} 
                      alt={c.name} 
                      className="w-10 h-10 rounded-full object-cover border border-[#222] shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#ccff00] transition-all">{c.name}</h4>
                      <p className="text-[10px] text-neutral-400 truncate max-w-[150px] font-mono">{c.email}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-neutral-500">
                        <span>Plan: <strong className="text-neutral-300 font-normal">{c.plan}</strong></span>
                        <span>•</span>
                        <span>Ingreso: <strong className="text-neutral-300 font-normal">{c.joinDate}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Active/Inactive Status Toggle */}
                    <button
                      id={`btn-toggle-status-${c.id}`}
                      onClick={() => onToggleClientStatus(c.id)}
                      className="flex items-center gap-1 py-1 px-2 rounded-lg bg-black/40 border border-[#222] text-[9px] font-mono hover:border-neutral-800 active:scale-95 transition-all cursor-pointer"
                      title="Cambiar Estado de Suscripción"
                    >
                      <span className={`w-2 h-2 rounded-full ${c.status === 'Activo' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      <span className={c.status === 'Activo' ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                        {c.status}
                      </span>
                    </button>

                    {/* Delete client button */}
                    <button 
                      id={`btn-delete-member-${c.id}`}
                      onClick={() => onDeleteClient(c.id)}
                      className="text-neutral-500 hover:text-red-400 p-1.5 rounded-lg bg-black/20 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 active:scale-95 transition-all cursor-pointer"
                      title="Eliminar Socio"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredClients.length === 0 && (
                <div className="text-center py-8 text-neutral-500 text-xs">
                  Ningún socio coincide con la búsqueda
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CLASS MANAGEMENT */}
        {activeTab === 'classes' && (
          <div className="flex flex-col gap-3 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs text-neutral-400 uppercase tracking-wider font-mono">Planificación</h4>
                <h3 className="text-sm font-bold text-white">Clases Programadas</h3>
              </div>
              <button 
                id="btn-trigger-add-class"
                onClick={() => setShowAddClass(!showAddClass)}
                className="bg-[#ccff00] hover:bg-[#d9ff26] text-black text-[10px] font-extrabold uppercase tracking-wide py-1.5 px-3 rounded-xl flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-lg"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>+ Clase</span>
              </button>
            </div>

            {/* Sliding Form to Add Class */}
            {showAddClass && (
              <div className="bg-[#111] border border-[#ccff00]/30 rounded-[24px] p-4 animate-fade-in shadow-xl">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-mono text-[#ccff00] uppercase tracking-wider">CREAR NUEVA CLASE</h4>
                  <button 
                    id="btn-close-add-class"
                    onClick={() => setShowAddClass(false)} 
                    className="text-white/40 hover:text-white text-xs font-bold font-mono"
                  >
                    Cerrar
                  </button>
                </div>

                <form onSubmit={handleAddClassSubmit} className="space-y-3">
                  <div>
                    <label className="text-[9px] text-neutral-400 uppercase font-mono block mb-1">Nombre de la Clase</label>
                    <input 
                      id="form-class-name"
                      type="text" 
                      required
                      placeholder="e.g. CrossFit WOD / Spinning HIIT"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="w-full bg-black text-white border border-[#222] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ccff00]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-neutral-400 uppercase font-mono block mb-1">Instructor</label>
                      <input 
                        id="form-class-instructor"
                        type="text" 
                        required
                        placeholder="e.g. Marcos Rubio"
                        value={classInstructor}
                        onChange={(e) => setClassInstructor(e.target.value)}
                        className="w-full bg-black text-white border border-[#222] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ccff00]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-neutral-400 uppercase font-mono block mb-1">Horario (Rango)</label>
                      <input 
                        id="form-class-time"
                        type="text" 
                        required
                        placeholder="e.g. 19:00 - 20:00"
                        value={classTime}
                        onChange={(e) => setClassTime(e.target.value)}
                        className="w-full bg-black text-white border border-[#222] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ccff00] font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-neutral-400 uppercase font-mono block mb-1">Día</label>
                      <select 
                        id="form-class-day"
                        value={classDay}
                        onChange={(e) => setClassDay(e.target.value as any)}
                        className="w-full bg-black text-white border border-[#222] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ccff00] cursor-pointer"
                      >
                        <option value="Lunes">Lunes</option>
                        <option value="Martes">Martes</option>
                        <option value="Miércoles">Miércoles</option>
                        <option value="Jueves">Jueves</option>
                        <option value="Viernes">Viernes</option>
                        <option value="Sábado">Sábado</option>
                        <option value="Domingo">Domingo</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] text-neutral-400 uppercase font-mono block mb-1">Capacidad Máxima</label>
                      <input 
                        id="form-class-capacity"
                        type="number" 
                        required
                        value={classCapacity}
                        onChange={(e) => setClassCapacity(e.target.value)}
                        className="w-full bg-black text-white border border-[#222] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ccff00] font-mono"
                      />
                    </div>
                  </div>

                  {classError && (
                    <p className="text-red-400 text-[10px] font-mono">{classError}</p>
                  )}

                  <button 
                    id="btn-submit-add-class"
                    type="submit"
                    className="w-full bg-[#ccff00] hover:bg-[#d9ff26] text-black font-extrabold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-lg"
                  >
                    Publicar Clase
                  </button>
                </form>
              </div>
            )}

            {/* List of classes */}
            <div className="space-y-2">
              {classes.map(cl => (
                <div key={cl.id} className="bg-[#111] border border-[#222] rounded-[20px] p-3.5 flex justify-between items-center hover:border-neutral-800 transition-all">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-[#ccff00]/10 text-[#ccff00] px-2 py-0.5 rounded-md font-mono uppercase font-bold">
                        {cl.day}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {cl.time}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-1">{cl.name}</h4>
                    <p className="text-[10px] text-neutral-400">Prof: <span className="text-white/80">{cl.instructor}</span></p>
                    <p className="text-[10px] text-neutral-500 font-mono mt-0.5">Cupos: {cl.bookedCount} inscritos de {cl.capacity}</p>
                  </div>

                  <button 
                    id={`btn-delete-class-${cl.id}`}
                    onClick={() => onDeleteClass(cl.id)}
                    className="text-neutral-500 hover:text-red-400 p-1.5 rounded-lg bg-black/20 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 active:scale-95 transition-all cursor-pointer"
                    title="Eliminar Clase"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ANNOUNCEMENTS BROADCASTER */}
        {activeTab === 'announcements' && (
          <div className="flex flex-col gap-3 animate-fade-in">
            <div>
              <h4 className="text-xs text-neutral-400 uppercase tracking-wider font-mono">Comunicación</h4>
              <h3 className="text-sm font-bold text-white">Mensajería y Avisos</h3>
              <p className="text-[11px] text-neutral-400 font-serif italic">Publica avisos globales que aparecerán en las pantallas de inicio de todos tus atletas.</p>
            </div>

            {/* Publication Form */}
            <div className="bg-[#111] border border-[#222] rounded-[24px] p-4">
              <h4 className="text-xs font-mono text-[#ccff00] uppercase tracking-wider mb-3">REDACTAR NUEVO ENVIÓ</h4>
              
              <form onSubmit={handleAnnPublish} className="space-y-3">
                <div>
                  <label className="text-[9px] text-neutral-400 uppercase font-mono block mb-1">Título del Aviso</label>
                  <input 
                    id="form-announce-title"
                    type="text" 
                    required
                    placeholder="e.g. Mantenimiento de Máquinas / Festivos"
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    className="w-full bg-black text-white border border-[#222] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ccff00]"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-neutral-400 uppercase font-mono block mb-1">Contenido del Mensaje</label>
                  <textarea 
                    id="form-announce-content"
                    required
                    rows={3}
                    placeholder="Escribe aquí los detalles del anuncio motivacional o informativo..."
                    value={annContent}
                    onChange={(e) => setAnnContent(e.target.value)}
                    className="w-full bg-black text-white border border-[#222] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ccff00] resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    id="form-announce-important"
                    type="checkbox"
                    checked={annImportant}
                    onChange={(e) => setAnnImportant(e.target.checked)}
                    className="rounded border-[#222] text-[#ccff00] focus:ring-[#ccff00] bg-black cursor-pointer"
                  />
                  <label htmlFor="form-announce-important" className="text-[11px] text-neutral-300 select-none cursor-pointer">
                    Marcar como importante / urgente (Borde de aviso)
                  </label>
                </div>

                {annSuccessMsg && (
                  <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-2.5 rounded-xl text-[10.5px] flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{annSuccessMsg}</span>
                  </div>
                )}

                <button 
                  id="btn-publish-announce"
                  type="submit"
                  className="w-full bg-[#ccff00] hover:bg-[#d9ff26] text-black font-extrabold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer shadow-lg"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Publicar en Pantallas</span>
                </button>
              </form>
            </div>

            {/* List of current announcements to delete */}
            <div className="space-y-2 mt-2">
              <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">AVISOS ACTIVOS ({announcements.length})</h4>
              
              {announcements.map(ann => (
                <div 
                  key={ann.id} 
                  className={`bg-[#111] border rounded-[20px] p-3.5 flex justify-between items-start ${
                    ann.important ? 'border-[#ccff00]/40 bg-[#ccff00]/5' : 'border-[#222]'
                  }`}
                >
                  <div className="space-y-1 pr-2">
                    <span className="text-[8px] font-mono text-neutral-500 uppercase block">{ann.date}</span>
                    <h5 className="text-xs font-bold text-white leading-tight">{ann.title}</h5>
                    <p className="text-[10px] text-neutral-300 leading-snug font-serif italic">"{ann.content}"</p>
                  </div>

                  <button 
                    id={`btn-delete-announce-${ann.id}`}
                    onClick={() => onDeleteAnnouncement(ann.id)}
                    className="text-neutral-500 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 active:scale-95 transition-all shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        </div>
      </div>

      {/* Admin Bottom Navigation Tabs */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-[#111111]/95 backdrop-blur-lg border-t border-[#222] flex items-center justify-center px-4 z-30">
        <div className="max-w-xl mx-auto w-full flex items-center justify-around">
          <button 
            id="btn-admin-tab-members"
            onClick={() => setActiveTab('members')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === 'members' ? 'text-[#ccff00]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[9px] font-mono uppercase font-bold tracking-wider">Socios</span>
          </button>

          <button 
            id="btn-admin-tab-classes"
            onClick={() => setActiveTab('classes')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === 'classes' ? 'text-[#ccff00]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[9px] font-mono uppercase font-bold tracking-wider">Clases</span>
          </button>

          <button 
            id="btn-admin-tab-notices"
            onClick={() => setActiveTab('announcements')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === 'announcements' ? 'text-[#ccff00]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <Bell className="w-5 h-5" />
            <span className="text-[9px] font-mono uppercase font-bold tracking-wider">Avisos</span>
          </button>
        </div>
      </div>

    </div>
  );
}
