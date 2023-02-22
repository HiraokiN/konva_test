// 元ネタ https://codesandbox.io/s/github/konvajs/site/tree/master/react-demos/transformer
import React from "react";
import { createRoot } from "react-dom/client"
import { Stage, Layer, Rect, Transformer } from "react-konva";


export const TransformableRectangle = ({ shapeProps, isSelected, onSelect, onChange }: any) => {

	const shapeRef: any = React.useRef();
	const trRef: any = React.useRef();

	React.useEffect(() => {
		if (isSelected) {
			// we need to attach transformer manually
			trRef.current.nodes([shapeRef.current]);
			trRef.current.getLayer().batchDraw();
		}
	}, [isSelected])
	return (
		<React.Fragment>
			<Rect
				onClick={onSelect}
				onTap={onSelect}
				ref={shapeRef}
				{...shapeProps}
				draggable
				onDragEnd={(e: any) => {
					onChange({
						...shapeProps,
						x: e.target.x(),
						y: e.target.y(),
					});
				}}
				onTransformEnd={(e) => {
					// transformer is changing scale of the node
					// and NOT its width or height
					// but in the store we have only width and height
					// to match the data better we will reset scale on transform end
					const node = shapeRef.current;
					const scaleX = node.scaleX();
					const scaleY = node.scaleY();

					// we will reset it back
					node.scaleX(1);
					node.scaleY(1);
					onChange({
						...shapeProps,
						x: node.x(),
						y: node.y(),
						// set minimal value
						width: Math.max(5, node.width() * scaleX),
						height: Math.max(node.height() * scaleY),
					});
				}}
			/>
			{isSelected && (
				<Transformer
					ref={trRef}
					rotateEnabled={false}
					boundBoxFunc={(oldBox, newBox) => {
						// limit resize
						if (newBox.width < 5 || newBox.height < 5) {
							return oldBox;
						}
						return newBox;
					}}
				/>
			)}
		</React.Fragment>
	)
}