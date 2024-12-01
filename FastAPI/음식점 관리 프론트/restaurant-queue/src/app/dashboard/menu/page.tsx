"use client";

import { useState, useEffect } from "react";
import { MenuList } from "@/components/menu/menu-list";
import { MenuForm } from "@/components/menu/menu-form";
import { MenuItem } from "@/types";
import { api } from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchMenuItems = async () => {
    try {
      const { data } = await api.get<MenuItem[]>("/menu/");
      setItems(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "에러",
        description: "메뉴 목록을 불러오는데 실패했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleSubmit = async (data: {
    name: string;
    price: number;
    category: string;
    description?: string;
  }) => {
    try {
      if (selectedItem) {
        await api.patch(`/menu/${selectedItem.menu_item_id}`, data);
        toast({
          title: "메뉴 수정 완료",
          description: "메뉴가 성공적으로 수정되었습니다.",
        });
      } else {
        await api.post("/menu/", data);
        toast({
          title: "메뉴 등록 완료",
          description: "새로운 메뉴가 등록되었습니다.",
        });
      }
      await fetchMenuItems();
      setIsDialogOpen(false);
      setSelectedItem(undefined);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "에러",
        description: "메뉴 저장에 실패했습니다.",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/menu/${id}`);
      await fetchMenuItems();
      toast({
        title: "메뉴 삭제 완료",
        description: "메뉴가 성공적으로 삭제되었습니다.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "에러",
        description: "메뉴 삭제에 실패했습니다.",
      });
    }
  };

  const handleEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
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
        <h1 className="text-2xl font-bold">메뉴 관리</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> 새 메뉴 추가
        </Button>
      </div>

      <MenuList
        items={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? "메뉴 수정" : "새 메뉴 추가"}
            </DialogTitle>
          </DialogHeader>
          <MenuForm
            initialData={selectedItem}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsDialogOpen(false);
              setSelectedItem(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}