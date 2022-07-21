import { render, screen, fireEvent } from 'test-utils';
import Sidebar from '@app/components/Sidebar';
import { hotels } from '@app/__mocks__/hotels';

const preloadedState = {
	hotel: {
		hotels,
		loading: false,
		error: false,
	},
}

describe('<Sidebar />', () => {
	it('should render search keyword and price range inputs', () => {
		render(<Sidebar hotels={hotels} />);

		const keywordInput = screen.getByTestId('keyword-input') as HTMLInputElement;
		const rangeInput = screen.getByLabelText('Filter price') as HTMLInputElement;

		expect(keywordInput).toBeInTheDocument();
		expect(keywordInput.type).toBe('text');
		expect(keywordInput.placeholder).toBe('Hotel name or city...');
		expect(rangeInput).toBeInTheDocument();
		expect(rangeInput.type).toBe('range');
		expect(rangeInput.id).toBe('price');
	});

	it('should set initial min and max prices correctly', () => {

		const { store } = render(<Sidebar hotels={hotels} />, { preloadedState });
		const { search: { minPrice, maxPrice } } = store.getState();

		expect(minPrice).toBe(200);
		expect(maxPrice).toBe(300);
		expect(screen.getByTestId('range-min-price').innerHTML).toBe("200");
		expect(screen.getByTestId('range-max-price').innerHTML).toBe("300");
		expect(screen.getByTestId('max-price').innerHTML).toBe("300");
	});

	it('should handle keyword input correctly', () => {
		const { store } = render(<Sidebar hotels={hotels} />);

		const keywordInput = screen.getByTestId('keyword-input') as HTMLInputElement;
		expect(keywordInput.value).toBe('');
		fireEvent.change(keywordInput, { target: { value: 'Downtown' } });

		const { search: { keyword } } = store.getState();
		expect(keyword).toBe('Downtown');
		expect(keywordInput.value).toBe('Downtown');
	});

	it('should handle range input correctly', () => {
		const { store } = render(<Sidebar hotels={hotels} />, { preloadedState });

		const rangeInput = screen.getByLabelText('Filter price') as HTMLInputElement;
		expect(rangeInput.value).toBe('300'); // Max value by default from hotels list above

		fireEvent.change(rangeInput, { target: { value: 250 } });

		const { search: { maxPrice } } = store.getState();
		expect(maxPrice).toBe(250);
		expect(screen.getByTestId('max-price').innerHTML).toBe('250');
	});
});
