// app/(dashboard)/tables/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { TableGrid } from '@/components/tables/table-grid';
import { TableForm } from '@/components/tables/table-form';
import { Table } from '@/types';
import { api } from '@/lib/axios';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const handleCreateTable = async (data: { table_number: string; capacity: number }) => {
    try {
      await api.post('/tables/', {
        ...data,
        status: 'available'
      });
      
      toast({
        title: "테이블 추가 완료",
        description: "새로운 테이블이 추가되었습니다.",
      });
      
      fetchTables();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "에러",
        description: "테이블 추가에 실패했습니다.",
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">테이블 관리</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          테이블 추가
        </Button>
      </div>

      <TableGrid 
        tables={tables}
        onStatusChange={handleStatusChange}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 테이블 추가</DialogTitle>
          </DialogHeader>
          <TableForm
            onSubmit={handleCreateTable}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}