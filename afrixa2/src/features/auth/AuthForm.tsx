"use client";
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signIn, signUp } from './authSlice';
import afrixaLogo from '../../assets/Asset 1.png';
import asset2 from '../../assets/Asset 2.png';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthForm({ mode }: { mode?: 'login' | 'signup' }) {
  const router = useRouter();
  const pathname = usePathname();
  const isSignup = mode === 'signup' || pathname.includes('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      const result = await dispatch(signUp({ email, password, displayName }));
      if (result.meta.requestStatus === 'fulfilled') {
        router.push('/auth/profile-setup');
      }
    } else {
      const result = await dispatch(signIn({ email, password }));
      if (result.meta.requestStatus === 'fulfilled') {
        router.push('/app');
      }
    }
  };

  return (
    <div className="relative">
      <img src={asset2.src} alt="Brand asset 2" className="absolute top-0 right-0 w-24 h-24 opacity-10 pointer-events-none select-none" aria-hidden="true" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-10 relative z-10">
        <img src={afrixaLogo} alt="AfriXa Logo" className="w-20 h-20 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">{isSignup ? 'Sign Up' : 'Login'}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded"
        />
        {isSignup && (
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="border p-2 rounded"
          />
        )}
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="bg-green-500 text-white p-2 rounded" disabled={loading}>
          {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Login'}
        </button>
        <button
          type="button"
          className="text-blue-500 underline mt-2"
          onClick={() => router.push(isSignup ? '/auth/login' : '/auth/signup')}
        >
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </button>
      </form>
    </div>
  );
} 