import React from 'react';
import { motion } from 'framer-motion';

export default function WelcomeLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-yellow-50 z-50">
      <motion.img
        src={require('../assets/Asset 1.png').default ?? '/src/assets/Asset 1.png'}
        alt="AfriXa Logo"
        className="w-32 h-32 mb-6 drop-shadow-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.1, 1], opacity: 1, rotate: [0, 10, -10, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />
      <motion.h1
        className="text-3xl md:text-4xl font-extrabold text-green-700 tracking-tight mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Welcome to AfriXa
      </motion.h1>
      <motion.p
        className="text-lg text-gray-600 font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        Connecting Africa, One Chat at a Time
      </motion.p>
    </div>
  );
} 