
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import SurveyLayout from '@/components/SurveyLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ResultsChart from '@/components/ResultsChart';
import { UserData, LearningStyle } from '@/types/survey';
import { getLearningStyleDescription, getLearningStyleStrengths, getLearningStyleRecommendations } from '@/utils/expertSystem';

const ResultDetailPage = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<UserData | null>(null);
  const { resultId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchResultDetail = async () => {
      try {
        setLoading(true);
        
        // Check authentication status first
        const { data: authData } = await supabase.auth.getSession();
        if (!authData.session) {
          navigate('/admin/login');
          return;
        }

        // Fetch the profile to confirm admin status
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.session.user.id)
          .single();
          
        if (profileData?.role !== 'admin') {
          navigate('/');
          return;
        }

        // Fetch the survey result by ID
        const { data, error } = await supabase
          .from('survey_results')
          .select('*')
          .eq('id', resultId)
          .single();
          
        if (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Hasil survei tidak ditemukan",
          });
          navigate('/admin/history');
          return;
        }
        
        // Transform the data to match the UserData structure
        const userData: UserData = {
          name: data.name,
          nim: data.nim,
          timestamp: data.timestamp,
          results: {
            visual: data.visual_score,
            auditory: data.auditory_score,
            reading: 0, // Not used in this application
            kinesthetic: data.kinesthetic_score
          },
          dominantStyle: data.dominant_style as LearningStyle
        };
        
        setResult(userData);
      } catch (error) {
        console.error('Error fetching result detail:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat detail hasil",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResultDetail();
  }, [resultId, navigate, toast]);

  const handlePrint = () => {
    window.print();
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return format(parseISO(dateString), 'dd MMMM yyyy, HH:mm', { locale: id });
  };

  return (
    <SurveyLayout title="Detail Hasil Tes" subtitle={result ? `${result.name} - ${result.nim}` : 'Memuat...'}>
      <div className="mb-4 flex justify-between items-center print:hidden">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/admin/history')}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePrint}
          className="flex items-center gap-1"
        >
          <Printer className="h-4 w-4" />
          Cetak Hasil
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p>Memuat detail hasil...</p>
        </div>
      ) : !result ? (
        <div className="text-center py-8">
          <p>Hasil tidak ditemukan</p>
        </div>
      ) : (
        <div className="space-y-6 pb-8">
          {/* Header Information */}
          <Card className="print-section">
            <CardHeader>
              <CardTitle className="text-xl">
                Laporan Hasil Tes VARK
              </CardTitle>
              <CardDescription>
                Tanggal Tes: {formatDate(result.timestamp)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nama</p>
                  <p className="font-medium">{result.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">NIM</p>
                  <p className="font-medium">{result.nim}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Chart */}
          {result.results && (
            <Card className="print-section">
              <CardHeader>
                <CardTitle className="text-lg">Hasil Skor Gaya Belajar</CardTitle>
              </CardHeader>
              <CardContent>
                <ResultsChart results={result.results} />
                
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Visual</p>
                    <p className="text-2xl font-bold text-indigo-600">{result.results.visual}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Auditori</p>
                    <p className="text-2xl font-bold text-purple-600">{result.results.auditory}</p>
                  </div>
                  <div className="p-3 bg-pink-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Kinestetik</p>
                    <p className="text-2xl font-bold text-pink-600">{result.results.kinesthetic}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dominant Learning Style */}
          {result.dominantStyle && (
            <Card className="print-section">
              <CardHeader>
                <CardTitle className="text-lg">Gaya Belajar Dominan: {result.dominantStyle.charAt(0).toUpperCase() + result.dominantStyle.slice(1)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{getLearningStyleDescription(result.dominantStyle)}</p>
                
                <h3 className="font-semibold text-md mb-2">Kekuatan:</h3>
                <ul className="list-disc pl-5 mb-4 space-y-1">
                  {getLearningStyleStrengths(result.dominantStyle).map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
                
                <h3 className="font-semibold text-md mb-2">Rekomendasi Strategi Belajar:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {getLearningStyleRecommendations(result.dominantStyle).map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          
          <div className="print-only text-center text-xs text-gray-500 mt-8">
            <p>Dokumen ini dicetak dari Aplikasi Tes Gaya Belajar VARK</p>
            <p>© {new Date().getFullYear()} - Semua Hak Dilindungi</p>
          </div>
        </div>
      )}
    </SurveyLayout>
  );
};

export default ResultDetailPage;
