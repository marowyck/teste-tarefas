import { FaCat } from "react-icons/fa6";

export const description =
  "Um formulário simples para acessar.";

export function AppLogo() {
  return (
    <div className="flex gap-2 items-center mb-11 justify-center   ">
      <div className="bg-primary p-2 text-white rounded-sm text-lg ">
        <FaCat />
      </div>

      <div className="font-bold  text-2xl flex gap-1 justify-center items-center">
        <span className="text-primary">Tarefas</span>
        <span>Teste</span>
      </div>
    </div>
  );
}
