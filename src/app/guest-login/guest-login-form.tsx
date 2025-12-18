"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { guestLoginAction } from "./actions";

const formSchema = z.object({
  phone: z
    .string()
    .min(10, "전화번호를 올바르게 입력해주세요.")
    .max(13, "전화번호가 너무 깁니다."),
  password: z.string().min(4, "비밀번호는 4자 이상이어야 합니다."),
});

export default function GuestLoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("phone", values.phone);
      formData.append("password", values.password);

      const result = await guestLoginAction(null, formData);

      if (result.success) {
        // TODO: Redirect to guest check page
        router.push("/guest-check");
      } else {
        form.setError("root", {
          type: "manual",
          message: result.message || "로그인에 실패했습니다.",
        });
      }
    });
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/50 text-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          비회원 조회
        </h1>
        <p className="mt-3 text-slate-600">
          구매 시 입력한 정보로
          <br />
          주문 내역을 조회할 수 있습니다.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 text-left"
        >
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">휴대폰 번호</FormLabel>
                <FormControl>
                  <Input
                    placeholder="010-0000-0000"
                    {...field}
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-200"
                  />
                </FormControl>
                <FormMessage className="text-red-500 font-medium text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">비밀번호</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="비밀번호 입력"
                    {...field}
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-200"
                  />
                </FormControl>
                <FormMessage className="text-red-500 font-medium text-xs" />
              </FormItem>
            )}
          />

          {form.formState.errors.root && (
            <div className="p-3 rounded-md bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium">
              {form.formState.errors.root.message}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            조회하기
          </Button>
        </form>
      </Form>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <p className="text-sm text-slate-500">
          계정이 있으신가요?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth")}
            className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
          >
            로그인하기
          </button>
        </p>
      </div>
    </div>
  );
}
