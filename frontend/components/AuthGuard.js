// components/AuthGuard.js
'use client'

import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }) {
  const { token } = useAuth();
  const router = useRouter();

  if (!token) {
    router.push('/login');
    return null;
  }

  return children;
}