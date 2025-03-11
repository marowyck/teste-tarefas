import { NextResponse } from "next/server";
import { logout } from "@/app/logout"; 

export async function GET() {
  try {
    const result = await logout();
    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao sair:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao  sair" },
      { status: 500 }
    );
  }
}
