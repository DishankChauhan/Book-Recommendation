// /components/SignIn.tsx
import React from 'react';
import { auth } from '@/lib/firebase'; // Adjust the path as needed
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const SignIn: React.FC = () => {
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('User signed in:', user);
      // You can redirect or update state here after successful sign-in
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <button onClick={handleSignIn} className="bg-blue-500 text-white px-4 py-2 rounded">
      Sign in with Google
    </button>
  );
};

export default SignIn;
