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

  const watchedValues = watch();

  // Handle showing all errors when Next button is clicked
  useEffect(() => {
    if (showAllErrors) {
      trigger();
      setTouchedFields({
        streetAddress: true,
        city: true,
        zipCode: true,
      });
      validateAllFields();
    }
  }, [showAllErrors, trigger]);

  // Comprehensive form validation
  const validateAllFields = async () => {
    try {
      await addressSchema.parseAsync(formData);

      // Additional zip code validation beyond schema
      if (!/^\d+$/.test(formData.zipCode) || formData.zipCode.length < 5) {
        throw new Error("Zip code must be at least 5 digits");
      }

      setErrors({});
    } catch (error) {
      const formattedErrors = {};

      if (error.errors) {
        error.errors.forEach((err) => {
          formattedErrors[err.path[0]] = err.message;
        });
      } else if (error.message && error.message.includes("Zip code")) {
        formattedErrors.zipCode = error.message;
      }

      setErrors(formattedErrors);
    }
  };

  // Real-time field validation during typing
  const validateField = async (fieldName, value) => {
    try {
      // Special zipCode validation with numeric and length requirements
      if (fieldName === "zipCode") {
        if (value.length === 0) {
          if (errors[fieldName]) {
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors[fieldName];
              return newErrors;
            });
          }
          clearFormErrors(fieldName);
          return true;
        }

        const zipRegex = /^\d+$/;
        const isValid = zipRegex.test(value) && value.length >= 5;

        if (isValid) {
          if (errors[fieldName]) {
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors[fieldName];
              return newErrors;
            });
          }
          clearFormErrors(fieldName);
          return true;
        } else {
          return false;
        }
      }
      // Standard validation for other fields
      else {
        await addressSchema
          .pick({ [fieldName]: true })
          .parseAsync({ [fieldName]: value });

        if (errors[fieldName]) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
          });
        }
        clearFormErrors(fieldName);
        return true;
      }
    } catch (error) {
      return false;
    }
  };

  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Restrict zipCode to numeric input only
    if (name === "zipCode" && value !== "" && !/^\d*$/.test(value)) {
      return;
    }

    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));

    setFormData({
      ...formData,
      [name]: value,
    });

    validateField(name, value);
  };

  // Determine when to show error messages
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
            placeholder="Enter your zip code min 5 digits"
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
