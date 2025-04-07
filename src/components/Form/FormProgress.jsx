import FormStep from "./FormStep";

export default function FormProgress({ activeStep }) {
  return (
    <div className="relative h-[300px] w-[200px] text-right">
      <FormStep
        className="absolute top-0 w-full pr-7"
        step="1"
        line
        active={activeStep >= 1}
      >
        Event Information
      </FormStep>
      <FormStep
        className="absolute top-1/2 -translate-y-1/2 w-full pr-7"
        step="2"
        line
        active={activeStep >= 2}
      >
        Venue Selection
      </FormStep>
      <FormStep
        className="absolute bottom-0 w-full pr-7"
        step="3"
        active={activeStep === 3}
      >
        Host Information
      </FormStep>
    </div>
  );
}
