import { render, screen } from "@testing-library/react";
import React from 'react';
import { CoursePlanner } from "./CoursePlanner";

// Written by Nish Patel
test("renders course planner field value", () => {
    render(<CoursePlanner />);
    const schoolYear = screen.getByText('year');
    const schoolTerm = screen.getByText('term');

    expect(schoolYear).toBeInTheDocument();
    expect(schoolTerm).toBeInTheDocument();
});