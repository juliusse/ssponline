import React from 'react';
import {GameBoard} from "./components/GameBoard";
import './styles/app.css'
class App extends React.Component {
    render() {
        return (
            <div>
                <GameBoard gameId="blub"/>
            </div>
        );
    }
}

export default App;
