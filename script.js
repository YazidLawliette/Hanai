var question = document.getElementById("question");
var answer = document.getElementById("answer");
var history = document.getElementById("history");

var apiUrl = `https://widipe.com/openai`;
var aiName = "Han So-hee";

async function sendReq() {
    const questionText = question.value.trim();

    if (questionText === "") {
        alert("Please enter a question.");
        return;
    }

    const nameQuestionPattern = /siapa namaku|siapa namamu|apa namamu|namamu|siapa|nama/i;
    if (nameQuestionPattern.test(questionText)) {
        const botMessage = document.createElement("p");
        botMessage.className = "chat-message";
        botMessage.innerHTML = `Nama aku ${aiName}.`;
        answer.appendChild(botMessage);

        saveHistory(questionText);
        const historyItem = document.createElement("p");
        historyItem.innerHTML = questionText;
        history.appendChild(historyItem);

        question.value = "";
        answer.scrollTop = answer.scrollHeight;
        return; 
    }

    try {
        const loadingMessage = document.createElement("p");
        loadingMessage.className = "loading";
        loadingMessage.innerHTML = "Loading...";
        answer.appendChild(loadingMessage);

        const url = `${apiUrl}?text=${encodeURIComponent(questionText)}`;
        const response = await fetch(url);

        loadingMessage.remove();

        if (!response.ok) {
            throw Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        const userMessage = document.createElement("p");
        userMessage.className = "user-message";
        userMessage.innerHTML = questionText; // Menjaga format huruf asli
        answer.appendChild(userMessage);

        const botMessage = document.createElement("p");
        botMessage.className = "chat-message";
        botMessage.innerHTML = data.result;
        answer.appendChild(botMessage);

        saveHistory(questionText);
        const historyItem = document.createElement("p");
        historyItem.innerHTML = questionText;
        history.appendChild(historyItem);

        question.value = "";
        
        answer.scrollTop = answer.scrollHeight;

    } catch (error) {
        console.log(error.message);
    }
}

function saveHistory(questionText) {
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.push(questionText);
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

window.onload = function() {
    loadHistory();
};

function loadHistory() {
    const savedHistory = JSON.parse(localStorage.getItem('chatHistory'));
    if (savedHistory) {
        savedHistory.forEach(item => {
            const historyItem = document.createElement("p");
            historyItem.innerHTML = item;
            history.appendChild(historyItem);
        });
    }
}

question.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); 
        sendReq(); 
    }
});
