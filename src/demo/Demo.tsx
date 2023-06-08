import { useMemo, useState } from 'react';
import './Demo.css';
import Overlay from '../lib/overlay';

function cpuHeavyFunction(quadratic: number) {
	const count = 1_000_000 * quadratic * quadratic;
	const x = Math.random() * 100;

	let result = 0;

	for (let i = 0; i < count; i++) {
		result = result + Math.atan(x) * Math.tan(x);
	}

	return result;
}

function Demo() {
	const [count, setCount] = useState(0);

	const result = useMemo(() => cpuHeavyFunction(count), [count]);

	return (
		<>
			<h1>Framerate React demo page</h1>
			<div className="card">
				<button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
				<p>
					CPU-heavy function over <kbd>count</kbd> returns: {result}
				</p>
			</div>

			<Overlay />
		</>
	);
}

export default Demo;
