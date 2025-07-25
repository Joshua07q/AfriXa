"use client";
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signIn, signUp } from './authSlice';
import afrixaLogo from '../../assets/Asset 1.png';
import asset2 from '../../assets/Asset 2.png';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

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
      <Image src={asset2.src} alt="Brand asset 2" className="absolute top-0 right-0 w-24 h-24 opacity-10 pointer-events-none select-none" aria-hidden="true" width={96} height={96} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-10 relative z-10">
        <Image src={afrixaLogo.src} alt="Afrixa Logo" className="w-24 h-24 mx-auto mb-6" width={96} height={96} />
        <h2 className="text-3xl font-bold mb-4 text-primary">{isSignup ? 'Create an Account' : 'Login to Afrixa'}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-3 rounded bg-surface text-on-surface"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-3 rounded bg-surface text-on-surface"
        />
        {isSignup && (
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="border p-3 rounded bg-surface text-on-surface"
          />
        )}
        {error && <div className="text-error">{error}</div>}
        <button type="submit" className="bg-accent text-on-secondary font-bold p-3 rounded" disabled={loading}>
          {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Login'}
        </button>
        <button
          type="button"
          className="text-accent hover:underline mt-4"
          onClick={() => router.push(isSignup ? '/auth/login' : '/auth/signup')}
        >
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </button>
      </form>
    </div>
  );
} 