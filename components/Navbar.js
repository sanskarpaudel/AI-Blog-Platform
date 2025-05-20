import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">AI Blog Platform</h1>
      <div className="space-x-4">
        <Link href="/" className="text-gray-700 hover:text-blue-600">
          Home
        </Link>
        <Link href="/explore" className="hover:text-blue-600">
          Explore
        </Link>
        {!session && (
          <>
            <Link href="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link
              href="/register"
              className="text-gray-700 hover:text-blue-600"
            >
              Register
            </Link>
          </>
        )}

        {session && (
          <>
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-blue-600"
            >
              Dashboard
            </Link>
            <Link href="/create" className="text-gray-700 hover:text-blue-600">
              Create
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
