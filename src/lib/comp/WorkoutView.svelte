<script lang="ts">
  import { WorkoutSession } from '$lib/session.svelte'
  import { setContext } from 'svelte'
  import WorkoutControls from './WorkoutControls.svelte'
  import WorkoutLog from './WorkoutLog.svelte'
  import ExerciseSelector from './ExerciseSelector.svelte'

  interface Props {
    session: WorkoutSession
  }

  let { session }: Props = $props()

  setContext('session', session)

  let showLog = $state(true)
  $effect(() => {
    showLog = session.state == 'rest'
  })
</script>

<div
  class="w-full h-full flex flex-col items-center justify-center flex-1 z-0 gap-8 max-w-xl mx-auto"
>
  <ExerciseSelector />
  <div class={[session.state != 'rest' && 'hidden', 'w-full']}>
    <WorkoutLog submitted={!showLog} />
  </div>
  <WorkoutControls />
  <div class="h-64">
    <pre class="bg-zinc-950 rounded-xl text-xs p-4 py-2">
      {JSON.stringify(session.data, undefined, 4)}
    </pre>
  </div>
</div>
