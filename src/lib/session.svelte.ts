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
  })
  state: 'active' | 'rest' | 'inactive' = $state('inactive')

  constructor() {
    this.state = 'inactive'
    this.#data.id = uuidv4()
    this.#data.date = new Date().toISOString()

    $effect(() => {
      if (this.#data.exercises.length > 0) {
        profile.saveSession(this.#data)
      }
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
    return this.#data.exercises[this.#data.exercises.length - 1]
  }
  set activeExercise(v: Exercise) {
    this.#data.exercises[this.#data.exercises.length] = v
  }

  async save() {}
}

class SessionHandler {
  active: WorkoutSession | undefined = $state()

  startSession() {
    this.active = new WorkoutSession()
  }
}

export let sessionHandler = new SessionHandler()
