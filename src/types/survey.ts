
export type LearningStyle = 'visual' | 'auditory' | 'reading' | 'kinesthetic';

export interface Question {
  id: number;
  text: string;
  category: LearningStyle;
}

export interface UserData {
  name: string;
  nim: string;
  answers?: Record<number, boolean>; // Making answers optional with ?
  results?: Record<LearningStyle, number>;
  dominantStyle?: LearningStyle;
  timestamp?: string;
}
