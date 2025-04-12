# Multi-Step Form with Zod Validation

<div align="center">
  <img src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Next.js-15.3.0-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/Tailwind-4.1.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind 4" />
  <img src="https://img.shields.io/badge/Zod-Latest-3068B7?style=for-the-badge" alt="Zod" />
</div>

<br />

<div align="center">
  <img src="https://user-images.githubusercontent.com/1500684/158238105-e7279a0c-1640-40db-86b0-3d3a10aab824.png" width="180" alt="Project Icon" />
</div>

<p align="center">A beautifully designed multi-step form implementation with React, Next.js, and Zod validation.</p>

## ✨ Features

- **Multi-step Form Process** - Guided step-by-step form completion
- **Form Validation** - Robust validation using Zod schema
- **Responsive Design** - Mobile-friendly interface
- **Dark Mode Support** - Toggle between light and dark themes
- **Summary View** - Review all information before final submission
- **Modern UI** - Clean, beautiful interface with Tailwind CSS

## 🖥️ Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center">
        <strong>Light Mode</strong><br />
        <img src="https://example.com/light-mode.png" width="400" alt="Light Mode Screenshot" />
      </td>
      <td align="center">
        <strong>Dark Mode</strong><br />
        <img src="https://example.com/dark-mode.png" width="400" alt="Dark Mode Screenshot" />
      </td>
    </tr>
  </table>
</div>

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/multi-step-form-zod.git
cd multi-step-form-zod
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔍 Project Structure

```
/app
  /components
    /form
      - MultiStepForm.jsx        # Main form controller
      - PersonalInfoForm.jsx     # Step 1: Personal information
      - AddressForm.jsx          # Step 2: Address details
      - AccountForm.jsx          # Step 3: Account setup
      - FormSummary.jsx          # Final step: Summary view
      - DarkModeToggle.jsx       # Dark mode functionality
      - validationSchemas.js     # Zod validation schemas
  - layout.js                    # Root layout with dark mode support
  - page.js                      # Main page component
  - globals.css                  # Global styles and Tailwind configurations
```

## 📝 Form Steps

1. **Personal Information**

   - Full Name (required)
   - Email (required, valid format)
   - Phone Number (required, min 10 digits)

2. **Address Details**

   - Street Address (required)
   - City (required)
   - Zip Code (required, numbers only, min 5 digits)

3. **Account Setup**

   - Username (required, min 4 characters)
   - Password (required, min 6 characters)
   - Confirm Password (must match password)

4. **Summary**
   - Review all information before submission

## 🔧 Technologies Used

- **Next.js** - React framework with App Router
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Zod** - TypeScript-first schema validation

## 🌐 Browser Support

- Chrome
- Firefox
- Safari
- Edge


