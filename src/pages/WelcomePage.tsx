import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSurvey } from '@/contexts/SurveyContext';
import SurveyLayout from '@/components/SurveyLayout';
import { useToast } from "@/components/ui/use-toast";
import { History, Shield } from 'lucide-react';

const WelcomePage = () => {
  const { userData, setName, setNim, surveyHistory } = useSurvey();
  const [localName, setLocalName] = useState(userData.name);
  const [localNim, setLocalNim] = useState(userData.nim);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!localName.trim()) {
      toast({
        title: "Nama diperlukan",
        description: "Silakan masukkan nama Anda untuk melanjutkan.",
        variant: "destructive",
      });
      return;
    }
    
    if (!localNim.trim()) {
      toast({
        title: "NIM diperlukan",
        description: "Silakan masukkan NIM Anda untuk melanjutkan.",
        variant: "destructive",
      });
      return;
    }
    
    setName(localName);
    setNim(localNim);
    navigate('/survey/visual');
  };

  const handleHistory = () => {
    navigate('/history');
  };
  
  const handleAdminLogin = () => {
    navigate('/admin/login');
  };

  return (
    <SurveyLayout 
      title="Sistem Pakar VARK" 
      subtitle="Temukan gaya belajar yang paling sesuai untuk Anda"
    >
      <div className="max-w-md mx-auto">
        <div className="bg-indigo-50 p-6 rounded-lg mb-8 text-center">
          <h2 className="font-semibold text-lg mb-2">Selamat Datang di Sistem Pakar VARK</h2>
          <p className="text-gray-700">
            Sistem ini akan menganalisis gaya belajar Anda menggunakan model VARK:
            Visual, Auditori, dan Kinestetik. Anda akan menjawab 30 pertanyaan
            dengan pilihan Ya atau Tidak.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">Nama</Label>
            <Input
              id="name"
              type="text"
              placeholder="Masukkan nama Anda"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nim" className="text-base">NIM</Label>
            <Input
              id="nim"
              type="text"
              placeholder="Masukkan NIM Anda"
              value={localNim}
              onChange={(e) => setLocalNim(e.target.value)}
              className="h-12"
            />
          </div>

          <Button type="submit" className="w-full h-12 bg-vark-visual hover:bg-indigo-600">
            Mulai Survei
          </Button>
          
          {surveyHistory.length > 0 && (
            <Button 
              type="button" 
              variant="outline"
              onClick={handleHistory}
              className="w-full mt-2"
            >
              <History className="mr-2 h-4 w-4" />
              Lihat Riwayat Tes ({surveyHistory.length})
            </Button>
          )}
        </form>
        
        <div className="mt-8 text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleAdminLogin}
            className="text-gray-500 hover:text-gray-700"
          >
            <Shield className="mr-2 h-4 w-4" />
            Admin Login
          </Button>
        </div>
      </div>
    </SurveyLayout>
  );
};

export default WelcomePage;
