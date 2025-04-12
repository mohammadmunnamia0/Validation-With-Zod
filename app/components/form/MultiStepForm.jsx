"use client";
import { useState } from "react";
import AccountForm from "./AccountForm";
import AddressForm from "./AddressForm";
import FormSummary from "./FormSummary";
import PersonalInfoForm from "./PersonalInfoForm";
import {
  accountSchema,
  addressSchema,
  personalInfoSchema,
} from "./validationSchemas";

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form data for all steps
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phoneNumber: "",
    },
    address: {
      streetAddress: "",
      city: "",
      zipCode: "",
    },
    account: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Error state for each step
  const [errors, setErrors] = useState({});

  // Flag to force showing all errors after clicking Next
  const [showAllErrors, setShowAllErrors] = useState(false);

  // Validate the current step
  const validateStep = async () => {
    try {
      let isValid = false;

      switch (step) {
        case 1:
          // Validate personal info
          personalInfoSchema.parse(formData.personalInfo);
          isValid = true;
          break;
        case 2:
          // Validate address
          // Additional check for zip code to ensure it's numeric and at least 5 digits
          if (
            !/^\d+$/.test(formData.address.zipCode) ||
            formData.address.zipCode.length < 5
          ) {
            throw new Error(
              "Zip code must be at least 5 digits and contain only numbers"
            );
          }
          addressSchema.parse(formData.address);
          isValid = true;
          break;
        case 3:
          // Validate account and check if passwords match
          if (formData.account.password !== formData.account.confirmPassword) {
            throw new Error("Passwords don't match");
          }
          accountSchema.parse(formData.account);
          isValid = true;
          break;
        default:
          isValid = true;
          break;
      }

      // Clear errors if validation succeeds
      setErrors({});
      return isValid;
    } catch (error) {
      // Format errors for display
      const formattedErrors = {};

      if (error.errors) {
        // Handle Zod validation errors
        error.errors.forEach((err) => {
          formattedErrors[err.path[0]] = err.message;
        });
      } else if (error.message) {
        // Handle custom error messages
        if (error.message.includes("Zip code")) {
          formattedErrors.zipCode = error.message;
        } else if (error.message.includes("Passwords")) {
          formattedErrors.confirmPassword = error.message;
        }
      }

      setErrors(formattedErrors);
      return false;
    }
  };

  // Next step handler
  const handleNext = () => {
    // Set flag to show all errors
    setShowAllErrors(true);

    validateStep().then((isValid) => {
      if (isValid) {
        if (step < 4) {
          setStep(step + 1);
          setErrors({});
          setShowAllErrors(false); // Reset the flag for the next step
        }
      }
    });
  };

  // Previous step handler
  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
      setShowAllErrors(false); // Reset the flag when going back
    }
  };

  // Submit form handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowAllErrors(true); // Show all errors on submit attempt

    validateStep().then((isValid) => {
      if (isValid) {
        // Create a copy of formData without the confirmPassword field for security
        const formDataToSubmit = {
          personalInfo: {
            ...formData.personalInfo,
          },
          address: {
            ...formData.address,
          },
          account: {
            username: formData.account.username,
            password: formData.account.password,
            // Remove confirmPassword for security
          },
        };

        // Log the data to console in a nicely formatted way
        console.log("Form Data Submitted:");
        console.log(JSON.stringify(formDataToSubmit, null, 2));

        setIsSubmitted(true);
      }
    });
  };

  // Update form data handler and trigger validation
  const updateFormData = (section, data) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: data,
    }));
  };

  // Render current step form
  const renderStepForm = () => {
    switch (step) {
      case 1:
        return (
          <PersonalInfoForm
            formData={formData.personalInfo}
            setFormData={(data) => updateFormData("personalInfo", data)}
            errors={errors}
            setErrors={setErrors}
            showAllErrors={showAllErrors}
          />
        );
      case 2:
        return (
          <AddressForm
            formData={formData.address}
            setFormData={(data) => updateFormData("address", data)}
            errors={errors}
            setErrors={setErrors}
            showAllErrors={showAllErrors}
          />
        );
      case 3:
        return (
          <AccountForm
            formData={formData.account}
            setFormData={(data) => updateFormData("account", data)}
            errors={errors}
            setErrors={setErrors}
            showAllErrors={showAllErrors}
          />
        );
      case 4:
        return <FormSummary formData={formData} />;
      default:
        return null;
    }
  };

  // Progress indicator
  const renderProgress = () => {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                {[1, 2, 3, 4].map((stepNumber, index) => (
                  <div
                    key={index}
                    className={`flex-1 text-center relative ${
                      stepNumber < step
                        ? "text-blue-600 dark:text-blue-400"
                        : stepNumber === step
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center border-2 ${
                        stepNumber < step
                          ? "bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500"
                          : stepNumber === step
                          ? "border-blue-600 dark:border-blue-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {stepNumber < step ? (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      ) : (
                        <span
                          className={`text-sm font-medium ${
                            stepNumber === step
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {stepNumber}
                        </span>
                      )}
                    </div>
                    {index < 3 && (
                      <div
                        className={`hidden sm:block absolute top-4 w-full left-1/2 h-0.5 ${
                          stepNumber < step
                            ? "bg-blue-600 dark:bg-blue-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      ></div>
                    )}
                    <div className="mt-2 text-sm">
                      {index === 0 && "Personal"}
                      {index === 1 && "Address"}
                      {index === 2 && "Account"}
                      {index === 3 && "Summary"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-card px-0 py-0 border-0 shadow-none">
              {renderStepForm()}
            </div>

            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button onClick={handlePrevious} className="btn-secondary">
                  Previous
                </button>
              )}
              {step === 1 && <div></div>}

              {step < 4 ? (
                <button onClick={handleNext} className="btn-primary">
                  Next
                </button>
              ) : (
                <button onClick={handleSubmit} className="btn-primary">
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <div className="form-card">
        <div className="text-center p-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 className="text-2xl font-semibold my-4 dark:text-white text-gray-800">
            Form Submitted Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Thank you for your submission. All your data has been processed.
          </p>
          <button
            onClick={() => {
              setStep(1);
              setIsSubmitted(false);
              setShowAllErrors(false);
              setFormData({
                personalInfo: { fullName: "", email: "", phoneNumber: "" },
                address: { streetAddress: "", city: "", zipCode: "" },
                account: { username: "", password: "", confirmPassword: "" },
              });
            }}
            className="btn-primary"
          >
            Submit Another Form
          </button>
        </div>
      </div>
    );
  }

  return renderProgress();
};

export default MultiStepForm;
