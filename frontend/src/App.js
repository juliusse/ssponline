import React from 'react';
import {GameBoard} from "./components/GameBoard";
import './styles/app.css'

class App extends React.Component {
    getQueryVariable(variable) {
        const query = window.location.search.substring(1);
        const vars = query.split('&');
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) === variable) {
                return decodeURIComponent(pair[1]);
            }
        }
    }

    render() {
        const devMode = this.getQueryVariable("dev") || false;
        const gameId = this.getQueryVariable("gameId");
        const team = this.getQueryVariable("team");
        const otherTeam = this.getQueryVariable("team") === "RED" ? "BLUE" : "RED";

        const devBoard = devMode ? <GameBoard team={otherTeam} gameId={gameId}/> : null;
        return (
            <div>
                <GameBoard team={team} gameId={gameId}/>
                {devBoard}
            </div>
        );
    }
}

export default App;
