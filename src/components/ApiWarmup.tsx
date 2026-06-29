'use client';
import { useEffect } from 'react';

export default function ApiWarmup() {
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (url) fetch(`${url}/api/reviews?limit=1`).catch(() => {});
  }, []);
  return null;
}
