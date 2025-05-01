
import React, { useState, useEffect } from 'react';
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Filter auditory questions (11-20)
  const auditoryQuestions = questions.filter(q => q.category === 'auditory');
  
  // Current question
  const currentQuestion = auditoryQuestions[currentQuestionIndex];
  
  useEffect(() => {
    // Ensure user has completed the visual questions section first
    const visualQuestions = questions.filter(q => q.category === 'visual');
    const visualQuestionsAnswered = visualQuestions.every(q => userData.answers[q.id] !== undefined);
    
    if (!visualQuestionsAnswered) {
      navigate('/survey/visual');
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
    
    if (currentQuestionIndex < auditoryQuestions.length - 1) {
      // Go to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions in this section are answered, proceed to next section
      navigate('/survey/kinesthetic');
    }
  };
  
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      // Go back to previous question
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      // Return to visual section if on first question
      navigate('/survey/visual');
    }
  };
  
  return (
    <SurveyLayout 
      title="Pertanyaan Auditori"
      subtitle={`Pertanyaan ${currentQuestionIndex + 1} dari ${auditoryQuestions.length}`}
    >
      <ProgressBar currentPage={2} totalPages={3} />
      
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
            className="bg-vark-auditory hover:bg-purple-600"
          >
            {currentQuestionIndex < auditoryQuestions.length - 1 ? 'Selanjutnya' : 'Bagian Berikutnya'}
          </Button>
        </div>
      </div>
    </SurveyLayout>
  );
};

export default AuditoryQuestionsPage;
