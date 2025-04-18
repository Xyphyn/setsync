<script lang="ts">
  import Button, { type ButtonProps } from '$lib/mono/Button.svelte'
  import { Icon, type IconSource } from 'svelte-hero-icons'

  interface Props extends ButtonProps {
    icon: IconSource
    label: string
  }

  let { icon, label, children, ...rest }: Props = $props()
</script>

<Button
  {...rest}
  color="tertiary"
  size="custom"
  class="md:px-4 md:py-2 max-md:w-9 max-md:h-9 justify-start items-start"
  alignment="left"
  title={label}
>
  {#snippet prefix()}
    <div class="max-md:w-full h-full grid place-items-center">
      <Icon src={icon} size="18" />
    </div>
  {/snippet}
  <span class="max-md:hidden">{label}</span>
</Button>
