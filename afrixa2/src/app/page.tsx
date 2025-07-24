"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import afrixaLogo from '../assets/Asset 1.png';
import asset2 from '../assets/Asset 2.png';
import asset3 from '../assets/Asset 3.png';
import asset4 from '../assets/Asset 4.png';

export default function Landing() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-yellow-50 relative overflow-hidden">
      <img src={afrixaLogo.src} alt="AfriXa Logo" className="w-32 h-32 mb-6 drop-shadow-lg z-10" />
      <div className="flex gap-4 mb-6 z-0 opacity-40">
        <img src={asset2.src} alt="Brand asset 2" className="w-12 h-12" />
        <img src={asset3.src} alt="Brand asset 3" className="w-12 h-12" />
        <img src={asset4.src} alt="Brand asset 4" className="w-12 h-12" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-2 z-10">Welcome to AfriXa</h1>
      <p className="text-lg text-gray-600 mb-8 z-10">Connecting Africa, One Chat at a Time</p>
      <button
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg focus:outline focus:ring transition z-10"
        onClick={() => router.push('/app')}
        aria-label="Enter AfriXa App"
      >
        Enter AfriXa
      </button>
    </div>
  );
}
