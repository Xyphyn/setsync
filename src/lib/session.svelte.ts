import { browser } from '$app/environment'
import {
  profile,
  type Exercise,
  type ExerciseSet,
  type Session,
} from './log.svelte'
import { v4 as uuidv4 } from 'uuid'

export class WorkoutSession {
  #data = $state<Session>({
    id: '',
    exercises: [],
    active: 0,
  })
  state: 'active' | 'rest' | 'inactive' = $state('inactive')

  constructor(data?: Session) {
    this.state = 'inactive'

    if (!data) {
      this.#data.id = uuidv4()
      this.#data.date = new Date().toISOString()
    } else {
      this.#data = data
    }

    if (browser) {
      localStorage.setItem('activeSession', this.#data.id)
    }

    $effect.root(() => {
      $effect(() => {
        if (this.#data) this.save()
      })
    })
  }

  logSet(set: ExerciseSet, index?: number) {
    if (index != undefined && this.activeExercise)
      this.activeExercise.sets[index] = set
    else this.activeExercise?.sets.push(set)
  }

  get data() {
    return this.#data
  }

  get activeExercise(): Exercise | undefined {
    return this.#data.exercises[this.#data.active]
  }
  set activeExercise(v: Exercise) {
    this.#data.exercises[this.#data.active] = v
  }

  async save() {
    if (browser) {
      profile.saveSession(this.#data)
    }
  }
}

class SessionHandler {
  constructor() {
    if (!browser) return

    const activeSession = localStorage.getItem('activeSession')
    if (!activeSession) return

    const found = profile.data.sessions.find((s) => s.id == activeSession)

    if (found) this.active = new WorkoutSession(found)
  }

  active: WorkoutSession | undefined = $state()

  startSession() {
    this.active = new WorkoutSession()
  }
}

export let sessionHandler = new SessionHandler()
