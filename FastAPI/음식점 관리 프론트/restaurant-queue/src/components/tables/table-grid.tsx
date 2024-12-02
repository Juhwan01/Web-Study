// components/tables/table-grid.tsx
import { useState } from 'react';
import { Table, MenuItem, OrderItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderForm } from "@/components/orders/order-form";

interface TableGridProps {
  tables: Table[];
  menuItems: MenuItem[];
  onStatusChange: (tableNumber: number, status: string) => Promise<void>;
  onCreateOrder: (tableId: number, items: OrderItem[]) => Promise<void>;
}

export const TableGrid = ({ tables, menuItems, onStatusChange, onCreateOrder }: TableGridProps) => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'occupied':
        return 'bg-red-500';
      case 'reserved':
        return 'bg-yellow-500';
      case 'cleaning':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map((table) => (
          <Card key={table.table_number} className="relative">
            <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getStatusColor(table.status)}`} />
            <CardHeader>
              <CardTitle>테이블 {table.table_number}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>수용 인원: {table.capacity}명</p>
              <Badge className="mt-2">
                {table.status === 'available' && '이용 가능'}
                {table.status === 'occupied' && '사용중'}
                {table.status === 'reserved' && '예약됨'}
                {table.status === 'cleaning' && '청소중'}
              </Badge>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button 
                size="sm" 
                variant={table.status === 'available' ? 'default' : 'outline'}
                onClick={() => onStatusChange(table.table_number, 'available')}
              >
                비움
              </Button>
              <Button 
                size="sm" 
                variant={table.status === 'occupied' ? 'default' : 'outline'}
                onClick={() => onStatusChange(table.table_number, 'occupied')}
              >
                사용중
              </Button>
              <Button 
                size="sm" 
                variant={table.status === 'cleaning' ? 'default' : 'outline'}
                onClick={() => onStatusChange(table.table_number, 'cleaning')}
              >
                청소
              </Button>
              {table.status === 'occupied' && (
                <Button
                  size="sm"
                  onClick={() => setSelectedTable(table.table_number)}
                >
                  주문하기
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedTable && (
        <OrderForm
          tableId={selectedTable}
          menuItems={menuItems}
          isOpen={true}
          onClose={() => setSelectedTable(null)}
          onSubmit={(items) => onCreateOrder(selectedTable, items)}
        />
      )}
    </>
  );
};