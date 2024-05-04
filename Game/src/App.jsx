import { useEffect, useState } from "react";
import "./App.css";
import Square from "./Component/square";
import { StartButton } from "./Component/Startbutton";
import ReactLoading from "react-loading";
import { PlayerCard } from "./Component/playerCard";

const renderFrom = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

function App() {
  const [mark, setMark] = useState(renderFrom);
  const [currPlayer, setCurrPlayer] = useState("circle");
  const [finishState, setFinishState] = useState(false);
  const [finishArray, setFinishArray] = useState([]);
  const [playOnline, setPlayOnline] = useState(false);
  const [socket, setSocket] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState(null);
  const [playingAs, setPlayingAs] = useState(null);

  const checkWinner = () => {
    // Check rows
    for (let row = 0; row < mark.length; row++) {
      if (
        mark[row][0] !== null &&
        mark[row][0] === mark[row][1] &&
        mark[row][1] === mark[row][2]
      ) {
        setFinishArray([row * 3 + 0, row * 3 + 1, row * 3 + 2]);
        return mark[row][0];
      }
    }

    // Check columns
    for (let col = 0; col < mark.length; col++) {
      if (mark[0][col] === mark[1][col] && mark[1][col] === mark[2][col]) {
        setFinishArray([0 * 3 + col, 1 * 3 + col, 2 * 3 + col]);
        return mark[0][col];
      }
    }

    // Check diagonals
    if (mark[0][0] === mark[1][1] && mark[1][1] === mark[2][2]) {
      setFinishArray([0 * 3 + 0, 1 * 3 + 1, 2 * 3 + 2]);
      return mark[0][0];
    }
    if (mark[0][2] === mark[1][1] && mark[1][1] === mark[2][0]) {
      setFinishArray([0 * 3 + 2, 1 * 3 + 1, 2 * 3 + 0]);
      return mark[0][2];
    }

    //for draw

    const isDrawMatch = mark.flat().every((e) => {
      if (e === "circle" || e === "cross") {
        return true;
      }
    });
    if (isDrawMatch) {
      return "draw";
    }

    // console.log(isDrawMatch)
    // No winner found
    return null;
  };

  useEffect(() => {
    const winner = checkWinner();
    if (winner) {
      setFinishState(winner);
    }
  }, [mark]);

  // socket?.on("playerMoveFromServer", (data) => {
  //   const id = data.state.id;
  //   setMark((prev) => {
  //     const newState = [...prev];
  //     const rowIndex = Math.floor(id / 3);
  //     const colindex = +(id % 3);
  //     newState[rowIndex][colindex] = data.state.sign;
  //     console.log(newState);
  //     return newState;
  //   });

  //   setCurrPlayer(data.state.sign == "circle" ? "cross" : "circle");
  // });

  socket?.on("OpponentNotFound", () => {
    setOpponentName(false);
  });

  socket?.on("playerMoveFromServer", (data) => {
    let flag = false;
    const id = data.state.id;
    setMark((prevState) => {
      let newState = [...prevState];
      const rowIndex = Math.floor(id / 3);
      const colIndex = id % 3;
      if (
        !isNaN(newState[rowIndex][colIndex]) &&
        Number.isInteger(newState[rowIndex][colIndex])
      ) {
        newState[rowIndex][colIndex] = data.state.sign;
       // console.log(newState[rowIndex][colIndex]);
        flag = true;
      }
      // newState[rowIndex][colIndex] = data.state.sign;
      return newState;
    });
    setCurrPlayer(data.state.sign === "circle" ? "cross" : "circle");
  });

  socket?.on("opponentLeftMatch", () => {
    setFinishState("opponentLeftMatch");
  });

  socket?.on("OpponentNotFound", function () {
    setOpponentName(false);
  });

  socket?.on("OpponentFound", (data) => {
   // console.log(data);
    setPlayingAs(data.playingAs);
    setOpponentName(data.opponentName);
  });

  if (!playOnline) {
    //console.log(playOnline)
    return (
      <StartButton
        setPlayerName={setPlayerName}
        opponentName={opponentName}
        playOnline={playOnline}
        socket={socket}
        setSocket={setSocket}
        setPlayOnline={setPlayOnline}
      />
    );
  }

  if (playOnline && !opponentName) {
   // console.log(playOnline);
    return (
      <div className="loader">
        <div className="waiting-message">
          <p className="waiting-text">Waiting for opponent...</p>
          <div className="loader-container">
            <ReactLoading
              type={"spin"}
              color={"#36D7B7"}
              height={50}
              width={50}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
    <div className="gameBox">
      <div className="curr_player">
        {/* <h1 className="title" >You</h1> */}
        <PlayerCard
          playerName={playerName}
          currPlayer={currPlayer}
          playingAs={ playingAs}
          imageUrl="https://tse1.mm.bing.net/th?id=OIP.kT5I04V0MSQ-BgYzBe6HAQAAAA&pid=Api&P=0&h=180"
        />
        {/* <div
          className={`left-side ${
            currPlayer === playingAs ? "current-move-" + currPlayer : ""
          }`}
        >
          {playerName}
        </div> */}
      </div>
      <div className="Opponent_player">
        {/* <h1 style={{ textAlign: "center" }}>Opponent</h1> */}
        <PlayerCard
          playerName={opponentName}
          currPlayer={currPlayer}
          playingAs={ playingAs}
          imageUrl="https://i.pinimg.com/originals/e0/9f/d0/e09fd0ad495b9a86b94080693c94a77c.jpg"
        />
        {/* <div
          className={`right-side ${
            currPlayer !== playingAs ? "current-move-" + currPlayer : ""
          }`}
        >
          {opponentName}
        </div> */}
      </div>
      </div>
      <div>
        <div className="main-div">
          <div>
            <h1 className="background game-heading">Tic Tac Toe</h1>
            <div className="square-wrapper">
              {renderFrom.map((arr, rowindex) => {
                return arr.map((e, colindex) => {
                  return (
                    <Square
                      id={rowindex * 3 + colindex}
                      setMark={setMark}
                      finishArray={finishArray}
                      socket={socket}
                      mark={mark}
                      playingAs={playingAs}
                      setFinishState={setFinishState}
                      finishState={finishState}
                      currPlayer={currPlayer}
                      setCurrPlayer={setCurrPlayer}
                      currElement={e}
                      key={rowindex * 3 + colindex}
                    />
                  );
                });
              })}
            </div>
          </div>
        </div>
        {finishState && finishState !== "draw" && (
          <h2 className="finished-state">
            {" "}
            {finishState === playingAs ? "You " : finishState} won the game
          </h2>
        )}
        {finishState && finishState === "draw" && (
          <h2 className="finished-state">It's draw</h2>
        )}
        {!finishState && opponentName && (
        <h2 className="finished-state">
          {currPlayer !== "circle" ? `It's ${opponentName}'s turn` : "It's Your Turn"}
        </h2>
      )}
        {!finishState && finishState == "opponentLeftMatch" && (
          <h2 className="finished-state">
            You Won the match because opponent left the match;
          </h2>
        )}
      </div>
      </div>
  );
}

export default App;
