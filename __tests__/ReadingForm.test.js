import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReadingForm from '../components/ReadingForm';
import api, { todayIST } from '../lib/api';

jest.mock('../lib/api', () => {
  const actual = jest.requireActual('../lib/api');
  return { __esModule: true, ...actual, default: { post: jest.fn(), put: jest.fn() } };
});

const today = todayIST();
const setup = (props = {}) => {
  const onSaved = jest.fn();
  render(<ReadingForm date={today} onSaved={onSaved} {...props} />);
  return { onSaved, user: userEvent.setup() };
};

beforeEach(() => jest.clearAllMocks());

test('requires a value', async () => {
  const { user } = setup();
  await user.click(screen.getByRole('button', { name: /add reading/i }));
  expect(screen.getByRole('alert')).toHaveTextContent('Please enter a glucose value.');
  expect(api.post).not.toHaveBeenCalled();
});

test.each(['39', '601', '12.5'])('rejects out-of-range value %s', async (value) => {
  const { user } = setup();
  await user.type(screen.getByLabelText(/value/i), value);
  await user.click(screen.getByRole('button', { name: /add reading/i }));
  expect(screen.getByRole('alert')).toHaveTextContent('Value must be between 40 and 600 mg/dl.');
});

test('rejects a future date', async () => {
  const { user } = setup();
  fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2999-01-01' } });
  await user.type(screen.getByLabelText(/value/i), '110');
  await user.click(screen.getByRole('button', { name: /add reading/i }));
  expect(screen.getByRole('alert')).toHaveTextContent('Date cannot be in the future.');
  expect(api.post).not.toHaveBeenCalled();
});

test('submits a valid reading', async () => {
  api.post.mockResolvedValue({ data: {} });
  const { user, onSaved } = setup();
  await user.type(screen.getByLabelText(/value/i), '110');
  await user.click(screen.getByRole('button', { name: /add reading/i }));
  expect(api.post).toHaveBeenCalledWith('/readings', { date: today, slot: 'morning', value: 110 });
  expect(onSaved).toHaveBeenCalledWith(today);
});

test('shows the server error message, e.g. a duplicate slot', async () => {
  api.post.mockRejectedValue({ response: { data: { message: 'You already have an After lunch reading for this date.' } } });
  const { user } = setup();
  await user.type(screen.getByLabelText(/value/i), '120');
  await user.click(screen.getByRole('button', { name: /add reading/i }));
  expect(await screen.findByRole('alert')).toHaveTextContent('You already have an After lunch reading');
});

test('pre-selects the first free slot', () => {
  setup({ takenSlots: ['morning', 'after_breakfast'] });
  expect(screen.getByLabelText(/time slot/i)).toHaveValue('after_lunch');
});