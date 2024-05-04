import Swal from 'sweetalert2';
import { useEffect } from 'react';
import './StartButton.css';
import { io } from "socket.io-client" ;
import { Typewriter } from "react-simple-typewriter";
import logo from "../../public/logo.png"

const handleInput = async () => {
    const { value: username } = await Swal.fire({
        title: "Enter your username",
        input: "text",
        inputLabel: "Username",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        inputPlaceholder: "Enter your username",
        inputValidator: (value) => {
            if (!value) {
                return "Username cannot be empty";
            }
        }
    });
    if (username) {
        Swal.fire(`Entered username: ${username}`);
        return username;
    }
};

export const StartButton = ({ setPlayerName,playOnline,opponentName,setPlayOnline,setSocket ,socket}) => {
    

    const handleClick=async()=>{
        const user=await handleInput();
        if(!user){
            return;
        }
        setPlayerName(user);
        setPlayOnline(prev=>!prev);
        

        //setting connection with backend
        const newSocket= io("http://localhost:3000",{
         autoConnect:true,
       })

       newSocket?.emit("request_to_play",{
        playerName:user
       })

       setSocket(newSocket);

       socket?.on("connect",()=> {
        setPlayOnline(prev=>!prev);
      //  console.log(playOnline);
      });
    }
   
   
  
  
  
   
     

  return (
    <div className="backgroundForButton">
      <div className='logo'><img src={logo} alt="logo" /></div>
      <div className='TypeWriter'>
               <Typewriter
                  words={["Welcome to Tic-Tac-Toe Game.", "Click on the Below buttton to Start the Game."]}
                  loop
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1000}
                />
        </div>
        
      <button className="container" onClick={handleClick}>
        <span role="img" aria-label="tic-tac-toe" className="iconButton">⭕❌</span> Start Tic Tac Toe Game <span role="img" aria-label="tic-tac-toe" className="icon">❌⭕</span>
      </button>
    </div>
  );
};


