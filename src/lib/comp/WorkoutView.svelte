<script lang="ts">
  import { WorkoutSession } from '$lib/session.svelte'
  import { setContext } from 'svelte'
  import WorkoutControls from './WorkoutControls.svelte'
  import WorkoutLog from './WorkoutLog.svelte'
  import ExerciseSelector from './ExerciseSelector.svelte'
  import Modal from '$lib/mono/Modal.svelte'
  import Button from '$lib/mono/Button.svelte'

  interface Props {
    session: WorkoutSession
  }

  let { session }: Props = $props()

  setContext('session', session)

  let logSubmitted = $state(false)
  let showLog = $state(false)
  $effect(() => {
    logSubmitted = session.state != 'rest'
  })
</script>

<div class="w-full h-full flex flex-col items-center flex-1 z-0 gap-8">
  <ExerciseSelector />
  <WorkoutControls />
  <div class={[session.state != 'rest' && 'hidden', 'mx-auto']}>
    <Button
      onclick={() => (showLog = !showLog)}
      rounding="xl"
      color={logSubmitted ? 'ghost' : 'primary'}
      class="ml-auto"
    >
      Log set
    </Button>
    <Modal bind:open={showLog}>
      {@const lastSet =
        session.activeExercise?.sets[session.activeExercise.sets.length - 1]}
      <WorkoutLog
        bind:submitted={logSubmitted}
        data={lastSet && {
          reps: lastSet?.reps,
          weight: lastSet?.weight,
        }}
        onsubmit={() => (showLog = false)}
      />
    </Modal>
  </div>
  <div class="h-64">
    <pre class="bg-zinc-950 rounded-xl text-xs p-4 py-2">
      {JSON.stringify(session.data, undefined, 4)}
    </pre>
  </div>
</div>
