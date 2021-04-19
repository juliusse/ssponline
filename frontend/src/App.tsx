import React from 'react';
import './App.css';
import {Team} from "./model/Team";
import {Game} from "./components/Game";

function getQueryVariable(variable: String) {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}

function App() {
    const devMode = getQueryVariable('dev') || false;
    const gameId = getQueryVariable('gameId') || 'dev';
    const team = Team.getForColor(getQueryVariable('team') || 'RED');
    const otherTeam = team === Team.RED ? Team.BLUE : Team.RED;

    const devBoard = devMode ? <Game team={otherTeam} gameId={gameId}/> : null;

    return (
        <div>
            <Game team={team} gameId={gameId}/>
            {devBoard}
        </div>
    );
}

export default App;
