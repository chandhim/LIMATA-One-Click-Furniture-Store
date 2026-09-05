"use client";

import { useEffect, useRef, useState } from "react";
import { X, Loader2, Send, Sparkles, AlertCircle, Plus, ChevronLeft, MessageSquare, Clock } from "lucide-react";
import { useAiChat } from "../hooks/use-ai-chat";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import type { Product } from "@/features/products/types/product.types";
import Link from "next/link";

const GENERIC_SUGGESTED_PROMPTS = [
  "Find a modern sofa",
  "Show office chairs",
  "Help furnish my living room",
  "Find something under Rs. 150,000"
];

const GENERIC_FOLLOW_UP_SUGGESTIONS = [
  "Compare these",
  "Show cheaper options",
  "More like this"
];

function isMeaningfulAssistantResponse(content: string, hasProducts: boolean): boolean {
  if (hasProducts) return true;
  const wordCount = content.trim().split(/\s+/).length;
  const lowerContent = content.toLowerCase();
  if (wordCount < 10 && (
    lowerContent.includes("you're welcome") ||
    lowerContent.includes("happy to help") ||
    lowerContent.includes("hello") ||
    lowerContent.includes("hi there") ||
    lowerContent.match(/^(sure|okay|yes|no|thanks|thank you)[.!]*$/i)
  )) {
    return false;
  }
  return true;
}

