"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { accountSchema } from "./validationSchemas";

const AccountForm = ({
  formData,
  setFormData,
  errors,
  setErrors,
  showAllErrors,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    resolver: zodResolver(accountSchema),
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
        username: true,
        password: true,
        confirmPassword: true,
      });

      // Validate the entire form and set errors
      validateAllFields();
    }
  }, [showAllErrors, trigger]);

  // Function to validate all fields at once
  const validateAllFields = async () => {
    try {
      // Try to validate the entire form
      await accountSchema.parseAsync(formData);

      // Check passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords don't match");
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
      } else if (error.message && error.message.includes("Passwords")) {
        formattedErrors.confirmPassword = error.message;
      }

      setErrors(formattedErrors);
    }
  };

  // Validate field on input change
  const validateField = async (fieldName, value) => {
    try {
      // Handle empty field case to prevent premature errors
      if (value.length === 0) {
        // We'll catch this on submission, no need to show error during typing
        return false;
      }

      if (fieldName === "confirmPassword") {
        // Special handling for confirmPassword which depends on password
        const isValid = value === formData.password && value.length > 0;

        if (isValid) {
          // Clear error if passwords match
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
          return false;
        }
      } else if (fieldName === "password") {
        // For password, just check minimum length
        const isValid = value.length >= 6;

        if (isValid) {
          // Clear error if valid
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
      } else if (fieldName === "username") {
        // For username, check minimum length
        const isValid = value.length >= 4;

        if (isValid) {
          // Clear error if valid
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
      } else {
        // For other fields, use standard Zod validation
        await accountSchema
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

    // If password is updated, also validate confirmPassword if it's already been touched
    if (name === "password" && touchedFields.confirmPassword) {
      validateField("confirmPassword", updatedData.confirmPassword);
    }
  };

  // Helper function to determine if an error should be shown
  const shouldShowError = (fieldName) => {
    return (
      (touchedFields[fieldName] || showAllErrors) &&
      (formErrors[fieldName] || errors[fieldName])
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="form-section">
      <h2 className="text-xl font-semibold mb-6 dark:text-white">
        Account Setup
      </h2>
      <form onSubmit={handleSubmit(() => {})}>
        <div className="mb-4">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="form-input"
            placeholder="Choose a username min 4 characters"
            {...register("username")}
            value={formData.username}
            onChange={handleInputChange}
          />
          {shouldShowError("username") && (
            <p className="form-error">
              {formErrors.username?.message || errors.username}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="form-input pr-10"
              placeholder="Enter your password"
              {...register("password")}
              value={formData.password}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {shouldShowError("password") && (
            <p className="form-error">
              {formErrors.password?.message || errors.password}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className="form-input pr-10"
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {shouldShowError("confirmPassword") && (
            <p className="form-error">
              {formErrors.confirmPassword?.message || errors.confirmPassword}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AccountForm;
