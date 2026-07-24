export const contactFieldLimits = {
  name: 80,
  email: 254,
  phone: 32,
  subject: 120,
  message: 2500,
};

const requiredFields = ["name", "email", "phone", "subject", "message"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()\d\s.-]{7,32}$/;

export function normalizeContactPayload(payload = {}) {
  return {
    name: String(payload.name ?? "").trim(),
    email: String(payload.email ?? "").trim().toLowerCase(),
    phone: String(payload.phone ?? "").trim(),
    subject: String(payload.subject ?? "").trim(),
    message: String(payload.message ?? "").trim(),
    company: String(payload.company ?? "").trim(),
  };
}

export function validateContactPayload(payload = {}) {
  const values = normalizeContactPayload(payload);
  const errors = {};

  for (const field of requiredFields) {
    if (!values[field]) {
      errors[field] = "This field is required.";
    }
  }

  for (const [field, limit] of Object.entries(contactFieldLimits)) {
    if (values[field] && values[field].length > limit) {
      errors[field] = `Please use ${limit} characters or fewer.`;
    }
  }

  if (values.email && !emailPattern.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (values.phone && !phonePattern.test(values.phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (values.message && values.message.length < 20) {
    errors.message = "Please include at least 20 characters.";
  }

  return {
    values,
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}
