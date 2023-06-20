import { Measurement } from '../core';
import { CSSProperties } from 'react';

const tableStyle: CSSProperties = {
	borderCollapse: 'collapse',
};
const leftCellStyle: CSSProperties = {
	textAlign: 'left',
	border: '1px solid gray',
	padding: 4,
};
const rightCellStyle: CSSProperties = {
	textAlign: 'right',
	border: '1px solid gray',
	padding: 4,
};

type Props = {
	measurements: Measurement | null;
	showMore: boolean;
};

function MeasurementTable(props: Props) {
	const { measurements, showMore } = props;

	if (measurements === null)
		return <p>Press 'Start' button to start measurements, then 'Stop' to see results</p>;

	return (
		<table style={tableStyle}>
			<tbody>
				{showMore && (
					<tr>
						<td style={leftCellStyle}>Last frame</td>
						<td style={rightCellStyle}>{measurements.lastFrame.toFixed(3)} ms</td>
					</tr>
				)}

				{showMore && (
					<tr>
						<td style={leftCellStyle}>Shortest frame</td>
						<td style={rightCellStyle}>{measurements.shortestFrame.toFixed(3)} ms</td>
					</tr>
				)}

				<tr>
					<td style={leftCellStyle}>Longest frame</td>
					<td style={rightCellStyle}>{measurements.longestFrame.toFixed(3)} ms</td>
				</tr>

				{showMore && (
					<tr>
						<td style={leftCellStyle}>All frames count</td>
						<td style={rightCellStyle}>{measurements.allFramesCount}</td>
					</tr>
				)}

				<tr>
					<td style={leftCellStyle}>All frames sum</td>
					<td style={rightCellStyle}>{measurements.allFramesSum.toFixed(3)} ms</td>
				</tr>

				<tr>
					<td style={leftCellStyle}>Long frames count</td>
					<td style={rightCellStyle}>{measurements.longFramesCount}</td>
				</tr>

				<tr>
					<td style={leftCellStyle}>Long frames sum</td>
					<td style={rightCellStyle}>{measurements.longFramesSum.toFixed(3)} ms</td>
				</tr>

				{showMore && (
					<tr>
						<td style={leftCellStyle}>Start timestamp</td>
						<td style={rightCellStyle}>
							{new Date(measurements.startTimestamp || 0).toLocaleTimeString()}
						</td>
					</tr>
				)}

				{showMore && (
					<tr>
						<td style={leftCellStyle}>Stop timestamp</td>
						<td style={rightCellStyle}>
							{new Date(measurements.stopTimestamp || 0).toLocaleTimeString()}
						</td>
					</tr>
				)}
			</tbody>
		</table>
	);
}

export default MeasurementTable;
