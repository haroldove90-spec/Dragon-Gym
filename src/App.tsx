import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, Users, Bell, ShieldAlert, Sparkles, Database, RefreshCw, 
  Info, Calendar, ArrowRightLeft, Terminal, Heart, Trophy, Activity
} from 'lucide-react';
import { Client, GymClass, Announcement, Booking, Plan, Staff, Payment, CheckIn } from './types';
import { 
  INITIAL_CLIENTS, INITIAL_CLASSES, INITIAL_ANNOUNCEMENTS, 
  INITIAL_PLANS, INITIAL_STAFF, INITIAL_PAYMENTS, INITIAL_CHECKINS 
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

  const [activeRole, setActiveRole] = useState<'home' | 'client' | 'staff' | 'admin'>('home');
  const [activeClientId, setActiveClientId] = useState<string>('1'); // Carlos by default

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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-[#ccff00]/5 blur-[120px] pointer-events-none"></div>

      {/* Mobile Device Container Mockup - FULL SCREEN INTERFACE */}
      <MobileFrame activeRole={activeRole} onNavigateHome={handleNavigateHome}>
        {activeRole === 'home' && (
          <HomeSelector onSelectRole={handleRoleSelection} />
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
          />
        )}
      </MobileFrame>
    </div>
  );
}
