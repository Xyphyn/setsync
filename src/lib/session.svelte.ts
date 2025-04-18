import type { Exercise, ExerciseSet, Session } from './log'

export class WorkoutSession {
  #data = $state<Session>({
    id: 0,
    exercises: [],
  })
  state: 'active' | 'rest' | 'inactive' = $state('inactive')

  constructor() {
    this.state = 'inactive'
  }

  logSet(set: ExerciseSet) {
    this.activeExercise?.sets.push(set)
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
}
