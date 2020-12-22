import React, { useState, useEffect, } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Color from 'color';
import { CustomPicker, SketchPicker, } from 'react-color';
import { EditableInput, Hue, Saturation,  } from 'react-color/lib/components/common';
import { Popover, Icon, Input, Row, Col, } from 'antd';

import './Colors.less';

const ColorPicker = (props) => {
	const {
		color,
		onChange,
	} = props;

	const handleColorChange = (color) => {
		color = Color(color.hex).hex();

		if(onChange){
			onChange(color);
		}
	}

	return (
		<SketchPicker
			color={Color(color).hex()}
			disableAlpha={true}
			onChange={handleColorChange}
		/>
	)
}

const CustomColorPicker = (props) => {
	const {
		color,
		onChange,
	} = props;

	const handleColorChange = (color) => {
		try {
			color = Color(color.hex).hex();

			onChange(color);
		} catch (error) {
		}
	}

	const handleHueChange = (inColor) => {
		const oldColor = Color(color).hsv();

		const outColor = {
			h: Math.round(inColor.h),
			s: oldColor.color[1],
			v: oldColor.color[2],
		};

		devLog({inColor, oldColor: oldColor.color, outColor});

		const newColor = Color(outColor).hex();

		onChange(newColor);
	}

	const handleSaturationChange = (inColor) => {
		const oldColor = Color(color).hsv();

		const outColor = {
			h: oldColor.color[0],
			s: inColor.s * 100,
			v: oldColor.color[2],
		};

		devLog({ inColor, oldColor: oldColor.color, outColor });

		const newColor = Color(outColor).hex();

		onChange(newColor);
	}

	const handleLuminanceChange = (inColor) => {
		const oldColor = Color(color).hsv();

		const outColor = {
			h: oldColor.color[0],
			s: oldColor.color[1],
			v: inColor.s * 100,
		}

		devLog({ inColor, oldColor: oldColor.color, outColor });

		const newColor = Color(outColor).hex();

		onChange(newColor);
	}

	const overrideForSaturation = (props) => {
		const oldColor = Color(color).hsv();

		const newColor = Color({
			h: oldColor.color[0],
			s: oldColor.color[1],
			v: 100,
		});

		const newHsl = newColor.hsl();
		const newHsv = newColor.hsv();
		const newRgb = newColor.rgb();

		const newProps = {
			...props,
			color: newColor.hex(),
			hex: newColor.hex(),
			hsl: {
				a: 1,
				h: newHsl.color[0],
				s: newHsl.color[1] / 100,
				l: newHsl.color[2] / 100,
			},
			hsv: {
				a: 1,
				h: newHsv.color[0],
				s: newHsv.color[1] / 100,
				v: newHsv.color[2] / 100,
			},
			rgb: {
				a: 1,
				r: newRgb.color[0],
				s: newRgb.color[1],
				l: newRgb.color[2],
			}
		}

		return newProps;
	}

	const overrideForLuminance = (props) => {
		const oldColor = Color(color).hsv();

		const newColor = Color({
			h: oldColor.color[0],
			s: 100,
			v: oldColor.color[2],
		});

		const newHsl = newColor.hsl();
		const newHsv = newColor.hsv();
		const newRgb = newColor.rgb();

		const newProps = {
			...props,
			color: newColor.hex(),
			hex: newColor.hex(),
			hsl: {
				a: 1,
				h: newHsl.color[0],
				s: newHsl.color[2] / 100,
				l: newHsl.color[1] / 100,
			},
			hsv: {
				a: 1,
				h: newHsv.color[0],
				s: newHsv.color[2] / 100,
				v: newHsv.color[1] / 100,
			},
			rgb: {
				a: 1,
				r: newRgb.color[0],
				s: newRgb.color[1],
				l: newRgb.color[2],
			}
		}

		return newProps;
	}

	return (
		<div>
			<div className="hex-input">
				<EditableInput
					style={{
						input: {
							background: color,
							color: Color(color).isDark() ? 'white' : 'black',
						},
					}}
					label="hex"
					value={color}
					onChange={handleColorChange}
				/>
			</div>
			<div className="hue-slider">
				<Hue
					{...props}
					pointer={() => (<div className="slider-cursor"></div>)}
					onChange={handleHueChange}
				/>
			</div>

			<div className="saturation-slider">
				<Saturation
					{...overrideForSaturation(props)}
					pointer={() => (<div className="slider-cursor"></div>)}
					onChange={handleSaturationChange}
				/>
			</div>

			<div className="luminance-slider">
				<Saturation
					{...overrideForLuminance(props)}
					pointer={() => (<div className="slider-cursor"></div>)}
					onChange={handleLuminanceChange}
				/>
			</div>
		</div>
	)
}

const MyCustomColorPicker = CustomPicker(CustomColorPicker);

