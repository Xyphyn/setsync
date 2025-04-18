<script lang="ts">
  import { exerciseDb, type ExerciseType } from '$lib/log'
  import Button from '$lib/mono/Button.svelte'
  import Option from '$lib/mono/forms/select/Option.svelte'
  import Select from '$lib/mono/forms/select/Select.svelte'
  import Modal from '$lib/mono/Modal.svelte'
  import type { WorkoutSession } from '$lib/session.svelte'
  import { getContext } from 'svelte'

  let session: WorkoutSession = getContext('session')

  let newExercise = $state<{
    open: boolean
    type?: ExerciseType
  }>({
    open: false,
  })
</script>

<Modal title="New exercise" bind:open={newExercise.open}>
  <p>Which exercise are you doing next?</p>
  <form
    onsubmit={(e) => {
      e.preventDefault()

      session.data.exercises.push({ sets: [], type: newExercise.type! })
      newExercise.open = false
    }}
  >
    <Select required bind:value={newExercise.type}>
      {#each Object.keys(exerciseDb) as key}
        <Option value={key}>{key}</Option>
      {/each}
    </Select>
    <Button submit color="primary" size="lg">Submit</Button>
  </form>
</Modal>

<div
  class="bg-zinc-950 border border-zinc-800 p-5 rounded-xl flex flex-col w-full gap-2"
>
  {#if session.activeExercise}
    <div class="flex flex-row gap-2">
      {#each session.data.exercises as exercise, index}
        <div
          class={[
            'w-7.5 h-7.5 rounded-full grid place-items-center font-medium',
            index == session.data.exercises.length - 1
              ? 'bg-zinc-100 text-zinc-900'
              : 'bg-zinc-700',
          ]}
        >
          {index + 1}
        </div>
      {/each}
    </div>
    <div>
      <p>{session.activeExercise.type}</p>
      <p>{session.activeExercise.sets.length} sets logged</p>
    </div>
  {/if}
  <div></div>
  <Button
    onclick={() => (newExercise.open = !newExercise.open)}
    rounding="xl"
    color="primary"
    class="w-max"
  >
    Next Exercise
  </Button>
</div>
