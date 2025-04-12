import DarkModeToggle from "./components/form/DarkModeToggle";
import MultiStepForm from "./components/form/MultiStepForm";

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4 dark:bg-gray-900 bg-gray-50">
      <div className="grid items-center mx-auto">
        <header className="justify-between">
          <div>
            <h1 className="text-center text-4xl md:text-4xl font-bold">
              Multi-Step Form with Zod Validation
            </h1>
            <DarkModeToggle />
          </div>
        </header>

        <div>
          <div className="mx-auto">
            <MultiStepForm className="max-w-3xl" />
          </div>
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
