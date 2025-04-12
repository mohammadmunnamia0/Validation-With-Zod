"use client";

const FormSummary = ({ formData }) => {
  const { personalInfo, address, account } = formData;

  return (
    <div className="form-section">
      <h2 className="text-xl font-semibold mb-6 dark:text-white">
        Review Your Information
      </h2>

      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3 dark:text-white">
            Personal Information
          </h3>
          <div className="space-y-2">
            <div className="flex flex-wrap">
              <span className="w-1/3 text-gray-600 dark:text-gray-300">
                Full Name:
              </span>
              <span className="w-2/3 font-medium dark:text-white">
                {personalInfo.fullName}
              </span>
            </div>
            <div className="flex flex-wrap">
              <span className="w-1/3 text-gray-600 dark:text-gray-300">
                Email:
              </span>
              <span className="w-2/3 font-medium dark:text-white">
                {personalInfo.email}
              </span>
            </div>
            <div className="flex flex-wrap">
              <span className="w-1/3 text-gray-600 dark:text-gray-300">
                Phone:
              </span>
              <span className="w-2/3 font-medium dark:text-white">
                {personalInfo.phoneNumber}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3 dark:text-white">
            Address Details
          </h3>
          <div className="space-y-2">
            <div className="flex flex-wrap">
              <span className="w-1/3 text-gray-600 dark:text-gray-300">
                Street Address:
              </span>
              <span className="w-2/3 font-medium dark:text-white">
                {address.streetAddress}
              </span>
            </div>
            <div className="flex flex-wrap">
              <span className="w-1/3 text-gray-600 dark:text-gray-300">
                City:
              </span>
              <span className="w-2/3 font-medium dark:text-white">
                {address.city}
              </span>
            </div>
            <div className="flex flex-wrap">
              <span className="w-1/3 text-gray-600 dark:text-gray-300">
                Zip Code:
              </span>
              <span className="w-2/3 font-medium dark:text-white">
                {address.zipCode}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3 dark:text-white">
            Account Information
          </h3>
          <div className="space-y-2">
            <div className="flex flex-wrap">
              <span className="w-1/3 text-gray-600 dark:text-gray-300">
                Username:
              </span>
              <span className="w-2/3 font-medium dark:text-white">
                {account.username}
              </span>
            </div>
            <div className="flex flex-wrap">
              <span className="w-1/3 text-gray-600 dark:text-gray-300">
                Password:
              </span>
              <span className="w-2/3 font-medium dark:text-white">
                ••••••••••
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t pt-6 border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Please review the information above. If everything looks correct,
          click "Submit" to complete the form.
        </p>
      </div>
    </div>
  );
};

export default FormSummary;
