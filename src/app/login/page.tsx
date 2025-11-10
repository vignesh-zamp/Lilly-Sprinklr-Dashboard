import { LoginForm } from '@/components/login/login-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function LoginPage() {
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
