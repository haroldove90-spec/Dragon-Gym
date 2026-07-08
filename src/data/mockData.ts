import { Client, GymClass, Announcement, WorkoutRoutine, Plan, Staff, Payment, CheckIn, QrAccess } from '../types';

export const INITIAL_PLANS: Plan[] = [
  { id: 'p1', name: 'Mensual', price: 50, durationDays: 30, status: 'Activo' },
  { id: 'p2', name: 'Trimestral', price: 130, durationDays: 90, status: 'Activo' },
  { id: 'p3', name: 'Anual', price: 450, durationDays: 365, status: 'Activo' },
  { id: 'p4', name: 'Pase del Día', price: 10, durationDays: 1, status: 'Activo' }
];

export const INITIAL_STAFF: Staff[] = [
  { id: 's1', name: 'Lucía Fernández', role: 'Recepcionista', username: 'lucia.gym', status: 'Activo' },
  { id: 's2', name: 'Marcos Rubio', role: 'Entrenador', username: 'marcos.gym', status: 'Activo' },
  { id: 's3', name: 'Alejandro Martínez', role: 'Administrador', username: 'alejandro.gym', status: 'Activo' }
];

export const INITIAL_PAYMENTS: Payment[] = [
  { id: 'pay1', clientId: '1', clientName: 'Carlos Mendoza', planName: 'Anual', amount: 450, date: '2026-01-15', method: 'Tarjeta', folio: 'F-2026-001' },
  { id: 'pay2', clientId: '2', clientName: 'Mariana Silva', planName: 'Mensual', amount: 50, date: '2026-06-10', method: 'Efectivo', folio: 'F-2026-002' },
  { id: 'pay3', clientId: '3', clientName: 'Sebastián Ortiz', planName: 'Trimestral', amount: 130, date: '2026-04-01', method: 'Transferencia', folio: 'F-2026-003' }
];

export const INITIAL_CHECKINS: CheckIn[] = [
  { id: 'ck1', clientId: '1', clientName: 'Carlos Mendoza', time: '08:30', date: '2026-07-06', status: 'Permitido' },
  { id: 'ck2', clientId: '2', clientName: 'Mariana Silva', time: '10:15', date: '2026-07-06', status: 'Permitido' }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Carlos Mendoza',
    email: 'carlos.m@gym.com',
    phone: '+34 612 345 678',
    planId: 'p3',
    status: 'Activo',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', // Beautiful portrait
    joinDate: '2026-01-15',
    expirationDate: '2027-01-15',
    debt: 0,
    emergencyContact: 'Juan Mendoza (Padre) - +34 612 999 000',
    completedWorkouts: 42,
    streakDays: 5,
    weightHistory: [
      { date: 'May 1', weight: 84.5 },
      { date: 'May 15', weight: 83.2 },
      { date: 'Jun 1', weight: 82.0 },
      { date: 'Jun 15', weight: 81.1 },
      { date: 'Jul 1', weight: 79.8 },
      { date: 'Jul 6', weight: 78.9 }
    ]
  },
  {
    id: '2',
    name: 'Mariana Silva',
    email: 'mariana.silva@gym.com',
    phone: '+34 699 888 777',
    planId: 'p1',
    status: 'Activo',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    joinDate: '2026-06-10',
    expirationDate: '2026-07-10', // near (in 4 days relative to July 6)
    debt: 0,
    emergencyContact: 'Isabel Silva (Madre) - +34 699 111 222',
    completedWorkouts: 15,
    streakDays: 3,
    weightHistory: [
      { date: 'Jun 10', weight: 65.0 },
      { date: 'Jun 24', weight: 64.2 },
      { date: 'Jul 6', weight: 63.5 }
    ]
  },
  {
    id: '3',
    name: 'Sebastián Ortiz',
    email: 'sebas.ortiz@gym.com',
    phone: '+34 655 444 333',
    planId: 'p2',
    status: 'Inactivo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    joinDate: '2026-04-01',
    expirationDate: '2026-07-01', // expired
    debt: 130,
    emergencyContact: 'Andrés Ortiz (Hermano) - +34 655 000 111',
    completedWorkouts: 28,
    streakDays: 0,
    weightHistory: [
      { date: 'Apr 1', weight: 92.0 },
      { date: 'May 1', weight: 89.5 },
      { date: 'Jun 1', weight: 88.0 },
      { date: 'Jul 1', weight: 86.4 }
    ]
  },
  {
    id: '4',
    name: 'Sofía Guerrero',
    email: 'sofia.g@gym.com',
    phone: '+34 622 111 000',
    planId: 'p3',
    status: 'Inactivo',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    joinDate: '2025-02-20',
    expirationDate: '2026-02-20', // expired
    debt: 450,
    emergencyContact: 'Laura Guerrero (Hermana) - +34 622 222 333',
    completedWorkouts: 89,
    streakDays: 12,
    weightHistory: [
      { date: 'Jan 5', weight: 58.0 },
      { date: 'Feb 12', weight: 57.5 },
      { date: 'Mar 18', weight: 56.8 }
    ]
  }
];

