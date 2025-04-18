// Define muscle groups
export type MuscleGroup =
  | 'biceps'
  | 'triceps'
  | 'chest'
  | 'core'
  | 'shoulders'
  | 'lats'
  | 'quads'
  | 'hamstrings'
  | 'calves'
  | 'traps'
  | 'glutes'
  | 'forearms'

// Define exercise categories
export type ExerciseCategory =
  | 'compound'
  | 'isolation'
  | 'strength'
  | 'hypertrophy'
  | 'cardio'
  | 'accessory'

export interface ExerciseDefinition {
  primaryMuscles: MuscleGroup[]
  secondaryMuscles: MuscleGroup[]
  category: ExerciseCategory[]
  equipment?: string[]
  notes?: string
}

export const exerciseDb: Record<string, ExerciseDefinition> = {
  barbellCurl: {
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    category: ['isolation', 'hypertrophy'],
    equipment: ['barbell'],
  },
  benchPress: {
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    category: ['compound', 'strength'],
    equipment: ['barbell', 'bench'],
  },
  squat: {
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'core'],
    category: ['compound', 'strength'],
    equipment: ['barbell', 'squat rack'],
  },
  deadlift: {
    primaryMuscles: ['hamstrings', 'glutes', 'lats'],
    secondaryMuscles: ['traps', 'forearms', 'core'],
    category: ['compound', 'strength'],
    equipment: ['barbell'],
  },
  overheadPress: {
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['triceps', 'traps', 'core'],
    category: ['compound', 'strength'],
    equipment: ['barbell'],
  },
  hammerCurl: {
    primaryMuscles: ['biceps', 'forearms'],
    category: ['isolation', 'hypertrophy'],
    secondaryMuscles: [],
  },
  pullUp: {
    primaryMuscles: ['lats', 'forearms'],
    secondaryMuscles: ['biceps', 'core'],
    category: ['strength'],
  },
}

export type ExerciseType = keyof typeof exerciseDb

export interface Session {
  name?: string
  date?: string
  id: number
  exercises: Exercise[]
}

export interface Exercise {
  type: ExerciseType
  sets: ExerciseSet[]
}

export interface ExerciseSet {
  reps: number
  weight: number
}

interface ProfileData {
  sessions: Session[]
  settings: {
    defaultRestTime: number
    weightUnit: 'kg' | 'lb'
  }
}

export class Profile {
  #data = $state<ProfileData>({
    sessions: [],
    settings: {
      defaultRestTime: 60,
      weightUnit: 'lb',
    },
  })

  set data(v: ProfileData) {
    this.#data = v
  }
  get data() {
    return this.#data
  }
}
