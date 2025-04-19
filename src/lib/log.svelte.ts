import { browser } from '$app/environment'

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
  variations: string[]
  equipment?: string[]
  notes?: string
}

export const exerciseDb: Record<string, ExerciseDefinition> = {
  bicepCurl: {
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    category: ['isolation', 'hypertrophy'],
    equipment: ['barbell', 'dumbbell', 'cable'],
    variations: ['standard', 'incline', 'hammer', 'preacher'],
  },
  row: {
    primaryMuscles: ['lats'],
    secondaryMuscles: ['biceps', 'core'],
    category: ['isolation', 'hypertrophy'],
    variations: ['bentOver', 'dumbbell', 'cable'],
  },
  benchPress: {
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    category: ['compound', 'strength'],
    equipment: ['barbell', 'bench'],
    variations: ['standard', 'incline', 'closeGrip'],
  },
  chestPress: {
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    category: ['compound', 'strength'],
    equipment: ['dumbbell'],
    variations: ['standard', 'incline', 'machine'],
  },
  squat: {
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'core'],
    category: ['compound', 'strength'],
    equipment: ['barbell', 'squat rack'],
    variations: ['standard'],
  },
  deadlift: {
    primaryMuscles: ['hamstrings', 'glutes', 'lats'],
    secondaryMuscles: ['traps', 'forearms', 'core'],
    category: ['compound', 'strength'],
    equipment: ['barbell'],
    variations: ['romanian', 'sumo'],
  },
  overheadPress: {
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['triceps', 'traps', 'core'],
    category: ['compound', 'strength'],
    equipment: ['barbell'],
    variations: ['barbell', 'dumbbell'],
  },
  pullUp: {
    primaryMuscles: ['lats', 'forearms'],
    secondaryMuscles: ['biceps', 'core'],
    category: ['strength'],
    variations: ['standard'],
  },
  deadHang: {
    primaryMuscles: ['forearms'],
    category: ['strength'],
    secondaryMuscles: ['biceps', 'lats', 'shoulders'],
    equipment: ['pullBar'],
    variations: ['standard'],
  },
  latPulldown: {
    primaryMuscles: ['lats'],
    category: ['isolation', 'hypertrophy'],
    secondaryMuscles: ['forearms'],
    variations: ['standard'],
  },
  pushDown: {
    primaryMuscles: ['triceps'],
    category: ['isolation', 'hypertrophy'],
    secondaryMuscles: ['forearms'],
    variations: ['cable'],
  },
  skullCrusher: {
    primaryMuscles: ['triceps'],
    category: ['isolation', 'hypertrophy'],
    secondaryMuscles: ['forearms'],
    variations: ['dumbbell', 'barbell'],
  },
  dips: {
    primaryMuscles: ['triceps'],
    category: ['isolation', 'hypertrophy'],
    secondaryMuscles: ['forearms'],
    variations: ['standard'],
  },
  lateralRaise: {
    primaryMuscles: ['shoulders'],
    category: ['isolation', 'hypertrophy'],
    secondaryMuscles: [],
    variations: ['dumbbell', 'cable'],
  },
}

type ExerciseDbKey = typeof exerciseDb

export type ExerciseType = {
  [K in keyof ExerciseDbKey]: {
    type: K
    variation: ExerciseDbKey[K]['variations'][number]
  }
}[keyof ExerciseDbKey]

export interface Session {
  name?: string
  date?: string
  id: string
  exercises: Exercise[]
  active: number
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

  constructor() {
    this.#data.sessions = Profile.loadSessions()

    $effect.root(() => {
      $effect(() => {
        if (browser)
          localStorage.setItem('sessions', JSON.stringify(this.#data.sessions))
      })
    })
  }

  set data(v: ProfileData) {
    this.#data = v
  }
  get data() {
    return this.#data
  }

  saveSession(session: Session) {
    const index = this.#data.sessions.findIndex((s) => s.id == session.id)

    if (index == -1) this.#data.sessions.push(session)
    else this.#data.sessions[index] = session

    if (browser)
      localStorage.setItem('sessions', JSON.stringify(this.#data.sessions))
  }

  static loadSessions(): Session[] {
    if (!browser) return []

    const stored = localStorage.getItem('sessions')
    if (!stored) return []
    const parsed: Session[] = JSON.parse(stored)
    return parsed
  }
}

export let profile = new Profile()
