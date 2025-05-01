
import React, { useState, useEffect } from 'react';
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Filter visual questions (1-10)
  const visualQuestions = questions.filter(q => q.category === 'visual');
  
  // Current question
  const currentQuestion = visualQuestions[currentQuestionIndex];
  
  // Progress within this section
  const visualProgress = ((currentQuestionIndex + 1) / visualQuestions.length);
  
  useEffect(() => {
    // If user hasn't entered name and NIM, redirect to welcome page
    if (!userData.name || !userData.nim) {
      navigate('/');
    }
  }, [userData, navigate]);
  
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
    
    if (currentQuestionIndex < visualQuestions.length - 1) {
      // Go to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions in this section are answered, proceed to next section
      navigate('/survey/auditory');
    }
  };
  
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      // Go back to previous question
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      // Return to welcome page if on first question
      navigate('/');
    }
  };
  
  return (
    <SurveyLayout 
      title="Pertanyaan Visual"
      subtitle={`Pertanyaan ${currentQuestionIndex + 1} dari ${visualQuestions.length}`}
    >
      <ProgressBar currentPage={1} totalPages={3} />
      
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
            className="bg-vark-visual hover:bg-indigo-600"
          >
            {currentQuestionIndex < visualQuestions.length - 1 ? 'Selanjutnya' : 'Bagian Berikutnya'}
          </Button>
        </div>
      </div>
    </SurveyLayout>
  );
};

export default VisualQuestionsPage;
