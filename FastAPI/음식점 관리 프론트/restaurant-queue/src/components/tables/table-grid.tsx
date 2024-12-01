import { Table } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TableGridProps {
  tables: Table[];
  onStatusChange: (tableNumber: string, status: Table['status']) => void;
}

export const TableGrid = ({ tables, onStatusChange }: TableGridProps) => {
  const getStatusColor = (status: Table['status']) => {
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
              onClick={() => onStatusChange(table.table_number 'occupied')}
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
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};