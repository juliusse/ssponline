import React from 'react';
import './App.css';
import { GameBoard } from './components/GameBoard';

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
  const team = getQueryVariable('team') || 'RED';
  const otherTeam = team === 'RED' ? 'BLUE' : 'RED';

  const devBoard = devMode ? <GameBoard team={otherTeam} gameId={gameId}/> : null;

  return (
      <div>
        <GameBoard team={team} gameId={gameId}/>
        {devBoard}
      </div>
  );
}

export default App;