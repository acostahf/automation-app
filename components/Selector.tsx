import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { Asset } from "@/types/index";

interface SelectorProps {
	data: Asset[];
	handleSelect: (selectedValue: string) => void;
}

const Selector = ({ data, handleSelect }: SelectorProps) => {
	return (
		<div className="flex w-full flex-wrap md:flex-nowrap gap-4">
			<Select label="Select a video" className="max-w-xs">
				{data.map((item, index) => (
					<SelectItem
						key={index}
						value={item.link}
						onClick={() => handleSelect(item.link)}
					>
						{item.label}
					</SelectItem>
				))}
			</Select>
		</div>
	);
};

export default Selector;
