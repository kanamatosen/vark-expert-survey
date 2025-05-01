
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSurvey } from '@/contexts/SurveyContext';
import SurveyLayout from '@/components/SurveyLayout';
import ResultsChart from '@/components/ResultsChart';
import { getLearningStyleDescription } from '@/utils/expertSystem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ResultsPage = () => {
  const { userData, resetSurvey } = useSurvey();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If results aren't calculated yet, redirect to the welcome page
    if (!userData.results || !userData.dominantStyle) {
      navigate('/');
    }
  }, [userData, navigate]);
  
  const handleRestart = () => {
    resetSurvey();
    navigate('/');
  };
  
  if (!userData.results || !userData.dominantStyle) {
    return null; // This will be handled by the useEffect redirect
  }
  
  const description = getLearningStyleDescription(userData.dominantStyle);
  
  return (
    <SurveyLayout title="Hasil Analisis Gaya Belajar">
      <div className="space-y-8">
        <div className="text-center mb-8">
          <p className="text-lg">
            <span className="font-bold">{userData.name}</span> ({userData.nim})
          </p>
        </div>
        
        <Card className="border-t-4" style={{ borderTopColor: getBorderColor(userData.dominantStyle) }}>
          <CardHeader>
            <CardTitle className="text-xl">Gaya Belajar Dominan: {getStyleName(userData.dominantStyle)}</CardTitle>
            <CardDescription>
              Berdasarkan jawaban Anda pada 30 pertanyaan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{description}</p>
          </CardContent>
        </Card>
        
        {userData.results && <ResultsChart results={userData.results} />}
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rincian Skor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="font-semibold text-vark-visual">Visual</p>
                <p className="text-2xl font-bold">{userData.results.visual}/10</p>
              </div>
              <div>
                <p className="font-semibold text-vark-auditory">Auditori</p>
                <p className="text-2xl font-bold">{userData.results.auditory}/10</p>
              </div>
              <div>
                <p className="font-semibold text-vark-kinesthetic">Kinestetik</p>
                <p className="text-2xl font-bold">{userData.results.kinesthetic}/10</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleRestart}
            className="px-8"
          >
            Mulai Survei Baru
          </Button>
        </div>
      </div>
    </SurveyLayout>
  );
};

// Helper functions
function getStyleName(style: string): string {
  switch (style) {
    case 'visual': return 'Visual';
    case 'auditory': return 'Auditori';
    case 'reading': return 'Membaca/Menulis';
    case 'kinesthetic': return 'Kinestetik';
    default: return 'Tidak Diketahui';
  }
}

function getBorderColor(style: string): string {
  switch (style) {
    case 'visual': return '#6366f1';
    case 'auditory': return '#8b5cf6';
    case 'reading': return '#a855f7';
    case 'kinesthetic': return '#d946ef';
    default: return '#6366f1';
  }
}

export default ResultsPage;
