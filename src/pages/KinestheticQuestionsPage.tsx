
import React, { useState, useEffect } from 'react';
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Filter kinesthetic questions (21-30)
  const kinestheticQuestions = questions.filter(q => q.category === 'kinesthetic');
  
  // Current question
  const currentQuestion = kinestheticQuestions[currentQuestionIndex];
  
  useEffect(() => {
    // Ensure user has completed the auditory questions section first
    const auditoryQuestions = questions.filter(q => q.category === 'auditory');
    const auditoryQuestionsAnswered = auditoryQuestions.every(q => userData.answers[q.id] !== undefined);
    
    if (!auditoryQuestionsAnswered) {
      navigate('/survey/auditory');
    }
  }, [userData, navigate]);
  
  const handleFinish = () => {
    // Check if current question is answered
    if (userData.answers[currentQuestion.id] === undefined) {
      toast({
        title: "Mohon jawab pertanyaan",
        description: "Silakan jawab pertanyaan sebelum melanjutkan.",
        variant: "destructive",
      });
      return;
    }
    
    calculateResults();
    navigate('/results');
  };
  
  const handleNext = () => {
    // Check if current question is answered
    if (userData.answers[currentQuestion.id] === undefined) {
      toast({
        title: "Mohon jawab pertanyaan",
        description: "Silakan jawab pertanyaan sebelum melanjutkan.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentQuestionIndex < kinestheticQuestions.length - 1) {
      // Go to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions in this section are answered, calculate results and go to results page
      calculateResults();
      navigate('/results');
    }
  };
  
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      // Go back to previous question
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      // Return to auditory section if on first question
      navigate('/survey/auditory');
    }
  };
  
  return (
    <SurveyLayout 
      title="Pertanyaan Kinestetik"
      subtitle={`Pertanyaan ${currentQuestionIndex + 1} dari ${kinestheticQuestions.length}`}
    >
      <ProgressBar currentPage={3} totalPages={3} />
      
      <div className="space-y-6">
        <QuestionCard key={currentQuestion.id} question={currentQuestion} />

        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={handleBack}
          >
            Kembali
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-vark-kinesthetic hover:bg-pink-600"
          >
            {currentQuestionIndex < kinestheticQuestions.length - 1 ? 'Selanjutnya' : 'Selesai'}
          </Button>
        </div>
      </div>
    </SurveyLayout>
  );
};

export default KinestheticQuestionsPage;
