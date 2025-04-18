<script lang="ts">
  import Button from '$lib/mono/Button.svelte'
  import TextInput from '$lib/mono/forms/TextInput.svelte'
  import type { WorkoutSession } from '$lib/session.svelte'
  import { getContext } from 'svelte'
  import { expoOut } from 'svelte/easing'
  import { slide } from 'svelte/transition'

  interface Props {
    submitted?: boolean
  }

  let { submitted = false }: Props = $props()

  let session: WorkoutSession = getContext('session')

  let logData = $state<{
    reps: number
    weight: number
  }>({ reps: 0, weight: 0 })

  function handleLog() {
    session.logSet({ reps: logData.reps, weight: logData.weight })
    submitted = true
    logData.reps = 0
  }
</script>

<fieldset
  class={[
    ' border border-zinc-800 rounded-xl p-5 max-w-xl w-full gap-4 flex flex-col transition-colors',
    submitted ? 'bg-zinc-900' : 'bg-zinc-950',
  ]}
>
  <legend class="text-sm font-medium">Log set</legend>
  {#if session.activeExercise}
    {#if !submitted}
      <form
        onsubmit={(e) => {
          e.preventDefault()
          handleLog()
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
    {/if}
  {:else}
    You need to choose an exercise to log sets.
  {/if}
</fieldset>
