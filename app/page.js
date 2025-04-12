import DarkModeToggle from "./components/form/DarkModeToggle";
import MultiStepForm from "./components/form/MultiStepForm";

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4 dark:bg-gray-900 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div className="text-center flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Multi-Step Form with Zod Validation
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A beautiful form implementation with step-by-step progress,
              validation, and dark mode support.
            </p>
          </div>
          <div className="ml-4">
            <DarkModeToggle />
          </div>
        </header>

        <div className="max-w-3xl mx-auto">
          <MultiStepForm />
        </div>

        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>
            © {new Date().getFullYear()} Form Validation Demo • Built with
            Next.js, React and Zod
          </p>
        </footer>
      </div>
    </main>
  );
}
