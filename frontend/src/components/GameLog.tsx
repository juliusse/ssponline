import React from "react";
import './GameLog.sass';
import {GameAction} from "../model/gameaction/GameAction";
import {GameActionType} from "../model/gameaction/GameActionType";
import {Team} from "../model/Team";
import moment from "moment";

type Props = {
    displayedUntilActionId: number | null;
    gameActions: Array<GameAction>;
    onActionClick: Function;
}

type State = {}

export class GameLog extends React.Component<Props, State> {

    toLogLine(action: GameAction): JSX.Element {
        let content = null;
        switch (action.actionType) {
            case GameActionType.CONFIGURE:
                content =
                    <div className='GameLogEntryContent'>
                        The game was created.
                    </div>;
                break;
            case GameActionType.SHUFFLE_UNITS:
                content =
                    <div className='GameLogEntryContent'>
                        <span className={action.team?.getName()}>{action.team?.getName()}</span> shuffled their units.
                    </div>;
                break;
            case GameActionType.ACCEPT_UNITS:
                content =
                    <div className='GameLogEntryContent'>
                        <span className={action.team?.getName()}>{action.team?.getName()}</span> accepted their units.
                    </div>;
                break;
            case GameActionType.SET_SPECIAL_UNITS:
                content =
                    <div className='GameLogEntryContent'>
                        <span className={action.team?.getName()}>{action.team?.getName()}</span> set their special
                        units.
                    </div>;
                break;
            case GameActionType.START:
                content =
                    <div className='GameLogEntryContent'>
                        Get Ready! The game starts!
                    </div>;
                break;
            case GameActionType.MOVE:
                content =
                    <div className='GameLogEntryContent'>
                        <span className={action.team?.getName()}>{action.team?.getName()}</span>
                        {' '}moved{' '}
                        <span className={action.team?.getName()}>{action.unitType}</span>
                        {' '}from {action.from!.toString()} to {action.to!.toString()}
                    </div>;
                break;
            case GameActionType.FIGHT:
                const winningTeamName = action.winningTeam?.getName();
                const result = action.winningTeam ?
                    <div>; <span className={winningTeamName}>{winningTeamName}</span> won!</div> :
                    null
                content =
                    <div className='GameLogEntryContent'>
                        Fight:
                        <span className={Team.RED.getName()}>{action.redType}</span> vs.
                        {' '}
                        <span className={Team.BLUE.getName()}>{action.blueType}</span>
                        {' '}
                        {result}
                    </div>;
                break;
            case GameActionType.FIGHT_CHOOSE_UNIT:
                content =
                    <div className='GameLogEntryContent'>
                        <span className={action.team?.getName()}>{action.team?.getName()}</span>
                        chose a unit for the fight;
                    </div>;
                break;
            case GameActionType.WIN:
                content =
                    <div className='GameLogEntryContent'>
                        GAME OVER!{' '}
                        <span className={action.team?.getName()}>{action.team?.getName()}</span>
                        {' '} won the game!
                    </div>;
                break;
        }

        const time = (
            <div className='GameLogEntryTime'>
                [
                <div className='GameLogEntryTimeContent'><span>{moment(action.timestamp).fromNow()}</span></div>
                ]
            </div>);
        const active = !this.props.displayedUntilActionId || action.actionId <= this.props.displayedUntilActionId;
        const activeClass = active ? 'active' : 'disabled';
        const handleClick = () => {
            this.props.onActionClick(action.actionId);
        }
        return (
            <div key={`action_${action.actionId}`}
                 className={`GameLogEntry ${activeClass}`}
                 onClick={handleClick}>
                {time}
                {content}
            </div>
        )
    }

    render() {
        const actions = this.props.gameActions;
        const entries = [];
        for(let i = actions.length -1; i >= 0; i--) {
            entries.push(this.toLogLine(actions[i]))
        }
        return (
            <div className='GameLog'>
                {entries}
            </div>
        );
    }
}
