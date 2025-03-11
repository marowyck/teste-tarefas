"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AppLogo } from "../AppLogo";
import EmailInput from "../EmailInput";
import PasswordInput from "../PasswordInput";
import { signUpSchema } from "../validationSchema";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import { useUserStore } from "@/app/stores/useUserStore";

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const methods = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const { toast } = useToast();
  const router = useRouter();

  const { signUpFunction, isLoading } = useUserStore();

  const onSubmit = async (data: SignUpFormData) => {
    const res = await signUpFunction({
      email: data.email,
      password: data.password,
    });

    if (res.result) {
      toast({
        title: "Registrado com sucesso!",
        description: "Sua conta foi criada.",
      });
      router.push("/to-dos");
    } else if (res.error) {
      toast({
        title: res.error,
        description:
          "Esse email já foi registrado.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Erro ao registrar",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    }
  };

  const handleErrorsToast = () => {
    const { errors } = methods.formState;
    const errorFields = ["email", "password", "confirmPassword"] as const;

    errorFields.forEach((field) => {
      if (errors[field]) {
        toast({
          title: "Erro ao validar",
          description: errors[field]?.message?.toString(),
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div>
      <AppLogo />
      <Card className="w-full max-w-sm py-2">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit, handleErrorsToast)}>
            <CardHeader>
              <CardTitle className="text-[22px] font-bold">Registrar</CardTitle>
              <CardDescription>
                Insira suas informações para criar uma conta
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 mt-3">
              <EmailInput name="email" label="Email" />
              <PasswordInput name="password" label="Password" />
              <PasswordInput name="confirmPassword" label="Confirm Password" />
              <div className="mt-4 text-sm flex items-center justify-center gap-1">
                <span>Já tem uma conta?</span>
                <Label className="text-primary">
                  <Link href="/">Entrar</Link>
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                {isLoading ? "Carregando..." : "Criar uma conta"}
              </Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
