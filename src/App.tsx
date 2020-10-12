import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function shuffle(array: number[]) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
function getRandomAnswer() {
  return Math.floor(Math.random() * 3) + 1
}

function App() {
  const [boxes, setBoxes] = useState([1, 2, 3]);
  const [answer, setAnswer] = useState(getRandomAnswer())
  const [chosen, setChosen] = useState<number | undefined>();
  const [boxToRemove, setBoxToRemove] = useState<number | undefined>()
  const [stage, setStage] = useState<number>(1)
  const [wins, setWins] = useState(0)
  const [games, setGames] = useState(0)

  const refresh = () => {
    if (!chosen) return;
    let tmp = [...boxes];
    for (let i = 0; i < 10; i++) {
      tmp = shuffle(tmp);
    }
    setBoxes(tmp);
    setChosen(undefined);
    setAnswer(getRandomAnswer())
    setStage(1)
    setGames(games+1)
  };

  const boxNotAnswerNotChosen = () => {
    const truths = boxes.filter(val => val !== answer && val !== chosen)
    var random = truths[Math.floor(Math.random() * truths.length)]
    return random
  }

  const chooseStep1 = (idx: number, stage: number) => {
    setChosen(idx)
    setStage(stage)
    if (stage === 3 && idx === answer) {
      setWins(wins+1)
    }
  }

  useEffect(() => {
    setBoxToRemove(boxNotAnswerNotChosen())
  }, [answer, chosen])

  const getP = () => {
    if (games === 0) return 0
    return Math.floor(wins/games*100)
  }
  return (
    <div className="App">
      <h1>GAMBLER!</h1>
      {stage === 1 && <h2>Wins {wins}/{games} @ {getP()}%</h2>}
      <button onClick={() => refresh()} disabled={!chosen}>
        restart
      </button>

      <p>Chosen: {chosen}</p>

      {stage === 1 && (
        <>
          <button onClick={() => chooseStep1(1, 2)}>box 1</button>
          <button onClick={() => chooseStep1(2, 2)}>box 2</button>
          <button onClick={() => chooseStep1(3, 2)}>box 3</button>
        </>
      )}

      {stage === 2 && (
        <>
          <button disabled={boxToRemove === 1} onClick={() => chooseStep1(1, 3)}>box 1</button>
          <button disabled={boxToRemove === 2} onClick={() => chooseStep1(2, 3)}>box 2</button>
          <button disabled={boxToRemove === 3} onClick={() => chooseStep1(3, 3)}>box 3</button>
        </>
      )}

      {stage === 3 && (
        <p>answer is: {answer}, you are {answer===chosen ? "RIGHT" : "WRONG!"}</p>
      )}
    </div>
  );
}

export default App;
