<script lang="ts">
  import '../app.css'

  let { children } = $props()
</script>

<div class="min-h-screen h-full w-full flex flex-col">
  {@render children()}
</div>
