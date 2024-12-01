// app/(dashboard)/queue/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { QueueForm } from '@/components/queue/queue-form';
import { QueueList } from '@/components/queue/queue-list';
import { Queue } from '@/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function QueuePage() {
  const [activeQueues, setActiveQueues] = useState<Queue[]>([]);
  const [completedQueues, setCompletedQueues] = useState<Queue[]>([]);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const response = await fetch('/api/queue');
        const data = await response.json();
        
        // 대기중 & 호출된 대기열
        setActiveQueues(data.filter((q: Queue) => 
          ['waiting', 'called'].includes(q.status)
        ));
        
        // 착석 완료 & 취소된 대기열
        setCompletedQueues(data.filter((q: Queue) => 
          ['seated', 'cancelled'].includes(q.status)
        ));
      } catch (error) {
        console.error('Failed to fetch queues:', error);
      }
    };

    fetchQueues();
    const interval = setInterval(fetchQueues, 30000); // 30초마다 갱신
    return () => clearInterval(interval);
  }, []);

  const calculateAverageWaitTime = (queues: Queue[]) => {
    if (queues.length === 0) return 0;
    const totalWaitTime = queues.reduce((sum, queue) => sum + queue.estimated_wait_time, 0);
    return Math.round(totalWaitTime / queues.length);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QueueForm />
        
        <Card>
          <CardHeader>
            <CardTitle>대기 현황</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">
              현재 대기: {activeQueues.length}팀
            </div>
            <div className="text-sm text-muted-foreground">
              평균 대기시간: {calculateAverageWaitTime(activeQueues)}분
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">
            대기중 ({activeQueues.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            완료 ({completedQueues.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-4">
          <QueueList queues={activeQueues} />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          <QueueList queues={completedQueues} />
        </TabsContent>
      </Tabs>
    </div>
  );
}