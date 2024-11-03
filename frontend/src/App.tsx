import "./App.sass";
import Team from "@/model/Team";
import Game from "@/components/Game";
import { ConfigProvider } from "@/ConfigProvider";

function getQueryVariable(variable: string) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
}

const App = () => {
  const devMode = getQueryVariable("dev") || false;
  const gameId = getQueryVariable("gameId") || "dev";
  const team = Team.getForColor(getQueryVariable("team") || "RED");
  const otherTeam = team === Team.RED ? Team.BLUE : Team.RED;

  const devBoard = devMode ? <Game team={otherTeam} gameId={gameId} /> : null;

  return (
    <ConfigProvider>
      <Game team={team} gameId={gameId} />
      {devBoard}
    </ConfigProvider>
  );
}

export default App;
