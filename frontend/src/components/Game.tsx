import { useEffect, useState } from "react";
import "./Game.sass";
import { GameState, UnitType } from "@/constants/Constants";
import { GameStateModel } from "@/model/GameStateModel";
import { GameActionsListResponse, GameBoardAdapter } from "@/utils/GameBoardAdapter";
import { Point } from "@/model/Point";
import { AxiosError } from "axios";
import FightUnitSelector from "@/components/FightUnitSelector";
import Team from "@/model/Team";
import GameBoard from "@/components/GameBoard";
import GameLog from "@/components/GameLog";
import GameTurnInfo from "@/components/GameTurnInfo";
import { useConfig } from "@/ConfigProvider";

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

  const config = useConfig();
  const gameBoardAdapter = new GameBoardAdapter(gameId, team, config.backendUrl);


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

  const loadActions = async () => {
    try {
      const actions = await gameBoardAdapter.getActionsAsync(gameState.lastProcessedAction + 1);
      processActions(actions);
    } catch (error: any) {
      processActionError(error);
    }
  };

  const moveUnit = async (from: Point, to: Point) => {
    try {
      const newActions = await gameBoardAdapter.sendActionMoveUnit(from, to, gameState.lastProcessedAction + 1);
      processActions(newActions);

    } catch (error: any) {
      processActionError(error);
    }
  };

  const handleFightUnitChosen = async (unitType: UnitType) => {
    try {
      const newActions = await gameBoardAdapter.sendActionFightUnitChosen(unitType, gameState.lastProcessedAction + 1);
      processActions(newActions);
    } catch (error: any) {
      processActionError(error);
    }
  };

  const handleShuffleClick = async () => {
    try {
      const newActions = await gameBoardAdapter.sendActionShuffleUnits(gameState.lastProcessedAction + 1);
      processActions(newActions);
    } catch (error: any) {
      processActionError(error);
    }
  };

  const handleAcceptClick = async () => {
    try {
      const newActions = await gameBoardAdapter.sendActionAcceptUnits(gameState.lastProcessedAction + 1);
      processActions(newActions);
    } catch (error: any) {
      processActionError(error);
    }
  };

  const handleRestUnitsClick = () => {
    setSetUpUnits({
        trap1: null,
        trap2: null,
        flag: null,
      },
    );
  };

  const handleAcceptSpecialUnitsClick = async () => {
    try {
      const newActions = await gameBoardAdapter
        .sendActionSelectSpecialUnits(
          setUpUnits.trap1!,
          setUpUnits.trap2!,
          setUpUnits.flag!,
          gameState.lastProcessedAction + 1,
        );
      processActions(newActions);
    } catch (error: any) {
      processActionError(error);
    }

    setSetUpUnits(
      {
        trap1: null,
        trap2: null,
        flag: null,
      },
    );
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

  const processActions = (response: GameActionsListResponse) => {
    const newGameState = gameState.processActions(response.gameActions);
    setGameState(GameStateModel.copy(newGameState));
  };

  const processActionError = (error: Error) => {
    if (error instanceof AxiosError && error.response?.data) {
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

  const handleMoveUnit = async (from: Point, to: Point) => {
    await moveUnit(from, to);
  };

  const handlePlaceSpecialUnit = (setUpUnits: GameSetupState) => {
    setSetUpUnits({ ...setUpUnits });
  };

  if (gameState.board == null) {
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
