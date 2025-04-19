<script lang="ts">
  import WorkoutView from '$lib/comp/WorkoutView.svelte'
  import { sessionHandler } from '$lib/session.svelte'

  if (!sessionHandler.active) sessionHandler.startSession()
</script>

<div class="p-6">
  <WorkoutView session={sessionHandler.active!} />
</div>
