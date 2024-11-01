import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-blue-500 p-4">
      <nav className="flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          Book Recommendations
        </Link>
        <div>
          {session ? (
            <>
              <Link href="/profile" className="text-white mr-4">
                Profile
              </Link>
              <button onClick={() => signOut()} className="text-white">
                Sign out
              </button>
            </>
          ) : (
            <button onClick={() => signIn('google')} className="text-white">
              Sign in with Google
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}