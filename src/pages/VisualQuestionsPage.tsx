
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSurvey } from '@/contexts/SurveyContext';
import { questions } from '@/data/questions';
import QuestionCard from '@/components/QuestionCard';
import ProgressBar from '@/components/ProgressBar';
import SurveyLayout from '@/components/SurveyLayout';
import { useToast } from "@/components/ui/use-toast";

const VisualQuestionsPage = () => {
  const navigate = useNavigate();
  const { userData } = useSurvey();
  const { toast } = useToast();
  
  // Filter visual questions (1-10)
  const visualQuestions = questions.filter(q => q.category === 'visual');
  
  // Check if all questions have been answered
  const allAnswered = visualQuestions.every(q => userData.answers[q.id] !== undefined);
  
  useEffect(() => {
    // If user hasn't entered name and NIM, redirect to welcome page
    if (!userData.name || !userData.nim) {
      navigate('/');
    }
  }, [userData, navigate]);
  
  const handleNext = () => {
    if (!allAnswered) {
      toast({
        title: "Mohon jawab semua pertanyaan",
        description: "Silakan jawab semua pertanyaan sebelum melanjutkan.",
        variant: "destructive",
      });
      return;
    }
    
    navigate('/survey/auditory');
  };
  
  return (
    <SurveyLayout 
      title="Pertanyaan Visual"
      subtitle="Bagian 1 dari 3: Pertanyaan tentang gaya belajar visual"
    >
      <ProgressBar currentPage={1} totalPages={3} />
      
      <div className="space-y-6">
        {visualQuestions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}

        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Kembali
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-vark-visual hover:bg-indigo-600"
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </SurveyLayout>
  );
};

export default VisualQuestionsPage;
