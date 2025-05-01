
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSurvey } from '@/contexts/SurveyContext';
import { questions } from '@/data/questions';
import QuestionCard from '@/components/QuestionCard';
import ProgressBar from '@/components/ProgressBar';
import SurveyLayout from '@/components/SurveyLayout';
import { useToast } from "@/components/ui/use-toast";

const AuditoryQuestionsPage = () => {
  const navigate = useNavigate();
  const { userData } = useSurvey();
  const { toast } = useToast();
  
  // Filter auditory questions (11-20)
  const auditoryQuestions = questions.filter(q => q.category === 'auditory');
  
  // Check if all questions have been answered
  const allAnswered = auditoryQuestions.every(q => userData.answers[q.id] !== undefined);
  
  useEffect(() => {
    // Ensure user has completed the visual questions section first
    const visualQuestions = questions.filter(q => q.category === 'visual');
    const visualQuestionsAnswered = visualQuestions.every(q => userData.answers[q.id] !== undefined);
    
    if (!visualQuestionsAnswered) {
      navigate('/survey/visual');
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
    
    navigate('/survey/kinesthetic');
  };
  
  const handleBack = () => {
    navigate('/survey/visual');
  };
  
  return (
    <SurveyLayout 
      title="Pertanyaan Auditori" 
      subtitle="Bagian 2 dari 3: Pertanyaan tentang gaya belajar auditori"
    >
      <ProgressBar currentPage={2} totalPages={3} />
      
      <div className="space-y-6">
        {auditoryQuestions.map((question) => (
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
            onClick={handleNext}
            className="bg-vark-auditory hover:bg-purple-600"
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </SurveyLayout>
  );
};

export default AuditoryQuestionsPage;
