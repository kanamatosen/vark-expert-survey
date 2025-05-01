
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
      return "Anda merupakan pembelajar visual. Anda belajar paling baik melalui gambar, diagram, dan visualisasi. Gaya belajar ini memanfaatkan indera penglihatan untuk menyerap informasi. Otak Anda memproses informasi visual lebih efektif dibandingkan bentuk informasi lainnya.";
    case 'auditory':
      return "Anda merupakan pembelajar auditori. Anda belajar paling baik melalui mendengarkan dan berbicara. Gaya belajar ini mengandalkan indera pendengaran untuk memahami dan mengingat informasi. Anda cenderung mampu menangkap nuansa dalam pembicaraan dan diskusi lisan.";
    case 'reading':
      return "Anda merupakan pembelajar yang suka membaca dan menulis. Anda belajar paling baik melalui kata-kata tertulis. Gaya belajar ini bergantung pada mengolah informasi melalui teks, baik membaca maupun menulis. Anda memiliki kemampuan yang baik dalam mengekspresikan diri melalui tulisan.";
    case 'kinesthetic':
      return "Anda merupakan pembelajar kinestetik. Anda belajar paling baik melalui gerakan, sentuhan, dan aktivitas praktis. Gaya belajar ini menggunakan sensasi fisik dan pengalaman praktis untuk memahami konsep. Anda cenderung mengingat lebih baik ketika terlibat langsung dalam suatu kegiatan.";
  }
}

export function getLearningStyleStrengths(style: LearningStyle): string[] {
  switch (style) {
    case 'visual':
      return [
        "Anda sangat baik dalam memahami dan mengingat informasi melalui gambar, diagram, dan video",
        "Anda memiliki kemampuan visualisasi yang kuat dan dapat membayangkan konsep secara mental",
        "Anda mampu mengenali pola visual dan hubungan spasial dengan baik",
        "Anda mudah mengingat wajah, lokasi, dan pengaturan visual",
        "Anda cenderung memiliki kemampuan yang baik dalam seni visual dan desain"
      ];
    case 'auditory':
      return [
        "Anda sangat baik dalam memahami informasi melalui penjelasan lisan dan diskusi",
        "Anda memiliki kemampuan mendengarkan yang kuat dan dapat mengingat apa yang Anda dengar",
        "Anda dapat mengenali nada, ritme, dan nuansa dalam suara",
        "Anda mampu mengikuti instruksi verbal dengan baik",
        "Anda cenderung memiliki keterampilan komunikasi verbal yang baik"
      ];
    case 'reading':
      return [
        "Anda sangat baik dalam memahami dan mengingat informasi tertulis",
        "Anda mampu mengekspresikan diri dengan jelas melalui tulisan",
        "Anda dapat mengorganisir pikiran dengan baik melalui catatan tertulis",
        "Anda memiliki kemampuan yang baik dalam menganalisis teks",
        "Anda menghargai struktur dan format yang terorganisir dalam belajar"
      ];
    case 'kinesthetic':
      return [
        "Anda sangat baik dalam belajar melalui pengalaman langsung dan praktik",
        "Anda memiliki koordinasi fisik dan keterampilan motorik yang baik",
        "Anda mampu mengingat apa yang Anda lakukan lebih baik daripada yang Anda lihat atau dengar",
        "Anda dapat menangkap nuansa praktis dari konsep abstrak",
        "Anda cenderung memiliki energi tinggi dan menikmati aktivitas fisik"
      ];
  }
}

export function getLearningStyleRecommendations(style: LearningStyle): string[] {
  switch (style) {
    case 'visual':
      return [
        "Gunakan peta pikiran dan diagram alur untuk merangkum informasi",
        "Tandai teks dengan warna berbeda untuk menyoroti informasi penting",
        "Gunakan flashcard dengan gambar dan simbol visual",
        "Tonton video tutorial dan presentasi visual",
        "Gambar konsep atau teori untuk membantu pemahaman",
        "Duduk di bagian depan kelas untuk melihat dengan jelas",
        "Visualisasikan informasi dalam pikiran Anda sebagai gambar atau film"
      ];
    case 'auditory':
      return [
        "Rekam kuliah dan dengarkan kembali saat belajar",
        "Bergabunglah dalam kelompok diskusi untuk membahas materi",
        "Jelaskan konsep secara verbal kepada orang lain",
        "Baca teks dengan suara keras untuk meningkatkan pemahaman",
        "Gunakan mnemonic dan rima untuk mengingat informasi",
        "Dengarkan podcast atau audiobook yang relevan dengan materi",
        "Hindari lingkungan bising saat belajar"
      ];
    case 'reading':
      return [
        "Buatlah catatan tertulis yang terstruktur dan rapi",
        "Tuliskan kembali konsep utama dengan kata-kata Anda sendiri",
        "Buat daftar periksa dan langkah-langkah tertulis",
        "Gunakan kamus dan sumber referensi tertulis",
        "Tulis rangkuman setelah membaca atau mendengarkan kuliah",
        "Terjemahkan diagram dan grafik menjadi deskripsi tertulis",
        "Praktikkan menulis jawaban untuk ujian"
      ];
    case 'kinesthetic':
      return [
        "Lakukan eksperimen dan aktivitas praktis terkait materi",
        "Gunakan model fisik atau objek nyata untuk belajar",
        "Ambil istirahat singkat dan bergerak saat belajar dalam waktu lama",
        "Mainkan peran atau simulasikan konsep yang dipelajari",
        "Belajar di lingkungan yang memungkinkan Anda bergerak bebas",
        "Gunakan gerakan tangan atau tubuh saat menjelaskan konsep",
        "Terapkan konsep yang dipelajari dalam situasi dunia nyata"
      ];
  }
}
