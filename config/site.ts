export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "Automate Reddit Dashboard",
	description:
		"Automate Reddit Dashboard is a dashboard for Reddit that allows you to automate your Reddit account.",
	navItems: [
		{
			label: "Home",
			href: "/",
		},
	],
	navMenuItems: [
		{
			label: "Profile",
			href: "/profile",
		},

		{
			label: "Settings",
			href: "/settings",
		},

		{
			label: "Logout",
			href: "/logout",
		},
	],
	links: {
		github: "https://github.com/nextui-org/nextui",
	},
};
