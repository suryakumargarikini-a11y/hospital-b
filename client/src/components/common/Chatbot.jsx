import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Chatbot.css';

const QUICK_CHIPS = [
    { label: '🩺 Check Symptoms', message: 'I want to check my symptoms' },
    { label: '📅 Book Appointment', message: 'I want to book an appointment' },
    { label: '👨‍⚕️ Find a Doctor', message: 'I need to find a doctor' },
    { label: '🚨 Emergency', message: 'This is an emergency' },
    { label: '📞 Contact', message: 'How can I contact the hospital?' },
];

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ── Markdown-like Renderer ────────────────────────────────────────────────────
function RenderMessage({ text }) {
    const lines = text.split('\n');

    return (
        <div className="medibot-content">
            {lines.map((line, i) => {
                // Section headers like **📋 Summary**
                if (/^\*\*(.+)\*\*$/.test(line.trim())) {
                    const heading = line.trim().replace(/^\*\*|\*\*$/g, '');
                    return <p key={i} className="medibot-section-header">{heading}</p>;
                }

                // Bullet list items
                if (/^[-•]\s/.test(line.trim())) {
                    const content = line.trim().replace(/^[-•]\s/, '');
                    return (
                        <div key={i} className="medibot-bullet">
                            <span className="medibot-bullet-dot">•</span>
                            <span>{renderInline(content)}</span>
                        </div>
                    );
                }

                // Numbered list
                if (/^\d+[.)]\s/.test(line.trim())) {
                    return (
                        <div key={i} className="medibot-bullet">
                            <span className="medibot-bullet-dot">{line.trim().match(/^\d+/)[0]}.</span>
                            <span>{renderInline(line.trim().replace(/^\d+[.)]\s/, ''))}</span>
                        </div>
                    );
                }

                // Blank line → spacer
                if (!line.trim()) return <div key={i} className="medibot-spacer" />;

                // Normal paragraph
                return <p key={i} className="medibot-para">{renderInline(line)}</p>;
            })}
        </div>
    );
}

function renderInline(text) {
    // Handle **bold** and *italic*
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return part;
    });
}

// ── Main Chatbot Component ────────────────────────────────────────────────────
export default function Chatbot() {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            from: 'bot',
            text: "👋 Hi! I'm **MediBot**, your AI Medical Assistant.\n\nI can help you:\n• 🩺 Analyze symptoms and possible conditions\n• 👨‍⚕️ Find the right doctor for your needs\n• 📅 Book an appointment directly\n• 🚨 Guide you in emergencies\n\nHow can I help you today?",
            actions: [
                { label: '🩺 Check My Symptoms', url: null, message: 'I want to check my symptoms' },
                { label: '📅 Book Appointment', url: '/book-appointment' },
                { label: '👨‍⚕️ Find a Doctor', url: null, message: 'I need to find a doctor' },
            ],
            time: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping, isOpen]);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setHasUnread(false);
        }
    }, [isOpen]);

    // Build history array from current messages (exclude the initial welcome)
    const buildHistory = (currentMessages) =>
        currentMessages
            .slice(1) // skip welcome
            .filter(m => m.from === 'user' || (m.from === 'bot' && m.text))
            .map(m => ({ from: m.from, text: m.text }));

    const sendMessage = async (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        const userMsg = { from: 'user', text: trimmed, time: new Date() };
        setMessages((prev) => {
            const next = [...prev, userMsg];
            doSend(trimmed, next);
            return next;
        });
        setInput('');
        setIsTyping(true);
    };

    const doSend = async (trimmed, currentMessages) => {
        try {
            const history = buildHistory(currentMessages.slice(0, -1)); // exclude the just-added user msg
            const { data } = await axios.post(`${API_BASE}/chat`, {
                message: trimmed,
                history,
            });
            setTimeout(() => {
                setIsTyping(false);
                setMessages((prev) => [
                    ...prev,
                    {
                        from: 'bot',
                        text: data.reply,
                        actions: data.actions || [],
                        time: new Date(),
                    },
                ]);
                if (!isOpen) setHasUnread(true);
            }, 400);
        } catch (err) {
            setTimeout(() => {
                setIsTyping(false);
                setMessages((prev) => [
                    ...prev,
                    {
                        from: 'bot',
                        text: "⚠️ I'm having trouble connecting right now. Please try again or contact us directly.",
                        actions: [{ label: '📞 Contact Us', url: '/contact' }],
                        time: new Date(),
                    },
                ]);
            }, 400);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    const handleActionClick = (action) => {
        if (action.message) {
            sendMessage(action.message);
        } else if (action.url) {
            setIsOpen(false);
            navigate(action.url);
        }
    };

    const handleChipClick = (chip) => sendMessage(chip.message);

    const formatTime = (date) =>
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="chatbot-wrapper">
            {/* ── Floating Bubble ── */}
            <button
                className={`chatbot-bubble ${isOpen ? 'bubble-open' : ''}`}
                onClick={() => setIsOpen((o) => !o)}
                aria-label="Toggle MediBot"
            >
                {isOpen ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    <>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                        {hasUnread && <span className="chatbot-unread-dot" />}
                    </>
                )}
            </button>

            {/* ── Chat Window ── */}
            <div className={`chatbot-window ${isOpen ? 'chatbot-window--open' : ''}`}>

                {/* Header */}
                <div className="chatbot-header">
                    <div className="chatbot-header-avatar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                    </div>
                    <div className="chatbot-header-info">
                        <span className="chatbot-header-name">MediBot AI</span>
                        <span className="chatbot-header-status">
                            <span className="status-dot" />
                            AI Medical Assistant
                        </span>
                    </div>
                    <button className="chatbot-close-btn" onClick={() => setIsOpen(false)} aria-label="Close">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Disclaimer banner */}
                <div className="chatbot-disclaimer-banner">
                    ⚕️ For informational purposes only · Not a substitute for medical advice
                </div>

                {/* Messages */}
                <div className="chatbot-messages">
                    {messages.map((msg, i) => (
                        <div key={i} className={`chatbot-msg-row ${msg.from === 'user' ? 'msg-user' : 'msg-bot'}`}>
                            {msg.from === 'bot' && (
                                <div className="chatbot-avatar">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                    </svg>
                                </div>
                            )}

                            <div className="chatbot-bubble-msg">
                                <div className="chatbot-msg-text">
                                    {msg.from === 'bot'
                                        ? <RenderMessage text={msg.text} />
                                        : msg.text
                                    }
                                </div>

                                {/* Action buttons */}
                                {msg.actions && msg.actions.length > 0 && (
                                    <div className="chatbot-actions">
                                        {msg.actions.map((action, j) => (
                                            <button
                                                key={j}
                                                className="chatbot-action-btn"
                                                onClick={() => handleActionClick(action)}
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="chatbot-msg-time">{formatTime(msg.time)}</div>
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="chatbot-msg-row msg-bot">
                            <div className="chatbot-avatar">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                            </div>
                            <div className="chatbot-bubble-msg typing-bubble">
                                <span /><span /><span />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick chips */}
                <div className="chatbot-quick-bar">
                    {QUICK_CHIPS.map((chip) => (
                        <button
                            key={chip.label}
                            className="chatbot-quick-chip"
                            onClick={() => handleChipClick(chip)}
                        >
                            {chip.label}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <div className="chatbot-input-area">
                    <input
                        ref={inputRef}
                        type="text"
                        className="chatbot-input"
                        placeholder="Describe your symptoms or ask anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        maxLength={500}
                    />
                    <button
                        className="chatbot-send-btn"
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim() || isTyping}
                        aria-label="Send"
                    >
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
