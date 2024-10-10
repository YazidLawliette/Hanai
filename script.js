var question = document.getElementById("question");
var answer = document.getElementById("answer");
var history = document.getElementById("history");
var apiUrl = `https://widipe.com/openai`;

question.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendReq();
    }
});

async function sendReq() {
    const questionText = question.value.trim();

    if (questionText === "") {
        alert("Please enter a question.");
        return;
    }

    const placeholder = document.getElementById("placeholder");
    if (placeholder) {
        placeholder.style.display = "none";
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
        userMessage.innerHTML = questionText;
        answer.appendChild(userMessage);

        const botMessage = document.createElement("p");
        botMessage.className = "chat-message";
        botMessage.innerHTML = handleResponse(data.result, questionText);
        answer.appendChild(botMessage);

        question.value = "";
        answer.scrollTop = answer.scrollHeight;

    } catch (error) {
        console.log(error.message);
    }
}

function handleResponse(responseText, questionText) {
    const nameKeywords = /siapa namamu|apa namamu|namamu siapa|siapa nama kamu|namamu|nama/i;
    if (nameKeywords.test(questionText)) {
        return "Nama aku Han So-hee.";
    }

    return responseText;
}