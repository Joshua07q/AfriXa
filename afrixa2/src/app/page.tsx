"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import afrixaLogo from '../assets/Asset 1.png';
import asset2 from '../assets/Asset 2.png';
import asset3 from '../assets/Asset 3.png';
import asset4 from '../assets/Asset 4.png';
import Image from 'next/image';

export default function Landing() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-yellow-50 relative overflow-hidden">
      <Image
        src={afrixaLogo.src}
        alt="Afrixa Logo"
        width={128}
        height={128}
        className="w-32 h-32 mb-6 drop-shadow-lg z-10"
      />
      <div className="flex gap-4 mb-6 z-0 opacity-40">
        <Image
          src={asset2.src}
          alt="Brand asset 2"
          width={48}
          height={48}
          className="w-12 h-12"
        />
        <Image
          src={asset3.src}
          alt="Brand asset 3"
          width={48}
          height={48}
          className="w-12 h-12"
        />
        <Image
          src={asset4.src}
          alt="Brand asset 4"
          width={48}
          height={48}
          className="w-12 h-12"
        />
      </div>
      <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-4 z-10">Welcome to Afrixa</h1>
      <p className="text-xl text-on-background mb-8 z-10">Connecting Africa, One Chat at a Time</p>
      <button
        className="bg-accent hover:bg-green-700 text-on-secondary font-bold py-4 px-10 rounded-full text-xl shadow-lg focus:outline focus:ring transition z-10"
        onClick={() => router.push('/app')}
        aria-label="Enter Afrixa App"
      >
        Enter Afrixa
      </button>
    </div>
  );
}
