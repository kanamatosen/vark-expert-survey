import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import SurveyLayout from '@/components/SurveyLayout';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface SurveyResult {
  id: string;
  name: string;
  nim: string;
  visual_score: number;
  auditory_score: number;
  kinesthetic_score: number;
  dominant_style: string;
  timestamp: string;
}

const AdminHistoryPage = () => {
  const [results, setResults] = useState<SurveyResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const resultsPerPage = 10;
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  useEffect(() => {
    fetchResults();
  }, [currentPage]);

  const checkAuthAndFetchData = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single();
          
        if (profileData?.role === 'admin') {
          setIsLoggedIn(true);
        }
      }
      
      // Get total count for pagination
      const { count, error: countError } = await supabase
        .from('survey_results')
        .select('*', { count: 'exact', head: true });
        
      if (!countError && count !== null) {
        setTotalPages(Math.ceil(count / resultsPerPage));
      }
      
      // Fetch results whether logged in or not
      fetchResults();
    } catch (error) {
      console.error("Auth check error:", error);
      // Still fetch results regardless of auth error
      fetchResults();
    }
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      console.log(`Fetching page ${currentPage} of results`);
      
      // Calculate pagination
      const from = (currentPage - 1) * resultsPerPage;
      const to = from + resultsPerPage - 1;
      
      const { data, error } = await supabase
        .from('survey_results')
        .select('*')
        .order('timestamp', { ascending: false })
        .range(from, to);
        
      if (error) {
        throw error;
      }
      
      console.log(`Fetched ${data?.length || 0} results`);
      setResults(data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat data",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      // Clean up any auth tokens first
      Object.keys(localStorage).forEach(key => {
        if (key.includes('supabase.auth') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Then sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      toast({
        title: "Logout berhasil",
        description: "Anda telah keluar dari akun admin",
      });
      
      // Force a page reload to clear any cached state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal logout",
      });
    }
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
  
  const changePage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <SurveyLayout title="Panel Admin" subtitle="Riwayat Semua Hasil Tes VARK">
      <div className="mb-4 flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/')}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Button>
        
        {isLoggedIn && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Semua Hasil Tes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <p>Memuat data...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada data hasil tes.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Tanggal</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>NIM</TableHead>
                      <TableHead>Gaya Belajar</TableHead>
                      <TableHead className="text-right">Visual</TableHead>
                      <TableHead className="text-right">Auditori</TableHead>
                      <TableHead className="text-right">Kinestetik</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">
                          {result.timestamp ? 
                            format(parseISO(result.timestamp), 'dd MMMM yyyy, HH:mm', { locale: id }) 
                            : '-'}
                        </TableCell>
                        <TableCell>{result.name}</TableCell>
                        <TableCell>{result.nim}</TableCell>
                        <TableCell>{formatStyleName(result.dominant_style)}</TableCell>
                        <TableCell className="text-right">{result.visual_score}</TableCell>
                        <TableCell className="text-right">{result.auditory_score}</TableCell>
                        <TableCell className="text-right">{result.kinesthetic_score}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => changePage(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => changePage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => changePage(currentPage + 1)}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </SurveyLayout>
  );
};

export default AdminHistoryPage;
