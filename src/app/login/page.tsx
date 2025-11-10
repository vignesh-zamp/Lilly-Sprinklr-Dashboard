
'use client';

import { LoginForm } from '@/components/login/login-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    if (isUserLoading || user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <p>Loading...</p>
            </div>
        );
    }

  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm mx-4 shadow-lg">
        <CardHeader className="text-center items-center">
            <Avatar className="h-12 w-12 bg-blue-500 text-white mb-4">
                <AvatarFallback className="bg-[#1DA1F2] text-white text-2xl font-bold">S</AvatarFallback>
            </Avatar>
          <CardTitle className="text-xl font-bold">Sprinklr Case Management</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
