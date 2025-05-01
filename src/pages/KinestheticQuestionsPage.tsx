
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSurvey } from '@/contexts/SurveyContext';
import { questions } from '@/data/questions';
import QuestionCard from '@/components/QuestionCard';
import ProgressBar from '@/components/ProgressBar';
import SurveyLayout from '@/components/SurveyLayout';
import { useToast } from "@/components/ui/use-toast";

const KinestheticQuestionsPage = () => {
  const navigate = useNavigate();
  const { userData, calculateResults } = useSurvey();
  const { toast } = useToast();
  
  // Filter kinesthetic questions (21-30)
  const kinestheticQuestions = questions.filter(q => q.category === 'kinesthetic');
  
  // Check if all questions have been answered
  const allAnswered = kinestheticQuestions.every(q => userData.answers[q.id] !== undefined);
  
  useEffect(() => {
    // Ensure user has completed the auditory questions section first
    const auditoryQuestions = questions.filter(q => q.category === 'auditory');
    const auditoryQuestionsAnswered = auditoryQuestions.every(q => userData.answers[q.id] !== undefined);
    
    if (!auditoryQuestionsAnswered) {
      navigate('/survey/auditory');
    }
  }, [userData, navigate]);
  
  const handleFinish = () => {
    if (!allAnswered) {
      toast({
        title: "Mohon jawab semua pertanyaan",
        description: "Silakan jawab semua pertanyaan sebelum melanjutkan.",
        variant: "destructive",
      });
      return;
    }
    
    calculateResults();
    navigate('/results');
  };
  
  const handleBack = () => {
    navigate('/survey/auditory');
  };
  
  return (
    <SurveyLayout 
      title="Pertanyaan Kinestetik" 
      subtitle="Bagian 3 dari 3: Pertanyaan tentang gaya belajar kinestetik"
    >
      <ProgressBar currentPage={3} totalPages={3} />
      
      <div className="space-y-6">
        {kinestheticQuestions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}

        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={handleBack}
          >
            Kembali
          </Button>
          <Button 
            onClick={handleFinish}
            className="bg-vark-kinesthetic hover:bg-pink-600"
          >
            Selesai
          </Button>
        </div>
      </div>
    </SurveyLayout>
  );
};

export default KinestheticQuestionsPage;
