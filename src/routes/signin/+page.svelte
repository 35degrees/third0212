<script lang="ts">
  import Icon from "@iconify/svelte";
	import { authClient } from "$lib/auth-client";

	const { data } = $props();
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="flex flex-col items-center gap-8 rounded-xl border bg-card p-10">
		<div class="github-logo">
      <Icon icon="fe:github" width="50" height="50" />
    </div>
		<div class="flex flex-col ">
		
			<button
				type="button"
				onclick={() =>
					authClient.signIn.social({ provider: "github", callbackURL: data.redirectPath })}
        class="bg-blue-500 -mt-4 text-white py-2 px-3 rounded-lg border-none outline-none cursor-pointer"
			>
				Sign in with GitHub
			</button>
      <div class="google-logo py-6 text-center flex items-center justify-center">
        <Icon icon="devicon:google" width="38" height="38" />
      </div>
		<div class="flex flex-col gap-2">
		
			<button
				type="button"
				onclick={() =>
				authClient.signIn.social({ provider: "google", callbackURL: data.redirectPath })}
        class="bg-blue-500 text-white py-2 px-3 rounded-lg border-none outline-none cursor-pointer"
			>
				Sign in with Google
			</button>
      <a href="/"><p class="text-md text-center mt-4 opacity-80 text-slate-500">Return Home</p></a>
			<!-- <Button
				type="button"
				onclick={() =>
					authClient.signIn.social({ provider: "google", callbackURL: data.redirectPath })}
				variant="outline"
				size="lg"
			>
				Sign in with Google
			</Button> -->
		</div>
    </div>
	</div>
</div>

<style>
  button:hover {
    filter: brightness(1.1);
  }
</style>