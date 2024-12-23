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
import { Queue } from "@/types";

interface QueueListProps {
  queues: Queue[];
  onStatusChange: (queueNumber: string, status: string) => Promise<void>;
}

export const QueueList: FC<QueueListProps> = ({ queues, onStatusChange }) => {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>대기번호</TableHead>
            <TableHead>고객명</TableHead>
            <TableHead>인원</TableHead>
            <TableHead>대기시간</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>등록시간</TableHead>
            <TableHead className="text-right">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queues.map((queue) => (
            <TableRow key={queue.queue_number}>
              <TableCell className="font-medium">
                {queue.queue_number}
              </TableCell>
              <TableCell>{queue.customer_name}</TableCell>
              <TableCell>{queue.party_size}명</TableCell>
              <TableCell>{queue.estimated_wait_time}분</TableCell>
              <TableCell>
                <Badge
                  variant={
                    queue.status === 'waiting' ? 'default' :
                    queue.status === 'called' ? 'secondary' :
                    queue.status === 'seated' ? 'success' : 'destructive'
                  }
                >
                  {
                    queue.status === 'waiting' ? '대기중' :
                    queue.status === 'called' ? '호출됨' :
                    queue.status === 'seated' ? '착석' : '취소됨'
                  }
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(queue.created_at).toLocaleTimeString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {queue.status === 'waiting' && (
                    <Button 
                      size="sm" 
                      onClick={() => onStatusChange(queue.queue_number, 'called')}
                    >
                      호출
                    </Button>
                  )}
                  {queue.status === 'called' && (
                    <Button 
                      size="sm"
                      variant="success"
                      onClick={() => onStatusChange(queue.queue_number, 'seated')}
                    >
                      착석
                    </Button>
                  )}
                  {queue.status === 'waiting' && (
                    <Button 
                      size="sm"
                      variant="destructive"
                      onClick={() => onStatusChange(queue.queue_number, 'cancelled')}
                    >
                      취소
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