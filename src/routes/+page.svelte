<script lang="ts">
	import { authClient } from "$lib/auth-client";

	const session = authClient.useSession();
</script>

<div class="flex flex-col gap-4 p-6">
	<h1 class="text-4xl font-bold">svelte-starter</h1>
	<div class="flex items-center gap-2">
		This is an unprotected page:
		<div class="rounded-md border bg-card p-1 font-mono text-card-foreground">
			routes/+page.svelte
		</div>
	</div>

	{#if $session.data}
		<div class="flex flex-col gap-2">
			<p>Welcome back, {$session?.data.user.name}!</p>
      <a href="/dashboard">
      
        <button class="w-fit bg-blue-500 text-white py-2 px-3 rounded-lg border-none outline-none" >Go to Dashboard</button>
      </a>
			<div>
				More data from auth client:
				<pre>{JSON.stringify($session?.data.user, null, 2)}</pre>
			</div>
			<button
				type="button"
				onclick={() => authClient.signOut()}
				class="w-fit bg-blue-500 text-white py-2 px-3 rounded-lg border-none outline-none"
		
				>Sign out</button
			>
		</div>
	{:else}
		<div class="flex flex-col gap-2">
			<p>You are not signed in.</p>
      <a href="/signin">
        <button class="w-fit bg-blue-500 text-white py-2 px-3 rounded-lg border-none outline-none">Sign in</button>
      </a>
		</div>
	{/if}

	<a
		class="text-muted-foreground underline hover:text-foreground"
		href="https://github.com/dotnize/svelte-starter"
		target="_blank"
		rel="noreferrer noopener"
	>
		dotnize/svelte-starter
	</a>
</div>