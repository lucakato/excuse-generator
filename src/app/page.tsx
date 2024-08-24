'use client';

import { useRouter } from 'next/navigation';
import Component from '@/components/component';

export default function Home() {
  const router = useRouter();

  const handleSubmit = async (formData: any) => {
    const response = await fetch('/api/wordware', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      router.push(`/excuse?message=${encodeURIComponent(data.message)}`);
    }
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <Component onSubmit={handleSubmit} />
    </main>
  );
}