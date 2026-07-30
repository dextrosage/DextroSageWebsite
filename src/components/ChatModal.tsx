import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import type { User, ChatMessage } from '../types';
import { api } from '../services/api';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: User | null;
  currentUser: User | null;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  currentUser
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async (pageNum: number, isInitial = false) => {
    if (!targetUser) return;
    try {
      setIsLoading(true);
      const res = await api.get(`/chat/${targetUser.user_id}?page=${pageNum}`);
      const newMessages = res.data.messages || [];
      
      if (newMessages.length < 30) {
        setHasMore(false);
      }
      
      if (isInitial) {
        setMessages(newMessages);
      } else {
        // PREPEND new messages when paginating back in time
        setMessages(prev => [...newMessages, ...prev]);
      }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setIsLoading(false);
    }
  }, [targetUser]);

  useEffect(() => {
    let ws: WebSocket | null = null;
    if (isOpen && targetUser && currentUser) {
      setPage(1);
      setHasMore(true);
      fetchMessages(1, true);

      // Connect WebSocket
      const wsUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/^http/, 'ws');
      ws = new WebSocket(`${wsUrl}/chat/ws/${currentUser.user_id}`);
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Only add to current view if the message is from the targetUser
          if (data.sender_id === targetUser.user_id) {
            setMessages(prev => [...prev, data]);
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        } catch (e) {
          console.error("Failed to parse websocket message", e);
        }
      };
    } else {
      setMessages([]);
      setInputText('');
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [isOpen, targetUser, currentUser, fetchMessages]);

  useEffect(() => {
    if (page === 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, page]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop } = scrollContainerRef.current;
      if (scrollTop === 0 && !isLoading && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchMessages(nextPage);
      }
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !targetUser || !currentUser) return;

    const textToSend = inputText.trim();
    setInputText('');
    
    // Optimistic UI update
    const optimisticMessage: ChatMessage = {
      sender_id: currentUser.user_id,
      text: textToSend,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      setIsSending(true);
      await api.post(`/chat/${targetUser.user_id}/send`, { text: textToSend });
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen || !targetUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Drawer */}
      <div className="relative w-full sm:w-[450px] h-full bg-[#020617] border-l border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-900/40 to-black/40 border-b border-white/10 relative z-10 backdrop-blur-md shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-blue-600/10 flex items-center justify-center text-blue-400 font-bold border border-blue-500/40 shadow-inner">
              {targetUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-white">{targetUser.name}</h3>
              <p className="text-xs text-green-400">Connected</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {isLoading && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          )}
          
          {messages.length === 0 && !isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <p>No messages yet.</p>
              <p className="text-sm">Send a message to start chatting!</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMine = msg.sender_id === currentUser?.user_id;
              return (
                <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-md ${
                      isMine 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm shadow-blue-500/20 border border-blue-400/20' 
                        : 'bg-white/5 text-gray-100 rounded-bl-sm backdrop-blur-md border border-white/10'
                    }`}
                  >
                    <p className="text-sm break-words">{msg.text}</p>
                    <span className="text-[10px] opacity-60 mt-1 block text-right">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleSend} className="p-3 bg-black/60 backdrop-blur-md border-t border-white/10 relative z-10">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Message..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
            />
            <Button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 flex-shrink-0 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Send className="w-4 h-4 text-white ml-0.5" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
