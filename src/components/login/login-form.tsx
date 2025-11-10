"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('sherina@example.com');
  const [password, setPassword] = useState('demo123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email === 'sherina@example.com' && password === 'demo123') {
        toast({
          title: 'Login Successful',
          description: 'Redirecting to dashboard...',
        });
        router.push('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid email or password.',
        });
        setIsLoading(false);
      }
    }, 1000);
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