export const INITIAL_CLASSES: GymClass[] = [
  {
    id: 'c1',
    name: 'CrossFit WOD',
    instructor: 'Marcos Rubio',
    time: '08:00 - 09:00',
    day: 'Lunes',
    capacity: 15,
    bookedCount: 11,
    iconName: 'Flame'
  },
  {
    id: 'c2',
    name: 'Spinning Explosivo',
    instructor: 'Diana Pérez',
    time: '09:15 - 10:15',
    day: 'Martes',
    capacity: 20,
    bookedCount: 18,
    iconName: 'Bike'
  },
  {
    id: 'c3',
    name: 'Powerlifting Fuerza',
    instructor: 'Iván Castro',
    time: '18:30 - 19:45',
    day: 'Miércoles',
    capacity: 8,
    bookedCount: 5,
    iconName: 'Dumbbell'
  },
  {
    id: 'c4',
    name: 'Yoga Vinyasa',
    instructor: 'Elena Martínez',
    time: '19:30 - 20:30',
    day: 'Jueves',
    capacity: 12,
    bookedCount: 4,
    iconName: 'Sparkles'
  },
  {
    id: 'c5',
    name: 'Boxeo Técnico',
    instructor: 'Javier Toro',
    time: '17:00 - 18:30',
    day: 'Viernes',
    capacity: 14,
    bookedCount: 13,
    iconName: 'ShieldAlert'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Horario Especial - Festivo',
    content: 'Este próximo viernes, el gimnasio abrirá en horario continuo de 08:00 a 16:00. ¡No dejes de entrenar!',
    date: 'Hace 2 horas',
    important: true
  },
  {
    id: 'a2',
    title: 'Nuevo equipamiento en sala',
    content: '¡Hemos instalado 3 nuevas jaulas de sentadillas de última generación en la zona de peso libre!',
    date: 'Ayer',
    important: false
  }
];