function getDynamicPrompts(chatContext: any, messages: any[], isInitial: boolean): string[] {
  const hasRoomContext = !!chatContext?.depth_analysis || !!(chatContext?.detected_objects && chatContext.detected_objects.length > 0);
  const hasArContext = !!chatContext?.ar_placement;
  
  if (!hasRoomContext && !hasArContext) {
    return isInitial ? GENERIC_SUGGESTED_PROMPTS : GENERIC_FOLLOW_UP_SUGGESTIONS;
  }

  const userMessages = messages.filter((m: any) => m.role === "user").map((m: any) => m.content.toLowerCase());
  const checkIntent = (keywords: string[]) => userMessages.some((msg: string) => keywords.some(kw => msg.includes(kw)));
  
  const hasDiscussedSpace = checkIntent(["space", "fit", "room for", "maximize", "clearance", "how much room"]);
  const hasDiscussedRecs = checkIntent(["recommend", "suggest", "match", "best option", "suitable", "why this", "good choice", "right choice"]);
  const hasDiscussedComparison = checkIntent(["compare", "which one", "better", "another option", "alternative", "stronger match"]);
  const hasDiscussedAr = checkIntent(["ar", "visualize", "see it in", "try it", "view it"]);
  const hasDiscussedPlacement = checkIntent(["placement", "position", "too close", "move it", "improve"]);

  const prompts: string[] = [];
  const addPrompt = (p: string) => {
    if (prompts.length < 3 && !userMessages.includes(p.toLowerCase())) {
      prompts.push(p);
    }
  };

  if (hasArContext) {
    const isSuitable = chatContext.ar_placement.suitable;
    if (isInitial) {
      if (isSuitable) {
        addPrompt("Why is this placement suitable?");
        addPrompt("What should I consider about this placement?");
        addPrompt("Would another position work better?");
      } else {
        addPrompt("Why isn't this placement suitable?");
        addPrompt("How can I improve the placement?");
        addPrompt("Would another furniture option work better?");
      }
    } else {
      if (!hasDiscussedPlacement) {
        addPrompt(isSuitable ? "Why is this placement suitable?" : "Why isn't this placement suitable?");
      }
      addPrompt(isSuitable ? "What should I consider about this placement?" : "How can I improve the placement?");
      addPrompt("Would another furniture option work better?");
    }
    return prompts;
  }

  if (hasRoomContext) {
    const space = chatContext.depth_analysis?.space_availability;
    
    if (isInitial) {
      addPrompt("Why are these products suitable for my room?");
      addPrompt("Which recommendation is the strongest match?");
      if (space === "Limited") addPrompt("How can I make better use of this limited space?");
      else if (space === "Moderate") addPrompt("Why do these products work well in this space?");
      else if (space === "Generous") addPrompt("How could I make better use of this available space?");
      else addPrompt("How can I make better use of this space?");
    } else {
      if (!hasDiscussedRecs) {
        addPrompt("Why are these products suitable for my room?");
      }
      if (!hasDiscussedComparison) {
        addPrompt("Which recommendation is the strongest match?");
        addPrompt("Would another option work better?");
      }
      if (!hasDiscussedSpace && space) {
        if (space === "Limited") addPrompt("What should I consider when choosing furniture for this room?");
        else addPrompt("What furniture works well with this amount of space?");
      }
      if (hasDiscussedRecs && !hasDiscussedAr) {
        addPrompt("Can I visualize the best match in my room?");
      }
    }
  }

  return prompts;
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [view, setView] = useState<"chat" | "history">("chat");
  const bottomRef = useRef<HTMLDivElement>(null);

  // First-time discovery tooltip
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSeen = localStorage.getItem("hasSeenChatbotHint");
      if (!hasSeen) {
        setTimeout(() => setShowTooltip(true), 1000);
      }
    }
  }, []);

  const dismissTooltip = (e?: React.MouseEvent | KeyboardEvent) => {
    if (e && 'stopPropagation' in e) {
      e.stopPropagation();
    }
    setShowTooltip(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("hasSeenChatbotHint", "true");
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showTooltip) dismissTooltip(e);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showTooltip]);

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
    if (showTooltip) dismissTooltip();
  };

  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    conversations,
    isHistoryLoading,
    chatContext,
    setChatContext,
    loadConversations,
    loadConversation,
    startNewConversation
  } = useAiChat();
  
  const hasRoomContext = !!chatContext?.depth_analysis || !!(chatContext?.detected_objects && chatContext.detected_objects.length > 0);
  const hasArContext = !!chatContext?.ar_placement;

  const currentPrompts = getDynamicPrompts(chatContext, messages, true);
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, view]);

  useEffect(() => {
    const handleOpenChat = (e: CustomEvent) => {
      setIsOpen(true);
      if (e.detail?.context) {
        setChatContext(e.detail.context);
      }
    };
    window.addEventListener("open-ai-chat", handleOpenChat as EventListener);
    return () => window.removeEventListener("open-ai-chat", handleOpenChat as EventListener);
  }, [setChatContext]);

  useEffect(() => {
    if (isOpen && view === "history") {
      loadConversations();
    }
  }, [isOpen, view, loadConversations]);

  const handleSubmit = (e?: React.FormEvent, preset?: string) => {
    e?.preventDefault();
    const content = preset || inputValue;
    if (content.trim() && !isLoading) {
      sendMessage(content);
      setInputValue("");
      if (view !== "chat") setView("chat");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleNewChat = () => {
    startNewConversation();
    setView("chat");
  };

  const handleOpenConversation = (id: string) => {
    loadConversation(id);
    setView("chat");
  };

  return (
    <>
      {showTooltip && !isOpen && (
        <div
          className="animate-fade-up"
          style={{
            position: "fixed",
            bottom: "5.5rem",
            left: "1.5rem",
            background: "var(--bg-dark)",
            color: "var(--fg-inverse)",
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-strong)",
            boxShadow: "var(--shadow-lg)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            maxWidth: "250px",
            fontSize: "0.875rem",
            lineHeight: 1.4,
          }}
        >
          <span>✨ Need help deciding? Ask LIMATA AI.</span>
          <button
            onClick={dismissTooltip}
            aria-label="Dismiss hint"
            style={{
              background: "none",
              border: "none",
              color: "var(--fg-secondary)",
              cursor: "pointer",
              padding: "0.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={14} />
          </button>
          <div
            style={{
              position: "absolute",
              bottom: "-6px",
              left: "1.25rem",
              width: "12px",
              height: "12px",
              background: "var(--bg-dark)",
              borderBottom: "1px solid var(--border-strong)",
              borderRight: "1px solid var(--border-strong)",
              transform: "rotate(45deg)",
            }}
          />
        </div>
      )}

      <button
        onClick={handleToggleOpen}
        aria-label={isOpen ? "Close LIMATA AI Assistant" : "Open LIMATA AI Assistant"}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          left: "1.5rem", // Bottom left so it doesn't conflict with right-side Support Chat
          width: 56,
          height: 56,
          borderRadius: "var(--radius-full)",
          background: "var(--bg-dark)",
          border: "2px solid var(--accent)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--accent)",
          boxShadow: "var(--shadow-lg)",
          zIndex: 1000,
          transition: "transform 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "5.5rem",
            left: "1.5rem",
            width: "calc(100vw - 3rem)",
            maxWidth: 400,
            height: "min(600px, calc(100vh - 8rem))",
            background: "var(--bg-surface)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 999,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "1rem",
              background: "var(--bg-dark)",
              borderBottom: "1px solid var(--border-strong)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent)" }}>
              {view === "chat" && isAuthenticated && (
                <button
                  onClick={() => setView("history")}
                  style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: "0 0.25rem" }}
                  aria-label="View History"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              <Sparkles size={20} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.95rem", fontWeight: 700, lineHeight: 1 }}>LIMATA AI</span>
                <span style={{ fontSize: "0.65rem", color: "var(--fg-muted)", marginTop: "2px" }}>Furniture Assistant</span>
              </div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--fg-muted)" }}>
              {view === "chat" && (
                 <button
                  onClick={handleNewChat}
                  style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}
                  title="New Conversation"
                 >
                   <Plus size={18} />
                 </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: "auto", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
            
            {view === "history" ? (
              <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <button 
                  className="btn-shimmer"
                  onClick={handleNewChat}
                  style={{ 
                    padding: "0.75rem", borderRadius: "var(--radius-md)", color: "#fff", border: "none",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", width: "100%"
                  }}
                >
                  <Plus size={16} /> Start New Conversation
                </button>

                <div style={{ marginTop: "1rem" }}>
                  <h3 className="section-label" style={{ marginBottom: "0.75rem" }}>Recent Conversations</h3>
                  {isHistoryLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
                      <Loader2 className="animate-spin" color="var(--accent)" size={24} />
                    </div>
                  ) : conversations.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--fg-muted)", fontSize: "0.875rem" }}>
                      <MessageSquare size={32} style={{ opacity: 0.5, margin: "0 auto 0.5rem" }} />
                      No recent conversations found.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {conversations.map(conv => (
                        <button
                          key={conv.id}
                          onClick={() => handleOpenConversation(conv.id)}
                          style={{
                            background: "var(--bg-surface)", border: "1px solid var(--border)",
                            padding: "0.875rem", borderRadius: "var(--radius-md)", textAlign: "left",
                            cursor: "pointer", display: "flex", flexDirection: "column", gap: "0.25rem",
                            transition: "border-color 0.2s"
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                        >
                          <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--fg-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {conv.title || "Furniture Inquiry"}
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "var(--fg-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <Clock size={10} />
                            {new Date(conv.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {messages.length === 0 ? (
                  <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", margin: "auto 0" }}>
                    
                    {/* Context Reference Card OR Generic Welcome */}
                    {hasRoomContext ? (
                      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1rem" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <Sparkles size={14} /> Based on your room analysis
                        </div>
                        <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.85rem", color: "var(--fg-secondary)", lineHeight: 1.6 }}>
                          {chatContext?.detected_objects?.length > 0 && (
                            <li>Detected: <span style={{ textTransform: "capitalize" }}>{chatContext.detected_objects[0]}</span></li>
                          )}
                          {chatContext?.depth_analysis?.space_availability && (
                            <li>Space availability: {chatContext.depth_analysis.space_availability}</li>
                          )}
                        </ul>
                      </div>
                    ) : hasArContext ? (
                      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1rem" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <Sparkles size={14} /> About this placement
                        </div>
                        <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.85rem", color: "var(--fg-secondary)", lineHeight: 1.6 }}>
                          <li>Status: {chatContext.ar_placement.suitable ? "✅ Suitable" : "❌ Space may be limited"}</li>
                          {chatContext.ar_placement.limiting_factor && (
                            <li>Issue: <span style={{ textTransform: "capitalize" }}>{chatContext.ar_placement.limiting_factor}</span></li>
                          )}
                        </ul>
                      </div>
                    ) : (
                      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}>
                        <div style={{ background: "var(--bg-dark)", padding: "1rem", borderRadius: "50%", color: "var(--accent)", marginBottom: "0.5rem" }}>
                          <Sparkles size={28} />
                        </div>
                        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "var(--fg-primary)" }}>
                          Hi! I&apos;m the LIMATA AI Assistant.
                        </h2>
                        <p style={{ fontSize: "0.875rem", color: "var(--fg-secondary)", margin: 0, maxWidth: "250px" }}>
                          I can help you find furniture, compare products, choose materials, and furnish your space.
                        </p>
                        
                        {!isAuthenticated && (
                          <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "var(--fg-muted)", background: "var(--bg-elevated)", padding: "0.25rem 0.75rem", borderRadius: "var(--radius-full)" }}>
                            Sign in to save your conversations.
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <div className="section-label" style={{ fontSize: "0.65rem", justifyContent: "center", marginBottom: "0.25rem" }}>Suggested Prompts</div>
                      {currentPrompts.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSubmit(undefined, prompt)}
                          className="btn-ghost"
                          style={{
                            padding: "0.6rem 1rem",
                            borderRadius: "var(--radius-full)",
                            fontSize: "0.8rem",
                            textAlign: "center",
                            cursor: "pointer",
                            width: "100%"
                          }}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    let displayContent = msg.content;
                    const hasProducts = msg.role === "assistant" && msg.recommendedProducts && msg.recommendedProducts.length > 0;
                    
                    if (hasProducts) {
                      displayContent = displayContent
                        .replace(/^\s*(?:\d+\.|\-|\*)\s+.*?(?:\$|Rs\.|₹|INR|for)\s*[\d,]+.*$/gim, "")
                        .replace(/^\s*\d+\.\s+.*$/gm, "")
                        .replace(/\n{3,}/g, "\n\n")
                        .trim();
                    }

                    const isLastAssistantMessage = idx === messages.length - 1 && msg.role === "assistant";

                    return (
                      <div
                        key={idx}
                        className="animate-fade-in"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                          gap: "0.5rem"
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "85%",
                            padding: "0.75rem 1rem",
                            borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                            background: msg.role === "user" ? "var(--accent)" : "var(--bg-surface)",
                            color: msg.role === "user" ? "#fff" : "var(--fg-primary)",
                            border: msg.role === "user" ? "none" : "1px solid var(--border)",
                            boxShadow: "var(--shadow-sm)",
                            fontSize: "0.9rem",
                            lineHeight: 1.5,
                            whiteSpace: "pre-wrap",
                          }}
                          dangerouslySetInnerHTML={{ __html: displayContent.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: inherit; text-decoration: underline;">$1</a>') }}
                        />
                        {hasProducts && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", marginTop: "0.25rem" }}>
                            <div className="section-label" style={{ paddingLeft: "0.5rem" }}>Recommended for you</div>
                            <div style={{ 
                              display: "grid", 
                              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", 
                              gap: "0.75rem" 
                            }}>
                              {msg.recommendedProducts!.slice(0, 4).map((p: Product) => (
                                <Link 
                                  key={p.productId} 
                                  href={`/products/${p.productId}`}
                                  target="_self"
                                  className="card"
                                  style={{ 
                                    padding: "0.5rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.5rem",
                                    textDecoration: "none",
                                    color: "inherit",
                                  }}
                                >
                                  <img 
                                    src={p.images?.[0] || "/placeholder.png"} 
                                    alt={p.name} 
                                    style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "var(--radius-sm)" }} 
                                  />
                                  <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "0 0.25rem" }}>
                                    <div style={{ fontSize: "0.8rem", fontWeight: 600, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.2 }}>
                                      {p.name}
                                    </div>
                                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent-dark)", marginTop: "0.25rem" }}>
                                      Rs. {p.price.toLocaleString()}
                                    </div>
                                    <div style={{ fontSize: "0.7rem", color: "var(--fg-muted)", marginTop: "0.25rem" }}>
                                      {p.material || "Standard"}
                                    </div>
                                    <div style={{ fontSize: "0.7rem", color: p.stock && p.stock > 0 ? "#27ae60" : "#e74c3c", fontWeight: 600 }}>
                                      {p.stock && p.stock > 0 ? "In Stock" : "Out of Stock"}
                                    </div>
                                  </div>
                                  <div style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: 600, padding: "0.25rem 0.25rem 0", borderTop: "1px solid var(--border)", marginTop: "auto" }}>
                                    View details &rarr;
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Follow up suggestions */}
                        {isLastAssistantMessage && !isLoading && isMeaningfulAssistantResponse(displayContent, hasProducts) && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginTop: "0.5rem", width: "100%" }}>
                            {getDynamicPrompts(chatContext, messages, false).length > 0 && (
                              <div style={{ fontSize: "0.7rem", color: "var(--fg-muted)", paddingLeft: "0.5rem" }}>You might also ask:</div>
                            )}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                              {getDynamicPrompts(chatContext, messages, false).map((suggestion, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleSubmit(undefined, suggestion)}
                                  style={{
                                    background: "var(--bg-elevated)", border: "1px solid var(--border-strong)",
                                    borderRadius: "var(--radius-full)", padding: "0.4rem 0.8rem",
                                    fontSize: "0.75rem", color: "var(--fg-secondary)", cursor: "pointer",
                                    transition: "all 0.2s"
                                  }}
                                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent-dark)"; }}
                                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--fg-secondary)"; }}
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                
                {isLoading && (
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div
                      style={{
                        padding: "0.75rem 1rem",
                        borderRadius: "16px 16px 16px 4px",
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border)",
                        boxShadow: "var(--shadow-sm)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <Loader2 size={16} className="animate-spin" color="var(--accent)" />
                      <span className="text-gradient" style={{ fontSize: "0.875rem", fontWeight: 600 }}>LIMATA AI is thinking...</span>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div
                    aria-live="polite"
                    className="animate-fade-up"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                      color: "var(--accent-dark)",
                      fontSize: "0.85rem",
                      marginTop: "0.5rem",
                      padding: "0.75rem 1rem",
                      background: "rgba(245, 158, 11, 0.05)",
                      border: "1px solid rgba(201, 169, 110, 0.3)",
                      borderRadius: "16px 16px 16px 4px",
                      maxWidth: "85%",
                      boxShadow: "var(--shadow-sm)"
                    }}
                  >
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: "0.1rem" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <span style={{ fontWeight: 600 }}>{error.type === 'network' ? 'Connection Issue' : 'Oops!'}</span>
                      <span style={{ color: "var(--fg-secondary)", lineHeight: 1.4 }}>{error.message}</span>
                    </div>
                  </div>
                )}
                
                <div ref={bottomRef} style={{ height: 1 }} />
              </div>
            )}
          </div>

          {/* Input Area */}
          {view === "chat" && (
            <form
              onSubmit={handleSubmit}
              style={{
                padding: "1rem",
                borderTop: "1px solid var(--border)",
                background: "var(--bg-surface)",
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                position: "relative"
              }}
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about furniture..."
                disabled={isLoading}
                className="input-base"
                style={{
                  flex: 1,
                  background: "var(--bg-base)",
                  borderRadius: "var(--radius-full)",
                  paddingRight: "3rem" // space for absolute button
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                style={{
                  position: "absolute",
                  right: "1.25rem",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  border: "none",
                  cursor: inputValue.trim() && !isLoading ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  opacity: inputValue.trim() && !isLoading ? 1 : 0.5,
                  transition: "opacity 0.2s, transform 0.2s"
                }}
                onMouseEnter={e => { if (inputValue.trim() && !isLoading) e.currentTarget.style.transform = "scale(1.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} style={{ marginLeft: 2 }} />}
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
