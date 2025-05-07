import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSurvey } from '@/contexts/SurveyContext';
import SurveyLayout from '@/components/SurveyLayout';
import ResultsChart from '@/components/ResultsChart';
import { getLearningStyleDescription, getLearningStyleStrengths, getLearningStyleRecommendations } from '@/utils/expertSystem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Printer, History } from 'lucide-react';

const ResultsPage = () => {
  const { userData, resetSurvey, addToHistory } = useSurvey();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // If results aren't calculated yet, redirect to the welcome page
    if (!userData.results || !userData.dominantStyle) {
      navigate('/');
      return;
    }
    
    // Add current survey to history once results are viewed
    addToHistory();
  }, [userData, navigate, addToHistory]);
  
  const handleRestart = () => {
    resetSurvey();
    navigate('/');
  };

  const handleViewHistory = () => {
    navigate('/history');
  };
  
  const handlePrint = () => {
    const content = printRef.current;
    if (content) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Hasil Analisis Gaya Belajar - ${userData.name}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  max-width: 800px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  text-align: center;
                  margin-bottom: 30px;
                }
                .card {
                  border: 1px solid #ddd;
                  border-radius: 8px;
                  padding: 15px;
                  margin-bottom: 20px;
                }
                .card-title {
                  font-size: 18px;
                  font-weight: bold;
                  margin-bottom: 10px;
                }
                .scores {
                  display: flex;
                  justify-content: space-around;
                  margin: 20px 0;
                }
                .score-item {
                  text-align: center;
                }
                .score-value {
                  font-size: 24px;
                  font-weight: bold;
                }
                h1 { font-size: 24px; margin-bottom: 5px; }
                h2 { font-size: 20px; margin-bottom: 10px; }
                h3 { font-size: 18px; margin-top: 20px; }
                p { margin-bottom: 15px; }
                ul { padding-left: 20px; }
                li { margin-bottom: 5px; }
                .footer {
                  margin-top: 30px;
                  text-align: center;
                  font-size: 12px;
                  color: #666;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Hasil Analisis Gaya Belajar VARK</h1>
                <p><strong>${userData.name}</strong> (${userData.nim})</p>
                <p>${new Date().toLocaleDateString('id-ID')}</p>
              </div>
              
              <div class="card">
                <div class="card-title">Gaya Belajar Dominan: ${getStyleName(userData.dominantStyle!)}</div>
                <p>${getLearningStyleDescription(userData.dominantStyle!)}</p>
                
                <h3>Kekuatan Gaya Belajar Anda:</h3>
                <ul>
                  ${getLearningStyleStrengths(userData.dominantStyle!).map(strength => `<li>${strength}</li>`).join('')}
                </ul>
                
                <h3>Rekomendasi Metode Belajar:</h3>
                <ul>
                  ${getLearningStyleRecommendations(userData.dominantStyle!).map(rec => `<li>${rec}</li>`).join('')}
                </ul>
              </div>
              
              <div class="scores">
                <div class="score-item">
                  <p>Visual</p>
                  <p class="score-value">${userData.results!.visual}/10</p>
                </div>
                <div class="score-item">
                  <p>Auditori</p>
                  <p class="score-value">${userData.results!.auditory}/10</p>
                </div>
                <div class="score-item">
                  <p>Kinestetik</p>
                  <p class="score-value">${userData.results!.kinesthetic}/10</p>
                </div>
              </div>
              
              <div class="footer">
                &copy; ${new Date().getFullYear()} VARK Learning Style Expert System
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  };
  
  if (!userData.results || !userData.dominantStyle) {
    return null; // This will be handled by the useEffect redirect
  }
  
  const description = getLearningStyleDescription(userData.dominantStyle);
  const strengths = getLearningStyleStrengths(userData.dominantStyle);
  const recommendations = getLearningStyleRecommendations(userData.dominantStyle);
  
  return (
    <SurveyLayout title="Hasil Analisis Gaya Belajar">
      <div className="space-y-8" ref={printRef}>
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
            <p className="text-gray-700 mb-4">{description}</p>
            
            <h3 className="font-semibold text-lg mt-4 mb-2">Mengapa Anda Cocok dengan Gaya Belajar Ini:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {strengths.map((strength, index) => (
                <li key={index} className="text-gray-700">{strength}</li>
              ))}
            </ul>
            
            <h3 className="font-semibold text-lg mt-4 mb-2">Rekomendasi Metode Belajar:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="text-gray-700">{recommendation}</li>
              ))}
            </ul>
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
        
        <div className="flex justify-center gap-4 mt-8">
          <Button 
            onClick={handleRestart}
            className="px-8"
          >
            Mulai Survei Baru
          </Button>
          <Button 
            onClick={handlePrint}
            className="px-8 bg-blue-600 hover:bg-blue-700"
          >
            <Printer className="mr-2 h-4 w-4" />
            Cetak Hasil
          </Button>
          <Button 
            onClick={handleViewHistory}
            className="px-8 bg-gray-600 hover:bg-gray-700"
          >
            <History className="mr-2 h-4 w-4" />
            Lihat Riwayat
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
