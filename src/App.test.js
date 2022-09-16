import { render, screen, waitFor } from '@testing-library/react';
import App from '../src/App';
import userEvent from '@testing-library/user-event'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
const url = "https://jsramverk-editor-anth21.azurewebsites.net";

// declare which API requests to mock
const server = setupServer(
rest.post(url+"/create", (req, res, ctx) => {
  return res(
    ctx.json([{name: "Nytt testdokument", content: "Exempelcontent"}]))
})
)

  
beforeAll(() => server.listen())
afterAll(() => server.close())


it('render header', () => {
  const { container } = render(<App />);

  expect(screen.getByText("Custom editor in React.")).toBeInTheDocument();
});

it('user writes in name field', () => {
  const container = render(< App />);
  const input = screen.getByTestId('name-input');
  userEvent.type(input, "Test input");
  expect(input).toHaveValue("Test input");
});

it('user creates new document and title changes', async () => {
  const container = render(< App />);
  const input = screen.getByTestId('name-input');
  const newDocumentButton = screen.getByTestId('new-document');
  userEvent.type(input, "Nytt testdokument");
  userEvent.click(newDocumentButton);
  await waitFor(() => screen.findByText('Nuvarande dokument: Nytt testdokument')) 
  expect(screen.findByText('Nuvarande dokument: Nytt testdokument').toBeInTheDocument)
});