export const WORKOUT_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'r1',
    title: 'Rutina Completa de Pecho y Espalda',
    durationMin: 50,
    level: 'Intermedio',
    videoUrl: 'https://www.youtube.com/watch?v=xP4iItH8HBU',
    description: 'Una rutina balanceada enfocada en empuje y tracción del torso superior para maximizar la densidad muscular y mejorar la postura.',
    uploadedBy: 'Administración',
    date: '2026-07-06',
    exercises: [
      { name: 'Press de Banca Plano con Barra', sets: 4, reps: '8-10', weight: '70 kg' },
      { name: 'Remo con Barra Pendlay', sets: 4, reps: '8', weight: '80 kg' },
      { name: 'Press Inclinado con Mancuernas', sets: 3, reps: '10-12', weight: '24 kg' },
      { name: 'Jalón al Pecho Agarre Neutro', sets: 3, reps: '12', weight: '55 kg' }
    ]
  },
  {
    id: 'r2',
    title: 'Guía de Hipertrofia y Definición Total',
    durationMin: 60,
    level: 'Avanzado',
    videoUrl: 'https://www.youtube.com/watch?v=w_0hSr5U-2U&t=681s',
    description: 'Técnicas avanzadas de aislamiento e hipertrofia para esculpir todo el cuerpo con alto volumen de entrenamiento y tiempos bajo tensión controlados.',
    uploadedBy: 'Marcos Rubio (Entrenador)',
    date: '2026-07-05',
    exercises: [
      { name: 'Sentadilla Trasera con Barra', sets: 4, reps: '8-10', weight: '100 kg' },
      { name: 'Dominadas Pronas Lastradas', sets: 4, reps: '6-8', weight: '+10 kg' },
      { name: 'Press Militar de Hombros', sets: 3, reps: '10', weight: '45 kg' },
      { name: 'Curl de Bíceps con Barra Z', sets: 4, reps: '12', weight: '30 kg' }
    ]
  },
  {
    id: 'r3',
    title: 'Ejecución Perfecta de Sentadilla y Fuerza',
    durationMin: 45,
    level: 'Principiante',
    videoUrl: 'https://www.youtube.com/watch?v=7NmiKpvPvt8&t=183s',
    description: 'Aprende la técnica perfecta de sentadilla profunda, posicionamiento de pies y mecánicas de fuerza básicas para evitar lesiones y levantar pesado.',
    uploadedBy: 'Marcos Rubio (Entrenador)',
    date: '2026-07-04',
    exercises: [
      { name: 'Sentadilla de Copa (Goblet)', sets: 3, reps: '12', weight: '16 kg' },
      { name: 'Prensa de Piernas a 45º', sets: 3, reps: '10', weight: '120 kg' },
      { name: 'Extensión de Piernas en Máquina', sets: 3, reps: '15', weight: '40 kg' },
      { name: 'Plancha Abdominal Isométrica', sets: 3, reps: '45 seg', weight: 'Corporal' }
    ]
  },
  {
    id: 'r4',
    title: 'Circuito de Abdominales y Core Intenso',
    durationMin: 30,
    level: 'Intermedio',
    videoUrl: 'https://www.youtube.com/watch?v=3SwP-FHEL68',
    description: 'Un circuito dinámico para fortalecer el transverso abdominal, lumbares, oblicuos y estabilizadores profundos del core.',
    uploadedBy: 'Administración',
    date: '2026-07-03',
    exercises: [
      { name: 'Abdominales de Rodillo (Ab Wheel)', sets: 3, reps: '12', weight: 'Corporal' },
      { name: 'Elevaciones de Piernas Suspendido', sets: 3, reps: '15', weight: 'Corporal' },
      { name: 'Giro Ruso con Balón Medicinal', sets: 3, reps: '20', weight: '8 kg' },
      { name: 'Hiperextensiones Lumbares', sets: 3, reps: '15', weight: 'Corporal' }
    ]
  }
];

export const INITIAL_QR_ACCESSES: QrAccess[] = [
  {
    id: 'qr1',
    clientId: '1',
    clientName: 'Carlos Mendoza',
    code: 'DG-CARLOS-7729',
    status: 'Activo',
    expiresAt: '2027-01-15',
    schedule: 'Todos los días (06:00 - 23:00)',
    createdAt: '2026-01-15'
  },
  {
    id: 'qr2',
    clientId: '2',
    clientName: 'Mariana Silva',
    code: 'DG-MARIANA-3110',
    status: 'Activo',
    expiresAt: '2026-07-10',
    schedule: 'Lunes a Sábado (06:00 - 22:00)',
    createdAt: '2026-06-10'
  }
];

