"use client";

import { useState, useEffect } from 'react';
import { TableGrid } from '@/components/tables/table-grid';
import { Table, MenuItem, OrderItem, TableUpdate} from '@/types';
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
import { TableForm } from '@/components/tables/table-form';

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
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
    }
  };

  const fetchMenuItems = async () => {
    try {
      const { data } = await api.get<MenuItem[]>('/menu/');
      setMenuItems(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "에러",
        description: "메뉴 정보를 불러오는데 실패했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([fetchTables(), fetchMenuItems()]);
  }, []);

  const handleStatusChange = async (tableNumber: number, status: string) => {
    try {
      // TableUpdate 인터페이스에 따라 요청 데이터 구성
      const updateData: TableUpdate = {
        status,
        current_order_id: null  // 또는 이 필드는 생략 가능 - Optional이므로
      };
  
      // URL에 table_number가 path parameter로 들어가야 함
      await api.patch(`/tables/${tableNumber}`, updateData);
      await fetchTables();
      
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

  const handleCreateOrder = async (tableId: number, items: OrderItem[]) => {
    try {
      // 주문 생성
      await api.post('/orders/', {
        table_id: tableId,
        items: items
      });
      
      // 약간의 딜레이를 주어 주문 생성이 완전히 처리되도록 함
      setTimeout(async () => {
        try {
          // 테이블 상태 변경
          await api.patch(`/tables/${tableId}`, { status: 'occupied' });
          await fetchTables();
        } catch (error) {
          // 테이블 상태 변경 실패는 조용히 처리
          console.log('테이블 상태 변경 실패:', error);
        }
      }, 500);
      
      toast({
        title: "주문 완료",
        description: "주문이 성공적으로 생성되었습니다.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "에러",
        description: "주문 생성에 실패했습니다.",
      });
    }
  };
  
  const handleCreateTable = async (data: { table_number: number; capacity: number }) => {
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
        menuItems={menuItems}
        onStatusChange={handleStatusChange}
        onCreateOrder={handleCreateOrder}
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
