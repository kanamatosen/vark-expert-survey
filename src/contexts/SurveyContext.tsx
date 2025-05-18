
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserData } from '../types/survey';
import { evaluateResults } from '../utils/expertSystem';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SurveyContextType {
  userData: UserData;
  setName: (name: string) => void;
  setNim: (nim: string) => void;
  setAnswer: (questionId: number, isYes: boolean) => void;
  calculateResults: () => void;
  resetSurvey: () => void;
  surveyHistory: UserData[];
  addToHistory: () => void;
  clearHistory: () => void;
  viewHistoryItem: (index: number) => void;
  isSubmitting: boolean;
}

const defaultUserData: UserData = {
  name: '',
  nim: '',
  answers: {},
};

// Function to load history from localStorage
const loadHistory = (): UserData[] => {
  const savedHistory = localStorage.getItem('vark-survey-history');
  return savedHistory ? JSON.parse(savedHistory) : [];
};

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [surveyHistory, setSurveyHistory] = useState<UserData[]>(loadHistory);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('vark-survey-history', JSON.stringify(surveyHistory));
  }, [surveyHistory]);

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

  const addToHistory = async () => {
    // Only add to history if we have results and it's not empty
    if (userData.results && userData.dominantStyle) {
      setIsSubmitting(true);
      try {
        // Check if this entry is already in history based on timestamp
        const existingEntry = surveyHistory.find(entry => 
          entry.name === userData.name && 
          entry.nim === userData.nim &&
          entry.timestamp && 
          (new Date().getTime() - new Date(entry.timestamp).getTime() < 5000) // Within 5 seconds
        );
        
        if (!existingEntry) {
          // Add timestamp to the survey result
          const surveyWithTimestamp = {
            ...userData,
            timestamp: new Date().toISOString()
          };
          
          // Add to local history
          setSurveyHistory(prev => [surveyWithTimestamp, ...prev]);
          
          // Save to Supabase
          if (userData.results) {
            const { error } = await supabase.from('survey_results').insert({
              name: userData.name,
              nim: userData.nim,
              visual_score: userData.results.visual,
              auditory_score: userData.results.auditory,
              kinesthetic_score: userData.results.kinesthetic,
              dominant_style: userData.dominantStyle
            });
            
            if (error) {
              console.error("Error saving to Supabase:", error);
            } else {
              // Show success toast message
              toast({
                title: "Terima Kasih!",
                description: "Data Anda aman bersama kami. Hasil tes gaya belajar Anda telah tersimpan.",
                duration: 5000,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error saving survey result:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const clearHistory = () => {
    setSurveyHistory([]);
  };
  
  // New function to view a specific history item
  const viewHistoryItem = (index: number) => {
    if (index >= 0 && index < surveyHistory.length) {
      const historyItem = surveyHistory[index];
      setUserData(historyItem);
    }
  };

  return (
    <SurveyContext.Provider 
      value={{ 
        userData, 
        setName, 
        setNim, 
        setAnswer,
        calculateResults,
        resetSurvey,
        surveyHistory,
        addToHistory,
        clearHistory,
        viewHistoryItem,
        isSubmitting
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
