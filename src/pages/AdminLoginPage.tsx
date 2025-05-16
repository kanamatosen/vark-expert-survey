
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import SurveyLayout from '@/components/SurveyLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/admin/history');
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if the credentials match what's in the database
      const { data, error } = await supabase
        .from('admin_credentials')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password)
        .single();

      if (error || !data) {
        toast({
          variant: "destructive",
          title: "Login gagal",
          description: "Email atau password tidak valid",
        });
        setIsLoading(false);
        return;
      }

      // If credentials are valid, manually set auth session
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      // If auth error, manually create account and signin
      if (signInError) {
        console.log("Sign in error, trying to sign up:", signInError);
        
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              is_admin: true
            }
          }
        });

        if (signUpError) {
          console.log("Sign up error:", signUpError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Gagal membuat akun admin. " + signUpError.message,
          });
          setIsLoading(false);
          return;
        }

        // Try sign in again after signup
        const { error: retrySignInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (retrySignInError) {
          console.log("Retry sign in error:", retrySignInError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Login gagal setelah pendaftaran. " + retrySignInError.message,
          });
          setIsLoading(false);
          return;
        }
      }

      toast({
        title: "Login berhasil",
        description: "Selamat datang, Admin!",
      });
      
      // Use a more reliable navigation method - direct page change
      window.location.href = '/admin/history';
      
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Terjadi kesalahan saat login",
      });
      setIsLoading(false);
    }
  };

  return (
    <SurveyLayout title="Admin Login" subtitle="Login untuk akses panel admin">
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email admin"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password admin"
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : 'Login'}
              </Button>
              
              <div className="text-center mt-4">
                <Button 
                  variant="link" 
                  onClick={() => navigate('/')}
                  type="button"
                >
                  Kembali ke Halaman Utama
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </SurveyLayout>
  );
};

export default AdminLoginPage;
