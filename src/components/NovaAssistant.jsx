import React, { useEffect, useRef, useState } from 'react';
import { Bot, ChevronDown, Minus, Send, Sparkles, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useStore } from '../context/StoreContext';

const QUICK_QUESTIONS = [
  'Tư vấn tivi phù hợp',
  'Laptop cho sinh viên',
  'Máy giặt tốt nhất',
  'Ưu đãi hôm nay có gì?',
];

// Đã xóa getAnswer giả lập để nhường chỗ cho AI thật
export default function NovaAssistant() {
  const { user, cartItems } = useStore();
  const [open, setOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messageListRef = useRef(null);
  const replyTimersRef = useRef([]);

  useEffect(() => {
    const list = messageListRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages]);

  useEffect(() => () => {
    replyTimersRef.current.forEach(clearTimeout);
  }, []);

  const ask = async (value) => {
    const text = value.trim();
    if (!text) return;

    const requestId = `${Date.now()}-${Math.random()}`;
    setMessages((current) => [
      ...current,
      { id: `${requestId}-user`, role: 'user', text },
      { id: requestId, role: 'typing' },
    ]);
    setInput('');
    
    // Thu thập thông tin khách hàng (Context)
    const userContext = user ? {
      name: user.name,
      cart: cartItems.map(item => item.product.name)
    } : null;

    try {
      const response = await fetch('http://localhost:8080/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          seed: text,
          userContext: userContext 
        })
      });
      
      const data = await response.json();
      const reply = data.text || "Lỗi phản hồi từ AI";
      
      setMessages((current) => current.map((message) => (
        message.id === requestId
          ? { id: `${requestId}-ai`, role: 'ai', text: reply }
          : message
      )));
    } catch (error) {
      console.error("Lỗi kết nối AI:", error);
      setMessages((current) => current.map((message) => (
        message.id === requestId
          ? { id: `${requestId}-ai`, role: 'ai', text: "Xin lỗi, hiện tại mình không thể kết nối với máy chủ AI." }
          : message
      )));
    }
  };

  if (!open) {
    return (
      <button
        className="nova-float"
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Mở trợ lý AI Nova Core"
      >
        <span className="nova-particle particle-one" aria-hidden="true" />
        <span className="nova-particle particle-two" aria-hidden="true" />
        <span className="nova-particle particle-three" aria-hidden="true" />
        <img src="/assets/floating-nova-cutout.png" alt="" />
      </button>
    );
  }

  return (
    <aside className={`nova-chat ${minimized ? 'minimized' : ''}`} aria-label="Trợ lý AI Nova Core">
      <header className="nova-head">
        <div className="nova-title">
          <span className="nova-status"><Bot size={17} /></span>
          <span><b>Nova Core</b><small><i /> Trợ lý AI trực tuyến</small></span>
        </div>
        <div className="nova-controls">
          <button
            type="button"
            onClick={() => setMinimized((value) => !value)}
            aria-label={minimized ? 'Mở rộng cửa sổ chat' : 'Thu nhỏ cửa sổ chat'}
          >
            {minimized ? <ChevronDown size={18} /> : <Minus size={18} />}
          </button>
          <button type="button" onClick={() => setOpen(false)} aria-label="Đóng cửa sổ chat">
            <X size={18} />
          </button>
        </div>
      </header>

      {!minimized && (
        <div className="nova-body">
          {messages.length === 0 && (
            <>
              <div className="nova-intro">
                <img className="nova-core" src="/assets/nova-core.png" alt="Nova Core" />
                <div>
                  <span><Sparkles size={13} /> TƯ VẤN THÔNG MINH</span>
                  <h3>Xin chào! Mình có thể giúp gì?</h3>
                  <p>Chọn câu hỏi gợi ý hoặc nhập nội dung bạn cần tư vấn.</p>
                </div>
              </div>
              <div className="quick-asks">
                {QUICK_QUESTIONS.map((question) => (
                  <button type="button" key={question} onClick={() => ask(question)}>{question}</button>
                ))}
              </div>
            </>
          )}

          {messages.length > 0 && (
  <div
    className="chat-messages"
    ref={messageListRef}
    aria-live="polite"
  >
    <div className="msg ai">
      <p className="ai-paragraph">
        Xin chào! Bạn cần mình tư vấn sản phẩm nào hôm nay?
      </p>
    </div>

    {messages.map((message) => {
      if (message.role === 'typing') {
        return (
          <div
            key={message.id}
            className="msg ai typing"
          >
            <i />
            <i />
            <i />
          </div>
        );
      }

      if (message.role === 'ai') {
        return (
          <div
            key={message.id}
            className="msg ai"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h3 className="ai-heading">{children}</h3>
                ),

                h2: ({ children }) => (
                  <h3 className="ai-heading">{children}</h3>
                ),

                h3: ({ children }) => (
                  <h3 className="ai-heading">{children}</h3>
                ),

                p: ({ children }) => (
                  <p className="ai-paragraph">{children}</p>
                ),

                strong: ({ children }) => (
                  <strong className="ai-strong">
                    {children}
                  </strong>
                ),

                ul: ({ children }) => (
                  <ul className="ai-list">{children}</ul>
                ),

                ol: ({ children }) => (
                  <ol className="ai-number-list">
                    {children}
                  </ol>
                ),

                li: ({ children }) => (
                  <li className="ai-list-item">
                    {children}
                  </li>
                ),
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
        );
      }

      return (
        <div
          key={message.id}
          className="msg user"
        >
          <p className="user-message-text">
            {message.text}
          </p>
        </div>
      );
    })}
  </div>
)}

          <form className="nova-input" onSubmit={(event) => { event.preventDefault(); ask(input); }}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              aria-label="Câu hỏi dành cho Nova Core"
            />
            <button type="submit" disabled={!input.trim()} aria-label="Gửi câu hỏi">
              <Send size={17} />
            </button>
          </form>
          <small className="nova-disclaimer">Nova AI có thể đưa ra thông tin chưa chính xác.</small>
        </div>
      )}
    </aside>
  );
}
