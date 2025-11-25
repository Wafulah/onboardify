
import { Suspense } from 'react';
import LoginClient from "@/components/auth/sign-in";
import { seedData } from '@/actions/seed';


export default function Page() {
   const seed = seedData();
  return (
    <Suspense fallback={<div>Loading...</div>}> 
      <LoginClient />
    </Suspense>
  );
}