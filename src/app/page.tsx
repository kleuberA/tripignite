import AdicionarPlanejamento from "@/components/addPlanejamento";
import { ToggleTheme } from "@/components/toggle-theme";

export default function Home() {
  return (
    <div>
      <ToggleTheme />
      <AdicionarPlanejamento />
    </div>
  );
}
