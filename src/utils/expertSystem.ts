import { LearningStyle, UserData } from "../types/survey";

export function evaluateResults(userData: UserData): UserData {
  const results: Record<LearningStyle, number> = {
    visual: 0,
    auditory: 0,
    reading: 0,
    kinesthetic: 0
  };
  
  // Count YES answers for each category
  Object.entries(userData.answers).forEach(([questionId, isYes]) => {
    const id = parseInt(questionId);
    
    if (isYes) {
      // Visual questions: 1-10
      if (id >= 1 && id <= 10) {
        results.visual += 1;
      } 
      // Auditory questions: 11-20
      else if (id >= 11 && id <= 20) {
        results.auditory += 1;
      }
      // Kinesthetic questions: 21-30
      else if (id >= 21 && id <= 30) {
        results.kinesthetic += 1;
      }
    }
  });
  
  // Forward chaining to determine dominant style
  // Rule: IF count(style) is highest THEN dominantStyle = style
  let dominantStyle: LearningStyle = 'visual';
  let maxScore = results.visual;
  
  if (results.auditory > maxScore) {
    dominantStyle = 'auditory';
    maxScore = results.auditory;
  }
  
  // We don't have "reading" questions in our implementation but keeping the type for future expansion
  
  if (results.kinesthetic > maxScore) {
    dominantStyle = 'kinesthetic';
    maxScore = results.kinesthetic;
  }
  
  return {
    ...userData,
    results,
    dominantStyle
  };
}

export function getLearningStyleDescription(style: LearningStyle): string {
  switch (style) {
    case 'visual':
      return "Anda merupakan pembelajar visual. Anda belajar paling baik melalui gambar, diagram, dan visualisasi. Untuk meningkatkan pembelajaran, gunakan peta pikiran, diagram, grafik, dan video dalam belajar.";
    case 'auditory':
      return "Anda merupakan pembelajar auditori. Anda belajar paling baik melalui mendengarkan dan berbicara. Untuk meningkatkan pembelajaran, ikuti diskusi kelompok, dengarkan rekaman, dan jelaskan konsep secara lisan.";
    case 'reading':
      return "Anda merupakan pembelajar yang suka membaca dan menulis. Anda belajar paling baik melalui kata-kata tertulis. Untuk meningkatkan pembelajaran, buatlah catatan tertulis, baca buku teks, dan tulis ulang konsep penting.";
    case 'kinesthetic':
      return "Anda merupakan pembelajar kinestetik. Anda belajar paling baik melalui gerakan dan aktivitas praktis. Untuk meningkatkan pembelajaran, lakukan eksperimen, mainkan peran, dan gunakan model fisik dalam belajar.";
  }
}
