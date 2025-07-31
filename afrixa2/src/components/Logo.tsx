"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 1 | 2 | 3;
  className?: string;
}

export default function Logo({ 
  size = 'md', 
  showText = true, 
  variant = 1,
  className = ''
}: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const logoFiles = {
    1: '/logo.png',
    2: '/logo2.png',
    3: '/logo3.png'
  };

  const logoElement = (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <Image
        src={logoFiles[variant]}
        alt="AfriXa Logo"
        width={size === 'sm' ? 24 : size === 'md' ? 40 : 64}
        height={size === 'sm' ? 24 : size === 'md' ? 40 : 64}
        className="object-contain"
      />
    </div>
  );

  if (!showText) {
    return logoElement;
  }

  return (
    <Link href="/app" className="flex items-center space-x-3">
      {logoElement}
      <span className={`text-on-primary font-bold ${textSizes[size]}`}>
        AfriXa
      </span>
    </Link>
  );
} 