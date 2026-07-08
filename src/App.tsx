import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, Users, Bell, ShieldAlert, Sparkles, Database, RefreshCw, 
  Info, Calendar, ArrowRightLeft, Terminal, Heart, Trophy, Activity,
  Download, Share2, MoreVertical, PlusSquare, X, Smartphone, CheckCircle
} from 'lucide-react';
import { Client, GymClass, Announcement, Booking, Plan, Staff, Payment, CheckIn, WorkoutRoutine, QrAccess } from './types';
import { 
  INITIAL_CLIENTS, INITIAL_CLASSES, INITIAL_ANNOUNCEMENTS, 
  INITIAL_PLANS, INITIAL_STAFF, INITIAL_PAYMENTS, INITIAL_CHECKINS,
  WORKOUT_ROUTINES, INITIAL_QR_ACCESSES
} from './data/mockData';
import MobileFrame from './components/MobileFrame';
import HomeSelector from './components/HomeSelector';
import ClientRole from './components/ClientRole';
import AdminRole from './components/AdminRole';
import StaffRole from './components/StaffRole';

interface SystemLog {
  id: string;
  time: string;
  message: string;
  type: 'system' | 'client' | 'admin' | 'database';
}

export default function App() {
  // --- STATE PERSISTENCE CODES ---
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('gymaura_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [classes, setClasses] = useState<GymClass[]>(() => {
    const saved = localStorage.getItem('gymaura_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('gymaura_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  // Client's bookings are stored as: { classId, date }
  const [bookings, setBookings] = useState<{ classId: string; date: string }[]>(() => {
    const saved = localStorage.getItem('gymaura_bookings');
    return saved ? JSON.parse(saved) : [
      { classId: 'c1', date: '6 Jul, 2026' }
    ];
  });

  // Catalog, Staff, Payments, and Check-Ins
  const [plans, setPlans] = useState<Plan[]>(() => {
    const saved = localStorage.getItem('gymaura_plans');
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = localStorage.getItem('gymaura_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('gymaura_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [checkIns, setCheckIns] = useState<CheckIn[]>(() => {
    const saved = localStorage.getItem('gymaura_checkins');
    return saved ? JSON.parse(saved) : INITIAL_CHECKINS;
  });

  const [routines, setRoutines] = useState<WorkoutRoutine[]>(() => {
    const saved = localStorage.getItem('gymaura_routines');
    return saved ? JSON.parse(saved) : WORKOUT_ROUTINES;
  });

  const [qrAccesses, setQrAccesses] = useState<QrAccess[]>(() => {
    const saved = localStorage.getItem('gymaura_qr_accesses');
    return saved ? JSON.parse(saved) : INITIAL_QR_ACCESSES;
  });

  const [activeRole, setActiveRole] = useState<'home' | 'client' | 'staff' | 'admin'>('home');
  const [activeClientId, setActiveClientId] = useState<string>('1'); // Carlos by default

  // --- PWA INSTALLATION FUNCTIONALITY ---
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true;
      return isStandalone;
    }
    return false;
  });
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [installTab, setInstallTab] = useState<'android' | 'ios'>('android');

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      addLog('Evento PWA "beforeinstallprompt" capturado. Listo para instalar.', 'system');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      addLog('¡Felicidades! Dragon Gym se ha instalado correctamente en este dispositivo.', 'system');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        addLog('Instalación de la PWA aceptada por el usuario.', 'client');
      } else {
        addLog('Instalación de la PWA rechazada.', 'client');
      }
      setDeferredPrompt(null);
    } else {
      setShowInstallModal(true);
      addLog('Mostrando guía visual de instalación móvil PWA.', 'system');
    }
  };

  // Simulated live event logger for visual premium touch
  const [logs, setLogs] = useState<SystemLog[]>([
    { id: '1', time: '18:59:28', message: 'Sistema Dragon Gym iniciado correctamente.', type: 'system' },
    { id: '2', time: '18:59:30', message: 'Base de datos cargada: 4 socios activos, 5 clases, 4 planes de membresía.', type: 'database' },
    { id: '3', time: '18:59:32', message: 'Servidor listo para recibir credenciales QR de accesos.', type: 'system' }
  ]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('gymaura_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('gymaura_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('gymaura_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('gymaura_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('gymaura_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('gymaura_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('gymaura_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('gymaura_checkins', JSON.stringify(checkIns));
  }, [checkIns]);

  useEffect(() => {
    localStorage.setItem('gymaura_routines', JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
    localStorage.setItem('gymaura_qr_accesses', JSON.stringify(qrAccesses));
  }, [qrAccesses]);

  // Helper to add system logs
  const addLog = (message: string, type: 'system' | 'client' | 'admin' | 'database') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newLog: SystemLog = {
      id: Math.random().toString(),
      time: timeStr,
      message,
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 45)); // limit to 45 logs
  };

  // --- ACTIONS HANDLERS ---

  // 1. Client Books Class
  const handleBookClass = (classId: string) => {
    const targetClass = classes.find(c => c.id === classId);
    const clientName = clients.find(c => c.id === activeClientId)?.name || 'Socio';

    if (!targetClass) return;
    if (targetClass.bookedCount >= targetClass.capacity) {
      addLog(`Error al reservar: Clase '${targetClass.name}' sin cupos.`, 'system');
      return;
    }

    if (bookings.some(b => b.classId === classId)) return;

    setClasses(prev => prev.map(c => 
      c.id === classId ? { ...c, bookedCount: c.bookedCount + 1 } : c
    ));

    setBookings(prev => [...prev, { classId, date: new Date().toLocaleDateString('es-ES') }]);
    addLog(`[RESERVA] ${clientName} reservó la clase '${targetClass.name}' (${targetClass.time})`, 'client');
  };

  // 2. Client Cancels Booking
  const handleCancelBooking = (classId: string) => {
    const targetClass = classes.find(c => c.id === classId);
    const clientName = clients.find(c => c.id === activeClientId)?.name || 'Socio';

    if (!targetClass) return;

    setClasses(prev => prev.map(c => 
      c.id === classId ? { ...c, bookedCount: Math.max(0, c.bookedCount - 1) } : c
    ));

    setBookings(prev => prev.filter(b => b.classId !== classId));
    addLog(`[RESERVA] ${clientName} CANCELÓ su plaza en '${targetClass.name}'`, 'client');
  };

  // 3. Weight log
  const handleAddWeightRecord = (clientId: string, weight: number, date: string) => {
    const targetClient = clients.find(c => c.id === clientId);
    if (!targetClient) return;

    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          weightHistory: [...c.weightHistory, { date, weight }]
        };
      }
      return c;
    }));

    addLog(`[MÉTRICAS] ${targetClient.name} registró peso de ${weight} kg`, 'client');
  };

  // 4. Workout Completed
  const handleCompleteWorkout = (clientId: string) => {
    const targetClient = clients.find(c => c.id === clientId);
    if (!targetClient) return;

    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          completedWorkouts: c.completedWorkouts + 1,
          streakDays: c.streakDays + 1
        };
      }
      return c;
    }));

    addLog(`[WORKOUT] ${targetClient.name} completó su rutina diaria. ¡Sumó racha +1!`, 'client');
  };

  // 5. Add / Register Gym Member
  const handleAddClient = (newC: Omit<Client, 'id' | 'completedWorkouts' | 'streakDays' | 'weightHistory'> & { initialWeight: number }) => {
    const nextId = (Math.max(...clients.map(c => parseInt(c.id))) + 1).toString();
    const created: Client = {
      id: nextId,
      name: newC.name,
      email: newC.email,
      phone: newC.phone,
      planId: newC.planId,
      status: newC.status,
      avatar: newC.avatar,
      joinDate: newC.joinDate,
      expirationDate: newC.expirationDate,
      debt: newC.debt,
      emergencyContact: newC.emergencyContact,
      completedWorkouts: 0,
      streakDays: 0,
      weightHistory: [{ date: 'Ingreso', weight: newC.initialWeight }]
    };

    setClients(prev => [...prev, created]);
    addLog(`[REGISTRO] Socio inscrito: '${created.name}' con Plan ID '${created.planId}'`, 'admin');
  };

  // 6. Delete member
  const handleDeleteClient = (id: string) => {
    const target = clients.find(c => c.id === id);
    if (!target) return;

    setClients(prev => prev.filter(c => c.id !== id));
    addLog(`[SOCIOS] Eliminado socio ID #${id}: '${target.name}'`, 'admin');
  };

  // 7. Toggle member Status
  const handleToggleClientStatus = (id: string) => {
    const target = clients.find(c => c.id === id);
    if (!target) return;

    const newStatus = target.status === 'Activo' ? 'Inactivo' : 'Activo';

    setClients(prev => prev.map(c => 
      c.id === id ? { ...c, status: newStatus } : c
    ));

    addLog(`[SOCIOS] Estado de '${target.name}' modificado a: ${newStatus}`, 'admin');
  };

  // 8. Add Class
  const handleAddClass = (newC: Omit<GymClass, 'id' | 'bookedCount'>) => {
    const nextId = 'c' + (classes.length + 1).toString();
    const created: GymClass = {
      id: nextId,
      ...newC,
      bookedCount: 0
    };

    setClasses(prev => [...prev, created]);
    addLog(`[CLASES] Nueva clase publicada: '${created.name}' por ${created.instructor}`, 'admin');
  };

  // 9. Cancel Class
  const handleDeleteClass = (id: string) => {
    const target = classes.find(c => c.id === id);
    if (!target) return;

    setClasses(prev => prev.filter(c => c.id !== id));
    setBookings(prev => prev.filter(b => b.classId !== id));

    addLog(`[CLASES] Clase eliminada: '${target.name}'`, 'admin');
  };

  // 10. Publish announcement
  const handlePublishAnnouncement = (title: string, content: string, important: boolean) => {
    const created: Announcement = {
      id: 'a' + (announcements.length + 1).toString(),
      title,
      content,
      date: 'Hace unos instantes',
      important
    };

    setAnnouncements(prev => [created, ...prev]);
    addLog(`[AVISOS] Aviso global: '${title}'`, 'admin');
  };

  // 11. Delete announcement
  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    addLog(`[AVISOS] Aviso eliminado ID: ${id}`, 'admin');
  };

  // 12. Add Membership Plan
  const handleAddPlan = (newPlan: Omit<Plan, 'id'>) => {
    const nextId = 'p' + (plans.length + 1).toString();
    const created: Plan = {
      id: nextId,
      ...newPlan
    };
    setPlans(prev => [...prev, created]);
    addLog(`[PLANES] Plan creado: '${created.name}' ($${created.price})`, 'admin');
  };

  // 13. Edit Plan details
  const handleEditPlan = (id: string, updated: Partial<Plan>) => {
    setPlans(prev => prev.map(p => 
      p.id === id ? { ...p, ...updated } : p
    ));
    addLog(`[PLANES] Plan ID #${id} actualizado`, 'admin');
  };

  // 14. Toggle Plan Status
  const handleTogglePlanStatus = (id: string) => {
    setPlans(prev => prev.map(p => 
      p.id === id ? { ...p, status: p.status === 'Activo' ? 'Inactivo' : 'Activo' } : p
    ));
    addLog(`[PLANES] Plan ID #${id} alternó visibilidad`, 'admin');
  };

  // 15. Add Staff member
  const handleAddStaff = (newStaff: Omit<Staff, 'id'>) => {
    const nextId = 's' + (staff.length + 1).toString();
    const created: Staff = {
      id: nextId,
      ...newStaff
    };
    setStaff(prev => [...prev, created]);
    addLog(`[STAFF] Registrado empleado: '${created.name}' (${created.role})`, 'admin');
  };

  // 16. Toggle Staff visibility / active status
  const handleToggleStaffStatus = (id: string) => {
    setStaff(prev => prev.map(s => 
      s.id === id ? { ...s, status: s.status === 'Activo' ? 'Inactivo' : 'Activo' } : s
    ));
    addLog(`[STAFF] Personal ID #${id} cambió estatus laboral`, 'admin');
  };

  // 17. Record Payment & Renew subscription
  const handleRecordPayment = (
    clientId: string,
    planId: string,
    amount: number,
    method: 'Efectivo' | 'Tarjeta' | 'Transferencia'
  ) => {
    const clientObj = clients.find(c => c.id === clientId);
    const planObj = plans.find(p => p.id === planId);
    if (!clientObj || !planObj) return;

    const nextPayId = 'pay' + (payments.length + 1).toString();
    const folioStr = `F-2026-${String(payments.length + 1).padStart(3, '0')}`;
    
    const newPayment: Payment = {
      id: nextPayId,
      clientId,
      clientName: clientObj.name,
      planName: planObj.name,
      amount,
      date: '2026-07-06',
      method,
      folio: folioStr
    };

    setPayments(prev => [...prev, newPayment]);

    // Recalculate expiration date
    const today = new Date('2026-07-06');
    today.setDate(today.getDate() + planObj.durationDays);
    const newExpDateStr = today.toISOString().split('T')[0];

    // Update Client status to Active, update expDate, and reset debt to 0
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          planId,
          status: 'Activo',
          expirationDate: newExpDateStr,
          debt: 0
        };
      }
      return c;
    }));

    addLog(`[CAJA] Pago procesado de '${clientObj.name}': $${amount} (${method}) para plan '${planObj.name}'`, 'system');
  };

  // 18. Add Check-In log
  const handleAddCheckIn = (newCk: Omit<CheckIn, 'id'>) => {
    const nextCkId = 'ck' + (checkIns.length + 1).toString();
    const created: CheckIn = {
      id: nextCkId,
      ...newCk
    };
    setCheckIns(prev => [...prev, created]);
    addLog(`[ACCESO] Ingreso de ${created.clientName}: ${created.status}`, 'system');
  };

  // 19. Add Workout Routine with videoUrl
  const handleAddRoutine = (newR: Omit<WorkoutRoutine, 'id' | 'uploadedBy' | 'date'>) => {
    const created: WorkoutRoutine = {
      id: 'r' + (routines.length + 1).toString(),
      uploadedBy: 'Administración',
      date: new Date().toISOString().split('T')[0],
      ...newR
    };
    setRoutines(prev => [created, ...prev]);
    addLog(`[RUTINAS] Nueva rutina subida: "${created.title}" por Administración.`, 'admin');
  };

  // 20. Delete Workout Routine
  const handleDeleteRoutine = (id: string) => {
    const target = routines.find(r => r.id === id);
    setRoutines(prev => prev.filter(r => r.id !== id));
    if (target) {
      addLog(`[RUTINAS] Rutina eliminada: "${target.title}"`, 'admin');
    }
  };

  // 21. Generate QR Access Code for Gym facility
  const handleGenerateQrAccess = (clientId: string, schedule: string, expiresAt: string) => {
    const targetClient = clients.find(c => c.id === clientId);
    if (!targetClient) return;

    const nextId = 'qr' + (qrAccesses.length + 1).toString();
    const codeStr = `DG-${targetClient.name.split(' ')[0].toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newQr: QrAccess = {
      id: nextId,
      clientId,
      clientName: targetClient.name,
      code: codeStr,
      status: 'Activo',
      expiresAt,
      schedule,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setQrAccesses(prev => [newQr, ...prev.filter(q => q.clientId !== clientId)]);
    addLog(`[ACCESO QR] Nuevo pase QR generado para ${targetClient.name} (${schedule})`, 'admin');
  };

  // 22. Toggle QR Access status (Suspend/Activate)
  const handleToggleQrAccessStatus = (id: string) => {
    setQrAccesses(prev => prev.map(q => {
      if (q.id === id) {
        const nextStatus = q.status === 'Activo' ? 'Suspendido' : 'Activo';
        addLog(`[ACCESO QR] Estatus de QR para ${q.clientName} modificado a: ${nextStatus}`, 'admin');
        return { ...q, status: nextStatus };
      }
      return q;
    }));
  };

  // Navigation handlers
  const handleRoleSelection = (role: 'client' | 'staff' | 'admin') => {
    setActiveRole(role);
    addLog(`Portal de ${role.toUpperCase()} iniciado.`, 'system');
  };

  const handleNavigateHome = () => {
    setActiveRole('home');
    addLog('Navegación al selector de roles del gimnasio.', 'system');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans relative overflow-x-hidden">
      {/* Visual atmospheric lighting background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-[#7A724E]/5 blur-[120px] pointer-events-none"></div>

      {/* Mobile Device Container Mockup - FULL SCREEN INTERFACE */}
      <MobileFrame activeRole={activeRole} onNavigateHome={handleNavigateHome}>
        {activeRole === 'home' && (
          <HomeSelector 
            onSelectRole={handleRoleSelection} 
            onInstallClick={handleInstallClick}
            isInstalled={isInstalled}
          />
        )}

        {activeRole === 'client' && (
          <ClientRole 
            clients={clients}
            classes={classes}
            announcements={announcements}
            bookings={bookings}
            plans={plans}
            payments={payments}
            onBookClass={handleBookClass}
            onCancelBooking={handleCancelBooking}
            onAddWeightRecord={handleAddWeightRecord}
            onCompleteWorkout={handleCompleteWorkout}
            activeClientId={activeClientId}
            onChangeClient={setActiveClientId}
            routines={routines}
            qrAccesses={qrAccesses}
          />
        )}

        {activeRole === 'staff' && (
          <StaffRole 
            clients={clients}
            plans={plans}
            payments={payments}
            checkIns={checkIns}
            onAddClient={handleAddClient}
            onRecordPayment={handleRecordPayment}
            onAddCheckIn={handleAddCheckIn}
            qrAccesses={qrAccesses}
            onGenerateQrAccess={handleGenerateQrAccess}
            onToggleQrAccessStatus={handleToggleQrAccessStatus}
          />
        )}

        {activeRole === 'admin' && (
          <AdminRole 
            clients={clients}
            classes={classes}
            announcements={announcements}
            plans={plans}
            staff={staff}
            payments={payments}
            checkIns={checkIns}
            onAddClient={handleAddClient}
            onDeleteClient={handleDeleteClient}
            onToggleClientStatus={handleToggleClientStatus}
            onAddClass={handleAddClass}
            onDeleteClass={handleDeleteClass}
            onPublishAnnouncement={handlePublishAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            onAddPlan={handleAddPlan}
            onEditPlan={handleEditPlan}
            onTogglePlanStatus={handleTogglePlanStatus}
            onAddStaff={handleAddStaff}
            onToggleStaffStatus={handleToggleStaffStatus}
            routines={routines}
            qrAccesses={qrAccesses}
            onAddRoutine={handleAddRoutine}
            onDeleteRoutine={handleDeleteRoutine}
            onGenerateQrAccess={handleGenerateQrAccess}
            onToggleQrAccessStatus={handleToggleQrAccessStatus}
          />
        )}
      </MobileFrame>

      {/* PWA Installation Walkthrough Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] border border-[#7A724E]/30 rounded-[32px] w-full max-w-md p-6 relative shadow-[0_20px_50px_rgba(122,114,78,0.08)] overflow-hidden">
            {/* Ambient light glow inside modal */}
            <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-[#7A724E]/5 blur-3xl"></div>

            {/* Close Button */}
            <button 
              onClick={() => setShowInstallModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all cursor-pointer border border-white/5"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Brand info */}
            <div className="text-center mt-2 flex flex-col items-center">
              <img 
                src="https://appdesignproyectos.com/dragongymicono.png" 
                alt="Dragon Gym Icon" 
                className="w-16 h-16 rounded-[20px] shadow-[0_0_20px_rgba(122,114,78,0.25)] border border-[#7A724E]/30 object-cover mb-3"
                referrerPolicy="no-referrer"
              />
              <h3 className="text-lg font-black text-white tracking-wide uppercase font-sans">Instalar Dragon Gym</h3>
              <p className="text-[11px] text-neutral-400 mt-1 text-center px-4">Lleva la experiencia del gym en tu bolsillo con accesos ultra rápidos</p>
            </div>

            {/* Tabs for platform instructions */}
            <div className="grid grid-cols-2 bg-neutral-900/60 p-1 rounded-2xl my-5 border border-neutral-800/80">
              <button 
                onClick={() => setInstallTab('android')}
                className={`py-2 px-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  installTab === 'android' 
                    ? 'bg-[#7A724E] text-black shadow-md' 
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android / Chrome</span>
              </button>
              <button 
                onClick={() => setInstallTab('ios')}
                className={`py-2 px-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  installTab === 'ios' 
                    ? 'bg-[#7A724E] text-black shadow-md' 
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span className="font-sans"> iOS / Safari</span>
              </button>
            </div>

            {/* Instructions */}
            <div className="space-y-4 text-left px-1">
              {installTab === 'android' ? (
                <>
                  <div className="flex gap-3.5 items-start">
                    <div className="w-6 h-6 rounded-full bg-[#7A724E]/10 border border-[#7A724E]/30 text-[#7A724E] text-xs font-black flex items-center justify-center shrink-0 mt-0.5 font-mono">
                      1
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Abre el menú del navegador</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">
                        Toca los tres puntos <MoreVertical className="w-3 h-3 text-neutral-400 inline" /> situados en la esquina superior derecha de Google Chrome.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-6 h-6 rounded-full bg-[#7A724E]/10 border border-[#7A724E]/30 text-[#7A724E] text-xs font-black flex items-center justify-center shrink-0 mt-0.5 font-mono">
                      2
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Selecciona "Instalar aplicación"</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">
                        Busca y presiona la opción <strong className="text-white">"Instalar aplicación"</strong> o <strong className="text-white">"Agregar a la pantalla principal"</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-6 h-6 rounded-full bg-[#7A724E]/10 border border-[#7A724E]/30 text-[#7A724E] text-xs font-black flex items-center justify-center shrink-0 mt-0.5 font-mono">
                      3
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Confirma y disfruta</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">
                        Confirma en el cuadro de diálogo para añadir el acceso directo con icono oficial a tu celular.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-3.5 items-start">
                    <div className="w-6 h-6 rounded-full bg-[#7A724E]/10 border border-[#7A724E]/30 text-[#7A724E] text-xs font-black flex items-center justify-center shrink-0 mt-0.5 font-mono">
                      1
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Presiona el botón de Compartir</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">
                        Toca el botón <strong className="text-[#7A724E] inline-flex items-center gap-0.5">Compartir <Share2 className="w-3 h-3 text-blue-400 inline" /></strong> en la barra de navegación de Safari.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-6 h-6 rounded-full bg-[#7A724E]/10 border border-[#7A724E]/30 text-[#7A724E] text-xs font-black flex items-center justify-center shrink-0 mt-0.5 font-mono">
                      2
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Añadir a la pantalla de inicio</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">
                        Desplázate hacia abajo en el menú de opciones de Safari y selecciona <strong className="text-white">"Agregar a inicio"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-white ml-0.5" />.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-6 h-6 rounded-full bg-[#7A724E]/10 border border-[#7A724E]/30 text-[#7A724E] text-xs font-black flex items-center justify-center shrink-0 mt-0.5 font-mono">
                      3
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Confirma el guardado</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">
                        Toca <strong className="text-white">"Agregar"</strong> en la esquina superior derecha. El icono de Dragon Gym aparecerá de inmediato.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-col gap-2">
              <button 
                onClick={() => {
                  setShowInstallModal(false);
                  addLog('Guía de instalación móvil cerrada.', 'system');
                }}
                className="w-full bg-[#7A724E] hover:bg-[#91875d] text-black font-extrabold text-xs uppercase tracking-wider py-3 rounded-2xl transition-all cursor-pointer shadow-lg active:scale-98"
              >
                Entendido, ¡Listo!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
