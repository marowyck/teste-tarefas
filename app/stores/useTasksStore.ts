import { create } from "zustand";
import { Task } from "../data/Tasks";

interface useTasksStoreInterface {
  isTaskDialogOpened: boolean;
  setIsTaskDialogOpened: (isTaskDialogOpened: boolean) => void;
  taskSelected: Task | null;
  setTaskSelected: (task: Task | null) => void;
  tasks: Task[];
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  openDeleteDialog: boolean;
  setOpenDeleteDialog: (isTaskDialogOpened: boolean) => void;
  setTasks: (tasks: Task[]) => void;
  fetchTasks: (
    userId: { id: string; email: string } | null
  ) => Promise<{ success: boolean; message: string }>;
  updateTaskFunction: (
    task: Task
  ) => Promise<{ success: boolean; message: string }>;
  deleteTaskFunction: (
    option: "delete" | "deleteAll",
    user: { id: string; email: string } | null,
    task?: Task 
  ) => Promise<{ success: boolean; message: string }>;
  addNewTask: (
    task: Task
  ) => Promise<{ success: boolean; message: string; task: Task }>;
}

export const useTasksStore = create<useTasksStoreInterface>((set, get) => {
  return {
    isTaskDialogOpened: false,
    setIsTaskDialogOpened: (isDialogOpened: boolean) => {
      set({ isTaskDialogOpened: isDialogOpened });
    },
    tasks: [],
    isLoading: false,
    setIsLoading: (isLoading: boolean) => {
      set({ isLoading });
    },

    openDeleteDialog: false,
    setOpenDeleteDialog: (openDeleteDialog: boolean) => {
      set({ openDeleteDialog: openDeleteDialog });
    },

    taskSelected: null,
    setTaskSelected: (task: Task | null) => {
      set({ taskSelected: task });
    },

    setTasks: (tasks: Task[]) => {
      set({ tasks });
    },

    addNewTask: async (
      task: Task
    ): Promise<{ success: boolean; message: string; task: Task }> => {
      try {
        set({ isLoading: true });
        const currentTasks = get().tasks;

        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task), 
        });

        const results: { success: boolean; message: string } =
          await response.json();

        if (!results.success) {
          throw new Error(results.message);
        }

        const updatedTasks = [...currentTasks, task];

        set({ tasks: sortTasksByCompleted(updatedTasks) });

        return { success: true, message: "Tarefa adicionada com sucesso", task };
      } catch (error) {
        console.log(error);
        return { success: false, message: "Erro ao adicionar tarefa", task };
      } finally {
        set({ isLoading: false });
      }
    },

    fetchTasks: async (user) => {
      try {
        set({ isLoading: true });

        if (!user) {
          return { success: false, message: "ID do usuário definido" };
        }

        console.log(user);

        const response = await fetch(`/api/tasks?userId=${user.id}`, {
          method: "GET",
        });

        const results: { tasks?: Task[]; success: boolean; message: string } =
          await response.json();

        if (!results.success || !results.tasks) {
          return { success: false, message: "Erro ao obter tarefa" };
        }

        set({ tasks: sortTasksByCompleted(results.tasks) });

        return { success: true, message: "Tarefa obtida com sucesso" };
      } catch (error) {
        console.error("Erro ao obter tarefas:", error);
        return { success: false, message: "Erro ao obter tarefa" };
      } finally {
        set({ isLoading: false });
      }
    },

    deleteTaskFunction: async (
      option: "delete" | "deleteAll",
      user,
      task?: Task
    ) => {
      try {
        set({ isLoading: true });

        if (!user) {
          return { success: false, message: "Usuário não definido" };
        }

        const response = await fetch(`/api/tasks?userId=${user.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ option: option, task: task }), 
        });

        const results: { success: boolean; message: string } =
          await response.json();

        if (!results.success) {
          return { success: false, message: results.message };
        }

        const currentTasks = get().tasks;

        if (option === "delete" && task) {
          const updatedTasks = currentTasks.filter((t) => t.id !== task.id);
          set({ tasks: sortTasksByCompleted(updatedTasks) });
        }

        if (option === "deleteAll") {
          set({ tasks: [] });
        }

        return { success: true, message: results.message };
      } catch (error) {
        return { success: false, message: `Erro ao deletar: ${error}` };
      } finally {
        set({ isLoading: false });
      }
    },

    updateTaskFunction: async (task: Task) => {
      try {
        set({ isLoading: true });

        const response = await fetch("/api/tasks", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task), 
        });

        const results: { success: boolean; message: string } =
          await response.json();

        if (!results.success) {
          return { success: false, message: `Erro ao atualizar` };
        }

        const currentTasks = get().tasks;

        const updatedTasks = currentTasks.map((t) =>
          t.id === task.id ? { ...t, ...task } : t
        );

        set({ tasks: sortTasksByCompleted(updatedTasks) });

        return { success: true, message: "Tarefa atualizada com sucesso" };
      } catch (error) {
        return { success: false, message: `Erro ao atualizar, ${error}` };
      } finally {
        set({ isLoading: false });
      }
    },
  };
});

function sortTasksByCompleted(tasks: Task[]): Task[] {
  const sortedTasks = tasks.sort((a, b) => {
    if (a.status === "in progress" && b.status !== "in progress") {
      return -1; 
    }
    if (a.status !== "in progress" && b.status === "in progress") {
      return 1; 
    }
    return 0; 
  });

  return sortedTasks;
}
