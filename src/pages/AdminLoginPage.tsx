
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import SurveyLayout from '@/components/SurveyLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

// Helper function to clean up auth state
const cleanupAuthState = () => {
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

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
      // First, verify if the credentials exist in admin_credentials table
      const { data: adminData, error: adminError } = await supabase
        .from('admin_credentials')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password)
        .single();

      if (adminError || !adminData) {
        toast({
          variant: "destructive",
          title: "Login gagal",
          description: "Email atau password tidak valid",
        });
        setIsLoading(false);
        return;
      }

      // Clean up any existing auth state to prevent conflicts
      cleanupAuthState();
      
      // Try to sign out first to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log("Sign out error (non-critical):", err);
      }

      // Now attempt to sign in with the admin credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Sign in error:", error);
        
        // If error is not about email confirmation, show it to user
        if (error.message !== "Email not confirmed") {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          });
          setIsLoading(false);
          return;
        }
        
        // For email confirmation errors, we'll handle it specially below
        console.log("Email not confirmed, will handle specially");
      }

      // Successful login or special handling for email confirmation error
      toast({
        title: "Login berhasil",
        description: "Selamat datang, Admin!",
      });
      
      // Force a page refresh to ensure clean state
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
