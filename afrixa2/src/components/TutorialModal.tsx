"use client";
import React from 'react';
import afrixaLogo from '../assets/Asset 1.png';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


export default function TutorialModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-8 relative animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl focus:outline focus:ring"
          onClick={onClose}
          aria-label="Close tutorial"
        >
          ×
        </button>
        <div className="flex flex-col items-center">
          <Image src={afrixaLogo} alt="AfriXa Logo" width={64} height={64} className="w-16 h-16 mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-green-700">Welcome to AfriXa!</h2>
          <p className="text-gray-600 mb-6 text-center">Here&apos;s a quick tour of the main features to get you started:</p>
          <ul className="text-left space-y-4 w-full max-w-md mx-auto">
            <li><span className="font-semibold text-green-700">💬 Real-time Chat:</span> Instantly message individuals or groups across Africa.</li>
            <li><span className="font-semibold text-green-700">🖼️ Profile & Avatars:</span> Personalize your profile and see others&apos; avatars and initials.</li>
            <li><span className="font-semibold text-green-700">🔍 Search & Start Chats:</span> Find users and create new chats or groups easily.</li>
            <li><span className="font-semibold text-green-700">📱 Responsive Design:</span> Use AfriXa on mobile, tablet, or desktop with a beautiful, adaptive layout.</li>
            <li><span className="font-semibold text-green-700">🔔 Status & Notifications:</span> Stay updated with message status and group info.</li>
            <li><span className="font-semibold text-green-700">🛡️ Secure & Private:</span> Your conversations are protected and private.</li>
          </ul>
          <button
            className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-full text-lg shadow focus:outline focus:ring"
            onClick={() => {
              onClose();
              router.push('/app');
            }}
            aria-label="Close tutorial and start using AfriXa"
          >
            Start Using AfriXa
          </button>
        </div>
      </div>
    </div>
  );
} 