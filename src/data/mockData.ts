import { Client, GymClass, Announcement, WorkoutRoutine } from '../types';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Carlos Mendoza',
    email: 'carlos.m@gym.com',
    phone: '+34 612 345 678',
    plan: 'Anual',
    status: 'Activo',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', // Beautiful portrait
    joinDate: '15/01/2026',
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
    plan: 'Mensual',
    status: 'Activo',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    joinDate: '10/06/2026',
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
    plan: 'Trimestral',
    status: 'Activo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    joinDate: '01/04/2026',
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
    plan: 'Anual',
    status: 'Inactivo',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    joinDate: '20/02/2025',
    completedWorkouts: 89,
    streakDays: 12,
    weightHistory: [
      { date: 'Jan', weight: 58.0 },
      { date: 'Feb', weight: 57.5 },
      { date: 'Mar', weight: 56.8 }
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
    title: 'Hipertrofia Empuje (Pecho/Tríceps)',
    durationMin: 55,
    level: 'Intermedio',
    exercises: [
      { name: 'Press de Banca Plano con Barra', sets: 4, reps: '8-10', weight: '70 kg' },
      { name: 'Press Inclinado con Mancuernas', sets: 3, reps: '10-12', weight: '24 kg' },
      { name: 'Aperturas en Polea (Cruce)', sets: 3, reps: '15', weight: '15 kg' },
      { name: 'Fondos de Tríceps en Paralelas', sets: 3, reps: 'Al Fallo', weight: 'Corporal' },
      { name: 'Extensión de Tríceps en Polea Alta', sets: 4, reps: '12', weight: '20 kg' }
    ]
  },
  {
    id: 'r2',
    title: 'Tracción Explosiva (Espalda/Bíceps)',
    durationMin: 60,
    level: 'Avanzado',
    exercises: [
      { name: 'Dominadas Pronas Lastradas', sets: 4, reps: '6-8', weight: '+10 kg' },
      { name: 'Remo con Barra Pendlay', sets: 3, reps: '8', weight: '80 kg' },
      { name: 'Jalón al Pecho Agarre Neutro', sets: 3, reps: '12', weight: '55 kg' },
      { name: 'Curl de Bíceps con Barra Z', sets: 4, reps: '10', weight: '30 kg' },
      { name: 'Curl Martillo Alterno Mancuernas', sets: 3, reps: '12-15', weight: '14 kg' }
    ]
  },
  {
    id: 'r3',
    title: 'Fuerza de Piernas y Core',
    durationMin: 50,
    level: 'Intermedio',
    exercises: [
      { name: 'Sentadilla Trasera con Barra', sets: 4, reps: '6-8', weight: '100 kg' },
      { name: 'Prensa de Piernas 45º', sets: 3, reps: '10-12', weight: '200 kg' },
      { name: 'Peso Muerto Rumano Mancuernas', sets: 3, reps: '12', weight: '32 kg' },
      { name: 'Elevaciones de Talones de pie', sets: 4, reps: '15', weight: '45 kg' },
      { name: 'Abdominales de Rodillo (Ab Wheel)', sets: 3, reps: '15', weight: 'Corporal' }
    ]
  }
];
