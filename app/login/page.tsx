
import dynamic from 'next/dynamic';

const LoginClient = dynamic(() => import('@/components/auth/sign-in'), { ssr: false });

export default function Page() {
  return <LoginClient />;
}
