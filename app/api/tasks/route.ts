import { Task } from "@/app/data/Tasks";
import { NextResponse } from "next/server";
import { db } from "@/app/db/drizzle";
import { tasksTable } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request
): Promise<
  NextResponse<{ tasks?: Task[]; success: boolean; message: string }>
> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, message: "ID do usuário necessário" });
    }

    const tasks = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.userId, userId));

    return NextResponse.json({
      tasks,
      success: true,
      message: "Tarefas obtidas com sucesso",
    });
  } catch (error) {
    console.error("Erro ao obter tarefas:", error);
    return NextResponse.json({
      success: false,
      message: "Erro ao obter tarefas do servidor.",
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Usuário não definido",
      });
    }

    const body: { option: "delete" | "deleteAll"; task?: Task } =
      await request.json();

    const { option, task } = body;

    if (!option) {
      return NextResponse.json({
        success: false,
        message: "Opção não foi definida",
      });
    }

    if (option === "delete") {
      if (task) {
        // Delete a specific task
        const deletedTask = await db
          .delete(tasksTable)
          .where(eq(tasksTable.id, task.id));

        if (!deletedTask) {
          return NextResponse.json({
            success: false,
            message: "Tarefa não encontrada ou erro ao deletar",
          });
        }

        return NextResponse.json({
          success: true,
          message: "Tarefa deletada com sucesso!",
        });
      }
    }

    if (option === "deleteAll") {
      const deletedAllTasks = await db
        .delete(tasksTable)
        .where(eq(tasksTable.userId, userId)); 

      if (!deletedAllTasks) {
        return NextResponse.json({
          success: false,
          message: "Erro ao deletar todas as tarefas",
        });
      }

      return NextResponse.json({
        success: true,
        message: "Deletando todas as tarefas",
      });
    }

    return NextResponse.json({
      success: false,
      message: "Opção inválida",
    });
  } catch (error) {
    console.log(error);
  }
}

export async function PUT(request: Request) {
  try {
    const body: Task = await request.json();

    const { id, name, priority, status } = body;

    const updatedTask = await db
      .update(tasksTable)
      .set({ name, priority, status })
      .where(eq(tasksTable.id, id))
      .returning();

    if (!updatedTask) {
      return NextResponse.json({
        success: false,
        message: "Tarefa não encontrada ou atualização falhou",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Tarefa adicionada com sucesso",
    });
  } catch (error) {
    console.log(error);
  }
}

export async function POST(
  request: Request
): Promise<NextResponse<{ success: boolean; message: string }>> {
  try {
    const body: Task = await request.json();

    const { id, name, priority, status, userId } = body;

    if (!id || !name || !priority || !status || !userId) {
      return NextResponse.json({
        success: false,
        message: "Todos os campos são necessários",
      });
    }

    console.log("Dado de tarefa recebido:", body);

    const result = await db.insert(tasksTable).values({
      id, 
      name,
      priority, 
      status, 
      userId, 
    });

    if (result) {
      return NextResponse.json({
        success: true,
        message: "Tarefa adicionada com sucesso!",
      });
    }

    return NextResponse.json({
      success: false,
      message: "Erro ao inserir tarefa!",
    });
  } catch (error) {
    console.error("Erro ao inserir tarefa:", error);
    return NextResponse.json({
      success: false,
      message: `Erro ao criar tarefa no servidor`,
    });
  }
}
