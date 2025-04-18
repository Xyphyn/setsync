<script lang="ts">
  import type { WorkoutSession } from '$lib/session.svelte'
  import { getContext } from 'svelte'
  import { Icon, Pause, Play, PlayPause } from 'svelte-hero-icons'
  import { Tween } from 'svelte/motion'

  let session: WorkoutSession = getContext('session')

  function handleWorkout() {
    switch (session.state) {
      case 'active': {
        session.state = 'rest'
        restEnd = Date.now() + restTime
        restInterval = triggerRestInterval()
        break
      }
      case 'rest': {
        session.state = 'active'
        clearInterval(restInterval)
        break
      }
      case 'inactive': {
        session.state = 'active'
        break
      }
    }
  }

  let restTime = $state(60 * 1000)
  let restEnd = $state(0)
  let restInterval = $state(-1)

  let restTween = new Tween(0, {
    duration: 0,
  })

  function triggerRestInterval() {
    restTween.set(Math.floor((restEnd - Date.now()) / 1000), { duration: 0 })

    return setInterval(() => {
      restTween.set(Math.floor((restEnd - Date.now()) / 1000))
    }, 1000)
  }
</script>

<button
  onclick={handleWorkout}
  class={[
    'rounded-full w-24 h-24 grid place-items-center cursor-pointer relative',
    'active:scale-95 transition-all z-10',
    session.state == 'inactive'
      ? 'bg-zinc-50 text-zinc-900'
      : 'bg-zinc-700 text-zinc-100',
  ]}
>
  {#if session.state == 'rest'}
    <div
      style="background: conic-gradient(rgba(60 60 255 / 1) {360 *
        (restTween.current / (restTime / 1000))}deg, rgba(60 60 255 / 0) 0deg)"
      class="absolute -inset-0.5 bg-blue-500 -z-10 rounded-full"
    ></div>
  {/if}

  <Icon
    src={session.state == 'active'
      ? Pause
      : session.state == 'inactive'
        ? Play
        : session.state == 'rest'
          ? PlayPause
          : Play}
    size="40"
    solid
  />
</button>
{session.state}
{session.state == 'rest' ? `(${Math.floor(restTween.current)})` : ''}

<div class="mt-8 flex flex-col">
  rest time {restTime / 1000}
  <input
    type="range"
    min={15}
    max={300}
    step={15}
    bind:value={() => restTime / 1000, (v) => (restTime = v * 1000)}
  />
</div>
