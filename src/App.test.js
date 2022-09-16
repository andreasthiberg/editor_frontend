import { render, screen } from '@testing-library/react';
import App from '../src/App';
import userEvent from '@testing-library/user-event'

it('renders header', () => {
  const { container } = render(<App />);

  expect(screen.getByText("Custom editor in React.")).toBeInTheDocument();
});

it('user writes in name field', () => {
  const container = render(< App />);
  const input = screen.getByTestId('name-input');
  userEvent.type(input, "Test input");
  expect(input).toHaveValue("Test input");
});

it('user creates new document', () => {
  const container = render(< App />);
  const input = screen.getByTestId('name-input');
  const newDocumentButton = screen.getByTestId('new-document');
  userEvent.type(input, "New document");
  userEvent.click(newDocumentButton);
});
