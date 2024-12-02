"use client";

import { FC } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QRCode from 'react-qr-code';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { api } from '@/lib/axios';

const formSchema = z.object({
  customer_name: z.string().min(2, "이름은 2글자 이상이어야 합니다."),
  party_size: z.number().min(1, "인원 수는 1명 이상이어야 합니다."),
  phone_number: z.string().min(10, "올바른 전화번호를 입력해주세요."),
});

interface QRDialogProps {
  isOpen: boolean;
  onClose: () => void;
  qrCode: string;
  queueNumber: string;
}

const QRDialog: FC<QRDialogProps> = ({ isOpen, onClose, qrCode, queueNumber }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>대기번호: {queueNumber}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 p-6">
          <QRCode value={qrCode} size={200} />
          <p className="text-sm text-gray-500">
            QR코드를 스캔하여 대기 상태를 확인하실 수 있습니다.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const QueueForm: FC = () => {
  const { toast } = useToast();
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrData, setQrData] = useState({ qrCode: '', queueNumber: '' });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_name: "",
      party_size: 1,
      phone_number: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data } = await api.post('/queue/', values);
      
      toast({
        title: "대기열 등록 완료",
        description: `대기번호: ${data.queue_number}`,
      });

      setQrData({
        qrCode: data.qr_code,
        queueNumber: data.queue_number
      });
      setQrDialogOpen(true);
      
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "오류",
        description: "대기열 등록 중 문제가 발생했습니다.",
      });
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>대기열 등록</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="customer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>고객명</FormLabel>
                    <FormControl>
                      <Input placeholder="홍길동" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="party_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>인원 수</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>전화번호</FormLabel>
                    <FormControl>
                      <Input placeholder="010-0000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                대기열 등록
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <QRDialog
        isOpen={qrDialogOpen}
        onClose={() => setQrDialogOpen(false)}
        qrCode={qrData.qrCode}
        queueNumber={qrData.queueNumber}
      />
    </>
  );
};