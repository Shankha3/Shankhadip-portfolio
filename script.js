const menuBtn = document.getElementById("menuBtn");
const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });
});
const chatbotToggle = document.getElementById("chatbotToggle");
const chatbotWindow = document.getElementById("chatbotWindow");
const chatbotClose = document.getElementById("chatbotClose");
const chatbotInput = document.getElementById("chatbotInput");
const chatbotSend = document.getElementById("chatbotSend");
const chatbotMessages = document.getElementById("chatbotMessages");

chatbotToggle.addEventListener("click", () => {
    chatbotWindow.classList.toggle("active");
});

chatbotClose.addEventListener("click", () => {
    chatbotWindow.classList.remove("active");
});

function addMessage(message, type) {
    const div = document.createElement("div");
    div.className = type === "user" ? "user-message" : "bot-message";
    div.textContent = message;
    chatbotMessages.appendChild(div);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

async function sendMessage() {
    const message = chatbotInput.value.trim();

    if (!message) return;

    addMessage(message, "user");
    chatbotInput.value = "";

try {
    const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Request failed");
    }

    addMessage(data.reply, "bot");
} catch (error) {
    addMessage("Sorry, I couldn't connect to the AI right now.", "bot");
}
}

chatbotSend.addEventListener("click", sendMessage);

chatbotInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});