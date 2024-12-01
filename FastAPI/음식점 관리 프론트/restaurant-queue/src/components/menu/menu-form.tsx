import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MenuItem } from "@/types";

const formSchema = z.object({
  name: z.string().min(1, "메뉴명을 입력해주세요"),
  price: z.number().min(0, "가격은 0 이상이어야 합니다"),
  category: z.string().min(1, "카테고리를 입력해주세요"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface MenuFormProps {
  initialData?: MenuItem;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

export const MenuForm = ({ initialData, onSubmit, onCancel }: MenuFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      price: initialData?.price || 0,
      category: initialData?.category || "",
      description: initialData?.description || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>메뉴명</FormLabel>
              <FormControl>
                <Input {...field} placeholder="메뉴명을 입력하세요" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>가격</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                  placeholder="가격을 입력하세요"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>카테고리</FormLabel>
              <FormControl>
                <Input {...field} placeholder="카테고리를 입력하세요" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="메뉴 설명을 입력하세요" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit">
            {initialData ? "수정하기" : "등록하기"}
          </Button>
        </div>
      </form>
    </Form>
  );
};