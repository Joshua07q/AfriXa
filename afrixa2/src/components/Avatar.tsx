import React from 'react';
import Image from 'next/image';

function getInitials(name: string | undefined | null) {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`;
  return color;
}

export default function Avatar({ src, name, size = 40, alt = 'avatar' }: { src?: string | null; name?: string | null; size?: number; alt?: string }) {
  if (src) {
    return <Image src={src} alt={alt} width={size} height={size} className="rounded-full object-cover" />;
  }
  const initials = getInitials(name);
  const bgColor = stringToColor(name || '?');
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold"
      style={{ width: size, height: size, background: bgColor, userSelect: 'none' }}
      aria-label={name || alt}
      role="img"
    >
      {initials}
    </div>
  );
} 