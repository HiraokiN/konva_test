import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Stage, Layer, Rect, Transformer } from 'react-konva';
import { TransformableRectangle } from './components/transformableRectangle'
import { Button } from '@mui/material';
import useImage from 'use-image';
import handaMap from './handa.png'

function App() {

	// 地図を表示
	const [image] = useImage(handaMap);

	const deleteRectangleById = (array: any, id: string) => {
		let copyArray = [...array]
		let deleteTargets: number[] = [] as number[];
		copyArray.forEach((item, index) => {
			if (item["id"] == id) {
				deleteTargets.push(index)
			}
		})
		deleteTargets.forEach((item, index) => {
			delete copyArray[item]
		})
		return copyArray
	}

	const newRectangleTemplate = {
		x: 0,
		y: 0,
		width: 100,
		height: 100,
		fillEnabled: true,
		id: "undefined",
		stroke: 'black',
		strokeWidth: 3,
		fill: "red",
		opacity: 0.5,
	}
	const initialRectangles = [
		{
			x: 10,
			y: 10,
			width: 100,
			height: 100,
			fillEnabled: true,
			id: 'rect1',
			stroke: 'black',
			strokeWidth: 3,
			fill: "#FF0000",
			opacity: 0.5,
		},
		{
			x: 150,
			y: 150,
			width: 100,
			height: 100,
			fillEnabled: true,
			id: 'rect2',
			stroke: "black",
			strokeWidth: 3,
			fill: "#FF0000",
			opacity: 0.5,
		},
	];
	const [rectangles, setRectangles] = React.useState(initialRectangles);
	const [selectedId, selectShape] = React.useState(null);
	const [counter, setCounter] = React.useState(3);

	const checkDeselect = (e: any) => {
		// deselect when clicked on empty area
		const clickedOnEmpty = e.target === e.target.getStage();
		if (clickedOnEmpty) {
			selectShape(null);
		}
	};
	return (
		<>
			<Button variant="outlined" onClick={() => {
				let newRectangle = { ...newRectangleTemplate };
				newRectangle["id"] = "rect" + counter.toString()
				const rects = rectangles.slice();
				rects.push(newRectangle);
				setRectangles(rects);
				setCounter(counter + 1)
				console.log(rectangles)
			}}>New</Button>
			<Button variant="outlined" onClick={() => {
				if (selectedId != null) {
					const rects = rectangles.slice();
					let newRects = deleteRectangleById(rects, selectedId)
					setRectangles(newRects)
				}
			}}>Delete</Button>
			{selectedId}
			<Stage
				width={window.innerWidth}
				height={window.innerHeight}
				onMouseDown={checkDeselect}
				onTouchStart={checkDeselect}
			>
				<Layer>
					<Rect width={800} height={600} fillPatternImage={image}/>
				</Layer>
				<Layer>
					{rectangles.map((rect: any, i: any) => {
						return (
							<TransformableRectangle
								key={i}
								shapeProps={rect}
								isSelected={rect.id === selectedId}
								onSelect={() => {
									selectShape(rect.id);
								}}
								onChange={(newAttrs: any) => {
									const rects = rectangles.slice();
									rects[i] = newAttrs;
									setRectangles(rects);
								}}
							/>
						);
					})}
				</Layer>
			</Stage>
		</>
	);
}

export default App;
