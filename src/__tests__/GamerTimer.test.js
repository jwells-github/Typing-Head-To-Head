import { render, screen } from '@testing-library/react';
import GameTimer from '../GameTimer';

test('If gameStarted is false, the countdown to the start of the game will be displayed', () => {
    let testgameCountDown = 10;
    render(
        <GameTimer
            gameStarted={false}
            gameCountDown={testgameCountDown}/>
    );
    expect(screen.queryByRole('heading', {name: "Game starting in " + testgameCountDown})).toBeTruthy();
});

test('If gameStarted is true, the timer of the current game will be displayed', () => {
    let startingTime = new Date('June 14 , 2022 23:15:30');
    let currentTime = new Date('June 14, 2022 23:15:30');
    startingTime.setSeconds(0);
    currentTime.setSeconds(1);
    
    let testTypingTimer =  currentTime - startingTime;
    
    render(
        <GameTimer
            gameStarted={true}
            typingTimer={testTypingTimer}/>
    );
    expect(screen.queryByRole('heading', {name: "0:01"})).toBeTruthy();
});