export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 text-center py-4 text-sm text-gray-500">
      <p>
        &copy; {new Date().getFullYear()} AI Blog Platform. All rights reserved.
      </p>
      <div className="mt-2 space-x-4">
        <a href="/about" className="hover:underline">
          About
        </a>
        <a
          href="https://github.com/"
          target="_blank"
          className="hover:underline"
        >
          GitHub
        </a>
        <a href="/privacy" className="hover:underline">
          Privacy
        </a>
      </div>
    </footer>
  );
}
