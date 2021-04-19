import React from "react";
import './GameLog.css';
import {GameAction} from "../model/gameaction/GameAction";
import {GameActionType} from "../model/gameaction/GameActionType";
import {Team} from "../model/Team";

type Props = {
    gameActions: Array<GameAction>
}

type State = {}

export class GameLog extends React.Component<Props, State> {

    toLogLine(action: GameAction): JSX.Element {
        switch (action.actionType) {
            case GameActionType.CONFIGURE:
                return (
                    <div className='GameLogEntry'>
                        The game was created.
                    </div>
                );
            case GameActionType.SHUFFLE_UNITS:
                return (
                    <div className='GameLogEntry'>
                        <span className={action.team?.getName()}>{action.team?.getName()}</span> shuffled their units.
                    </div>
                );
            case GameActionType.ACCEPT_UNITS:
                return (
                    <div className='GameLogEntry'>
                        <span className={action.team?.getName()}>{action.team?.getName()}</span> accepted their units.
                    </div>
                );
            case GameActionType.SET_SPECIAL_UNITS:
                return (
                    <div className='GameLogEntry'>
                        <span className={action.team?.getName()}>{action.team?.getName()}</span> set their special units.
                    </div>
                );
            case GameActionType.START:
                return (
                    <div className='GameLogEntry'>
                        Get Ready! The game starts!
                    </div>
                );
            case GameActionType.MOVE:
                return (
                    <div className='GameLogEntry'>
                        <span className={action.team?.getName()}>{action.team?.getName()}</span>
                        {' '}
                        moved unit from {action.from!.toString()} to {action.to!.toString()}
                    </div>
                );
            case GameActionType.FIGHT:
                const winningTeamName = action.winningTeam?.getName();
                const losingTeamName = (action.winningTeam === Team.RED ? Team.BLUE : Team.RED).getName();
                return (
                    <div className='GameLogEntry'>
                        <span className={Team.RED.getName()}>{action.redType}</span> vs.
                        {' '}
                        <span className={Team.BLUE.getName()}>{action.blueType}</span>;
                        {' '}
                        <span className={winningTeamName}>{winningTeamName}</span> won the fight!
                    </div>
                );
            case GameActionType.FIGHT_CHOOSE_UNIT:
                return (
                    <div className='GameLogEntry'>
                        <span className={action.team?.getName()}>{action.team?.getName()}</span>
                        {' '}
                        chose a unit for the fight;
                    </div>
                );
        }

        return <div/>;
    }

    render() {
        const entries = this
            .props
            .gameActions
            .reverse()
            .map(gameAction => {
                return <div className='GameLogEntry'
                            key={`action_${gameAction.actionId}`}>{this.toLogLine(gameAction)}</div>;
            })
        return (
            <div className='GameLog'>
                {entries}
            </div>
        );
    }
}
