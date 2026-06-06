import React, { useState, useEffect, useRef } from "react";
import { API } from "../apiConfig";
import "./AiChatBot.css";

export default function AiChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your Gemini AI Hostel Assistant. Ask me anything about your housing block, passes, profile, or hostel statistics!"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("STUDENT");
  const messagesEndRef = useRef(null);

  // Retrieve user role from local storage
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user && user.Type) {
        setUserRole(user.Type);
      }
    } catch (err) {
      console.error("Error parsing user role for chatbot", err);
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);



  const handleSendMessage = async (textToSend) => {
    const query = textToSend.trim();
    if (!query) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    setInputValue("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ question: query })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessages((prev) => [...prev, { sender: "ai", text: data.answer }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: data.message || "Failed to fetch response from Gemini. Please try again." }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Network error occurred. Make sure your backend server is active." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  // Safe helper to render basic markdown bold/lists/newlines in chat messages
  const renderFormattedText = (text) => {
    if (!text) return "";
    return text.split("\n").map((line, idx) => {
      let formattedLine = line;
      // Bold Markdown replacement: **text** -> <strong>text</strong>
      const boldRegex = /\*\*(.*?)\*\*/g;
      formattedLine = formattedLine.replace(boldRegex, "<strong>$1</strong>");

      // Bullet List replacement: - text -> &bull; text
      if (formattedLine.trim().startsWith("- ")) {
        return (
          <div key={idx} className="chat-bullet" style={{ paddingLeft: "15px", marginBottom: "5px" }} dangerouslySetInnerHTML={{ __html: `&bull; ${formattedLine.trim().substring(2)}` }} />
        );
      }
      return (
        <p key={idx} style={{ margin: "0 0 8px 0" }} dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });
  };

  return (
    <div className="ai-chatbot-container">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button className="chatbot-toggle-btn" onClick={() => setIsOpen(true)} title="Ask Gemini AI">
          <div className="ai-pulse-ring"></div>
          <svg className="chatbot-svg-icon" viewBox="0 0 24 24" width="28" height="28">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98 1 4.28L1.61 21.39c-.38.76.36 1.5 1.12 1.12l5.11-1.39C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
          </svg>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="chatbot-window glass-card animate-chat-up">
          <div className="chatbot-header">
            <div className="chatbot-title-group">
              <div className="chatbot-status-dot"></div>
              <div>
                <h4 className="chatbot-title">Gemini AI</h4>
                <p className="chatbot-subtitle">Hostel Companion • {userRole}</p>
              </div>
            </div>
            <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>&times;</button>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message-row ${msg.sender === "user" ? "user-row" : "ai-row"}`}>
                {msg.sender === "ai" && (
                  <div className="ai-avatar-circle">✦</div>
                )}
                <div className="chat-bubble">
                  {renderFormattedText(msg.text)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-message-row ai-row">
                <div className="ai-avatar-circle animate-pulse-fast">✦</div>
                <div className="chat-bubble typing-bubble">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form className="chatbot-input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="chatbot-text-input"
              placeholder="Ask anything about the hostel record..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
              required
            />
            <button type="submit" className="chatbot-send-btn" disabled={loading || !inputValue.trim()}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
