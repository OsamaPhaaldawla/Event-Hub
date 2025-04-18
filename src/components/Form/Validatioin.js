export function validateStep1(formData) {
  const step1Data = {
    title: formData.title,
    subtitle: formData.subtitle ? formData.subtitle : null,
    type: formData.type,
    accessType: formData.accessType,
    seats: formData.seats,
    price: formData.price,
    image: formData.image ?? null,
    description: formData.description,
  };
  formData = step1Data;
  const errors = {};

  if (!formData.title) {
    errors.title = "Title is required.";
  } else if (formData.title.length > 30) {
    errors.title = "Title is too long, max 30 characters.";
  }

  if (formData.subtitle && formData.subtitle.length > 80) {
    errors.subtitle = "Subtitle must be less than 80 characters.";
  }

  if (!formData.type) {
    errors.type = "Event type is required.";
  }

  if (!formData.accessType) {
    errors.accessType = "Access type is required.";
  }

  if (
    (formData.accessType === "free-limited" ||
      formData.accessType === "paid") &&
    !formData.seats
  ) {
    errors.seats = "Seats number is required.";
  }

  if (formData.image !== null && formData.image.name === "") {
    errors.image = "Image is required";
  }

  if (formData.accessType === "paid" && !formData.price) {
    errors.price = "Ticket price is required.";
  } else if (formData.price < 5) {
    errors.price = "Ticket price start from 5";
  }

  if (!formData.description) {
    errors.description = "Description is required.";
  } else if (formData.description.length > 300) {
    errors.description = "Description must be at most 300 characters.";
  }

  const validationErrors = Object.keys(errors).length === 0 ? null : errors;
  return { validationErrors, step1Data };
}

//? Validate step 2 *******************
export function validateStep2(formData, selectedVenue) {
  const errors = {};
  const step2Data = {
    venueName: selectedVenue.name,
    location: selectedVenue.location,
    url: selectedVenue.url,
    date: formData.date,
    time: formData.time,
  };
  formData = step2Data;

  if (!formData.venueName) {
    errors.vanueName = "Please Select a Venue from the list.";
  }

  if (!formData.date) {
    errors.date = "Event date is required.";
  }

  if (!formData.time) {
    errors.time = "Event time is required.";
  }

  const validationErrors = Object.keys(errors).length === 0 ? null : errors;

  return { validationErrors, step2Data };
}

//? Step 3 Validation ****************
export function validateStep3(formData) {
  const errors = {};
  const step3Data = {
    hosterName: formData.hosterName,
    hosterEmail: formData.hosterEmail,
    hosterPassword: formData.hosterPassword,
    hosterDescription: formData.hosterDescription ?? null,
  };
  formData = step3Data;

  if (!formData.hosterName) {
    errors.vanueName = "Enter a Name";
  }

  if (!formData.hosterEmail) {
    errors.date = "Enter your Email";
  }

  if (!formData.hosterPassword) {
    errors.time = "For security, enter a password.";
  }

  const validationErrors = Object.keys(errors).length === 0 ? null : errors;

  return { validationErrors, step3Data };
}
