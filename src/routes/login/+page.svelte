<script lang="ts">
import { Button } from "$lib/components/ui/button";
import { Input } from "$lib/components/ui/input";
import { Label } from "$lib/components/ui/label";
import { Separator } from "$lib/components/ui/separator";

type LoginPageData = {
	reason: string | null;
	requiredRole: string | null;
	redirectTo: string;
};

const {
	data,
	form,
}: {
		data: LoginPageData;
		form?: {
			action?: string;
			message?: string;
			fields?: Record<string, string>;
			redirectTo?: string;
			success?: boolean;
		} | null;
	} = $props();

const loginError = $derived.by(() => (form?.action === "login" ? form?.message ?? null : null));
const redirectTo = $derived.by(() => form?.redirectTo ?? data.redirectTo ?? "/quotes");

const sampleAccounts = [
	{ username: "quotes", password: "quotes", label: "Quotes access" },
	{ username: "filter", password: "filter", label: "Filters access" },
	{ username: "admin", password: "admin", label: "Full access" },
];

const reasonCopy = $derived.by(() => {
	if (data.reason === "forbidden" && data.requiredRole) {
		return `You need the "${data.requiredRole}" role to view that area.`;
	}
	if (data.reason === "unauthenticated") {
		return "Please sign in to continue.";
	}
	return "Sign in to manage the South Park quotes dashboard.";
});
</script>

<section class="w-full max-w-md space-y-6 rounded-3xl border border-border/70 bg-card/90 p-8 shadow-xl backdrop-blur">
	<div class="space-y-2 text-center">
		<h1 class="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
		<p class="text-sm text-muted-foreground">{reasonCopy}</p>
	</div>

	<form method="POST" action="?/login" class="space-y-4">
		<input type="hidden" name="redirectTo" value={redirectTo} />
		<div class="space-y-2 text-left">
			<Label for="login-username">Username</Label>
			<Input
				id="login-username"
				name="username"
				autocomplete="username"
				required
				value={form?.fields?.username ?? ""}
			/>
		</div>
		<div class="space-y-2 text-left">
			<Label for="login-password">Password</Label>
			<Input
				id="login-password"
				type="password"
				name="password"
				autocomplete="current-password"
				required
			/>
		</div>
		{#if loginError}
			<p class="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
				{loginError}
			</p>
		{/if}
		<Button type="submit" class="w-full">Sign in</Button>
	</form>

	<Separator class="my-4" />

	<div class="space-y-3 text-left text-xs text-muted-foreground">
		<p class="font-semibold uppercase tracking-wide text-[11px] text-muted-foreground/80">
			Sample accounts
		</p>
		<ul class="grid gap-2">
			{#each sampleAccounts as sample}
				<li class="flex items-center justify-between rounded-lg border border-border/60 bg-background/80 px-3 py-2">
					<div>
						<p class="text-sm font-semibold text-foreground">{sample.username}</p>
						<p class="text-[11px] text-muted-foreground/80">{sample.label}</p>
					</div>
					<span class="font-mono text-xs text-muted-foreground">{sample.password}</span>
				</li>
			{/each}
		</ul>
	</div>
</section>
