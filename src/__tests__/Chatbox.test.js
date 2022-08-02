import { render, screen } from '@testing-library/react';
import ChatBox from '../ChatBox';

test('Chatbox will display the chatMessages props', () => {
    let testchatMessages = "testchatMessage";
    render(
        <ChatBox
            chatMessages={testchatMessages}/>
    );
    expect(screen.queryByText(testchatMessages)).toBeTruthy();
});