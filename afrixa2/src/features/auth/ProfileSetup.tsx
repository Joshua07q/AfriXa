"use client";
import React, { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateProfile as firebaseUpdateProfile } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../../firebase';
import { setUser, serializeUser } from './authSlice';
import afrixaLogo from '../../assets/Asset 1.png';
import asset3 from '../../assets/Asset 3.png';
import { useRouter } from 'next/navigation';
import TutorialModal from '../../components/TutorialModal';

export default function ProfileSetup() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [showTutorial, setShowTutorial] = useState(false);

  if (!user) return null;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
      setPhotoURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let uploadedPhotoURL = photoURL;
    try {
      if (photo) {
        const storageRef = ref(storage, `profile_pictures/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, photo);
        uploadTask.on('state_changed', (snapshot) => {
          setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        });
        await uploadTask;
        uploadedPhotoURL = await getDownloadURL(storageRef);
      }
      if (auth.currentUser) {
        await firebaseUpdateProfile(auth.currentUser, {
          displayName,
          photoURL: uploadedPhotoURL,
        });
        await auth.currentUser.reload();
        dispatch(setUser(serializeUser(auth.currentUser)));
      }
      // Show tutorial for first-time users
      if (!localStorage.getItem('afrixa_tutorial_shown')) {
        setShowTutorial(true);
        localStorage.setItem('afrixa_tutorial_shown', '1');
      } else {
        router.push('/app/chat');
      }
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <img src={asset3.src} alt="Brand asset 3" className="absolute bottom-0 left-0 w-24 h-24 opacity-10 pointer-events-none select-none" aria-hidden="true" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-10 relative z-10">
        <img src={afrixaLogo.src} alt="AfriXa Logo" className="w-20 h-20 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Set up your profile</h2>
        <div className="flex flex-col items-center gap-2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            className="hidden"
          />
          <div
            className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {photoURL ? (
              <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>Upload</span>
            )}
          </div>
          {progress > 0 && progress < 100 && (
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded" disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
      {showTutorial && <TutorialModal onClose={() => {
        localStorage.setItem('afrixa_show_app', '1');
        router.push('/app/profile');
      }} />}
    </div>
  );
} 