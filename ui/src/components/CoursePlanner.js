import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import { StateZero } from "./CoursePlannerStateZero";
import { StateOne } from "./CoursePlannerStateOne";
import { StateTwo } from "./CoursePlannerStateTwo";

export function CoursePlanner() {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step !== 2) setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (step !== 0) setStep((prev) => prev - 1);
  };

  return (
    <div>
      <Box>
        <h1>Course Planner</h1>
        {step === 0 ? <StateZero next={nextStep} /> : null}
        {step === 1 ? <StateOne next={nextStep} prev={prevStep} /> : null}
        {step === 2 ? <StateTwo prev={prevStep} /> : null}
      </Box>
    </div>
  );
}
