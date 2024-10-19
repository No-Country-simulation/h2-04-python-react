/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProfileImage({ profilePhoto, username, size = 'size-10' }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  
  const imageUrl = profilePhoto
    ? `${BASE_URL}${profilePhoto}`
    : `https://avatar.iran.liara.run/username?username=${username}`;

  return (
    <div className={`relative ${size}`}>
      {!imageLoaded && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-200 rounded-full ${size}`}>
          <Loader2 className={`${size === 'size-10' ? 'size-5' : 'size-8'} text-gray-400 animate-spin`} />
        </div>
      )}
      <img
        src={imageUrl}
        alt={`Avatar de ${username}`}
        className={`${size} rounded-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
}