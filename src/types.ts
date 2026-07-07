export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  planId: string; // References Plan.id
  status: 'Activo' | 'Inactivo';
  avatar: string;
  joinDate: string; // YYYY-MM-DD
  expirationDate: string; // YYYY-MM-DD
  debt: number; // outstanding amount
  emergencyContact: string; // emergency phone/name
  weightHistory: WeightRecord[];
  completedWorkouts: number;
  streakDays: number;
}

export interface WeightRecord {
  date: string;
  weight: number; // in kg
}

export interface GymClass {
  id: string;
  name: string;
  instructor: string;
  time: string;
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  capacity: number;
  bookedCount: number;
  iconName: string;
}

export interface Booking {
  id: string;
  classId: string;
  clientName: string;
  date: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  important: boolean;
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  weight?: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  durationMin: number;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  exercises: WorkoutExercise[];
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  status: 'Activo' | 'Inactivo';
}

export interface Staff {
  id: string;
  name: string;
  role: 'Recepcionista' | 'Entrenador' | 'Administrador';
  username: string;
  status: 'Activo' | 'Inactivo';
}

export interface Payment {
  id: string;
  clientId: string;
  clientName: string;
  planName: string;
  amount: number;
  date: string; // YYYY-MM-DD
  method: 'Efectivo' | 'Tarjeta' | 'Transferencia';
  folio: string;
}

export interface CheckIn {
  id: string;
  clientId: string;
  clientName: string;
  time: string; // HH:MM
  date: string; // YYYY-MM-DD
  status: 'Permitido' | 'Denegado';
}
