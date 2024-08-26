'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function ExcusePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const message = searchParams.get('message')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Your Excuse</h1>
      <p className="text-lg mb-8 text-foreground">{message}</p>
      <Button onClick={() => router.push('/')} className="rounded-2xl">
        Generate another excuse!
      </Button>
    </div>
  )
}