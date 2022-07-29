import { render, screen } from '@testing-library/react';
import Player from '../Player';

test('Player will return an empty div when soloGame and opponent are true', () => {
    let testUsername = 'testUsername';
    render(
        <Player
            soloGame={true}
            opponent={true}
            username={testUsername}/>
    );
    expect(screen.queryByRole('heading', {name: testUsername})).toBeNull();
});

test('Player will append (You) to a username if opponent and soloGame are false', () => {
    let testUsername = 'testUsername';
    render(
        <Player
            soloGame={false}
            opponent={false}
            username={testUsername}
            winLoss={"0 Wins : 0 Losses"}
            wpm={"10"}
            words={["red","apples","are","tasty"]}
            progress={0}/>
    );
    expect(screen.queryByRole('heading', {name: testUsername + ' (You)'})).toBeTruthy();
    expect(screen.queryByRole('heading', {name: testUsername})).toBeNull();
});


test('Player will not append (You) to a username if opponent is false and soloGame is true', () => {
    let testUsername = 'testUsername';
    render(
        <Player
            soloGame={true}
            opponent={false}
            username={testUsername}
            winLoss={"0 Wins : 0 Losses"}
            wpm={"10"}
            words={["red","apples","are","tasty"]}
            progress={0}/>
    );
    expect(screen.queryByRole('heading', {name: testUsername})).toBeTruthy();
    expect(screen.queryByRole('heading', {name: testUsername + ' (You)'})).toBeNull();
});

test('Player will display the given win loss record', () => {
    render(
        <Player
            soloGame={true}
            opponent={false}
            username={"testUsername"}
            winLoss={"1 Wins : 2 Losses"}
            wpm={"10"}
            words={["red","apples","are","tasty"]}
            progress={0}/>
    );
    expect(screen.getByText("1 Wins : 2 Losses")).toBeTruthy();
});

test('Player will display the given Record WPM', () => {
    let wpm = 10;
    render(
        <Player
            soloGame={true}
            opponent={false}
            username={"testUsername"}
            winLoss={"0 Wins : 0 Losses"}
            wpm={wpm}
            words={["red","apples","are","tasty"]}
            progress={0}/>
    );
    expect(screen.queryByRole('heading', {name: wpm + ' WPM'})).toBeTruthy();
});

test('Player will display the passageTitle once typing is finished', () => {
    let testPassageTitle = "testPassageTitle"
    render(
        <Player
            soloGame={true}
            opponent={false}
            username={"testUsername"}
            winLoss={"0 Wins : 0 Losses"}
            wpm={"10"}
            words={["red","apples","are","tasty"]}
            progress={0}
            typingFinished={true}
            passageTitle={testPassageTitle}
            />
    );
    expect(screen.queryByText("This was a passage from " + testPassageTitle)).toBeTruthy();
});

test('Player will not display the passageTitle if typing is not finished', () => {
    let testPassageTitle = "testPassageTitle"
    render(
        <Player
            soloGame={true}
            opponent={false}
            username={"testUsername"}
            winLoss={"0 Wins : 0 Losses"}
            wpm={"10"}
            words={["red","apples","are","tasty"]}
            progress={0}
            typingFinished={false}
            passageTitle={testPassageTitle}
            />
    );
    expect(screen.queryByText("This was a passage from " + testPassageTitle)).toBeNull();
});