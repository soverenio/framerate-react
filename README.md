# framerate-react
Measure framerate metrics in your React app (or generic Javascript app)

## Installation

```bash
npm install framerate-react
```

## Usage

### Using convenience component within your React application

```javascript
import Overlay from 'framerate-react';

function App() {
    return (
        <>
            <Main />

            <Overlay />
        </>
    )
}
```

### Directly calling core API

Measurement data returned by API looks like this:

```javascript
{
    "lastFrameTimestamp": 8937.49, // DOMHighResTimeStamp
    "lastFrame": 16.666,
    "shortestFrame": 16.666,
    "longestFrame": 183.326,
    "allFramesCount": 180,
    "allFramesSum": 3483.194,

    // These numbers respect long frame threshold set by start() function, by default 50ms
    "lastLongFrame": 183.326,
    "longFramesCount": 4,
    "longFramesSum": 516.646,

    // Time of start() and stop(), respectively. Unlike lastFrameTimestamp, these are
    // your good old number of ms since the beginning of January 1, 1970, UTC.
    "startTimestamp": 1686222481723,
    "stopTimestamp": 1686222485217
}
```

To obtain measurements, the simple way:

```javascript
import { start, stop } from 'framerate-react/core';

start(50); // Consider frames >50ms as long frames.

//... some activity ...
const results = stop();
```

You can add callback to be called on each animation frame:

```javascript
import { start, stop } from 'framerate-react/core';

start(50, (results) => console.log(results.lastFrame));

// ... some activity ...
const results = stop();
```

With `getLatestData()`, you can periodically poll measurements, to reduce overhead of using callback. Just in case you need measurements some time later, after `stop()`, they will still be available (until next call to `start()`):

```javascript
import { start, stop, getLatestData } from 'framerate-react/core';

start(50);
window.setInterval(() => console.log(getLatestData()), 300);

// ... some activity ...
stop();
```

Using callback function and lastFrameTimestamp/lastFrame fields, you can collect plot data to draw pretty charts. Beware of implicit overheads though!

## API

* `<Overlay />` - renders a UI overlay with controls to take measurements. Accepts `style` and `className` props.
* `start(longFramesThreshold?: number, onFrameCallback?: Function): void` - starts collecting frames data.
* `stop(): Measurement` - stops collecting and returns data.
* `getLatestData(): Measurement` - returns data collected so far (without stopping).

## License

MIT