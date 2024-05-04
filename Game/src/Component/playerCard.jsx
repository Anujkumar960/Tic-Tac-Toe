import React from "react";
import "../Component/playerCard.css";

export const PlayerCard = ({ playerName, imageUrl,currPlayer,playingAs }) => {
  return (
    <>
      <div className={`player-card ${currPlayer === playingAs ? "current-moved-"+ currPlayer : ""}
`}>
      <img src={imageUrl} alt={playerName} />
      <p>{playerName}</p>
      </div>
      
    </>
  

  );
};


