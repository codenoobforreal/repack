import { render, screen } from "@testing-library/react";
import App from "./App";

test("render App component", () => {
  render(<App />);

  expect(screen.getByTitle("react icon")).toBeInTheDocument();
});
