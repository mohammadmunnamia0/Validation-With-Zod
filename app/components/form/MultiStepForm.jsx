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

  // Initialize form data structure with empty values
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

  const [errors, setErrors] = useState({});

  // Controls whether to show all validation errors, triggered on Next/Submit
  const [showAllErrors, setShowAllErrors] = useState(false);

  // Validates the current step data using Zod schemas
  const validateStep = async () => {
    try {
      let isValid = false;

      switch (step) {
        case 1:
          personalInfoSchema.parse(formData.personalInfo);
          isValid = true;
          break;
        case 2:
          // Extra validation for zipCode beyond the schema
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
          // Ensure passwords match before validation
          if (formData.account.password !== formData.account.confirmPassword) {
            throw new Error("Passwords must match");
          }
          accountSchema.parse(formData.account);
          isValid = true;
          break;
        default:
          isValid = true;
          break;
      }

      setErrors({});
      return isValid;
    } catch (error) {
      const formattedErrors = {};

      if (error.errors) {
        error.errors.forEach((err) => {
          formattedErrors[err.path[0]] = err.message;
        });
      } else if (error.message) {
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

  // Handles progression to next step after validation
  const handleNext = () => {
    setShowAllErrors(true);

    validateStep().then((isValid) => {
      if (isValid) {
        if (step < 4) {
          setStep(step + 1);
          setErrors({});
          setShowAllErrors(false);
        }
      }
    });
  };

  // Handles back navigation
  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
      setShowAllErrors(false);
    }
  };

  // Validates and processes the final form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowAllErrors(true);

    validateStep().then((isValid) => {
      if (isValid) {
        // Security: remove confirmPassword before submission
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
          },
        };

        console.log("Form Data Submitted:");
        console.log(JSON.stringify(formDataToSubmit, null, 2));

        setIsSubmitted(true);
      }
    });
  };

  // Updates form data while preserving structure
  const updateFormData = (section, data) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: data,
    }));
  };

  // Get form title based on step
  const getFormTitle = () => {
    switch (step) {
      case 1:
        return "Personal Information";
      case 2:
        return "PERSONAL INFO";
      case 3:
        return "PROFESSIONAL INFO";
      case 4:
        return "Summary";
      default:
        return "";
    }
  };

  // Renders the appropriate form based on current step
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

  // Renders the progress indicator with step circles
  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center items-center mb-6">
        {[1, 2, 3].map((number) => (
          <div key={number} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                number <= step
                  ? "bg-purple-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {number}
            </div>
            {number < 3 && (
              <div
                className={`w-16 h-0.5 ${
                  number < step ? "bg-purple-600" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Main form UI with navigation buttons
  const renderCurrentForm = () => {
    return (
      <div className="bg-purple-600 min-h-screen flex justify-center items-center p-4">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
          {renderStepIndicator()}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold">{getFormTitle()}</h2>
          </div>
          {renderStepForm()}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={handlePrevious}
                className="bg-gray-400 text-white px-6 py-2 rounded-md"
              >
                Back
              </button>
            )}
            {step === 1 && <div></div>}

            {step < 4 ? (
              <button
                onClick={handleNext}
                className="bg-purple-600 text-white px-6 py-2 rounded-md"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-purple-600 text-white px-6 py-2 rounded-md"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Success screen shown after form submission
  if (isSubmitted) {
    return (
      <div className="bg-purple-600 min-h-screen flex justify-center items-center p-4">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
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
          </div>
          <h2 className="text-xl font-semibold mb-4">
            You have successfully completed the process.
          </h2>
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
            className="bg-purple-600 text-white px-6 py-2 rounded-md mt-4"
          >
            Start Again
          </button>
        </div>
      </div>
    );
  }

  return renderCurrentForm();
};

export default MultiStepForm;
