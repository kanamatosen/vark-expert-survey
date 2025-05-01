
import React from 'react';
import { Question } from '../types/survey';
import { Button } from '@/components/ui/button';
import { useSurvey } from '@/contexts/SurveyContext';

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const { userData, setAnswer } = useSurvey();
  const answer = userData.answers[question.id];
  
  return (
    <div className="border rounded-lg p-6 mb-4 bg-white shadow-sm">
      <p className="font-medium text-lg mb-4">{question.text}</p>
      
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
