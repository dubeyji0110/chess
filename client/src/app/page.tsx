'use client';

import { Button } from '@/components';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="h-screen w-screen">
      <div className="flex justify-center items-center h-screen">
        <Button
          className="bg-green-600 text-white font-medium hover:bg-green-700 w-40 text-center"
          onClick={() => {
            router.push('/game');
          }}
        >
          Play
        </Button>
      </div>
    </main>
  );
}
