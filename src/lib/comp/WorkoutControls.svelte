<script lang="ts">
  import { action, modal } from '$lib/mono/modal'
  import { sessionHandler, type WorkoutSession } from '$lib/session.svelte'
  import { getContext } from 'svelte'
  import { Icon, Pause, Play, PlayPause, XMark } from 'svelte-hero-icons'
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

<div class="items-center flex flex-col gap-2">
  <button
    onclick={handleWorkout}
    class={[
      'rounded-full w-24 h-24 grid place-items-center cursor-pointer relative',
      'active:scale-95 transition-all z-10',
      session.state == 'inactive'
        ? 'bg-zinc-50 text-zinc-900'
        : 'bg-zinc-900 text-zinc-100',
    ]}
  >
    {#if session.state == 'rest'}
      <div
        style="background: conic-gradient(rgba(60 60 255 / 1) {360 *
          (restTween.current /
            (restTime / 1000))}deg, rgba(60 60 255 / 0) 0deg)"
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
  <div>
    <span class="font-medium capitalize">
      {session.state}
    </span>
    <span>
      {session.state == 'rest' ? `(${Math.floor(restTween.current)}s)` : ''}
    </span>
  </div>
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
  <div class="flex flex-row gap-2">
    <button
      onclick={() =>
        modal({
          title: 'Confirm',
          body: 'This will end your running workout.',
          actions: [
            action({
              type: 'danger',
              content: 'Confirm',
              action: () => {
                sessionHandler.startSession()
              },
              close: true,
            }),
            action({ close: true, content: 'Cancel' }),
          ],
        })}
      class="rounded-full w-8 h-8 bg-red-500 text-white
      grid place-items-center cursor-pointer hover:bg-red-700 transition-all active:scale-95"
    >
      <Icon src={XMark} size="20" micro />
    </button>
  </div>
</div>
