<script>
  import Button from '$lib/mono/Button.svelte'
  import { Bolt, ChartBar, Clock, Icon, UserCircle } from 'svelte-hero-icons'
  import SidebarButton from './SidebarButton.svelte'
</script>

<SidebarButton href="/" icon={Bolt} label="Workout" />
<SidebarButton href="/history" icon={Clock} label="History" />
<SidebarButton href="/" icon={ChartBar} label="Analytics" />
<SidebarButton href="/profile" icon={UserCircle} label="Profile" />
