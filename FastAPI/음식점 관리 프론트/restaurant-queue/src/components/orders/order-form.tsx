import { FC, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MenuItem, OrderItem } from '@/types';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface OrderFormProps {
  tableId: number;
  menuItems: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (items: OrderItem[]) => Promise<void>;
}

interface OrderItemWithMenu extends OrderItem {
  name?: string;
}

export const OrderForm: FC<OrderFormProps> = ({
  tableId,
  menuItems,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [orderItems, setOrderItems] = useState<OrderItemWithMenu[]>([]);

  const addItem = (menuItem: MenuItem) => {
    const existingItem = orderItems.find(item => item.menu_item_id === menuItem.id);
    
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.menu_item_id === menuItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, {
        menu_item_id: menuItem.id,
        quantity: 1,
        notes: '',
        name: menuItem.name
      }]);
    }
  };

  const removeItem = (menuItemId: number) => {
    setOrderItems(orderItems.filter(item => item.menu_item_id !== menuItemId));
  };

  const updateQuantity = (menuItemId: number, change: number) => {
    setOrderItems(orderItems.map(item => {
      if (item.menu_item_id === menuItemId) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const updateNotes = (menuItemId: number, notes: string) => {
    setOrderItems(orderItems.map(item =>
      item.menu_item_id === menuItemId
        ? { ...item, notes }
        : item
    ));
  };

  const handleSubmit = async () => {
    // notes가 빈 문자열인 경우 undefined로 변환
    const items = orderItems.map(({ name, ...item }) => ({
      ...item,
      notes: item.notes?.trim() || ''
    }));
    await onSubmit(items);
    setOrderItems([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>테이블 {tableId} 주문</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="font-semibold">메뉴</h3>
            <div className="grid grid-cols-2 gap-2">
              {menuItems.map((menuItem) => (
                <Button
                  key={menuItem.id}
                  variant="outline"
                  onClick={() => addItem(menuItem)}
                  className="h-20 whitespace-normal text-left justify-start"
                >
                  <div>
                    <div>{menuItem.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {menuItem.price.toLocaleString()}원
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">주문 내역</h3>
            {orderItems.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                메뉴를 선택해주세요
              </div>
            ) : (
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.menu_item_id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>{item.name}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.menu_item_id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.menu_item_id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => removeItem(item.menu_item_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      placeholder="요청사항"
                      value={item.notes || ''}
                      onChange={(e) => updateNotes(item.menu_item_id, e.target.value)}
                      className="h-20"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={orderItems.length === 0}
          >
            주문하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};