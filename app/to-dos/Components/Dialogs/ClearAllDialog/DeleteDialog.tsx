import { useTasksStore } from "@/app/stores/useTasksStore";
import { useUserStore } from "@/app/stores/useUserStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export function DeleteDialog() {
  const {
    openDeleteDialog,
    setOpenDeleteDialog,
    taskSelected,
    setTaskSelected,
    deleteTaskFunction,
    isLoading,
    tasks,
  } = useTasksStore();

  const [message, setMessage] = useState("");
  const { user } = useUserStore();

  function handleOpenChange(open: boolean) {
    if (open) {
      setOpenDeleteDialog(open);
    }
  }

  useEffect(() => {
    if (taskSelected) {
      setMessage(`Essa ação não pode ser desfeita. Isso irá apagar permanentemente a tarefa 
      [${taskSelected.name}] e remover do servidor!`);
    } else {
      setMessage(`Essa ação não pode ser desfeita. Isso irá apagar permanentemente todas as tarefas do servidor!`);
    }
  }, [taskSelected]);

  async function deleteFunction() {
    if (taskSelected) {
      const result = await deleteTaskFunction("delete", user, taskSelected);

      if (result.success) {
        toast({
          title: "Tarefa deletada",
          description: `Tarefa deletada com sucesso.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Ocorreu um erro ao deletar tarefa.",
        });
      }
    } else {
      const result = await deleteTaskFunction("deleteAll", user);

      if (result.success) {
        toast({
          title: "Tarefas deletadas",
          description: `Todas as tarefas foram deletadas com sucesso.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Ocorreu um erro ao deletar tarefas.",
        });
      }
    }
    setTaskSelected(null);
    setOpenDeleteDialog(false);
  }

  return (
    <AlertDialog open={openDeleteDialog} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger disabled={tasks.length === 0}>
        <Button variant="link" disabled={tasks.length === 0}>
          Apagar tudo
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-7">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Você tem certeza?
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-7">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-7">
          <AlertDialogCancel
            onClick={() => {
              setTaskSelected(null);
              setOpenDeleteDialog(false);
            }}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={deleteFunction}>
            {isLoading ? "Carregando..." : "Deletar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
