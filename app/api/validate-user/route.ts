import { NextResponse } from "next/server";
import { validateRequest } from "@/app/aut";

export async function GET() {
  try {
    const user = await validateRequest();

    if (!user || !user.user) {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }
    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: user.user.id,
        email: user.user.email,
      },
    });
  } catch (error) {
    console.error("Erro ao validar:", error);
    return NextResponse.json(
      { isAuthenticated: false, error: "Erro ao validar" },
      { status: 500 }
    );
  }
}
