import { render, screen } from "@testing-library/react";
import React from 'react';
import { Login } from "./Login";

// Written by Pranav Agnihotri
test("renders Login page with placeholder text", () => {
    render(<Login />);
    const emptyEmail = screen.getByTestId('email-field');
    const emptyPassword = screen.getByTestId('password-field');
    const loginButton = screen.getByText('Login');

    expect(emptyEmail).toBeInTheDocument();
    expect(emptyEmail).toHaveTextContent("Email *")
    expect(emptyPassword ).toBeInTheDocument();
    expect(emptyPassword).toHaveTextContent("Password *")
    expect(loginButton).toBeInTheDocument();
  });