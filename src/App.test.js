import { render, screen, waitFor } from '@testing-library/react';
import React from "react";
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

  expect(screen.getByText("Texredigerare i React.")).toBeInTheDocument();
});

it('user can type in register field', () => {
  const container = render(< App />);
  const input = screen.getByTestId('register-email');
  userEvent.type(input, "Test input");
  expect(input).toHaveValue("Test input");
});

it('render register form', () => {
  const { container } = render(<App />);

  expect(screen.getAllByText("användare")).toBeInTheDocument();
});