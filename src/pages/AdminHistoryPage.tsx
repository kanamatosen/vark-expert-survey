
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import SurveyLayout from '@/components/SurveyLayout';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SurveyResult {
  id: string;
  name: string;
  nim: string;
  visual_score: number;
  auditory_score: number;
  kinesthetic_score: number;
  dominant_style: string;
  timestamp: string;
}

const AdminHistoryPage = () => {
  const [results, setResults] = useState<SurveyResult[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/admin');
        return;
      }
      
      fetchResults();
    };
    
    checkSession();
  }, [navigate]);

  const fetchResults = async () => {
    try {
      const { data, error } = await supabase
        .from('survey_results')
        .select('*')
        .order('timestamp', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setResults(data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat data",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout berhasil",
      description: "Anda telah keluar dari akun admin",
    });
    navigate('/');
  };

  // Helper function to format learning style name
  const formatStyleName = (style?: string) => {
    switch (style) {
      case 'visual': return 'Visual';
      case 'auditory': return 'Auditori';
      case 'reading': return 'Membaca';
      case 'kinesthetic': return 'Kinestetik';
      default: return '-';
    }
  };

  return (
    <SurveyLayout title="Panel Admin" subtitle="Riwayat Semua Hasil Tes VARK">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex justify-between items-center">
            <span>Semua Hasil Tes</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <p>Memuat data...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada data hasil tes.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Tanggal</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>NIM</TableHead>
                    <TableHead>Gaya Belajar</TableHead>
                    <TableHead className="text-right">Visual</TableHead>
                    <TableHead className="text-right">Auditori</TableHead>
                    <TableHead className="text-right">Kinestetik</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">
                        {result.timestamp ? 
                          format(parseISO(result.timestamp), 'dd MMMM yyyy, HH:mm', { locale: id }) 
                          : '-'}
                      </TableCell>
                      <TableCell>{result.name}</TableCell>
                      <TableCell>{result.nim}</TableCell>
                      <TableCell>{formatStyleName(result.dominant_style)}</TableCell>
                      <TableCell className="text-right">{result.visual_score}</TableCell>
                      <TableCell className="text-right">{result.auditory_score}</TableCell>
                      <TableCell className="text-right">{result.kinesthetic_score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </SurveyLayout>
  );
};

export default AdminHistoryPage;
