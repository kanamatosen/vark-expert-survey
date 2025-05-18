
import React from 'react';
import { Question } from '../types/survey';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react'; 
import { useSurvey } from '@/contexts/SurveyContext';

interface QuestionCardProps {
  question: Question;
}

// Helper function to get explanations for questions
const getQuestionExplanation = (category: string): string => {
  switch (category) {
    case 'visual':
      return 'Pertanyaan ini mengevaluasi kecenderungan belajar visual Anda - kemampuan untuk belajar dengan melihat (diagram, gambar, video).';
    case 'auditory':
      return 'Pertanyaan ini mengevaluasi kecenderungan belajar auditori Anda - kemampuan untuk belajar dengan mendengarkan (diskusi, ceramah, audio).';
    case 'kinesthetic':
      return 'Pertanyaan ini mengevaluasi kecenderungan belajar kinestetik Anda - kemampuan untuk belajar dengan melakukan (praktik, gerakan fisik, eksperimen).';
    default:
      return 'Pertanyaan ini mengevaluasi preferensi gaya belajar Anda.';
  }
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const { userData, setAnswer } = useSurvey();
  const answer = userData.answers[question.id];
  
  return (
    <div className="border rounded-lg p-6 mb-4 bg-white shadow-sm">
      <p className="font-medium text-lg mb-4">{question.text}</p>
      
      <Alert className="mb-4 bg-blue-50">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-sm text-blue-700 ml-2">
          {getQuestionExplanation(question.category)}
        </AlertDescription>
      </Alert>
      
      <div className="flex space-x-4 justify-center mt-4">
        <Button 
          variant={answer === true ? "default" : "outline"} 
          onClick={() => setAnswer(question.id, true)}
          className={answer === true ? "bg-green-600 hover:bg-green-700" : ""}
        >
          Ya
        </Button>
        <Button 
          variant={answer === false ? "default" : "outline"} 
          onClick={() => setAnswer(question.id, false)}
          className={answer === false ? "bg-red-600 hover:bg-red-700" : ""}
        >
          Tidak
        </Button>
      </div>
    </div>
  );
};

export default QuestionCard;
