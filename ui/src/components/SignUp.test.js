import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignUp } from "./SignUp";

// Written by Omar ElZaria
test("renders Sign Up page empy", () => {
    const mockFetchCallback = jest.fn();
    render(<SignUp />);
    const emptyFirstName = screen.getByLabelText("First Name");
    const emptyLastName = screen.getByLabelText("Last Name");
    const emptyEmail = screen.getByLabelText("Email");
    const emptyPassword = screen.getByLabelText("Password");
    const emptyConfirmPassword = screen.getByLabelText("Confirm Password");
    const emptyMajor = screen.getByLabelText("Major");
    const emptyCoursesTaken = screen.getByLabelText("Select Previously Taken Courses")
    const SignUpButton = screen.getByText('Sign Up');
    expect(emptyFirstName).toBeInTheDocument();
    expect(emptyLastName).toBeInTheDocument();
    expect(emptyEmail).toBeInTheDocument();
    expect(emptyPassword ).toBeInTheDocument();
    expect(emptyConfirmPassword).toBeInTheDocument();
    expect(emptyMajor).toBeInTheDocument();
    expect(emptyCoursesTaken).toBeInTheDocument();
    expect(SignUpButton).toBeInTheDocument();
  });

// Written by Omar ElZaria
test("filling sign up fields keeps the value", () => {
    render(<SignUp />);
    const firstName = screen.getByTestId('first-name-input');
    userEvent.type(firstName, 'Omar');
    const lastName = screen.getByTestId('last-name-input');
    userEvent.type(lastName, 'Test');
    const email = screen.getByTestId('email-input');
    userEvent.type(email, 'omar.elzaria@mail.utoronto.ca');
    const password = screen.getByTestId('password-input');
    userEvent.type(password, 'test1234');
    const confirmPassword = screen.getByTestId('confirm-password-input');
    userEvent.type(confirmPassword, 'test1234');
    const major = screen.getByTestId('majorinput');
    userEvent.type(major, 'Computer Engineering');
});