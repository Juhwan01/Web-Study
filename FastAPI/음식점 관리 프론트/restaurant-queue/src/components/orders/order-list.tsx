import { FC } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Order, MenuItem } from "@/types";

interface OrderListProps {
  orders: Order[];
  menuItems: MenuItem[];
  onStatusChange: (orderId: number, status: string) => Promise<void>;
}

export const OrderList: FC<OrderListProps> = ({ orders, menuItems, onStatusChange }) => {
  const getMenuItemName = (menuItemId: number) => {
    return menuItems.find(item => item.id === menuItemId)?.name || '알 수 없는 메뉴';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'pending': 'default',
      'preparing': 'warning',
      'ready': 'success',
      'served': 'secondary',
      'paid': 'outline'
    } as const;

    const labels = {
      'pending': '대기중',
      'preparing': '준비중',
      'ready': '준비완료',
      'served': '서빙완료',
      'paid': '결제완료'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>주문번호</TableHead>
            <TableHead>테이블</TableHead>
            <TableHead>메뉴</TableHead>
            <TableHead>총액</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>주문시간</TableHead>
            <TableHead className="text-right">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>#{order.id}</TableCell>
              <TableCell>테이블 {order.table_id}</TableCell>
              <TableCell>
                <ul className="list-disc list-inside">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {getMenuItemName(item.menu_item_id)} x {item.quantity}
                      {item.notes && <span className="text-gray-500 text-sm"> ({item.notes})</span>}
                    </li>
                  ))}
                </ul>
              </TableCell>
              <TableCell>{order.total_amount.toLocaleString()}원</TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell>{new Date(order.created_at).toLocaleTimeString()}</TableCell>
              <TableCell className="text-right">
                <div className="space-x-2">
                  {order.status === 'pending' && (
                    <Button 
                      size="sm"
                      onClick={() => onStatusChange(order.id, 'preparing')}
                    >
                      준비시작
                    </Button>
                  )}
                  {order.status === 'preparing' && (
                    <Button 
                      size="sm"
                      onClick={() => onStatusChange(order.id, 'ready')}
                    >
                      준비완료
                    </Button>
                  )}
                  {order.status === 'ready' && (
                    <Button 
                      size="sm"
                      onClick={() => onStatusChange(order.id, 'served')}
                    >
                      서빙완료
                    </Button>
                  )}
                  {order.status === 'served' && (
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => onStatusChange(order.id, 'paid')}
                    >
                      결제완료
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
