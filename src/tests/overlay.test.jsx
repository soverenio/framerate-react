import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Overlay from '../lib/overlay';

describe('Overlay', () => {
	it('should render a button to start and stop measurements', () => {
		const { getByText } = render(<Overlay />);
		expect(getByText('Start')).toBeInTheDocument();
		fireEvent.click(getByText('Start'));
		expect(getByText('Stop')).toBeInTheDocument();

		// Cleanup; otherwise other tests fail
		fireEvent.click(getByText('Stop'));
	});

	it('should show measurement results after stopping', () => {
		const { getByText } = render(<Overlay />);
		fireEvent.click(getByText('Start'));
		fireEvent.click(getByText('Stop'));
		expect(getByText('Longest frame')).toBeInTheDocument();
	});

	it('should show "show more..." link and hide details initially', () => {
		const { queryByText, getByText } = render(<Overlay />);
		fireEvent.click(getByText('Start'));
		fireEvent.click(getByText('Stop'));
		expect(queryByText('Last frame')).not.toBeInTheDocument();
		expect(getByText('show more...')).toBeInTheDocument();
	});

	it('should show more details when "show more..." is clicked', () => {
		const { queryByText, getByText } = render(<Overlay />);
		fireEvent.click(getByText('Start'));
		fireEvent.click(getByText('Stop'));
		fireEvent.click(getByText('show more...'));
		expect(queryByText('Last frame')).toBeInTheDocument();
		expect(getByText('show less...')).toBeInTheDocument();
	});

	it('should show non-zero results after some time', async () => {
		const { getByRole, getByText } = render(<Overlay />);
		fireEvent.click(getByText('Start'));

		let times = 0;
		await waitFor(() => (times++ ? Promise.resolve() : Promise.reject()), { interval: 500 });

		fireEvent.click(getByText('Stop'));
		expect(getByRole('row', { name: /Longest frame/ })).not.toHaveTextContent('0.000 ms');
	});
});
