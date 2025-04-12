"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { personalInfoSchema } from "./validationSchemas";

const PersonalInfoForm = ({
  formData,
  setFormData,
  errors,
  setErrors,
  showAllErrors,
}) => {
  // Track which fields have been interacted with
  const [touchedFields, setTouchedFields] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    watch,
    trigger,
    clearErrors: clearFormErrors,
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: formData,
    mode: "onChange",
  });

  // Watch for changes in all fields
  const watchedValues = watch();

  // When showAllErrors becomes true, validate all fields and mark them as touched
  useEffect(() => {
    if (showAllErrors) {
      // Trigger validation for all fields
      trigger();

      // Mark all fields as touched
      setTouchedFields({
        fullName: true,
        email: true,
        phoneNumber: true,
      });

      // Validate the entire form and set errors
      validateAllFields();
    }
  }, [showAllErrors, trigger]);

  // Function to validate all fields at once
  const validateAllFields = async () => {
    try {
      // Try to validate the entire form
      await personalInfoSchema.parseAsync(formData);

      // Clear errors if successful
      setErrors({});
    } catch (error) {
      // Format and set errors
      const formattedErrors = {};

      if (error.errors) {
        // Handle Zod validation errors
        error.errors.forEach((err) => {
          formattedErrors[err.path[0]] = err.message;
        });
      }

      setErrors(formattedErrors);
    }
  };

  // Validate field on input change
  const validateField = async (fieldName, value) => {
    try {
      // Special handling for phoneNumber
      if (fieldName === "phoneNumber") {
        // Only validate if it's not empty (to avoid premature validation)
        if (value.length === 0) {
          if (errors[fieldName]) {
            // Clear the error if the field is empty (will be caught on submission)
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors[fieldName];
              return newErrors;
            });
          }
          // Clear form errors too
          clearFormErrors(fieldName);
          return true;
        }

        // Check if it's a valid phone number (at least 10 digits, only numbers)
        const isValid = value.length >= 10 && /^\d+$/.test(value);
        if (isValid) {
          // Clear errors if valid
          if (errors[fieldName]) {
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors[fieldName];
              return newErrors;
            });
          }
          // Clear form errors too
          clearFormErrors(fieldName);
          return true;
        }
        return false;
      }

      // For email, use special validation to avoid premature errors
      else if (fieldName === "email") {
        // Only validate if it looks like a complete email
        if (value.length === 0 || !value.includes("@")) {
          // Don't show error yet, but don't clear existing errors from submission
          return false;
        }

        // Basic email regex check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(value);

        if (isValid) {
          // Clear errors if valid
          if (errors[fieldName]) {
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors[fieldName];
              return newErrors;
            });
          }
          // Clear form errors too
          clearFormErrors(fieldName);
          return true;
        }
        return false;
      }

      // For all other fields, use standard validation
      else {
        // Try to validate just this field
        await personalInfoSchema
          .pick({ [fieldName]: true })
          .parseAsync({ [fieldName]: value });

        // If successful and there's an error for this field, clear it
        if (errors[fieldName]) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
          });
        }

        // Also clear form errors
        clearFormErrors(fieldName);
        return true;
      }
    } catch (error) {
      // The field is invalid, but we don't set errors here yet
      return false;
    }
  };

  // Function to handle input changes and update parent state
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special handling for phone number to ensure it's numeric
    if (name === "phoneNumber" && value !== "" && !/^\d*$/.test(value)) {
      return; // Don't update if non-numeric characters are entered
    }

    // Mark the field as touched
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Update the form data
    const updatedData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedData);

    // Validate the field immediately
    validateField(name, value);
  };

  // Helper function to determine if an error should be shown
  const shouldShowError = (fieldName) => {
    return (
      (touchedFields[fieldName] || showAllErrors) &&
      (formErrors[fieldName] || errors[fieldName])
    );
  };

  return (
    <div className="form-section">
      <h2 className="text-xl font-semibold mb-6 dark:text-white">
        Personal Information
      </h2>
      <form onSubmit={handleSubmit(() => {})}>
        <div className="mb-4">
          <label htmlFor="fullName" className="form-label">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            className="form-input"
            placeholder="Enter your full name"
            {...register("fullName")}
            value={formData.fullName}
            onChange={handleInputChange}
          />
          {shouldShowError("fullName") && (
            <p className="form-error">
              {formErrors.fullName?.message || errors.fullName}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="form-input"
            placeholder="Enter your email"
            {...register("email")}
            value={formData.email}
            onChange={handleInputChange}
          />
          {shouldShowError("email") && (
            <p className="form-error">
              {formErrors.email?.message || errors.email}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="phoneNumber" className="form-label">
            Phone Number
          </label>
          <input
            id="phoneNumber"
            type="tel"
            inputMode="numeric"
            pattern="\d*"
            className="form-input"
            placeholder="Enter your phone number (numbers only)"
            {...register("phoneNumber")}
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
          {shouldShowError("phoneNumber") && (
            <p className="form-error">
              {formErrors.phoneNumber?.message || errors.phoneNumber}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoForm;
