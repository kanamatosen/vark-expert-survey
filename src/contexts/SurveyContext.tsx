
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserData } from '../types/survey';
import { evaluateResults } from '../utils/expertSystem';

interface SurveyContextType {
  userData: UserData;
  setName: (name: string) => void;
  setNim: (nim: string) => void;
  setAnswer: (questionId: number, isYes: boolean) => void;
  calculateResults: () => void;
  resetSurvey: () => void;
}

const defaultUserData: UserData = {
  name: '',
  nim: '',
  answers: {},
};

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);

  const setName = (name: string) => {
    setUserData(prev => ({ ...prev, name }));
  };

  const setNim = (nim: string) => {
    setUserData(prev => ({ ...prev, nim }));
  };

  const setAnswer = (questionId: number, isYes: boolean) => {
    setUserData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: isYes
      }
    }));
  };

  const calculateResults = () => {
    const evaluatedData = evaluateResults(userData);
    setUserData(evaluatedData);
  };

  const resetSurvey = () => {
    setUserData(defaultUserData);
  };

  return (
    <SurveyContext.Provider 
      value={{ 
        userData, 
        setName, 
        setNim, 
        setAnswer,
        calculateResults,
        resetSurvey
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};
