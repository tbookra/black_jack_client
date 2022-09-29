import "./home.css";
import { useState, useEffect, useRef } from "react";
import Card from "../../components/card/Card";
import { serverRequests } from "../../api";
import { getNumber, hasWon, hasDealerWon } from "../../utils/utilsFuntions";

export default function Home() {
  //   const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [playerCards, setPlayersCards] = useState([]);
  const [dealersCards, setDealersCards] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);
  const [startBtnDisable, setStartBtnDisable] = useState(false);
  const [callBtnDisable, setCallBtnDisable] = useState(true);
  const [palyerCalled, setPlayerCalled] = useState(false);
  const [winStatus, setWinStatus] = useState("no");
  const interval = useRef(null);

  const resetStates = () => {
    // reset the game without the need for refresh
    setPlayersCards([]);
    setDealersCards([]);
    setPlayerScore(0);
    setDealerScore(0);
    setBtnDisable(false);
    setPlayerCalled(false);
    setFetchError(null);
    setWinStatus("no");
  };

  useEffect(() => {
    // useEffect for catching a Players moves that ends the game
    const win = hasWon(playerScore);
    setWinStatus(win);
    if (win === "win" || win === "lost") {
      console.log("win", win);
      setBtnDisable(true);
      setStartBtnDisable(false);
      setCallBtnDisable(true);
    }
  }, [playerScore, btnDisable]);

  useEffect(() => {
    // useEffect for catching a Dealers moves that ends the game
    const win = hasDealerWon(dealerScore);
    if (win === "lost") {
      setWinStatus("win");
    } else if (win === "win") {
      setWinStatus("lost");
    } else if (win === "stop" && palyerCalled) {
      if (playerScore > dealerScore) {
        setWinStatus("win");
      } else {
        setWinStatus("lost");
      }
    }
    if (win === "win" || win === "lost" || win === "stop") {
      setBtnDisable(true);
      setStartBtnDisable(false);
      setCallBtnDisable(true);
    }
    if (winStatus === "win" || winStatus === "lost")
      clearInterval(interval.current);
  }, [dealerScore, winStatus, palyerCalled, playerScore]);

  const handleStartClick = async () => {
    resetStates();
    const PLAYER_DELAY = 700;
    const DEALER_DELAY = 1500;
    try {
      const { data } = await serverRequests.get("game_moves/new-game");
      setTimeout(() => {
        setPlayersCards([data.success.player[0]]);
        setWinStatus("no");
      }, 400);
      setTimeout(() => {
        setPlayersCards((prev) => [...prev, data.success.player[1]]);
      }, PLAYER_DELAY);
      setTimeout(() => {
        setDealersCards([data.success.dealer[0]]);
      }, 1200);
      setTimeout(() => {
        setDealersCards((prev) => [...prev, data.success.dealer[1]]);
      }, DEALER_DELAY);

      setTimeout(() => {
        setPlayerScore(
          getNumber(data.success.player[0].split(";")[1]).value +
            getNumber(data.success.player[1].split(";")[1]).value
        );
      }, PLAYER_DELAY);
      setTimeout(() => {
        setDealerScore(
          getNumber(data.success.dealer[0].split(";")[1]).value +
            getNumber(data.success.dealer[1].split(";")[1]).value
        );
      }, DEALER_DELAY);
      setTimeout(() => {
        setStartBtnDisable(true);
        setBtnDisable(false);
        setCallBtnDisable(false);
      }, DEALER_DELAY + 100);
    } catch (error) {
      setFetchError(error.message);
    }
  };

  const handleHitClick = async () => {
    try {
      const { data } = await serverRequests.get("game_moves/hit");
      setPlayersCards((prev) => [...prev, data.success]);
      setPlayerScore(
        (prev) => prev + getNumber(data.success.split(";")[1]).value
      );
    } catch (error) {
      setFetchError(error.message);
    }
  };
  const handleCallClick = async () => {
    setPlayerCalled(true);

    interval.current = setInterval(async () => {
      try {
        const { data } = await serverRequests.get("game_moves/hit");
        setDealersCards((prev) => [...prev, data.success]);
        setDealerScore(
          (prev) => prev + getNumber(data.success.split(";")[1]).value
        );
      } catch (error) {
        setFetchError(error.message);
      }
    }, 1000);
  };

  return (
    <div className="homeContainer">
      {fetchError && (
        <div className="fetchErrorDiv">
          {`Something went wrong: ${fetchError}`}
          <div>Please refresh</div>
        </div>
      )}
      <div className="buttonsContainer">
        <button
          className="btn startBtn"
          onClick={handleStartClick}
          disabled={startBtnDisable}
        >
          START
        </button>
        <button
          className="btn hitBtn"
          onClick={handleHitClick}
          disabled={btnDisable}
        >
          HIT
        </button>
        <button
          className="btn callBtn"
          onClick={handleCallClick}
          disabled={callBtnDisable}
        >
          CALL
        </button>
      </div>
      <hr className="homeHr" />
      <div className="titleDiv">
        <div className="playerTitle">YOUR SCORE: {playerScore}</div>
        <div className="playerTitle">YOUR CARDS:</div>
      </div>
      <div className="playerContainer">
        {playerCards.length > 0
          ? playerCards.map((card) => (
              <Card
                key={card}
                symbol={card.split(";")[0]}
                number={card.split(";")[1]}
              />
            ))
          : ""}
      </div>
      <hr className="homeHr" />
      <div className="titleDiv">
        <div className="playerTitle">DEALERS SCORE: {dealerScore}</div>
        <div className="playerTitle">DEALERS CARDS:</div>
      </div>
      <div className="dealerContainer">
        {dealersCards.length > 0
          ? dealersCards.map((card) => (
              <Card
                key={card}
                symbol={card.split(";")[0]}
                number={card.split(";")[1]}
              />
            ))
          : ""}
      </div>
      <div // win/lose message
        className={
          winStatus === "lost" || winStatus === "win"
            ? "endGameContainer show"
            : "endGameContainer"
        }
      >
        {winStatus === "lost" ? (
          <div className="lost">You have lost! thanks for your Money</div>
        ) : winStatus === "win" ? (
          <div className="win">You Won!!! Try Again</div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
