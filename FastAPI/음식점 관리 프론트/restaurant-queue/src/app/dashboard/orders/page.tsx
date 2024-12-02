"use client";

import { useState, useEffect } from 'react';
import { OrderList } from '@/components/orders/order-list';
import { Order, MenuItem } from '@/types';
import { api } from '@/lib/axios';
import { useToast } from "@/components/ui/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      const { data } = await api.get<Order[]>('/orders/');
      setOrders(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "에러",
        description: "주문 목록을 불러오는데 실패했습니다.",
      });
    }
  };

  const fetchMenuItems = async () => {
    try {
      const { data } = await api.get<MenuItem[]>("/menu/");
      setMenuItems(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "에러",
        description: "메뉴 정보를 불러오는데 실패했습니다.",
      });
    }
  };

  const handleStatusChange = async (orderId: number, status: string) => {
    try {
      const updateData = {
        status,
        completed_at: ['paid', 'cancelled'].includes(status) ? 
          new Date().toISOString() : 
          null
      };

      await api.patch(`/orders/${orderId}`, updateData);
      await fetchOrders();  // 여기서 사용
      
      toast({
        title: "상태 변경 완료",
        description: `주문 #${orderId}의 상태가 변경되었습니다.`,
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        variant: "destructive",
        title: "에러",
        description: "상태 변경에 실패했습니다.",
      });
    }
  };

  useEffect(() => {
    Promise.all([fetchOrders(), fetchMenuItems()]).finally(() => {
      setIsLoading(false);
    });

    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const activeOrders = orders.filter(order => !['paid', 'cancelled'].includes(order.status));
  const completedOrders = orders.filter(order => ['paid', 'cancelled'].includes(order.status));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">주문 관리</h1>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">
            진행중 ({activeOrders.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            완료 ({completedOrders.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-4">
          <OrderList
            orders={activeOrders}
            menuItems={menuItems}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          <OrderList
            orders={completedOrders}
            menuItems={menuItems}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}