import { fireEvent, render, screen } from '@testing-library/react';
import Upload from '../views/Upload';

test('renders correct content for the headline', () => {
    render(<Upload />);

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Uploading...')).toBeDefined();
});

test('renders h2', () => {
    render(<Upload />);

    expect(screen.getByRole('heading', { level: 2 })).toBeDefined();
});
