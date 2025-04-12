"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { addressSchema } from "./validationSchemas";

const AddressForm = ({
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
    trigger,
    watch,
    clearErrors: clearFormErrors,
  } = useForm({
    resolver: zodResolver(addressSchema),
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
        streetAddress: true,
        city: true,
        zipCode: true,
      });

      // Validate the entire form and set errors
      validateAllFields();
    }
  }, [showAllErrors, trigger]);

  // Function to validate all fields at once
  const validateAllFields = async () => {
    try {
      // Try to validate the entire form
      await addressSchema.parseAsync(formData);

      // Check zipCode custom rules
      if (!/^\d+$/.test(formData.zipCode) || formData.zipCode.length < 5) {
        throw new Error(
          "Zip code must be at least 5 digits and contain only numbers"
        );
      }

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
      } else if (error.message && error.message.includes("Zip code")) {
        formattedErrors.zipCode = error.message;
      }

      setErrors(formattedErrors);
    }
  };

  // Validate field on input change
  const validateField = async (fieldName, value) => {
    try {
      // Special handling for zipCode
      if (fieldName === "zipCode") {
        // Handle empty case - don't show error yet
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

        // Special handling for zipCode to enforce numeric only and min length
        const zipRegex = /^\d+$/;
        const isValid = zipRegex.test(value) && value.length >= 5;

        if (isValid) {
          // If valid and there's an error, clear it
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
        } else {
          // Don't set error yet, just return false
          return false;
        }
      }
      // Handle other fields
      else {
        // For other fields, use standard Zod validation
        await addressSchema
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
        // Clear form errors too
        clearFormErrors(fieldName);
        return true;
      }
    } catch (error) {
      // The field is invalid, but don't set errors here
      return false;
    }
  };

  // Function to handle input changes and update parent state
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // For zipCode, only allow numeric input
    if (name === "zipCode" && value !== "" && !/^\d*$/.test(value)) {
      return; // Don't update if non-numeric characters are entered
    }

    // Mark the field as touched
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Update form data
    const updatedData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedData);

    // Validate the field immediately when it changes
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
        Address Details
      </h2>
      <form onSubmit={handleSubmit(() => {})}>
        <div className="mb-4">
          <label htmlFor="streetAddress" className="form-label">
            Street Address
          </label>
          <input
            id="streetAddress"
            type="text"
            className="form-input"
            placeholder="Enter your street address"
            {...register("streetAddress")}
            value={formData.streetAddress}
            onChange={handleInputChange}
          />
          {shouldShowError("streetAddress") && (
            <p className="form-error">
              {formErrors.streetAddress?.message || errors.streetAddress}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="city" className="form-label">
            City
          </label>
          <input
            id="city"
            type="text"
            className="form-input"
            placeholder="Enter your city"
            {...register("city")}
            value={formData.city}
            onChange={handleInputChange}
          />
          {shouldShowError("city") && (
            <p className="form-error">
              {formErrors.city?.message || errors.city}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="zipCode" className="form-label">
            Zip Code
          </label>
          <input
            id="zipCode"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            className="form-input"
            placeholder="Enter your zip code (numbers only)"
            {...register("zipCode")}
            value={formData.zipCode}
            onChange={handleInputChange}
          />
          {shouldShowError("zipCode") && (
            <p className="form-error">
              {formErrors.zipCode?.message || errors.zipCode}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
