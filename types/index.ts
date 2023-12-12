import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export type Profile = {
	id: number;
	name: string;
	prompt: string;
	username: string;
};
