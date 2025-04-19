<script lang="ts">
  import { exerciseDb, type ExerciseType } from '$lib/log.svelte'
  import Badge from '$lib/mono/Badge.svelte'
  import Button from '$lib/mono/Button.svelte'
  import Option from '$lib/mono/forms/select/Option.svelte'
  import Select from '$lib/mono/forms/select/Select.svelte'
  import Modal from '$lib/mono/Modal.svelte'
  import type { WorkoutSession } from '$lib/session.svelte'
  import { getContext } from 'svelte'

  let session: WorkoutSession = getContext('session')

  let newExercise = $state<{
    open: boolean
    type: ExerciseType
  }>({
    open: false,
    type: {
      type: 'bicepCurl',
      variation: 'standard',
    },
  })
</script>

<Modal title="New exercise" bind:open={newExercise.open}>
  <p>Which exercise are you doing next?</p>
  <form
    onsubmit={(e) => {
      e.preventDefault()

      session.data.exercises.push({ sets: [], type: { ...newExercise.type! } })
      session.data.active = session.data.exercises.length - 1
      newExercise.open = false
    }}
    class="space-y-2"
  >
    <div class="flex flex-row gap-2">
      <Select
        class="flex-1"
        label="Type"
        required
        bind:value={newExercise.type.type}
      >
        {#each Object.keys(exerciseDb) as key}
          <Option value={key}>{key}</Option>
        {/each}
      </Select>
      {#key newExercise.type.type}
        <Select
          label="Variation"
          required
          bind:value={newExercise.type.variation}
        >
          {#each exerciseDb[newExercise.type.type].variations as variation}
            <Option value={variation}>{variation}</Option>
          {/each}
        </Select>
      {/key}
    </div>
    <Button submit color="primary" size="lg" class="w-full">Submit</Button>
  </form>
</Modal>

<div
  class="bg-zinc-950 border border-zinc-800 p-5 rounded-xl flex flex-col w-full gap-2"
>
  {#if session.activeExercise}
    <div class="flex flex-row gap-2">
      {#each session.data.exercises as exercise, index}
        <button
          class={[
            'w-7.5 h-7.5 rounded-full grid place-items-center font-medium cursor-pointer',
            index == session.data.active
              ? 'bg-zinc-100 text-zinc-900'
              : 'bg-zinc-800',
          ]}
          onclick={() => (session.data.active = index)}
        >
          {index + 1}
        </button>
      {/each}
    </div>
    <div class="font-medium text-lg capitalize flex flex-row gap-2">
      <p>{session.activeExercise.type.type}</p>
      <Badge>{session.activeExercise.type.variation}</Badge>
    </div>
    <div class="space-y-0.5">
      <p class="text-sm">
        {session.activeExercise.sets.length} sets logged
      </p>
      <div class="flex flex-row gap-2 flex-wrap">
        {#each session.activeExercise.sets as set}
          <Badge>{set.reps} × {set.weight}lb</Badge>
        {/each}
      </div>
    </div>
  {/if}
  <div></div>
  <div class="flex flex-row gap-2">
    <Button
      onclick={() => (newExercise.open = !newExercise.open)}
      rounding="xl"
      color="primary"
      class="w-max"
    >
      Next Exercise
    </Button>
    <Button
      rounding="xl"
      class="w-max"
      onclick={() => {
        session.data.exercises.splice(session.data.active, 1)
        if (session.data.active > session.data.exercises.length - 1)
          session.data.active = session.data.exercises.length - 1
      }}
    >
      Remove
    </Button>
  </div>
</div>
