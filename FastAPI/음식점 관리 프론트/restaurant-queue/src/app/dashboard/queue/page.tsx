"use client";

import { useState, useEffect } from 'react';
import { QueueForm } from '@/components/queue/queue-form';
import { QueueList } from '@/components/queue/queue-list';
import { Queue } from '@/types';
import { api } from '@/lib/axios';
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

export default function QueuePage() {
  const [activeQueues, setActiveQueues] = useState<Queue[]>([]);
  const [completedQueues, setCompletedQueues] = useState<Queue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        setError(null);
        const { data } = await api.get<Queue[]>('/queues/');
        
        setActiveQueues(data.filter(q => 
          ['waiting', 'called'].includes(q.status)
        ));
        
        setCompletedQueues(data.filter(q => 
          ['seated', 'cancelled'].includes(q.status)
        ));
      } catch (error) {
        setError('대기열 정보를 불러오는데 실패했습니다.');
        console.error('Failed to fetch queues:', error);
      } finally {
        setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

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
        <TabsList className="grid w-full grid-cols-2">
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