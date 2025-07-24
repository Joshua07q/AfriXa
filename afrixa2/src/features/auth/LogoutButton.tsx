"use client";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signOut } from './authSlice';

export default function LogoutButton() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  return (
    <button
      className="bg-red-500 text-white p-2 rounded mt-4"
      onClick={() => dispatch(signOut())}
      disabled={loading}
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
} 