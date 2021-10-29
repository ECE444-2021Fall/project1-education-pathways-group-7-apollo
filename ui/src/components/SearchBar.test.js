import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "./SearchBar";

test("renders search bar emtpy", () => {
  const mockFetchCallback = jest.fn();
  render(<SearchBar fetchCourses={mockFetchCallback} />);
  const emptySearch = screen.getByLabelText("Search input");
  const goButton = screen.getByText('Go!');
  expect(emptySearch).toBeInTheDocument();
  expect(goButton).toBeInTheDocument();
});

test("clicking go button calls fetch callback", () => {
    const mockFetchCallback = jest.fn();
    render(<SearchBar fetchCourses={mockFetchCallback} />);
    userEvent.click(screen.getByText('Go!'));
    expect(mockFetchCallback).toBeCalledTimes(1);
});

test("filling search bar keeps the value", () => {
    const mockFetchCallback = jest.fn();
    render(<SearchBar fetchCourses={mockFetchCallback} />);
    const search = screen.getByTestId('course-search-bar');
    userEvent.type(search, 'ECE444');
    const typedVal = screen.getByText('ECE444')
    expect(typedVal).toBeInTheDocument();
});