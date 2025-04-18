<script lang="ts">
  import Button from '$lib/mono/Button.svelte'
  import TextInput from '$lib/mono/forms/TextInput.svelte'
  import type { WorkoutSession } from '$lib/session.svelte'
  import { getContext } from 'svelte'
  import { expoOut } from 'svelte/easing'
  import { slide } from 'svelte/transition'

  interface Props {
    submitted?: boolean
    onsubmit?: (submitted: boolean) => void
    data?: { reps: number; weight: number }
  }

  let { submitted = $bindable(false), onsubmit, data }: Props = $props()

  let session: WorkoutSession = getContext('session')

  let logData = $state<{
    reps: number
    weight: number
  }>(data ?? { reps: 0, weight: 0 })

  function handleLog(editing: boolean) {
    console.log(editing, session.activeExercise!.sets.length - 1)
    session.logSet(
      { reps: logData.reps, weight: logData.weight },
      editing ? session.activeExercise!.sets.length - 1 : undefined
    )
    submitted = true
    onsubmit?.(submitted)
    logData.reps = 0
  }
</script>

<fieldset
  class={[
    'bg-zinc-950 border border-zinc-800 rounded-xl p-5 max-w-xl w-full gap-4 flex flex-col transition-colors',
  ]}
>
  <legend class="text-sm font-medium">Log set</legend>
  {#if submitted}
    Editing last set
  {/if}
  {#if session.activeExercise}
    <form
      onsubmit={(e) => {
        e.preventDefault()
        handleLog(submitted)
      }}
      class="space-y-2"
      out:slide={{ duration: 500, easing: expoOut, axis: 'y' }}
    >
      <TextInput
        label="Reps"
        size="sm"
        class="rounded-lg"
        type="number"
        bind:value={logData.reps}
      />
      <TextInput
        label="Weight"
        size="sm"
        class="rounded-lg"
        type="number"
        bind:value={logData.weight}
      />
      <Button submit color="primary" rounding="xl">Submit</Button>
    </form>
  {:else}
    You need to choose an exercise to log sets.
  {/if}
</fieldset>
