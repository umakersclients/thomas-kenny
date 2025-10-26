import type { ComponentType } from "svelte";

export type NavigationLinkItem = {
	label: string;
	href: string;
	description?: string;
	icon?: ComponentType;
	active?: boolean;
	badge?: string;
	external?: boolean;
};

export type NavigationSection = {
	section?: string;
	links: NavigationLinkItem[];
};

export type NavigationLink = NavigationSection;
