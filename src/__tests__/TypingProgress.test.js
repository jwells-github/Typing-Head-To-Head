import { render, screen } from '@testing-library/react';
import TypingProgress from '../TypingProgress';

let testWords = ["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"];


test('Words that have been progressed through by the player will have the playerCompletedWord class', () => {
    let classToTest = "playerCompletedWord"
    render(
        <TypingProgress
            words={testWords}
            progress={1}
            opponent={false}/>
    );
    expect(screen.getAllByRole('listitem').find(listitem => listitem.textContent === testWords[0])).toBeTruthy();
    expect(screen.getAllByRole('listitem').find(listitem => listitem.textContent === testWords[0])).toHaveClass(classToTest);
    
    expect(screen.getAllByRole('listitem').find(listitem => listitem.textContent === testWords[1])).toBeTruthy();
    expect(screen.getAllByRole('listitem').find(listitem => listitem.textContent === testWords[1])).not.toHaveClass(classToTest);
});

test('Words that have been progressed through by the opponent will have the opponentCompletedWord class', () => {
    let classToTest = "opponentCompletedWord"
    render(
        <TypingProgress
            words={testWords}
            progress={1}
            opponent={true}/>
    );
    expect(screen.getAllByRole('listitem').find(listitem => listitem.textContent === testWords[0])).toBeTruthy();
    expect(screen.getAllByRole('listitem').find(listitem => listitem.textContent === testWords[0])).toHaveClass(classToTest);
    
    expect(screen.getAllByRole('listitem').find(listitem => listitem.textContent === testWords[1])).toBeTruthy();
    expect(screen.getAllByRole('listitem').find(listitem => listitem.textContent === testWords[1])).not.toHaveClass(classToTest);
});

test('The current word will have the currentWord class for the player', () => {
    let classToTest = "currentWord"
    render(
        <TypingProgress
            words={testWords}
            progress={1}
            opponent={false}/>
    );
    expect(screen.getAllByRole('listitem').find(listitem => listitem.textContent === testWords[0])).toBeTruthy();
    expect(screen.getAllByRole('listitem').find(listitem => listitem.textContent === testWords[0])).not.toHaveClass(classToTest);
    
    expect(screen.getAllByRole('listitem').find(listitem => listitem.textContent === testWords[1])).toBeTruthy();
    expect(screen.getAllByRole('listitem').find(listitem => listitem.textContent === testWords[1])).toHaveClass(classToTest);
});

test('The current word will not have the currentWord class for the opponent', () => {
    let classToTest = "currentWord"
    render(
        <TypingProgress
            words={testWords}
            progress={1}
            opponent={true}/>
    );
    
    expect(screen.getAllByRole('listitem').find(listitem => listitem.textContent === testWords[1])).toBeTruthy();
    expect(screen.getAllByRole('listitem').find(listitem => listitem.textContent === testWords[1])).not.toHaveClass(classToTest);
});