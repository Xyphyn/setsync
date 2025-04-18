import { profile } from '$lib/log.svelte'

export async function load() {
  return profile.data
}
