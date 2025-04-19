<script lang="ts">
  import { profile } from '$lib/log.svelte.js'
  import Badge from '$lib/mono/Badge.svelte'
  import Button from '$lib/mono/Button.svelte'
  import { action, modal } from '$lib/mono/modal.js'
  import { Icon, Trash } from 'svelte-hero-icons'

  let { data } = $props()
</script>

<div class="grid grid-cols-1 xl:grid-cols-2 p-5 gap-5">
  {#each data.sessions.toReversed() as session}
    <div
      class="flex flex-col gap-2 border rounded-xl p-5 border-zinc-800 max-h-96 overflow-auto"
    >
      {#if session.date}
        <div>
          {new Date(session.date).toLocaleString()}
        </div>
      {/if}
      <div class="font-medium text-lg">{session.name ?? 'Unnamed'}</div>
      <div class="flex flex-col gap-2">
        {#each session.exercises as exercise}
          <div class="space-y-1 bg-zinc-900 p-3 rounded-lg">
            <div class="capitalize font-semibold text-sm">{exercise.type}</div>
            <div class="flex flex-row flex-wrap gap-1">
              {#each exercise.sets as set}
                <Badge>{set.reps} × {set.weight}lb</Badge>
              {/each}
            </div>
          </div>
        {/each}
      </div>
      <Button
        onclick={() =>
          modal({
            title: 'Confirm',
            body: 'This will permanently delete this workout.',
            actions: [
              action({
                close: true,
                type: 'danger',
                content: 'Confirm',
                action: () => {
                  const index = profile.data.sessions.findIndex(
                    (i) => i.id == session.id
                  )
                  if (index != -1) profile.data.sessions.splice(index, 1)
                },
              }),
              action({ close: true, content: 'Cancel' }),
            ],
          })}
        color="danger"
        size="square-md"
      >
        <Icon src={Trash} size="16" micro />
      </Button>
    </div>
  {/each}
</div>
