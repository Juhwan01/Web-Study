"use client";

import { useState, useEffect } from 'react';
import { TableGrid } from '@/components/tables/table-grid';
import { Table } from '@/types';
import { api } from '@/lib/axios';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTables = async () => {
    try {
      const { data } = await api.get<Table[]>('/tables/');
      setTables(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "에러",
        description: "테이블 정보를 불러오는데 실패했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleStatusChange = async (tableNumber: string, status: Table['status']) => {
    try {
      await api.patch(`/tables/${tableNumber}`, { status });
      await fetchTables(); // 테이블 정보 새로고침
      
      toast({
        title: "상태 변경 완료",
        description: `테이블 ${tableNumber}의 상태가 변경되었습니다.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "에러",
        description: "상태 변경에 실패했습니다.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">테이블 관리</h1>
      <TableGrid 
        tables={tables}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
