import { CSSProperties, useEffect, useState } from 'react';

const dragDropStyle: CSSProperties = {
	cursor: 'move',
	userSelect: 'none',
};

type Pan = {
	x: number;
	y: number;
};

type Props = {
	setPan: (setterFn: (pan: Pan) => Pan) => void;
};

function DragDrop(props: Props) {
	const [isMouseDown, setMouseDown] = useState<unknown | false>(false);

	useEffect(
		function () {
			if (isMouseDown === false) return;

			function onMouseMove(event: MouseEvent) {
				props.setPan(function (pan) {
					return { x: pan.x + event.movementX, y: pan.y + event.movementY };
				});
			}

			function onMouseUp() {
				setMouseDown(false);
			}

			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('mouseup', onMouseUp);

			return function () {
				document.removeEventListener('mousemove', onMouseMove);
				document.removeEventListener('mouseup', onMouseUp);
			};
		},
		[isMouseDown, props.setPan]
	);

	return (
		<span style={dragDropStyle} draggable="false" onMouseDown={setMouseDown}>
			⮃
		</span>
	);
}

export default DragDrop;
export type { Pan };
