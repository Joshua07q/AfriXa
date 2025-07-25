import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { FiMessageCircle, FiUser, FiSettings, FiBook, FiPlus, FiHelpCircle } from 'react-icons/fi';

  return (
    <aside className="w-full md:w-72 h-screen p-4 overflow-y-auto bg-black/60 backdrop-blur-lg shadow-lg border-r border-white/10" aria-label="Chat sidebar" role="complementary">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-on-primary">Afrixa</h1>
        {/* Logo will be added when available */}
      </div>
      <button className="mb-4 bg-accent text-on-secondary p-3 rounded-lg w-full font-bold flex items-center gap-2 justify-center shadow-lg" onClick={() => setModalOpen(true)} aria-label="Start a new chat or group"><FiPlus /> New Chat / Group</button>