import React, { useState } from 'react';
import { 
  Dumbbell, Calendar, BarChart3, QrCode, Sparkles, Flame, CheckCircle2, 
  Trash2, Plus, Play, Award, Scale, Bell, Heart, Trophy, UserCheck 
} from 'lucide-react';
import { Client, GymClass, Announcement, WorkoutRoutine } from '../types';
import { WORKOUT_ROUTINES } from '../data/mockData';

interface ClientRoleProps {
  clients: Client[];
  classes: GymClass[];
  announcements: Announcement[];
  bookings: { classId: string; date: string }[];
  onBookClass: (classId: string) => void;
  onCancelBooking: (classId: string) => void;
  onAddWeightRecord: (clientId: string, weight: number, date: string) => void;
  onCompleteWorkout: (clientId: string) => void;
  activeClientId: string;
  onChangeClient: (id: string) => void;
}

type TabType = 'dashboard' | 'classes' | 'progress' | 'pass';

export default function ClientRole({
  clients,
  classes,
  announcements,
  bookings,
  onBookClass,
  onCancelBooking,
  onAddWeightRecord,
  onCompleteWorkout,
  activeClientId,
  onChangeClient
}: ClientRoleProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  // Find currently logged-in client
  const client = clients.find(c => c.id === activeClientId) || clients[0];
  
  // Workout Tracker Modal State
  const [activeWorkout, setActiveWorkout] = useState<WorkoutRoutine | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);

  // Add new weight state
  const [newWeight, setNewWeight] = useState('');
  const [newWeightDate, setNewWeightDate] = useState('');
  const [weightError, setWeightError] = useState('');

  // Handle active workout click
  const handleStartWorkout = (routine: WorkoutRoutine) => {
    setActiveWorkout(routine);
    setCompletedExercises({});
  };

  const toggleExercise = (exName: string) => {
    setCompletedExercises(prev => ({
      ...prev,
      [exName]: !prev[exName]
    }));
  };

  const handleFinishWorkout = () => {
    if (!activeWorkout) return;
    onCompleteWorkout(client.id);
    setActiveWorkout(null);
    setShowSuccessAnim(true);
    setTimeout(() => {
      setShowSuccessAnim(false);
    }, 4000);
  };

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightVal = parseFloat(newWeight);
    if (isNaN(weightVal) || weightVal <= 20 || weightVal > 300) {
      setWeightError('Ingresa un peso válido (20 - 300 kg)');
      return;
    }
    const dateVal = newWeightDate.trim() || new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    onAddWeightRecord(client.id, weightVal, dateVal);
    setNewWeight('');
    setNewWeightDate('');
    setWeightError('');
  };

  // Check if class is booked by client
  const isClassBooked = (classId: string) => {
    return bookings.some(b => b.classId === classId);
  };

  // Weight history coordinates calculation for custom SVG graph
  const renderWeightGraph = () => {
    const history = client.weightHistory || [];
    if (history.length === 0) return null;

    const weights = history.map(h => h.weight);
    const maxWeight = Math.max(...weights) + 1;
    const minWeight = Math.min(...weights) - 1;
    const range = maxWeight - minWeight || 1;

    const width = 310;
    const height = 140;
    const paddingLeft = 30;
    const paddingBottom = 20;
    const paddingTop = 10;
    const paddingRight = 10;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Map each data point to svg coordinate
    const points = history.map((record, index) => {
      const x = paddingLeft + (index / (history.length - 1 || 1)) * chartWidth;
      const y = paddingTop + chartHeight - ((record.weight - minWeight) / range) * chartHeight;
      return { x, y, ...record };
    });

    // Create Path SVG
    let pathData = '';
    let areaData = '';
    
    if (points.length > 0) {
      pathData = `M ${points[0].x} ${points[0].y}`;
      areaData = `M ${points[0].x} ${height - paddingBottom}`;
      areaData += ` L ${points[0].x} ${points[0].y}`;
      
      for (let i = 1; i < points.length; i++) {
        pathData += ` L ${points[i].x} ${points[i].y}`;
        areaData += ` L ${points[i].x} ${points[i].y}`;
      }
      
      areaData += ` L ${points[points.length - 1].x} ${height - paddingBottom} Z`;
    }

    return (
      <div className="relative bg-[#111] rounded-[24px] border border-[#222] p-4 shadow-xl">
        <h4 className="text-[10px] font-mono text-neutral-400 tracking-wider uppercase mb-3">HISTORIAL DE PESO (kg)</h4>
        
        <svg className="w-full h-[140px]" viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ccff00" stopOpacity="0.25"/>
              <stop offset="100%" stopColor="#ccff00" stopOpacity="0.0"/>
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <line x1={paddingLeft} y1={paddingTop} x2={width - paddingRight} y2={paddingTop} stroke="#222" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={paddingLeft} y1={paddingTop + chartHeight / 2} x2={width - paddingRight} y2={paddingTop + chartHeight / 2} stroke="#222" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="#222" strokeWidth="1" />

          {/* Area under the line */}
          {points.length > 0 && (
            <path d={areaData} fill="url(#chartGlow)" />
          )}

          {/* Main line */}
          {points.length > 0 && (
            <path d={pathData} fill="none" stroke="#ccff00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          )}

          {/* Data points & Tooltip labels */}
          {points.map((pt, i) => (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r="4" fill="#000" stroke="#ccff00" strokeWidth="2.5" />
              {/* Highlight weight number above point */}
              <text 
                x={pt.x} 
                y={pt.y - 8} 
                textAnchor="middle" 
                fill="#FFF" 
                fontSize="9" 
                fontWeight="bold"
                className="font-mono bg-black"
              >
                {pt.weight}
              </text>
              {/* Date label at bottom */}
              <text 
                x={pt.x} 
                y={height - 4} 
                textAnchor="middle" 
                fill="#555" 
                fontSize="8"
                fontWeight="500"
              >
                {pt.date}
              </text>
            </g>
          ))}
          
          {/* Y-Axis scale markers */}
          <text x={paddingLeft - 6} y={paddingTop + 3} textAnchor="end" fill="#555" fontSize="8" fontWeight="bold">{maxWeight.toFixed(0)}</text>
          <text x={paddingLeft - 6} y={paddingTop + chartHeight / 2 + 3} textAnchor="end" fill="#555" fontSize="8" fontWeight="bold">{((maxWeight + minWeight)/2).toFixed(0)}</text>
          <text x={paddingLeft - 6} y={height - paddingBottom + 3} textAnchor="end" fill="#555" fontSize="8" fontWeight="bold">{minWeight.toFixed(0)}</text>
        </svg>

        <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#222] text-[11px] text-neutral-400">
          <span>Último peso: <strong className="text-white font-mono">{weights[weights.length - 1]} kg</strong></span>
          <span>Diferencia: <strong className={weights[weights.length - 1] < weights[0] ? "text-green-400 font-mono" : "text-[#ccff00] font-mono"}>
            {(weights[weights.length - 1] - weights[0]).toFixed(1)} kg
          </strong></span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] relative overflow-hidden">
      
      {/* Simulation Banner Switcher */}
      <div className="bg-[#111] px-4 py-1.5 flex items-center justify-between border-b border-[#222] z-20">
        <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest font-mono flex items-center gap-1">
          <UserCheck className="w-3 h-3 text-[#ccff00]" />
          <span>Ver como:</span>
        </label>
        <select 
          id="client-profile-switcher"
          value={activeClientId} 
          onChange={(e) => onChangeClient(e.target.value)}
          className="bg-black text-[11px] text-[#ccff00] border border-[#222] rounded-md px-1.5 py-0.5 outline-none font-semibold focus:border-[#ccff00] cursor-pointer"
        >
          {clients.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.plan})
            </option>
          ))}
        </select>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto scrollbar-none pb-20">
        <div className="max-w-3xl mx-auto w-full px-6 py-4">
        
        {/* SUCCESS CELEBRATION FLOATING POPUP */}
        {showSuccessAnim && (
          <div className="absolute inset-x-4 top-16 bg-[#ccff00] text-black p-4 rounded-2xl shadow-[0_10px_30px_rgba(204,255,0,0.4)] z-50 animate-bounce flex items-center gap-3 border border-[#b8e600]">
            <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-xl">🎉</div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider font-display">¡Rutina Completada!</h4>
              <p className="text-[10px] text-black/80 font-serif italic">Se sumó a tus estadísticas de entrenamiento diario. ¡Sigue así!</p>
            </div>
          </div>
        )}

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* Header / Avatar info based on the yellow dashboard screen */}
            <div className="flex items-center justify-between mt-1">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] font-mono">Panel del Socio</span>
                <h2 className="text-lg font-black text-white tracking-tight leading-tight flex items-center gap-1.5">
                  ¡Hola, {client.name.split(' ')[0]}! <span className="animate-pulse">⚡</span>
                </h2>
                <p className="text-[11px] text-[#ccff00]/80 font-serif italic">"Supera tus límites hoy"</p>
              </div>
              <div className="relative">
                <img 
                  src={client.avatar} 
                  alt={client.name} 
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.3)]"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#050505]"></span>
              </div>
            </div>

            {/* Daily stats - Grid mimicking the design */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#111] border border-[#222] rounded-[20px] p-3 flex flex-col items-center text-center">
                <Flame className="w-5 h-5 text-[#ccff00] mb-1" />
                <span className="text-[9px] text-neutral-400 font-mono uppercase">Racha</span>
                <span className="text-sm font-black text-white mt-0.5">{client.streakDays} <span className="text-[10px] text-[#ccff00]">días</span></span>
              </div>
              <div className="bg-[#111] border border-[#222] rounded-[20px] p-3 flex flex-col items-center text-center">
                <Dumbbell className="w-5 h-5 text-[#ccff00] mb-1" />
                <span className="text-[9px] text-neutral-400 font-mono uppercase">Sesiones</span>
                <span className="text-sm font-black text-white mt-0.5">{client.completedWorkouts}</span>
              </div>
              <div className="bg-[#111] border border-[#222] rounded-[20px] p-3 flex flex-col items-center text-center">
                <Scale className="w-5 h-5 text-[#ccff00] mb-1" />
                <span className="text-[9px] text-neutral-400 font-mono uppercase">Peso</span>
                <span className="text-sm font-black text-white mt-0.5">
                  {client.weightHistory?.[client.weightHistory.length - 1]?.weight || '--'} <span className="text-[9px] font-normal text-neutral-400">kg</span>
                </span>
              </div>
            </div>

            {/* Important Broadcast from Admin, if any exists */}
            {announcements.length > 0 && (
              <div className="bg-[#ccff00]/5 border border-[#ccff00]/20 rounded-[20px] p-3.5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#ccff00]/5 rounded-full blur-xl pointer-events-none"></div>
                <div className="flex items-start gap-2.5">
                  <div className="bg-[#ccff00] text-black p-1.5 rounded-lg shrink-0 mt-0.5">
                    <Bell className="w-3.5 h-3.5 animate-ring" />
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-[#ccff00] uppercase tracking-widest font-bold">AVISO DEL CLUB</span>
                    <h4 className="text-xs font-bold text-white mt-0.5 leading-snug">{announcements[0].title}</h4>
                    <p className="text-[10.5px] text-neutral-300 mt-1 leading-normal font-serif italic">"{announcements[0].content}"</p>
                  </div>
                </div>
              </div>
            )}

            {/* Workout of the day block */}
            <div className="bg-[#ccff00] text-black rounded-[28px] p-4 shadow-xl">
              <div className="flex justify-between items-center mb-2">
                <div className="bg-black/10 text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full font-mono">
                  NIVEL: {WORKOUT_ROUTINES[0].level}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold font-mono">
                  <Flame className="w-3.5 h-3.5 text-black" />
                  <span>{WORKOUT_ROUTINES[0].durationMin} MIN</span>
                </div>
              </div>

              <span className="text-[10px] font-mono tracking-wider opacity-60 uppercase block">RUTINA SUGERIDA DE HOY</span>
              <h3 className="text-base font-black uppercase tracking-wide mt-0.5 leading-tight font-display">{WORKOUT_ROUTINES[0].title}</h3>
              
              <div className="mt-3 space-y-1.5 bg-black/5 p-2 rounded-xl">
                {WORKOUT_ROUTINES[0].exercises.slice(0, 3).map((ex, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[11px] font-medium border-b border-black/5 pb-1 last:border-0 last:pb-0">
                    <span>{ex.name}</span>
                    <span className="font-mono text-black/70">{ex.sets}x{ex.reps}</span>
                  </div>
                ))}
                {WORKOUT_ROUTINES[0].exercises.length > 3 && (
                  <p className="text-[9px] text-black/50 text-right font-mono">+ {WORKOUT_ROUTINES[0].exercises.length - 3} más...</p>
                )}
              </div>

              <button 
                id="btn-start-workout"
                onClick={() => handleStartWorkout(WORKOUT_ROUTINES[0])}
                className="w-full bg-black hover:bg-neutral-900 text-[#ccff00] text-xs font-bold uppercase tracking-widest py-3 rounded-2xl shadow-lg mt-4 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Iniciar Entrenamiento</span>
              </button>
            </div>

            {/* Quick Tips */}
            <div className="bg-[#111] border border-[#222] rounded-[24px] p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ccff00]/10 flex items-center justify-center text-[#ccff00] shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Objetivo Semanal</h4>
                <p className="text-[10.5px] text-neutral-400 leading-relaxed mt-0.5 font-serif italic">Completa 3 entrenamientos esta semana para mantener tu racha activa.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CLASSES BOOKING */}
        {activeTab === 'classes' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="mb-1">
              <span className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] font-mono">Clases Dirigidas</span>
              <h3 className="text-lg font-black text-white tracking-tight">Horarios e Inscripciones</h3>
              <p className="text-xs text-neutral-400 font-serif italic">Reserva tu plaza en tiempo real para asegurar tu espacio.</p>
            </div>

            <div className="space-y-3">
              {classes.map(cl => {
                const booked = isClassBooked(cl.id);
                const full = cl.bookedCount >= cl.capacity;
                return (
                  <div key={cl.id} className="bg-[#111] border border-[#222] rounded-[24px] p-4 flex justify-between items-center hover:border-neutral-800 transition-all">
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-[#ccff00]/10 text-[#ccff00] px-2 py-0.5 rounded-full font-mono uppercase font-bold">
                          {cl.day}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {cl.time}
                        </span>
                      </div>
                      
                      <h4 className="text-sm font-bold text-white tracking-wide">{cl.name}</h4>
                      <p className="text-[11px] text-neutral-400">Instructor: <span className="text-white/80">{cl.instructor}</span></p>
                      
                      {/* Booking Counter Bar */}
                      <div className="pt-2 flex items-center gap-1.5">
                        <div className="w-24 h-1.5 bg-black rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${booked ? 'bg-green-500' : 'bg-[#ccff00]'}`}
                            style={{ width: `${(cl.bookedCount / cl.capacity) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-[9px] font-mono text-neutral-500">
                          {cl.bookedCount}/{cl.capacity} Plazas
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {booked ? (
                        <button
                          id={`btn-cancel-class-${cl.id}`}
                          onClick={() => onCancelBooking(cl.id)}
                          className="px-3 py-2 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-extrabold uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                        >
                          Reservado ✓
                        </button>
                      ) : (
                        <button
                          id={`btn-book-class-${cl.id}`}
                          onClick={() => onBookClass(cl.id)}
                          disabled={full}
                          className={`px-3 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all active:scale-95 cursor-pointer ${
                            full 
                              ? 'bg-[#222] text-neutral-600 border border-neutral-800 cursor-not-allowed' 
                              : 'bg-[#ccff00] text-black hover:bg-[#d9ff26] font-extrabold'
                          }`}
                        >
                          {full ? 'Lleno' : 'Reservar'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: PROGRESS */}
        {activeTab === 'progress' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="mb-1">
              <span className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] font-mono">Control Corporal</span>
              <h3 className="text-lg font-black text-white tracking-tight">Sigue Tu Evolución</h3>
              <p className="text-xs text-neutral-400 font-serif italic">Monitorea tus marcas de peso y mantente enfocado en tu meta.</p>
            </div>

            {/* Custom SVG Line Chart */}
            {renderWeightGraph()}

            {/* Form to log weight */}
            <div className="bg-[#111] border border-[#222] rounded-[24px] p-4">
              <h4 className="text-xs font-mono text-[#ccff00] uppercase tracking-wider mb-3">REGISTRAR NUEVA MARCA</h4>
              
              <form onSubmit={handleWeightSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-neutral-400 uppercase font-mono block mb-1">Peso (kg)</label>
                    <input 
                      id="input-weight-val"
                      type="number" 
                      step="0.1" 
                      placeholder="e.g. 78.5"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      className="w-full bg-black text-white border border-[#222] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ccff00] font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-neutral-400 uppercase font-mono block mb-1">Fecha (Opcional)</label>
                    <input 
                      id="input-weight-date"
                      type="text" 
                      placeholder="e.g. 15 Jul"
                      value={newWeightDate}
                      onChange={(e) => setNewWeightDate(e.target.value)}
                      className="w-full bg-black text-white border border-[#222] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ccff00]"
                    />
                  </div>
                </div>

                {weightError && (
                  <p className="text-red-400 text-[10px] font-mono">{weightError}</p>
                )}

                <button 
                  id="btn-save-weight"
                  type="submit"
                  className="w-full bg-[#ccff00] hover:bg-[#d9ff26] text-black font-extrabold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer shadow-lg"
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span>Guardar Registro</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: PASS */}
        {activeTab === 'pass' && (
          <div className="flex flex-col gap-4 animate-fade-in text-center items-center">
            <div className="mb-1 w-full text-left">
              <span className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] font-mono">Acceso sin llave</span>
              <h3 className="text-lg font-black text-white tracking-tight">Pase Virtual</h3>
              <p className="text-xs text-neutral-400 font-serif italic">Muestra este código en recepción para registrar tu ingreso.</p>
            </div>

            {/* Premium Gold Pass Card (Visual inspired by the gold aesthetics in the image) */}
            <div className="w-full max-w-[280px] bg-gradient-to-br from-[#ccff00] via-[#d9ff26] to-[#ccff00] rounded-[32px] p-6 shadow-2xl relative overflow-hidden text-black text-left border border-white/10">
              {/* Subtle background graphics */}
              <div className="absolute right-[-40px] bottom-[-40px] w-40 h-40 bg-black/[0.04] rounded-full border-[10px] border-black"></div>
              <div className="absolute left-[-20px] top-[-20px] w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[9px] font-mono font-black tracking-widest bg-black/15 px-2 py-0.5 rounded-md uppercase">MEMBER PASS</span>
                  <h4 className="text-base font-black uppercase tracking-tight mt-1 font-display">IRON SQUAD</h4>
                </div>
                <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-[#ccff00] shadow-lg">
                  <Dumbbell className="w-5 h-5" />
                </div>
              </div>

              {/* QR Code Container */}
              <div className="bg-white p-4 rounded-[20px] shadow-lg flex flex-col items-center justify-center mx-auto my-4 w-[140px] h-[140px]">
                <QrCode className="w-28 h-28 text-black" strokeWidth={1.5} />
              </div>

              <div className="space-y-2 mt-4 pt-4 border-t border-black/10">
                <div className="flex justify-between text-xs">
                  <span className="opacity-60 font-medium">Socio:</span>
                  <span className="font-extrabold">{client.name}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="opacity-60 font-medium">Plan:</span>
                  <span className="font-mono font-bold">{client.plan}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="opacity-60 font-medium">Estado:</span>
                  <span className="text-[10px] bg-black text-[#ccff00] px-2 py-0.5 rounded-full font-bold">
                    {client.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-neutral-400 max-w-[260px] leading-relaxed mt-2 font-mono uppercase">
              <span>* Escanea para registrar asistencia automática</span>
            </div>
          </div>
        )}

        </div>
      </div>

      {/* WORKOUT ACTIVE MODE FULLSCREEN OVERLAY */}
      {activeWorkout && (
        <div className="absolute inset-0 bg-[#050505] z-50 flex flex-col p-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-[#222] pb-3 mb-3">
            <div>
              <span className="text-[9px] font-mono text-[#ccff00] uppercase tracking-widest font-bold">ENTRENAMIENTO ACTIVO</span>
              <h3 className="text-sm font-bold text-white font-display">{activeWorkout.title}</h3>
            </div>
            <button 
              id="btn-cancel-workout-modal"
              onClick={() => setActiveWorkout(null)}
              className="text-white/40 hover:text-white text-xs bg-white/5 py-1 px-2.5 rounded-lg border border-white/5 cursor-pointer"
            >
              Salir
            </button>
          </div>

          <p className="text-[11px] text-neutral-400 mb-3 leading-snug font-serif italic">
            "Marca cada ejercicio completado. Tu progreso se guardará cuando termines toda la lista."
          </p>

          {/* Exercise Checklist */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
            {activeWorkout.exercises.map((ex, index) => {
              const isDone = !!completedExercises[ex.name];
              return (
                <div 
                  key={index} 
                  onClick={() => toggleExercise(ex.name)}
                  className={`border rounded-2xl p-3 flex justify-between items-center transition-all cursor-pointer ${
                    isDone 
                      ? 'bg-green-500/10 border-green-500/30 text-white/60' 
                      : 'bg-[#111] border-[#222] text-white hover:border-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                      {isDone && <CheckCircle2 className="w-5 h-5 text-green-400 bg-black rounded-full" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">{ex.name}</h4>
                      <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Series: {ex.sets} | Carga: {ex.weight || 'N/A'}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold bg-black px-2 py-1 rounded-lg text-[#ccff00]">
                    {ex.reps} Reps
                  </span>
                </div>
              );
            })}
          </div>

          {/* Complete button */}
          <button
            id="btn-submit-workout-completed"
            onClick={handleFinishWorkout}
            className="w-full bg-[#ccff00] hover:bg-[#d9ff26] text-black font-black text-xs uppercase tracking-widest py-3.5 rounded-2xl shadow-xl mt-4 active:scale-95 transition-all cursor-pointer"
          >
            Terminar y Registrar Rutina
          </button>
        </div>
      )}

      {/* Bottom Navigation Tabs - Perfectly Styled inside the mobile frame */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-[#111111]/95 backdrop-blur-lg border-t border-[#222] flex items-center justify-center px-4 z-30">
        <div className="max-w-xl mx-auto w-full flex items-center justify-around">
          <button 
            id="btn-tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === 'dashboard' ? 'text-[#ccff00]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <Dumbbell className="w-5 h-5" />
            <span className="text-[9px] font-mono uppercase font-bold tracking-wider">Inicio</span>
          </button>

          <button 
            id="btn-tab-classes"
            onClick={() => setActiveTab('classes')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === 'classes' ? 'text-[#ccff00]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[9px] font-mono uppercase font-bold tracking-wider">Clases</span>
          </button>

          <button 
            id="btn-tab-progress"
            onClick={() => setActiveTab('progress')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === 'progress' ? 'text-[#ccff00]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[9px] font-mono uppercase font-bold tracking-wider">Progreso</span>
          </button>

          <button 
            id="btn-tab-pass"
            onClick={() => setActiveTab('pass')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === 'pass' ? 'text-[#ccff00]' : 'text-neutral-400 hover:text-white/75'}`}
          >
            <QrCode className="w-5 h-5" />
            <span className="text-[9px] font-mono uppercase font-bold tracking-wider">QR Pase</span>
          </button>
        </div>
      </div>

    </div>
  );
}
