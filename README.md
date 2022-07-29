# Typing-Head-To-Head

## [View this project live on Heroku!](https://typing-head-to-head.herokuapp.com/)

Multiplayer functionality can be demoed by opening the webpage in two different browser tabs if no other players are available. 

Typing-Head-To-Head is a web app that allows players to compete against each other in one versus one typing races

Players are first prompted to enter a username before choosing to participate in a public game, a solo game, or a private game.

Once a player has chosen a mode and has been matched into a game they are shown a passage of text. The first player to correctly type each word in the passage is declared the winner.

Players are also able to type messages to each other in a public chat room, or in a private game room.

## Running Typing Head-To-Head locally
1. Clone the repo to your local machine
2. run 'node server.js' from within the /Typing-Head-To-Head/server directory
3. Open another terminal and run 'npm run start-local' from within the /Typing-Head-To-Head/ directory
## Built with

- Front end created using [React](https://reactjs.org/)  
- Back end created using [Express](https://expressjs.com/) (A web framework for [Node.js](https://nodejs.org/en/))
- [Socket.IO](https://socket.io/) for real time communication between the user and the server

## Images
### Multiplayer typing game
![Multiplayer game](README-IMAGES/player_vs_player.png?raw=true "Multiplayer Game")
### Mode selection screen with chat
![Mode selection screen](README-IMAGES/selection_menu.png?raw=true "Mode selection screen with chat")
### Solo typing game
![Mode selection screen](README-IMAGES/solo_game.png?raw=true "Solo Game")
