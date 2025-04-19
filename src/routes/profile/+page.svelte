<script lang="ts">
  import {
    exerciseDb,
    profile,
    type ExerciseType,
    type Session,
  } from '$lib/log.svelte'
  import Badge from '$lib/mono/Badge.svelte'
  import Button from '$lib/mono/Button.svelte'
  import Option from '$lib/mono/forms/select/Option.svelte'
  import Select from '$lib/mono/forms/select/Select.svelte'
  import TextInput from '$lib/mono/forms/TextInput.svelte'
  import Modal from '$lib/mono/Modal.svelte'

  type Exercise = keyof typeof exerciseDb

  type GoalData = {
    open: boolean
    type: ExerciseType
    value: {
      weight: number
      reps: number
    }
  }

  let newGoal = $state<GoalData>({
    open: false,
    type: {
      type: 'bicepCurl',
      variation: 'standard',
    },
    value: {
      weight: 0,
      reps: 1,
    },
  })

  function goalPercentage(
    best: { weight: number; reps: number },
    goal: { weight: number; reps: number }
  ): number {
    const best1RM = best.weight * (1 + best.reps / 30)
    const goal1RM = goal.weight * (1 + goal.reps / 30)

    return best1RM / goal1RM
  }

  function addGoal(data: GoalData) {
    profile.data.goals[data.type.type] = data.value
  }

  function findMaxAndIndex<T>(arr: T[]) {
    if (arr.length === 0) return { max: undefined, index: -1 }

    let max = arr[0]
    let index = 0

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
        max = arr[i]
        index = i
      }
    }

    return { max, index }
  }

  const findBests = (
    sessions: Session[]
  ): Partial<
    Record<keyof typeof exerciseDb, { reps: number; weight: number }>
  > => {
    let foundBests: Partial<
      Record<keyof typeof exerciseDb, { reps: number; weight: number }>
    > = {}

    for (let i = 0; i < sessions.length; i++) {
      console.log($state.snapshot(sessions))
      for (let j = 0; j < sessions[i].exercises.length; j++) {
        console.log(j)
        const exercise = sessions[i].exercises[j]
        if (!exercise) {
          console.log('Stopped at', sessions[i].exercises[j])
          continue
        }
        const oneRMs = exercise.sets.map((i) => i.weight * (1 + i.reps / 30))
        // TODO add error handling if array empty
        const max1RM = findMaxAndIndex(oneRMs)

        const currentBest = foundBests[exercise.type.type]
        const currentBest1RM =
          (currentBest && currentBest.weight * (1 + currentBest.reps / 30)) ??
          -1

        if (currentBest1RM < (max1RM.max ?? 0)) {
          const bestSet = exercise.sets[max1RM.index]
          foundBests[exercise.type.type] = {
            reps: bestSet.reps,
            weight: bestSet.weight,
          }
        }
      }
    }

    return foundBests
  }

  let bests = $derived(findBests(profile.data.sessions))
  $inspect(bests)
</script>

<Modal title="Add goal" bind:open={newGoal.open}>
  <form
    onsubmit={(e) => {
      e.preventDefault()

      addGoal({
        open: false,
        type: { ...newGoal.type },
        value: { ...newGoal.value },
      })
      newGoal.open = false
    }}
    class="space-y-2"
  >
    <div class="flex flex-row gap-2">
      <Select
        class="flex-1"
        label="Type"
        required
        bind:value={newGoal.type.type}
      >
        {#each Object.keys(exerciseDb) as key}
          <Option value={key}>{key}</Option>
        {/each}
      </Select>
      {#key newGoal.type.type}
        <Select label="Variation" required bind:value={newGoal.type.variation}>
          {#each exerciseDb[newGoal.type.type].variations as variation}
            <Option value={variation}>{variation}</Option>
          {/each}
        </Select>
      {/key}
    </div>
    <TextInput type="number" label="Weight" bind:value={newGoal.value.weight} />
    <TextInput type="number" label="Reps" bind:value={newGoal.value.reps} />
    <Button submit color="primary" size="lg" class="w-full">Submit</Button>
  </form>
</Modal>

<div class="p-5 space-y-5">
  <h1 class="font-medium text-3xl md:text-4xl tracking-tight">Goals</h1>
  <div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
    {#each Object.keys(profile.data.goals) as goal}
      {@const goalValue =
        /* @ts-ignore */
        profile.data.goals[goal]}
      {#if goalValue}
        {@const bestValue =
          //@ts-ignore
          bests[goal]}
        <div
          class="p-5 rounded-xl border border-zinc-800 relative overflow-auto"
        >
          {#if bestValue}
            <div
              class="absolute top-0 bg-gradient-to-r from-blue-400 to-violet-500 h-px left-0 rounded-xl"
              style="width: {Math.floor(
                goalPercentage(bestValue, goalValue) * 100
              )}%;"
            ></div>
          {/if}
          <div class="font-medium text-sm capitalize">{goal}</div>
          <div class="w-max text-2xl font-semibold">
            {goalValue.reps}×{goalValue.weight}lb
          </div>
          {#if bestValue}
            <div class="text-sm">
              <span
                class="font-medium text-lg bg-gradient-to-r from-blue-400 to-violet-500 text-transparent bg-clip-text"
              >
                {Math.floor(goalPercentage(bestValue, goalValue) * 100)}%
              </span>
              of goal
            </div>
            <div class="font-medium text-sm">
              Best <span class="font-normal">
                {bestValue.reps}×{bestValue.weight}lb
              </span>
            </div>
          {/if}
        </div>
      {/if}
    {/each}
  </div>
  <Button
    onclick={() => (newGoal.open = !newGoal.open)}
    color="primary"
    rounding="xl"
  >
    Add goal
  </Button>
  <h1 class="font-medium text-3xl md:text-4xl tracking-tight">Best sets</h1>
  <div class="flex flex-col gap-4">
    {#each Object.keys(bests) as best}
      {@const value =
        // @ts-ignore
        bests[best]}
      {#if value}
        <div>
          <div>
            {best}
          </div>
          <div>
            {value.reps} x {value.weight}
          </div>
        </div>
      {/if}
    {/each}
  </div>
</div>
