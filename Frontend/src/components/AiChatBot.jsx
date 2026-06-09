import React, { useState, useEffect, useRef } from "react";
import { API } from "../apiConfig";
import "./AiChatBot.css";

export default function AiChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your AI Hostel Assistant. Ask me anything about your housing block, passes, profile, or hostel statistics!"
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
          { sender: "ai", text: data.message || "Failed to fetch response from AI Assistant. Please try again." }
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

    // 1. Escape HTML to prevent XSS
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // 2. Code blocks: ```code``` -> <pre class="chat-code-block"><code>code</code></pre>
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="chat-code-block"><code>$1</code></pre>');

    // 3. Inline code: `code` -> <code>code</code>
    html = html.replace(/`([^`]+)`/g, '<code class="chat-inline-code">$1</code>');

    // 4. Headers: ### Title -> <h3>Title</h3>
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h4>$1</h4>');
    html = html.replace(/^# (.*?)$/gm, '<h5>$1</h5>');

    // 5. Bold: **text** or __text__ -> <strong>text</strong>
    html = html.replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([\s\S]*?)__/g, '<strong>$1</strong>');

    // 6. Italics: *text* or _text_ -> <em>text</em>
    html = html.replace(/\*([\s\S]*?)\*/g, '<em>$1</em>');
    html = html.replace(/_([\s\S]*?)_/g, '<em>$1</em>');

    // 7. Unordered lists: lines starting with "- " or "* " (with optional spaces) -> <li>
    // We group consecutive list items together into <ul>
    const lines = html.split("\n");
    let inList = false;
    let inNumList = false;
    const processedLines = [];

    for (let line of lines) {
      const trimmed = line.trim();
      
      // Unordered list item matches starting with "- ", "* ", or "• "
      const ulMatch = trimmed.match(/^[-*•]\s+(.*)$/);
      // Ordered list item
      const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);

      if (ulMatch) {
        if (inNumList) {
          processedLines.push("</ol>");
          inNumList = false;
        }
        if (!inList) {
          processedLines.push('<ul class="chat-list">');
          inList = true;
        }
        processedLines.push(`<li>${ulMatch[1]}</li>`);
      } else if (olMatch) {
        if (inList) {
          processedLines.push("</ul>");
          inList = false;
        }
        if (!inNumList) {
          processedLines.push('<ol class="chat-num-list">');
          inNumList = true;
        }
        processedLines.push(`<li>${olMatch[2]}</li>`);
      } else {
        if (inList) {
          processedLines.push("</ul>");
          inList = false;
        }
        if (inNumList) {
          processedLines.push("</ol>");
          inNumList = false;
        }
        
        if (trimmed) {
          // Normal paragraph
          processedLines.push(`<p class="chat-paragraph">${line}</p>`);
        } else {
          // Empty line
          processedLines.push('<div class="chat-spacer"></div>');
        }
      }
    }

    if (inList) processedLines.push("</ul>");
    if (inNumList) processedLines.push("</ol>");

    html = processedLines.join("\n");

    return (
      <div className="chat-message-html" dangerouslySetInnerHTML={{ __html: html }} />
    );
  };

  return (
    <div className="ai-chatbot-container">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button className="chatbot-toggle-btn" onClick={() => setIsOpen(true)} title="Ask AI Assistant">
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
                <h4 className="chatbot-title">AI Assistant</h4>
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
