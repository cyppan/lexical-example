import Editor from "./Editor";
import "./style.css";
import { VariablesContext, availableVariables } from "./VariablesContext";

export default function App() {
	return (
		<VariablesContext.Provider value={availableVariables}>
			<div className="App">
				<Editor />
			</div>
		</VariablesContext.Provider>
	);
}
