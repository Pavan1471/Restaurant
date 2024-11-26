import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Restaurant Menu Data
const menuData = [
  { _id: "1", itemName: "Margherita Pizza", category: "pizza", price: 300 },
  { _id: "2", itemName: "Veggie Supreme Pizza", category: "pizza", price: 400 },
  { _id: "3", itemName: "Classic Burger", category: "burger", price: 200 },
  { _id: "4", itemName: "Chicken Burger", category: "burger", price: 250 },
  { _id: "5", itemName: "Caesar Salad", category: "salad", price: 150 },
  { _id: "6", itemName: "Greek Salad", category: "salad", price: 180 },
];

// Predefined Responses
const predefinedResponses = {
  welcome: "Welcome to Foodie GPT! I'm here to help you with menu recommendations and orders.",
  deliveryTime: "Delivery usually takes 30-45 minutes. Let me know what you'd like to order!",
  paymentMethods: "We accept UPI, debit cards, credit cards, and cash on delivery.",
  customerSupport: "For help with orders, call our support team at 18009868676.",
  returnPolicy: "Food orders cannot be returned. Please check your order before confirming.",
  orderStatus: "To check your order status, visit the 'My Orders' section on our app.",
};

// Utility Functions
const getRecommendations = (category) => {
  return menuData
    .filter((item) => item.category.toLowerCase() === category.toLowerCase())
    .map((item) => `${item.itemName} - ₹${item.price}`)
    .join("\n");
};

const sanitizeText = (input) => {
  const lines = input.split("\n");
  return lines
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .join("\n");
};

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const apiKey = "AIzaSyDaVF1OZSbYNPgLRz-lFG2uznc2OP0eZKQ";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const speak = (text) => {
    if (isMuted || !text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const voiceInput = event.results[0][0].transcript;
      setUserInput(voiceInput);
      handleGenerate(voiceInput);
    };

    recognition.onerror = (error) => {
      console.error("Voice recognition error:", error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
  };



  const handleGenerate = async (inputText = userInput) => {
    if (!inputText.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: inputText }]);
    setIsLoading(true);

    const lowerCaseInput = inputText.toLowerCase().trim();

    // Predefined responses
    if (predefinedResponses.welcome.toLowerCase().includes(lowerCaseInput)) {
      const response = predefinedResponses.welcome;
      setMessages((prev) => [...prev, { sender: "bot", text: response }]);
      speak(response);
      setIsLoading(false);
      setUserInput("");
      return;
    }

    // Category-based recommendations
    let category = null;
    if (lowerCaseInput.includes("pizza")) category = "pizza";
    else if (lowerCaseInput.includes("burger")) category = "burger";
    else if (lowerCaseInput.includes("salad")) category = "salad";

    if (category) {
      const recommendations = getRecommendations(category);
      const response = `Here are some ${category} recommendations:\n${recommendations}`;
      setMessages((prev) => [...prev, { sender: "bot", text: response }]);
      speak(response);
      setIsLoading(false);
      setUserInput("");
      return;
    }

    // AI response
    const parts = [
      { text: `You are a restaurant assistant bot named Foodie GPT.` },
      { text: `User input: ${inputText}` },
    ];

    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain",
        },
      });
      const botResponse = sanitizeText(result.response.text());
      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
      speak(botResponse);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMsg = "An error occurred while generating a response.";
      setMessages((prev) => [...prev, { sender: "bot", text: errorMsg }]);
      speak(errorMsg);
    } finally {
      setIsLoading(false);
      setUserInput("");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          height: "500px",
          overflowY: "auto",
          border: "1px solid #DDD",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "20px",
          backgroundColor: "#F9F9F9",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "10px 0",
            }}
          >
              <div
                style={{
                  display: "inline-block",
                  padding: "10px",
                  borderRadius: "5px",
                  backgroundColor: msg.sender === "user" ? "#D1E7FF" : "#FFF3CD",
                  color: "#333",
                }}
              >
                {msg.text}
              </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <em>Loading...</em>
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px",justifyContent:"space-around" }}>
      <button
        onClick={() => setIsMuted(!isMuted)}
        style={{
          padding: "10px",
          backgroundColor: isMuted ? "#DC3545" : "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginRight: "20px"
        }}
      >
        {isMuted ? "Unmute" : "Mute"}
      </button>
        <button
          onClick={handleVoiceInput}
          disabled={isListening}
          style={{
            padding: "10px",
            marginRight: "10px",
            backgroundColor: isListening ? "#AAA" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: isListening ? "not-allowed" : "pointer",
          }}
        >
          {isListening ? "Listening..." : "Speak"}
        </button>
        <input
          type="text"
          placeholder="Ask me something..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          style={{
            width: "70%",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #DDD",
            marginRight: "10px",
          }}
        />
        <button
          onClick={() => handleGenerate()}
          disabled={isLoading}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: isLoading ? "not-allowed" : "pointer",
            backgroundColor: isLoading ? "#AAA" : "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          {isLoading ? "Processing..." : "Send"}
        </button>
      </div>
      
    </div>
  );
};

export default App;
