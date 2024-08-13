document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const modelSelect = document.getElementById('model-dropdown');
    const maxTokens = document.getElementById('max-tokens');
    const temperature = document.getElementById('temperature');
    const clearHistoryButton = document.getElementById('clear-history');
    const newChatButton = document.getElementById('new-chat-button');
    const chatHistoryDropdown = document.getElementById('chat-history-dropdown');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    let currentChatId = null;

    function addMessage(role, content) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', role);
        messageElement.textContent = `${role}: ${content}`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message && currentChatId) {
            addMessage('user', message);
            userInput.value = '';

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chatId: currentChatId,
                        message,
                        model: modelSelect.value,
                        maxTokens: parseInt(maxTokens.value),
                        temperature: parseFloat(temperature.value),
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    addMessage('assistant', data.response);
                } else {
                    throw new Error('Failed to get response');
                }
            } catch (error) {
                console.error('Error:', error);
                addMessage('system', 'An error occurred while processing your request.');
            }
        }
    }

    async function createNewChat() {
        try {
            const response = await fetch('/api/chat', { method: 'POST' });
            if (response.ok) {
                const data = await response.json();
                currentChatId = data.chatId;
                chatMessages.innerHTML = '';
                userInput.disabled = false;
                sendButton.disabled = false;
                loadChatHistory();
            } else {
                throw new Error('Failed to create new chat');
            }
        } catch (error) {
            console.error('Error creating new chat:', error);
        }
    }

    async function loadChatHistory() {
        try {
            const response = await fetch('/api/chats');
            if (response.ok) {
                const chats = await response.json();
                chatHistoryDropdown.innerHTML = '<option value="">Select Chat History</option>';
                chats.forEach(chat => {
                    const option = document.createElement('option');
                    option.value = chat.id;
                    option.textContent = chat.title || `Chat ${chat.id}`;
                    chatHistoryDropdown.appendChild(option);
                });
            } else {
                throw new Error('Failed to load chat history');
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }

    async function loadChat(chatId) {
        try {
            const response = await fetch(`/api/chats/${chatId}`);
            if (response.ok) {
                const chat = await response.json();
                currentChatId = chat.id;
                chatMessages.innerHTML = '';
                chat.messages.forEach(msg => addMessage(msg.role, msg.content));
                userInput.disabled = false;
                sendButton.disabled = false;
            } else {
                throw new Error('Failed to load chat');
            }
        } catch (error) {
            console.error('Error loading chat:', error);
        }
    }

    async function clearChatHistory() {
        try {
            const response = await fetch('/api/chats', { method: 'DELETE' });
            if (response.ok) {
                chatMessages.innerHTML = '';
                currentChatId = null;
                userInput.disabled = true;
                sendButton.disabled = true;
                loadChatHistory();
                addMessage('system', 'Chat history cleared.');
            } else {
                throw new Error('Failed to clear chat history');
            }
        } catch (error) {
            console.error('Error clearing chat history:', error);
            addMessage('system', 'Failed to clear chat history.');
        }
    }

    async function loadModels() {
        try {
            const response = await fetch('/api/models');
            if (response.ok) {
                const models = await response.json();
                modelSelect.innerHTML = '';
                models.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model.id;
                    option.textContent = model.name;
                    modelSelect.appendChild(option);
                });
            } else {
                throw new Error('Failed to load models');
            }
        } catch (error) {
            console.error('Error loading models:', error);
        }
    }

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    newChatButton.addEventListener('click', createNewChat);
    clearHistoryButton.addEventListener('click', clearChatHistory);
    chatHistoryDropdown.addEventListener('change', (e) => {
        if (e.target.value) {
            loadChat(e.target.value);
        }
    });

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    maxTokens.addEventListener('input', () => {
        document.getElementById('max-tokens-value').textContent = maxTokens.value;
    });

    temperature.addEventListener('input', () => {
        document.getElementById('temperature-value').textContent = temperature.value;
    });

    loadModels();
    loadChatHistory();
});