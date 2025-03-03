const choices=["rock","paper","scissors"];
const playerdis = document.getElementById("playerdis");
const computerdis =document.getElementById("computerdis");
const resultdisplay=document.getElementById("resultdisplay");

function playgame(playerchoice){
    const computerchoice = choices[Math.floor(Math.random() *  3)];
    console.log(computerchoice);
    let result = "";
    if(playerchoice=== computerchoice){
        result="its a Tie";
    }
    else{
        switch(playerchoice){
            case "rock":
                result = (computerchoice === "Scissors") ? "You Lose": "You Win";  
                break;
            case "paper":
                result=(computerchoice === "rock") ? "You Win": "You Lose";
                break;
            case "scissors":
                result=(computerchoice === "paper") ? "You Win": "You Lose";
                break;

                  }
    }
    playerdis.textContent = `Player: ${playerchoice}`;
    computerdis.textContent = `Computer: ${computerchoice}`;
    resultdisplay.textContent = result;
    

}