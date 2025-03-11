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
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema } from "../validationSchema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import { useUserStore } from "@/app/stores/useUserStore";

type AuthFormData = z.infer<typeof authSchema>;

export default function SignIn() {
  const methods = useForm<AuthFormData>({ resolver: zodResolver(authSchema) });
  const { toast } = useToast();
  const router = useRouter();
  const { loginFunction, isLoading } = useUserStore();

  const onSubmit = async (data: AuthFormData) => {
    const IsLogged = await loginFunction(data);

    console.log(IsLogged);

    if (IsLogged.isLoggedIn) {
      toast({
        title: "Entrou com sucesso!",
        description: "Você entrou.",
      });
      router.push("/to-dos");
    } else {
      toast({
        title: "Erro ao entrar",
        description: IsLogged.error,
        variant: "destructive",
      });
    }

    console.log(IsLogged);
  };

  const handleErrorToast = () => {
    const { errors } = methods.formState;
    const errorFields = ["email", "password"] as const;

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
          <form onSubmit={methods.handleSubmit(onSubmit, handleErrorToast)}>
            <CardHeader>
              <CardTitle className="text-[22px] font-bold">Entrar</CardTitle>
              <CardDescription>
                Coloque seu email para entrar em sua conta.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 mt-3">
              <EmailInput name="email" label="Email" />
              <PasswordInput name="password" label="Senha" />
              <div className="mt-4 text-sm flex items-center justify-center gap-1">
                <span>Não tem uma conta?</span>
                <Label className="text-primary">
                  <Link href="/sign-up">Registrar</Link>
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                {isLoading ? "Carregando..." : "Entrar"}
              </Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
