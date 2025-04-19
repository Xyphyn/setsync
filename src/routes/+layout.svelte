<script lang="ts">
  import Button from '$lib/mono/Button.svelte'
  import {
    Bolt,
    ChartBar,
    CheckCircle,
    Clock,
    Home,
    Icon,
    UserCircle,
  } from 'svelte-hero-icons'
  import '../app.css'
  import Sidebar from './_components/Sidebar.svelte'
  import ModalContainer from '$lib/mono/ModalContainer.svelte'

  let { children } = $props()
</script>

<div class="layout bg-zinc-800">
  <ModalContainer />
  <div
    class="bg-zinc-950 flex flex-row md:flex-col p-4 h-full md:h-screen sticky top-0 z-50 justify-center"
  >
    <Sidebar />
  </div>
  <div class="min-h-screen h-full w-full flex flex-col bg-zinc-950 z-10">
    {@render children()}
  </div>
</div>

<style>
  .layout {
    display: grid;
    grid-template-rows: 4rem 1fr;
    gap: 1px;
  }

  @media screen and (min-width: 768px) {
    .layout {
      grid-template-columns: 20% 1fr;
      grid-template-rows: none;
    }
  }
</style>
