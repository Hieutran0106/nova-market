import React, { useEffect, useRef, useState } from 'react';
import { Bot, ChevronDown, Minus, Send, Sparkles, X } from 'lucide-react';

const QUICK_QUESTIONS = [
  'Tư vấn tivi phù hợp',
  'Laptop cho sinh viên',
  'Máy giặt tốt nhất',
  'Ưu đãi hôm nay có gì?',
];

function getAnswer(question) {
  const text = question.toLocaleLowerCase('vi');

  if (text.includes('laptop')) {
    return 'Bạn cho mình biết ngành học, ngân sách và có cần chơi game hay không nhé. Với sinh viên CNTT, RAM 16GB và SSD 512GB là mức nên ưu tiên.';
  }
  if (text.includes('tivi') || text.includes('tv')) {
    return 'Bạn cho mình biết khoảng cách xem và diện tích phòng nhé. Phòng khách phổ biến thường phù hợp với TV 55–65 inch.';
  }
  if (text.includes('máy giặt')) {
    return 'Gia đình 4 người nên chọn máy 9–10,5 kg, ưu tiên Inverter và động cơ vận hành êm.';
  }
  if (text.includes('ưu đãi') || text.includes('khuyến mãi')) {
    return 'Hôm nay có trả góp 0%, miễn phí giao hàng toàn quốc và giờ vàng giảm đến 30%.';
  }
  return 'Bạn cho mình biết thêm ngân sách, mục đích sử dụng và tiêu chí ưu tiên để mình tư vấn chính xác hơn nhé.';
}

export default function NovaAssistant() {
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

  const ask = (value) => {
    const text = value.trim();
    if (!text) return;

    const requestId = `${Date.now()}-${Math.random()}`;
    setMessages((current) => [
      ...current,
      { id: `${requestId}-user`, role: 'user', text },
      { id: requestId, role: 'typing' },
    ]);
    setInput('');

    const timer = setTimeout(() => {
      setMessages((current) => current.map((message) => (
        message.id === requestId
          ? { id: `${requestId}-ai`, role: 'ai', text: getAnswer(text) }
          : message
      )));
    }, 700);
    replyTimersRef.current.push(timer);
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
            <div className="chat-messages" ref={messageListRef} aria-live="polite">
              <div className="msg ai">Xin chào! Bạn cần mình tư vấn sản phẩm nào hôm nay?</div>
              {messages.map((message) => message.role === 'typing'
                ? <div key={message.id} className="msg ai typing"><i /><i /><i /></div>
                : <div key={message.id} className={`msg ${message.role}`}>{message.text}</div>)}
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
