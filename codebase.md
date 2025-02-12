# .gitignore

```
node_modules

# Output
.output
.vercel
.netlify
.wrangler
/.svelte-kit
/build

# OS
.DS_Store
Thumbs.db

# Env
.env
.env.*
!.env.example
!.env.test

# Vite
vite.config.js.timestamp-*
vite.config.ts.timestamp-*

```

# .npmrc

```
engine-strict=true

```

# .prettierrc

```
{
  "plugins": ["prettier-plugin-tailwindcss"]
}

```

# components.json

```json

```

# drizzle.config.ts

```ts
import { defineConfig } from "drizzle-kit";
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

export default defineConfig({
  schema: "./src/lib/server/db/schema.ts",

  dbCredentials: {
    url: process.env.DATABASE_URL,
  },

  verbose: true,
  strict: true,
  dialect: "postgresql",
});

```

# package.json

```json
{
  "name": "third0212",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "prepare": "svelte-kit sync || echo ''",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
    "db:push": "drizzle-kit push",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  },
  "devDependencies": {
    "@iconify/svelte": "^4.2.0",
    "@sveltejs/adapter-auto": "^4.0.0",
    "@sveltejs/kit": "^2.16.0",
    "@sveltejs/vite-plugin-svelte": "^5.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "drizzle-kit": "^0.30.2",
    "prettier-plugin-tailwindcss": "^0.6.11",
    "svelte": "^5.0.0",
    "svelte-check": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^6.0.0"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.10.4",
    "better-auth": "^1.1.17",
    "drizzle-orm": "^0.38.4",
    "postgres": "^3.4.5"
  }
}

```

# README.md

```md
# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

\`\`\`bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
\`\`\`

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

\`\`\`bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
\`\`\`

## Building

To create a production version of your app:

\`\`\`bash
npm run build
\`\`\`

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

```

# src/app.css

```css
@import "tailwindcss";

```

# src/app.d.ts

```ts
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

```

# src/app.html

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>

```

# src/hooks.server.ts

```ts
import { auth } from "$lib/server/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";

export async function handle({ event, resolve }) {
  return svelteKitHandler({ event, resolve, auth });
}

```

# src/lib/auth-client.ts

```ts
import { PUBLIC_BASE_URL } from "$env/static/public";
import { createAuthClient } from "better-auth/svelte";

export const authClient = createAuthClient({
  baseURL: PUBLIC_BASE_URL,
});

```

# src/lib/index.ts

```ts
// place files you want to import through the `$lib` alias in this folder.
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
const connectionString: string = process.env.DATABASE_URL as string;
const sql = neon(connectionString);
export { sql };

```

# src/lib/server/auth.ts

```ts
import { env } from "$env/dynamic/private";
import { PUBLIC_BASE_URL } from "$env/static/public";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "./db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  // emailAndPassword: {
  // 	enabled: true,
  // },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID!,
      clientSecret: env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
    },
  },
  baseURL: PUBLIC_BASE_URL,
});

```

# src/lib/server/db/index.ts

```ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { env } from "$env/dynamic/private";
if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
const client = neon(env.DATABASE_URL);
export const db = drizzle(client);

```

# src/lib/server/db/schema.ts

```ts
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

```

# src/routes/+layout.svelte

```svelte
<script lang="ts">
	import "../app.css";
	let { children } = $props();
</script>

<svelte:head>
	<title>svelte-starter</title>
</svelte:head>

{@render children()}
```

# src/routes/+page.svelte

```svelte
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
```

# src/routes/dashboard/+layout.server.ts

```ts
import { auth } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ request }) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    redirect(302, "/signin");
  }

  return {
    user: session.user,
  };
};

```

# src/routes/dashboard/+layout.svelte

```svelte
<script lang="ts">

	import type { Snippet } from "svelte";
	import type { LayoutData } from "./$types";

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<div class="flex flex-col gap-4 p-4">
	<h1 class="text-4xl font-bold">Dashboard Layout</h1>
	<div class="flex items-center gap-2">
		This is a protected layout:
		<div class="rounded-md border bg-card p-1 font-mono text-card-foreground">
			routes/dashboard/+layout.svelte
		</div>
	</div>

	<div>
		User data from layout server loader
		<pre>{JSON.stringify(data.user, null, 2)}</pre>
	</div>

  <a href="/">
    <button class="w-fit bg-blue-500 text-white py-2 px-3 rounded-lg border-none outline-none">Back to Home</button>
  </a>

	{@render children()}
</div>
```

# src/routes/dashboard/+page.svelte

```svelte
<div class="flex flex-col gap-1">
	Dashboard index page
	<div class="rounded-md border bg-card p-1 font-mono text-card-foreground">
		routes/dashboard/+page.svelte
	</div>
</div>
```

# src/routes/signin/+page.server.ts

```ts
import { auth } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const session = await auth.api.getSession({ headers: event.request.headers });

  const redirectPath = "/dashboard";

  if (session) {
    redirect(302, redirectPath);
  }

  // Also used on client signin page as callbackURL
  return {
    redirectPath,
  };
};

```

# src/routes/signin/+page.svelte

```svelte
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
```

# static/favicon.png

This is a binary file of the type: Image

# svelte.config.js

```js
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter()
	}
};

export default config;

```

# tsconfig.json

```json
{
	"extends": "./.svelte-kit/tsconfig.json",
	"compilerOptions": {
		"allowJs": true,
		"checkJs": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"resolveJsonModule": true,
		"skipLibCheck": true,
		"sourceMap": true,
		"strict": true,
		"moduleResolution": "bundler"
	}
	// Path aliases are handled by https://svelte.dev/docs/kit/configuration#alias
	// except $lib which is handled by https://svelte.dev/docs/kit/configuration#files
	//
	// If you want to overwrite includes/excludes, make sure to copy over the relevant includes/excludes
	// from the referenced tsconfig.json - TypeScript does not merge them in
}

```

# vite.config.ts

```ts
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],
});

```

