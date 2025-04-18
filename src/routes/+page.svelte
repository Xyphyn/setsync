<script lang="ts">
  import WorkoutView from '$lib/comp/WorkoutView.svelte'
  import { WorkoutSession } from '$lib/session.svelte'

  let session = new WorkoutSession()
</script>

<div class="p-6">
  <WorkoutView {session} />
</div>
