import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameInput from '../GameInput';

test('If Typing is finished and the player won, display a win message', () => {
    render(
        <GameInput
            typingFinished={true}
            raceWinner={true}/>
    );
    expect(screen.queryByRole('heading', {name: "You win!"})).toBeTruthy();
    expect(screen.queryByRole('heading', {name: "You lose"})).not.toBeTruthy();
});

test('If Typing is finished and the player lost, display a losing message', () => {
    render(
        <GameInput
            typingFinished={true}
            raceWinner={false}/>
    );
    expect(screen.queryByRole('heading', {name: "You lose"})).toBeTruthy();
    expect(screen.queryByRole('heading', {name: "You win!"})).not.toBeTruthy();
});

test('props playAgain will be called if the user presses the Play Again button', () => {
    let playAgainCalled = false;
    render(
        <GameInput
            typingFinished={true}
            raceWinner={true}
            playAgain={()=> playAgainCalled = true}/>
    );
    expect(playAgainCalled).not.toBeTruthy();
    userEvent.click(screen.getByRole('button', {name: "Play again"}));
    expect(playAgainCalled).toBeTruthy();
});

test('props leaveGame will be called if the user presses the Leave game button', () => {
    let leaveGameCalled = false;
    render(
        <GameInput
            typingFinished={true}
            raceWinner={true}
            leaveGame={()=> leaveGameCalled = true}/>
    );
    expect(leaveGameCalled).not.toBeTruthy();
    userEvent.click(screen.getByRole('button', {name: "Leave game"}));
    expect(leaveGameCalled).toBeTruthy();
});

test('TypingInput is disabled if the game has not started', () => {
    render(
        <GameInput
            typingFinished={false}
            gameStarted={false}/>
    );
    expect(screen.queryByRole('textbox')).toBeDisabled();
});

test('TypingInput is not disabled if the game has  started', () => {
    render(
        <GameInput
            typingFinished={false}
            gameStarted={true}/>
    );
    expect(screen.queryByRole('textbox')).not.toBeDisabled();
});

test('GameInputs props compareInput is called when the user types in the textbox', () => {
    let testCompareInput = false;
    render(
        <GameInput
            typingFinished={false}
            gameStarted={true}
            compareInput={() => testCompareInput = true}/>
    );
    expect(testCompareInput).not.toBeTruthy();
    userEvent.type(screen.getByRole('textbox'), 'test');
    expect(testCompareInput).toBeTruthy();
});