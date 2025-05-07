
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { useSurvey } from '@/contexts/SurveyContext';
import SurveyLayout from '@/components/SurveyLayout';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';

const HistoryPage = () => {
  const { surveyHistory, clearHistory } = useSurvey();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBack = () => {
    navigate('/');
  };

  const handleClearHistory = () => {
    clearHistory();
    toast({
      title: "Riwayat dihapus",
      description: "Semua data riwayat tes telah dihapus.",
    });
  };

  // Helper function to format learning style name
  const formatStyleName = (style?: string) => {
    switch (style) {
      case 'visual': return 'Visual';
      case 'auditory': return 'Auditori';
      case 'reading': return 'Membaca';
      case 'kinesthetic': return 'Kinestetik';
      default: return '-';
    }
  };

  return (
    <SurveyLayout title="Riwayat Analisis VARK" subtitle="Daftar hasil tes sebelumnya">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex justify-between items-center">
            <span>Riwayat Tes</span>
            {surveyHistory.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">Hapus Semua</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus semua riwayat?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini tidak dapat dibatalkan. Semua data riwayat tes akan dihapus secara permanen.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearHistory}>Hapus</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {surveyHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada riwayat tes yang tersimpan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Tanggal</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>NIM</TableHead>
                    <TableHead>Gaya Belajar</TableHead>
                    <TableHead className="text-right">Skor</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {surveyHistory.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {entry.timestamp ? 
                          format(parseISO(entry.timestamp), 'dd MMMM yyyy, HH:mm', { locale: id }) 
                          : '-'}
                      </TableCell>
                      <TableCell>{entry.name}</TableCell>
                      <TableCell>{entry.nim}</TableCell>
                      <TableCell>{formatStyleName(entry.dominantStyle)}</TableCell>
                      <TableCell className="text-right">
                        {entry.results ? (
                          <>
                            V: {entry.results.visual}, 
                            A: {entry.results.auditory}, 
                            K: {entry.results.kinesthetic}
                          </>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate('/results')}
                          disabled={!entry.results}
                        >
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          <div className="mt-6 flex justify-center">
            <Button onClick={handleBack}>
              Kembali ke Halaman Utama
            </Button>
          </div>
        </CardContent>
      </Card>
    </SurveyLayout>
  );
};

export default HistoryPage;
