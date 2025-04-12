import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Multi-Step Form with Zod",
  description: "A multi-step form with Zod validation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storageKey = 'darkMode';
                  var prefersDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');
                  var value = localStorage.getItem(storageKey);
                  var prefersDark = prefersDarkQuery.matches;
                  
                  if (value === null) {
                    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
                    document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
                  } else {
                    var isDark = value === 'true';
                    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
                    document.documentElement.classList.add(isDark ? 'dark' : 'light');
                  }
                } catch (error) {
                  console.error('Dark mode initialization failed:', error);
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
