import { start, stop, Measurement } from '../core';
import { CSSProperties, useMemo, useState } from 'react';
import DragDrop, { Pan } from './dragdrop';
import MeasurementTable from './MeasurementTable';

const controlBarStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between' };
const buttonStyle: CSSProperties = {
	marginTop: 12,
	marginBottom: 12,
	width: 120,
};

type Props = {
	style?: CSSProperties;
	className?: string;
};

function Overlay(props: Props) {
	// Functional state
	const [isRunning, setRunning] = useState(false);
	const [measurements, setMeasurements] = useState<Measurement | null>(null);
	// Presentational state
	const [opacity, setOpacity] = useState('0.8');
	const [pan, setPan] = useState<Pan>({ x: 0, y: 0 });
	const [showMore, setShowMore] = useState(false);

	function onStart() {
		setMeasurements(null);
		setRunning(true);
		start();
	}

	function onStop() {
		setRunning(false);
		const result = stop();
		setMeasurements(result);
	}

	const wrapperStyle = useMemo(() => {
		const result: CSSProperties = {
			position: 'fixed',
			transform: `translate(${pan.x}px, ${pan.y}px)`,
			border: '1px solid gray',
			borderRadius: 4,
			padding: 8,
			backgroundColor: `rgba(224, 224, 224, ${opacity})`,
			fontFamily: 'sans-serif',
			zIndex: 1000,
			...props.style,
		};

		return result;
	}, [props.style, opacity, pan]);

	return (
		<div className={props.className} style={wrapperStyle} draggable="false">
			<div style={controlBarStyle}>
				<label>
					Opacity
					<input
						type="range"
						min="0"
						max="1"
						step="0.1"
						value={opacity}
						onChange={(e) => setOpacity(e.target.value)}
					/>
				</label>

				<DragDrop setPan={setPan} />
			</div>

			<hr />

			<button style={buttonStyle} onClick={isRunning ? onStop : onStart}>
				{isRunning ? 'Stop' : measurements === null ? 'Start' : 'Restart'}
			</button>

			{measurements === null ? (
				<p>
					Press {isRunning ? "'Stop' to see results." : "'Start' button to start measurements."}
				</p>
			) : (
				<>
					<MeasurementTable measurements={measurements} showMore={showMore} />
					<a
						href="#"
						onClick={(e) => {
							e.preventDefault();
							setShowMore(!showMore);
						}}
					>
						show {showMore ? 'less' : 'more'}...
					</a>
				</>
			)}
		</div>
	);
}

export default Overlay;
