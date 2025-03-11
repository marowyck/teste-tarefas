"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Task } from "@/app/data/Tasks";
import { useTasksStore } from "@/app/stores/useTasksStore";
import { toast } from "@/hooks/use-toast";

const priorities = [
  {
    value: "low",
    label: "Baixa",
  },
  {
    value: "medium",
    label: "Média",
  },
  {
    value: "high",
    label: "Alta",
  },
];

export function ComboboxDemo({ singleTask }: { singleTask: Task }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const { updateTaskFunction, isLoading } = useTasksStore();

  React.useEffect(() => {
    setValue(singleTask.priority);
  }, [singleTask]);

  function isValidPriority(value: string): value is "low" | "medium" | "high" {
    return value === "low" || value === "medium" || value === "high";
  }

  async function onSelectFunction(currentValue: string) {
    if (!isValidPriority(currentValue)) {
      return;
    }
    const updatedTask: Task = { ...singleTask, priority: currentValue };

    setValue(currentValue);

    const result = await updateTaskFunction(updatedTask);

    if (result.success) {
      toast({
        title: "Tarefa atualizada",
        description: `A prioridade foi atualizada com sucesso`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro enquanto estavamos atualizando a tarefa",
      });
    }
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[100px] justify-between"
        >
          {value
            ? priorities.find((framework) => framework.value === value)?.label
            : priorities[0].value}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[130px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {priorities.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={onSelectFunction}
                  disabled={isLoading}
                >
                  {value === framework.value && isLoading
                    ? "Carregando..." 
                    : framework.label}

                  {!isLoading && (
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === framework.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
