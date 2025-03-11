"use client";
import { Task } from "@/app/data/Tasks";
import { useTasksStore } from "@/app/stores/useTasksStore";
import { useUserStore } from "@/app/stores/useUserStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { SlOptions } from "react-icons/sl";
export function TasksOptions({ singleTask }: { singleTask: Task }) {
  const {
    setIsTaskDialogOpened,
    setTaskSelected,
    taskSelected,
    addNewTask,
    setOpenDeleteDialog,
  } = useTasksStore();

  const { user } = useUserStore();

  const [actionClicked, setActionClicked] = useState("");

  const handleItemClick = (action: string) => {
    //
    if (action === "edit") {
      setTaskSelected(singleTask);
      setIsTaskDialogOpened(true);
    } else if (action === "copy") {
      setTaskSelected(singleTask);
      setActionClicked(action);
    } else if (action === "delete") {
      setTaskSelected(singleTask);
      setOpenDeleteDialog(true);
    }
  };

  useEffect(() => {
    if (taskSelected && actionClicked === "copy") {
      toast({
        title: "Copiando a tarefa...",
        description: "Nós estamos criando uma cópia da tarefa",
      });
      createCopyOfTask();
    }
  }, [taskSelected, actionClicked]);

  async function createCopyOfTask() {
    if (taskSelected) {
      const newTask: Task = {
        id: nanoid(),
        name: `${taskSelected.name} (copy)`,
        status: taskSelected.status,
        priority: taskSelected.priority,
        userId: user?.id || "",
      };

      const result = await addNewTask(newTask);

      if (result.success) {
        toast({
          title: "Tarefa copiada",
          description: `Tarefa copiada com sucesso.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Ocorreu um erro ao copiar a tarefa.",
        });
      }

      setTaskSelected(null);
      setActionClicked("");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          <SlOptions />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleItemClick("edit")}>
            Editar
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleItemClick("copy")}>
            Copiar
            <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500"
            onClick={() => handleItemClick("delete")}
          >
            Deletar
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
