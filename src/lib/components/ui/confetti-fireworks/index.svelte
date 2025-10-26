<script lang="ts">
import { cn } from "$lib/utils";

export type ConfettiFireworksProps = {
	class?: string;
	pieces?: number;
	bursts?: number;
};

let {
	class: className,
	pieces = 28,
	bursts = 4,
}: ConfettiFireworksProps = $props();

const confettiIndexes = Array.from({ length: pieces }, (_, index) => index);
const burstIndexes = Array.from({ length: bursts }, (_, index) => index);
const colors = ["#f97316", "#22d3ee", "#a855f7", "#facc15", "#4ade80"];
</script>

<div
	class={cn(
		"pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.9),transparent)]",
		className,
	)}
	aria-hidden="true"
>
	{#each confettiIndexes as index}
		<span
			class="confetti-piece"
			style={`--confetti-left:${(index / pieces) * 100}%; --confetti-delay:${(index % 7) * 0.35}s; --confetti-color:${colors[index % colors.length]}; --confetti-tilt:${(index % 5) * 18}deg;`}
		></span>
	{/each}

	{#each burstIndexes as index}
		<span
			class="firework-burst"
			style={`--firework-left:${(index / bursts) * 100}%; --firework-delay:${index * 0.9}s;`}
		></span>
	{/each}
</div>

<style>
	.confetti-piece {
		position: absolute;
		top: -10%;
		left: var(--confetti-left);
		width: 0.5rem;
		height: 1rem;
		background: var(--confetti-color);
		border-radius: 0.125rem;
		opacity: 0.8;
		animation: confetti-fall 6.5s linear infinite;
		animation-delay: var(--confetti-delay);
		transform: rotate(var(--confetti-tilt));
	}

	.firework-burst {
		position: absolute;
		top: 15%;
		left: var(--firework-left);
		width: 12rem;
		height: 12rem;
		background:
			radial-gradient(circle, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0) 55%),
			conic-gradient(from 0deg, rgba(248, 113, 113, 0.8), rgba(96, 165, 250, 0.8), rgba(244, 114, 182, 0.8), rgba(248, 113, 113, 0.8));
		mix-blend-mode: screen;
		animation: firework-pop 3.4s ease-in-out infinite;
		animation-delay: var(--firework-delay);
		opacity: 0.55;
		border-radius: 9999px;
	}

	@keyframes confetti-fall {
		0% {
			opacity: 0;
			transform: translate3d(0, 0, 0) rotate(var(--confetti-tilt));
		}
		12% {
			opacity: 1;
		}
		60% {
			opacity: 0.9;
		}
		100% {
			opacity: 0;
			transform: translate3d(0, 120vh, 0) rotate(calc(var(--confetti-tilt) + 540deg));
		}
	}

	@keyframes firework-pop {
		0% {
			opacity: 0;
			transform: translate3d(-50%, 0, 0) scale(0.2);
		}
		40% {
			opacity: 0.75;
			transform: translate3d(-50%, 0, 0) scale(1.05);
		}
		70% {
			opacity: 0.3;
			transform: translate3d(-50%, 0, 0) scale(0.75);
		}
		100% {
			opacity: 0;
			transform: translate3d(-50%, 0, 0) scale(0.4);
		}
	}
</style>
