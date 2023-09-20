import { createContext } from "react";

export const availableVariables = [
	{ name: "Order Number", value: "{{order.name}}" },
];

export const VariablesContext = createContext(availableVariables);
