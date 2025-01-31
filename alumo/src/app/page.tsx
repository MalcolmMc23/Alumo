"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 sm:px-20 py-12 gap-12 text-gray-900 dark:text-gray-100">
      <main className="flex flex-col items-center text-center w-full max-w-2xl">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <div className="flex justify-center w-full mt-6">
          <button
            className="px-10 py-5 text-lg font-semibold text-white bg-blue-600 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-blue-700"
            onClick={() => console.log("Button Clicked")}
          >
            Click Me
          </button>
        </div>

        <ol className="list-decimal list-inside text-base text-left mt-6 space-y-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <li>
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <a
            className="rounded-lg border border-transparent transition-colors flex items-center justify-center bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 gap-2 hover:bg-gray-700 dark:hover:bg-gray-200 text-base h-12 px-5 shadow-md"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logo"
              width={20}
              height={20}
            />
            Deploy Now
          </a>
          <a
            className="rounded-lg border border-gray-300 dark:border-gray-600 transition-colors flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-transparent text-base h-12 px-5 min-w-44 shadow-md"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read Docs
          </a>
        </div>
      </main>

      <footer className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
        <a
          className="flex items-center gap-2 hover:underline"
          href="https://nextjs.org/learn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline"
          href="https://vercel.com/templates?framework=next.js"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline"
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Next.js →
        </a>
      </footer>
    </div>
  );
}
