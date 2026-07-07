import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, Users, Bell, ShieldAlert, Sparkles, Database, RefreshCw, 
  Info, Calendar, ArrowRightLeft, Terminal, Heart, Trophy, Activity
} from 'lucide-react';
import { Client, GymClass, Announcement, Booking } from './types';
import { 
  INITIAL_CLIENTS, INITIAL_CLASSES, INITIAL_ANNOUNCEMENTS 
} from './data/mockData';
import MobileFrame from './components/MobileFrame';
import HomeSelector from './components/HomeSelector';
import ClientRole from './components/ClientRole';
import AdminRole from './components/AdminRole';

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
    // Default: Carlos Mendoza has booked 1 class
    return saved ? JSON.parse(saved) : [
      { classId: 'c1', date: '6 Jul, 2026' }
    ];
  });

  const [activeRole, setActiveRole] = useState<'home' | 'client' | 'admin'>('home');
  const [activeClientId, setActiveClientId] = useState<string>('1'); // Carlos by default

  // Simulated live event logger for visual premium touch
  const [logs, setLogs] = useState<SystemLog[]>([
    { id: '1', time: '18:59:28', message: 'Sistema Iron Haven iniciado correctamente.', type: 'system' },
    { id: '2', time: '18:59:30', message: 'Base de datos cargada: 4 socios activos, 5 clases disponibles.', type: 'database' },
    { id: '3', time: '18:59:32', message: 'Servidor listo para recibir solicitudes.', type: 'system' }
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

  const clearDatabase = () => {
    if (window.confirm('¿Estás seguro de que deseas restablecer la base de datos a los valores por defecto?')) {
      localStorage.removeItem('gymaura_clients');
      localStorage.removeItem('gymaura_classes');
      localStorage.removeItem('gymaura_announcements');
      localStorage.removeItem('gymaura_bookings');
      setClients(INITIAL_CLIENTS);
      setClasses(INITIAL_CLASSES);
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
      setBookings([{ classId: 'c1', date: '6 Jul, 2026' }]);
      setActiveRole('home');
      setActiveClientId('1');
      addLog('Base de datos restablecida a valores de fábrica.', 'database');
    }
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

    // Check if already booked
    if (bookings.some(b => b.classId === classId)) return;

    // Increment bookedCount
    setClasses(prev => prev.map(c => 
      c.id === classId ? { ...c, bookedCount: c.bookedCount + 1 } : c
    ));

    // Add booking
    setBookings(prev => [...prev, { classId, date: new Date().toLocaleDateString('es-ES') }]);
    
    addLog(`[RESERVA] ${clientName} reservó la clase '${targetClass.name}' (${targetClass.time})`, 'client');
  };

  // 2. Client Cancels Booking
  const handleCancelBooking = (classId: string) => {
    const targetClass = classes.find(c => c.id === classId);
    const clientName = clients.find(c => c.id === activeClientId)?.name || 'Socio';

    if (!targetClass) return;

    // Decrement bookedCount
    setClasses(prev => prev.map(c => 
      c.id === classId ? { ...c, bookedCount: Math.max(0, c.bookedCount - 1) } : c
    ));

    // Remove booking
    setBookings(prev => prev.filter(b => b.classId !== classId));

    addLog(`[RESERVA] ${clientName} CANCELÓ su plaza en '${targetClass.name}'`, 'client');
  };

  // 3. Client registers a weight measurement
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

    addLog(`[METRICAS] ${targetClient.name} registró peso de ${weight} kg para la fecha ${date}`, 'client');
  };

  // 4. Client completes a workout
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

    addLog(`[WORKOUT] ${targetClient.name} completó exitosamente su rutina del día. ¡Sumó racha +1!`, 'client');
  };

  // 5. Admin adds a new gym member
  const handleAddClient = (newC: Omit<Client, 'id' | 'completedWorkouts' | 'streakDays' | 'weightHistory'> & { initialWeight: number }) => {
    const nextId = (Math.max(...clients.map(c => parseInt(c.id))) + 1).toString();
    const created: Client = {
      id: nextId,
      name: newC.name,
      email: newC.email,
      phone: newC.phone,
      plan: newC.plan,
      status: newC.status,
      avatar: newC.avatar,
      joinDate: newC.joinDate,
      completedWorkouts: 0,
      streakDays: 0,
      weightHistory: [{ date: 'Ingreso', weight: newC.initialWeight }]
    };

    setClients(prev => [...prev, created]);
    addLog(`[ADMIN] Se registró un nuevo socio: '${created.name}' con Plan ${created.plan}`, 'admin');
  };

  // 6. Admin deletes a client
  const handleDeleteClient = (id: string) => {
    const target = clients.find(c => c.id === id);
    if (!target) return;

    setClients(prev => prev.filter(c => c.id !== id));
    addLog(`[ADMIN] Se eliminó al socio: '${target.name}' de la base de datos`, 'admin');
  };

  // 7. Admin toggles client Active/Inactive subscription
  const handleToggleClientStatus = (id: string) => {
    const target = clients.find(c => c.id === id);
    if (!target) return;

    const newStatus = target.status === 'Activo' ? 'Inactivo' : 'Activo';

    setClients(prev => prev.map(c => 
      c.id === id ? { ...c, status: newStatus } : c
    ));

    addLog(`[ADMIN] Cambió estado de '${target.name}' a: ${newStatus.toUpperCase()}`, 'admin');
  };

  // 8. Admin registers a new fitness class
  const handleAddClass = (newC: Omit<GymClass, 'id' | 'bookedCount'>) => {
    const nextId = 'c' + (classes.length + 1).toString();
    const created: GymClass = {
      id: nextId,
      ...newC,
      bookedCount: 0
    };

    setClasses(prev => [...prev, created]);
    addLog(`[ADMIN] Se publicó una nueva clase dirigida: '${created.name}' (${created.time}) con ${created.instructor}`, 'admin');
  };

  // 9. Admin cancels/removes a class
  const handleDeleteClass = (id: string) => {
    const target = classes.find(c => c.id === id);
    if (!target) return;

    setClasses(prev => prev.filter(c => c.id !== id));
    // Also clear associated bookings
    setBookings(prev => prev.filter(b => b.classId !== id));

    addLog(`[ADMIN] Se eliminó la clase: '${target.name}' de la planificación`, 'admin');
  };

  // 10. Admin broadcasts an announcement
  const handlePublishAnnouncement = (title: string, content: string, important: boolean) => {
    const created: Announcement = {
      id: 'a' + (announcements.length + 1).toString(),
      title,
      content,
      date: 'Hace unos instantes',
      important
    };

    setAnnouncements(prev => [created, ...prev]);
    addLog(`[ADMIN] Se publicó aviso global urgente: '${title}'`, 'admin');
  };

  // 11. Admin deletes announcement
  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    addLog(`[ADMIN] Se eliminó aviso ID: ${id}`, 'admin');
  };

  // Transition logs
  const handleRoleSelection = (role: 'client' | 'admin') => {
    setActiveRole(role);
    addLog(`Usuario accedió al portal de ${role === 'client' ? 'CLIENTE' : 'ADMINISTRADOR'}.`, 'system');
  };

  const handleNavigateHome = () => {
    setActiveRole('home');
    addLog('Usuario volvió a la pantalla de selección de roles.', 'system');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans relative overflow-x-hidden">
      {/* Visual atmospheric lighting background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-[#ccff00]/5 blur-[120px] pointer-events-none"></div>

      {/* Mobile Device Container Mockup */}
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
            onBookClass={handleBookClass}
            onCancelBooking={handleCancelBooking}
            onAddWeightRecord={handleAddWeightRecord}
            onCompleteWorkout={handleCompleteWorkout}
            activeClientId={activeClientId}
            onChangeClient={setActiveClientId}
          />
        )}

        {activeRole === 'admin' && (
          <AdminRole 
            clients={clients}
            classes={classes}
            announcements={announcements}
            onAddClient={handleAddClient}
            onDeleteClient={handleDeleteClient}
            onToggleClientStatus={handleToggleClientStatus}
            onAddClass={handleAddClass}
            onDeleteClass={handleDeleteClass}
            onPublishAnnouncement={handlePublishAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
          />
        )}
      </MobileFrame>
    </div>
  );
}
