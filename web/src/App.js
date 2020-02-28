import { hot } from "react-hot-loader";

import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { BrowserRouter } from "react-router-dom";
import { Route } from "react-router";

import { useOvermind, } from './overmind'

import "./App.less";

const pTypes = {};

const dProps = {};

const App = (props) => {
	const {
		state,
		actions,
	} = useOvermind();

	useEffect(() => {
		actions.getColors();
	}, []);

	const refreshColors = () => {
		actions.getColors();
	}

	// useEffect(() => {
	// 	if (state.stuff.data.length > 0 && state.stuff.data.length < 5)
	// 	actions.getColors();
	// }, [state.stuff.data]);

	const generateFontColor = (bgColor) => {
		const red = parseInt(bgColor.slice(1, 3), 16);
		const green = parseInt(bgColor.slice(3, 5), 16);
		const blue = parseInt(bgColor.slice(5, 7), 16);

		const perceivedLightness = (
			((red * .2126) +
			(green * .7152) + 
			(blue * .0722)) / 255
		)

		console.log({red, green, blue})

		return perceivedLightness > .5 ? 'black' : 'white'
	}

	return (
		<div className="app">
			<button onClick={refreshColors}>Refresh</button>
			<pre>
				{JSON.stringify(state, null, 2)}
			</pre>
			<div className="color-swatches">
				{state.stuff.data.map((color, index) => (
					<div 
					key={index}
					className="color-swatch"
					style={{
						backgroundColor: color,
						color: generateFontColor(color),
					}}>
						{color}
						<div className="extra">
							<div>This</div>
							<div>That</div>
							<div>Things</div>
							<div>Stuff</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

App.propTypes = pTypes;
App.defaultProps = dProps;

export default hot(module)(App);
