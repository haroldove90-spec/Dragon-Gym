export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: 'Mensual' | 'Trimestral' | 'Anual';
  status: 'Activo' | 'Inactivo';
  avatar: string;
  joinDate: string;
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