const ColorRanger = (props) => {
	const [colorsIn, setColorsIn,] = useState(
		_.map(
			['teal', 'purple', 'gold'], 
			color => Color(color).hex().toLowerCase()
		)
	);
	const [colorsOut, setColorsOut,] = useState(9);

	const generateColorRange = (start, end, steps) => {
		return _.chain(Array(steps))
			.map((datum, index) => {
				return Color(start).mix(Color(end), (index + 1) / steps).hex().toLowerCase();
			})
			.value()
	}

	const generateColorRanges = (colorsIn, colorsOut) => {
		const colorsMadePerSegment = colorsOut - 1;

		return _.chain(colorsIn)
			.reduce((colorRanges, color, colorIndex) => {
				if (colorIndex === 0) {
					colorRanges.push(Color(color).hex());
				} else {
					colorRanges = [
						...colorRanges,
						...(generateColorRange(
							// start color
							colorsIn[colorIndex - 1],
							// end color
							color,
							// steps
							colorsMadePerSegment
						)),
					];
				}
				return colorRanges;
			}, [])
			.value();
	}

	const generateColorsMade = (colorsIn, colorsOut) => {
		const colorsInLength = colorsIn.length;
		const segments = colorsInLength - 1;
		const colorsMadePerSegment = colorsOut - 1;
		const colorsMade = (segments * colorsMadePerSegment) + segments;

		return colorsMade;
	}

	const deriveColors = (colorsIn, colorsOut) => {
		const colorRanges = generateColorRanges(colorsIn, colorsOut);
		const colorsMade = generateColorsMade(colorsIn, colorsOut);
		const step = colorsMade / colorsOut;

		return colorRanges.filter((color, index) => index % step === 0);
	}

	const derivedColors = deriveColors(colorsIn, colorsOut);

	const handleColorDelete = (event, index) => {
		event.stopPropagation();

		const newColors = colorsIn.filter((c, i) =>
			i !== index
		);

		setColorsIn(newColors);
	}

	const handleColorChange = (color, index) => {
		let newColors = [...colorsIn];

		newColors[index] = color;

		setColorsIn(newColors)
	}

	return (
		<div style={{
			padding: '2rem',
			background: '#ccc',
			height: '100%',
			overflow: 'auto',
		}}>
			Number of gradient steps: &nbsp;
			<input
				min="2"
				style={{
					width: '3rem',
					textAlign: 'center',
				}}
				type="number"
				onChange={e => {
					const count = parseInt(e.target.value);
					if (!_.isNaN(count) && count >= 2){
						setColorsOut(count);
					}
				}}
				value={colorsOut}
			/>

			<br />
			<br />

			{colorsIn.map((color, index) => {
				return (
					<Popover
						key={`color-popover-${index}`}
						content={(
							<MyCustomColorPicker
								color={color}
								onChange={(color) => handleColorChange(color.hex, index)}
							/>
						)}
						trigger="click"
						placement="bottom"
					>
						<div 
							key={`color-block-${index}`}
							style={{
								display: 'inline-block',
								margin: '0 .25rem .5rem',
								padding: '.5rem',
								borderRadius: '.25rem',
								background: 'white',
							}}
						>
							<div style={{
								verticalAlign: 'middle',
								background: color,
								height: '1.5rem',
								width: '1.5rem',
								marginRight: '.25rem',
								display: 'inline-block'
							}}></div>
							<code style={{
								pointerEvents: 'none',
							}}>
								{color}
							</code>
							{colorsIn.length > 2 &&
								<Icon
									style={{
										color: 'red',
										marginLeft: '.5rem',
										cursor: 'pointer',
									}}
									type="delete"
									onClick={event => handleColorDelete(event, index)}
								/>
							}
						</div>
					</Popover>
				);
			})}

			<Icon 
				style={{
					background: 'grey',
					color: 'white',
					padding: '.25rem',
					borderRadius: '.25rem',
					marginLeft: '.5rem',
					cursor: 'pointer',
				}}
				type="plus"
				onClick={() => {
					let newColors = [...colorsIn];

					const newColor = Color({
						r: _.random(0, 255, false),
						g: _.random(0, 255, false),
						b: _.random(0, 255, false),
					});

					newColors.push(newColor.hex().toLowerCase());

					setColorsIn(newColors);
				}}
			/>

			<br />
			<br />

			<Row gutter="16">
				<Col span="8">
					<div>
						{derivedColors.map(color => (
							<div
								style={{
									height: '3rem',
									background: color,
									textAlign: 'center',
									color: Color(color).isDark() ? 'white' : 'black',
								}}
							><code style={{
								color: 'inherit', 
								lineHeight: '3rem',
							}}>{color}</code></div>
						))}
					</div>
				</Col>

				<Col span="8">
					<div>
						<h2>Colors Created</h2>
						{_.map(derivedColors, color => <div style={{
							fontFamily: 'monospace',
							marginLeft: '1rem',
						}}>{color}</div>)}
					</div>
				</Col>

				<Col span="8">
					<div>
						<h2>Configuration</h2>
						<pre>{JSON.stringify({
							steps: colorsOut,
							colorsIn: colorsIn,
						}, null, 4)}</pre>
					</div>
					{/* <button>Export</button>
					&nbsp;
					<button>Import</button> */}
				</Col>
			</Row>
		</div>
	)
};

export default ColorRanger;