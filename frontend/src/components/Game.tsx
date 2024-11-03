import { useEffect, useState } from "react";
import "./Game.sass";
import { GameState, UnitType } from "@/constants/Constants";
import { GameStateModel } from "@/model/GameStateModel";
import { GameActionsListResponse, GameBoardAdapter } from "@/utils/GameBoardAdapter";
import { Point } from "@/model/Point";
import { AxiosError, AxiosResponse } from "axios";
import { GameBoard } from "./GameBoard";
import { GameLog } from "./GameLog";
import { GameTurnInfo } from "./GameTurnInfo";
import FightUnitSelector from "@/components/FightUnitSelector";
import Team from "@/model/Team";

type GameProps = {
  team: Team
  gameId: string
}


export type GameSetupState = {
  trap1: Point | null
  trap2: Point | null
  flag: Point | null
}

const Game = ({ team, gameId }: GameProps) => {
  const [gameState, setGameState] = useState(new GameStateModel(team));
  const [displayedUntilActionId, setDisplayedUntilActionId] = useState<number | null>(null);
  const [shadowGameState, setShadowGameState] = useState<GameStateModel | null>(null);
  const [setUpUnits, setSetUpUnits] = useState<GameSetupState>({
    trap1: null,
    trap2: null,
    flag: null,
  });
  const [intervalId, setIntervalId] = useState<number | null>(null);

  const gameBoardAdapter = new GameBoardAdapter(gameId, team);


  useEffect(() => {
    loadActions();
    return () => {
      stopCheck();
    };
  }, []);

  useEffect(() => {
    if ((gameState.gameState === GameState.SETUP && gameState.acceptedUnits) ||
      (gameState.gameState === GameState.TURN && gameState.activeTeam !== team) ||
      (gameState.gameState === GameState.FIGHT && gameState.fightChoice != null)) {
      if (intervalId == null) {
        startCheck();
      }
    } else {
      stopCheck();
    }
  }, [gameState]);

  const loadActions = () => {
    gameBoardAdapter
      .getActionsAsync(gameState.lastProcessedAction + 1)
      .then(processActions)
      .catch(processActionError);
  };

  const moveUnit = (from: Point, to: Point) => {
    gameBoardAdapter
      .sendActionMoveUnit(from, to, gameState.lastProcessedAction + 1)
      .then(processActions)
      .catch(processActionError);
  };

  const handleFightUnitChosen = (unitType: UnitType) => {
    gameBoardAdapter
      .sendActionFightUnitChosen(unitType, gameState.lastProcessedAction + 1)
      .then(processActions)
      .catch(processActionError);
  };

  const handleShuffleClick = () => {
    gameBoardAdapter
      .sendActionShuffleUnits(gameState.lastProcessedAction + 1)
      .then(processActions)
      .catch(processActionError);
  };

  const handleAcceptClick = () => {
    gameBoardAdapter
      .sendActionAcceptUnits(gameState.lastProcessedAction + 1)
      .then(processActions)
      .catch(processActionError);
  };

  const handleRestUnitsClick = () => {
    setSetUpUnits({
        trap1: null,
        trap2: null,
        flag: null,
      },
    );
  };

  const handleAcceptSpecialUnitsClick = () => {
    gameBoardAdapter
      .sendActionSelectSpecialUnits(
        setUpUnits.trap1!,
        setUpUnits.trap2!,
        setUpUnits.flag!,
        gameState.lastProcessedAction + 1,
      )
      .then(processActions)
      .catch(processActionError)
      .finally(() => {
        setSetUpUnits(
          {
            trap1: null,
            trap2: null,
            flag: null,
          },
        );
      });
  };

  const handleHistoryActionClick = (actionId: number) => {
    if (gameState.lastProcessedAction === actionId) {
      setShadowGameState(null);
      setDisplayedUntilActionId(null);
      return;
    }

    const shadowGameState = new GameStateModel(team);
    for (let i = 0; i <= actionId; i++) {
      shadowGameState.processAction(gameState.actions[i]);
    }

    setShadowGameState(shadowGameState);
    setDisplayedUntilActionId(actionId);
  };

  const processActions = (response: AxiosResponse<GameActionsListResponse>) => {
    const newGameState = gameState.processActions(response.data.gameActions);
    setGameState(GameStateModel.copy(newGameState));
  };

  const processActionError = (error: AxiosError) => {
    if (error?.response?.data) {
      // @ts-expect-error should be casted to correct type
      alert(error.response.data.message);
    }
  };

  const startCheck = () => {
    if (intervalId != null) {
      return;
    }

    // @ts-expect-error - setInterval expects a number
    setIntervalId(setInterval(loadActions, 2000));
  };

  const stopCheck = () => {
    if (intervalId == null) {
      return;
    }

    clearInterval(intervalId!);
    setIntervalId(null);
  };

  const handleMoveUnit = (from: Point, to: Point) => {
    moveUnit(from, to);
  };

  const handlePlaceSpecialUnit = (setUpUnits: GameSetupState) => {
    setSetUpUnits({...setUpUnits});
  };

  if (gameState.board == null || !gameState.gameState) {
    return <div />;
  }

  return (
    <div className="Game">
      <GameTurnInfo playerTeam={team}
                    actions={gameState.actions}
                    setUpUnits={setUpUnits}
                    onShuffleClick={handleShuffleClick}
                    onAcceptShuffleClick={handleAcceptClick}
                    onResetSpecialUnitsClick={handleRestUnitsClick}
                    onAcceptSpecialUnitsClick={handleAcceptSpecialUnitsClick} />
      <GameBoard team={team}
                 gameState={shadowGameState ? shadowGameState : gameState}
                 isShadowState={!!shadowGameState}
                 setUpUnits={setUpUnits}
                 onMoveUnit={handleMoveUnit}
                 onPlaceSpecialUnit={handlePlaceSpecialUnit} />
      <FightUnitSelector gameState={gameState.gameState}
                         team={team}
                         choice={gameState.fightChoice}
                         onChooseUnit={handleFightUnitChosen} />
      <GameLog displayedUntilActionId={displayedUntilActionId}
               gameActions={gameState.actions}
               onActionClick={handleHistoryActionClick} />
    </div>
  );
};

export default Game;
