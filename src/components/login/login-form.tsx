
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/firebase';
import { AuthError, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const [email, setEmail] = useState('sherina@example.com');
  const [password, setPassword] = useState('demo123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!auth) {
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'Authentication service is not available.',
        });
        setIsLoading(false);
        return;
    }

    try {
        // First, try to sign in
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: 'Login Successful',
          description: 'Redirecting to dashboard...',
        });
        // The onAuthStateChanged listener will handle the redirect
    } catch (error) {
        const signInError = error as AuthError;
        
        // If user not found or password incorrect, try to create a new user
        if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/wrong-password' || signInError.code === 'auth/invalid-credential') {
            try {
                await createUserWithEmailAndPassword(auth, email, password);
                toast({
                    title: 'Account Created',
                    description: 'New user created successfully. Logging in...',
                });
                // The onAuthStateChanged listener will handle the redirect
            } catch (signUpError: any) {
                toast({
                    variant: 'destructive',
                    title: 'Sign-Up Failed',
                    description: signUpError.message || 'Could not create a new user.',
                });
                setIsLoading(false);
            }
        } else {
            // Handle other sign-in errors
            toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: signInError.message || 'An unexpected error occurred.',
            });
            setIsLoading(false);
        }
    }
  };

  return (
    <div className="space-y-4">
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="font-semibold">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full bg-[#1DA1F2] hover:bg-[#1A91DA]" disabled={isLoading}>
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
    <Card className="bg-muted">
        <CardContent className="p-4 text-center text-sm text-muted-foreground">
            <p className="font-semibold">Demo Credentials</p>
            <p>Email: sherina@example.com</p>
            <p>Password: demo123</p>
        </CardContent>
    </Card>
    </div>
  );
}
