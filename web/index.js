import React from "react";
import { render, } from "react-dom";
// import { createOvermind } from 'overmind'
// import { Provider} from 'overmind-react'
// import { config } from "./src/overmind";
import App from "./src/App";

const getAppEnv = () => 'local';

// const overmind = createOvermind(config);

window.log = getAppEnv() !== "prod" ? console.log : () => {};

log(`Running in "${getAppEnv()}" mode.`);

// render the application
function renderApp() {
	// <Provider value={overmind}>
	render(
		<App />,
		document.getElementById("root")
	);
			// </Provider>,
}

renderApp();

if (module.hot) {
	module.hot.accept();
}
