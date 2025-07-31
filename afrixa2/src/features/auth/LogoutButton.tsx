"use client";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signOut } from './authSlice';
import { FiLogOut, FiUser } from 'react-icons/fi';

export default function LogoutButton() {
  const dispatch = useAppDispatch();
  const { loading, user } = useAppSelector((state) => state.auth);
  
  return (
    <div className="flex items-center gap-3 p-4 bg-surface border-t border-accent/20">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
          <FiUser className="text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-on-surface truncate">
            {user?.displayName || user?.email || 'User'}
          </div>
          <div className="text-sm opacity-70 text-on-surface">
            {user?.email}
          </div>
        </div>
      </div>
      
      <button
        className="flex items-center gap-2 px-4 py-2 bg-error/20 hover:bg-error/30 text-error rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
        onClick={() => dispatch(signOut())}
        disabled={loading}
        aria-label="Sign out"
      >
        <FiLogOut className="text-lg" />
        {loading ? 'Signing out...' : 'Sign Out'}
      </button>
    </div>
  );
} 