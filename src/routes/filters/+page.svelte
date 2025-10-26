<script lang="ts">
import { ConfettiFireworks } from "$lib/components/ui/confetti-fireworks";

type FiltersPageData = {
	authorized: boolean;
	user?: { username: string; roles: string[] };
	authContext?: import("$lib/server/auth").AuthFailure | null;
};

const { data } = $props<{ data: FiltersPageData }>();
</script>

{#if data.authorized && data.user}
	<section class="relative overflow-hidden rounded-3xl border border-border/60 bg-background/80 p-10 shadow-lg">
		<ConfettiFireworks class="absolute inset-0" />
		<div class="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
			<div class="space-y-2">
				<p class="text-xs uppercase tracking-[0.35em] text-muted-foreground">Experimental</p>
				<h1 class="text-3xl font-semibold tracking-tight text-foreground">
					Filter Playground, {data.user.username}!
				</h1>
				<p class="text-base text-muted-foreground">
					This sandbox showcases upcoming filter presets. Tailor the stream of quotes with playful confetti fireworks looping in the background.
				</p>
			</div>
			<ul class="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
				{#each data.user.roles as role}
					<li class="rounded-full border border-border/60 px-3 py-1 uppercase tracking-wide">
						{role}
					</li>
				{/each}
			</ul>
		</div>
	</section>
{:else}
	<div class="rounded-xl border border-border/60 bg-background/70 p-10 text-center text-sm text-muted-foreground">
		The filters playground is available to users with the <span class="font-semibold text-foreground">filter</span> role.
	</div>
{/if}
