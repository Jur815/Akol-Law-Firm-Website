export const contactFieldLimits = {
  name: 80,
  email: 254,
  phone: 32,
  subject: 120,
  message: 2500,
};

const requiredFields = ["name", "email", "phone", "subject", "message"];
const allowedFields = new Set([...requiredFields, "company"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()\d\s.-]{7,32}$/;

function normalizeContactPayload(payload) {
  return {
    name: payload.name?.trim() ?? "",
    email: payload.email?.trim().toLowerCase() ?? "",
    phone: payload.phone?.trim() ?? "",
    subject: payload.subject?.trim() ?? "",
    message: payload.message?.trim() ?? "",
    company: payload.company?.trim() ?? "",
  };
}

export function validateContactPayload(payload = {}) {
  if (
    !payload ||
    typeof payload !== "object" ||
    Array.isArray(payload) ||
    Object.entries(payload).some(([field, value]) => !allowedFields.has(field) || typeof value !== "string")
  ) {
    return { values: null, errors: {}, isValid: false };
  }

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

  if (values.phone && (!phonePattern.test(values.phone) || !/\d/.test(values.phone))) {
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
