//
// Simple usage:
//
//  start(50);
//  ... some activity ...
//  const results = stop();
//
//
//
// Usage with callback called on each animation frame:
//
//  start(50, (results) => { console.log(results.lastFrame) });
//  ... some activity ...
//  stop();
//
//
//
// With getLatestData(), you can periodically poll measurements, to reduce overhead of
// using callback. Just in case you need measurements some time later, after stop(), they
// will still be available (until next call to start()):
//
//  start(50);
//  window.setInterval(() => console.log(getLatestData()), 300);
//	... some activity ...
//  stop();
//
//
//
// Using callback function and lastFrameTimestamp/lastFrame fields, you can
// collect plot data to draw pretty charts. Beware of implicit overheads though!
//

type Measurement = {
	// These numbers are calculated regardless of threshold
	lastFrameTimestamp: number; // DOMHighResTimeStamp
	lastFrame: number;
	shortestFrame: number;
	longestFrame: number;
	allFramesCount: number;
	allFramesSum: number;

	// These numbers respect long frame threshold
	lastLongFrame: number;
	longFramesCount: number;
	longFramesSum: number;

	// Time of start() and stop(), respectively. Unlike lastFrameTimestamp, these are
	// your good old number of ms since the beginning of January 1, 1970, UTC.
	startTimestamp: number | null;
	stopTimestamp: number | null;
};

type Callback = (measurement: Measurement) => void;

const DEFAULT_DELTA = 50;

let requestId = 0; // Used to cancel window.requestAnimationFrame
let callbackFn: Callback | null = null;

// Measurements. Not inside object - to remove overhead of property access (for simplest use-case).
let lastFrameTimestamp = 0;
let lastFrame = 0;
let shortestFrame = 0;
let longestFrame = 0;
let allFramesCount = 0;
let allFramesSum = 0;

let lastLongFrame = 0;
let longFramesCount = 0;
let longFramesSum = 0;

let startTimestamp: number | null = null;
let stopTimestamp: number | null = null;

function getLatestData(): Measurement {
	return {
		lastFrameTimestamp,
		lastFrame,
		shortestFrame,
		longestFrame,
		allFramesCount,
		allFramesSum,

		lastLongFrame,
		longFramesCount,
		longFramesSum,

		startTimestamp,
		stopTimestamp,
	};
}

function start(longFrameThreshold?: number, callback?: Callback) {
	if (requestId !== 0) throw new Error("Can't start: measurement already in progress");

	callbackFn = callback || null;

	// Clear all measurement data and set start time.
	lastFrameTimestamp = 0;
	lastFrame = 0;
	shortestFrame = 0;
	longestFrame = 0;
	allFramesCount = 0;
	allFramesSum = 0;

	lastLongFrame = 0;
	longFramesCount = 0;
	longFramesSum = 0;

	startTimestamp = new Date().getTime();
	stopTimestamp = null;

	// Set internally used values
	let previousTimestamp = 0;
	const watchedDelta = longFrameThreshold === undefined ? DEFAULT_DELTA : longFrameThreshold;

	function onAnimationFrame(timestamp: number) {
		if (previousTimestamp === 0) {
			previousTimestamp = timestamp;
			requestId = window.requestAnimationFrame(onAnimationFrame);
			return;
		}

		const delta = timestamp - previousTimestamp;

		lastFrameTimestamp = timestamp;
		lastFrame = delta;
		shortestFrame = shortestFrame === 0 ? delta : Math.min(shortestFrame, delta);
		longestFrame = Math.max(longestFrame, delta);
		allFramesCount += 1;
		allFramesSum += delta;

		if (delta >= watchedDelta) {
			lastLongFrame = delta;
			longFramesCount += 1;
			longFramesSum += delta;
		}

		previousTimestamp = timestamp;

		if (callbackFn) {
			callbackFn(getLatestData());
		}

		requestId = window.requestAnimationFrame(onAnimationFrame);
	}

	requestId = window.requestAnimationFrame(onAnimationFrame);
}

function stop(): Measurement {
	window.cancelAnimationFrame(requestId);
	requestId = 0;

	stopTimestamp = new Date().getTime();
	const latestData = getLatestData();

	if (callbackFn) {
		callbackFn(latestData);
	}

	return latestData;
}

export { start, stop, getLatestData };
export type { Measurement };
