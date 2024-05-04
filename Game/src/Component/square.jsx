import React, { useState } from "react";
import "../Component/square.css";

const circleSvg = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke="black"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>{" "}
    </g>
  </svg>
);

const crossSvg = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        d="M19 5L5 19M5.00001 5L19 19"
        stroke="black"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>{" "}
    </g>
  </svg>
);

const Square = ({
  currElement,
  playingAs,
  setMark,
  mark,
  id,
  currPlayer,
  finishArray,
  setCurrPlayer,
  finishState,
  socket,
}) => {
  const [icon, setIcon] = useState(null);

  const handleClick = () => {
    const rowIndex = Math.floor(id / 3);
    const colindex = +(id % 3);
    if(isNaN(mark[rowIndex][colindex]) && !Number.isInteger(mark[rowIndex][colindex])){
      return;
    }
    

    if (playingAs !== currPlayer) {
        return;
      }

    if (finishState) {
      return;
    }
    if (icon==null) {
      const newIcon = currPlayer === "circle" ? circleSvg : crossSvg;
      setIcon(newIcon);
    //  console.log(icon);
      const prevCurrPlayer = currPlayer;
   //   console.log(prevCurrPlayer);
      socket?.emit("playerMoveFromClient", {
        state: {
          id,
          sign: prevCurrPlayer,
        },
      });
      
      setCurrPlayer((prev) => (prev == "circle" ? "cross" : "circle"));

      setMark((prev) => {
        const newState = [...prev];
        const rowIndex = Math.floor(id / 3);
        const colindex = +(id % 3);
        if (!isNaN(newState[rowIndex][colindex]) && Number.isInteger(newState[rowIndex][colindex])) {
          newState[rowIndex][colindex] = prevCurrPlayer;
         // console.log(newState[rowIndex][colindex]);
        }
        //console.log(rowIndex,colindex);
        return newState; //returning new 2D matrix using Player's mark
      });
    }
  };
  return (
    <div
      className={`square ${finishState ? "not-allowed" : ""} ${
        currPlayer !== playingAs ? "not-allowed" : ""
      } ${finishArray.includes(id) ? finishState + "-won" : ""}
        ${finishState && finishState !== playingAs ? "grey-background" : ""}
      `}
      onClick={handleClick}
    >
      {currElement === "circle"
        ? circleSvg
        : currElement === "cross"
        ? crossSvg
        : icon}
    </div>
  );
};

export default Square;
