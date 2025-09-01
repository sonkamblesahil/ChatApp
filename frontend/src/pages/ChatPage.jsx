import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const loggedInUsername = localStorage.getItem("username");
  const navigate = useNavigate();

  // Common emojis for quick access
  const commonEmojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋',
    '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳',
    '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖',
    '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
    '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '👍', '👎',
    '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
    '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏'
  ];

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/");
  };

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      const shouldLeave = window.confirm(
        "Are you sure you want to leave the chat? You'll be logged out and redirected to the homepage."
      );
      if (shouldLeave) {
        localStorage.removeItem("username");
        navigate("/");
      } else {
        // Push the current state back to prevent navigation
        window.history.pushState(null, "", window.location.pathname);
      }
    };

    // Push initial state
    window.history.pushState(null, "", window.location.pathname);
    
    // Add event listener
    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  // Fetch users and their latest messages
  useEffect(() => {
    if (loggedInUsername) {
      fetch(`http://localhost:3001/latest/${loggedInUsername}`)
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => console.error("Error fetching latest users:", err));
    }
  }, [loggedInUsername]);

  // Search users
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim()) {
      fetch(`http://localhost:3001/search/${value}`)
        .then(res => res.json())
        .then(data => setUsers(data.users))
        .catch(err => console.error("Error searching users:", err));
    } else {
      fetch(`http://localhost:3001/latest/${loggedInUsername}`)
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => console.error("Error fetching latest users:", err));
    }
  };

  // Fetch full chat history when a user is selected
  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetch(`http://localhost:3001/getconversation/${loggedInUsername}/${user.username}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.messages) {
          const mappedMessages = data.messages.map(m => ({
            from: m.sender,
            text: m.content,
            time: m.timestamp,
            messageType: m.messageType || 'text'
          }));
          setMessages(mappedMessages);
        } else {
          setMessages([]);
        }
      })
      .catch(err => {
        console.error("Error fetching conversation:", err);
        setMessages([]);
      });
  };

  // Send message
  const handleSend = async () => {
    if (newMessage.trim() && selectedUser) {
      const messageData = {
        message: newMessage,
        messageType: 'text'
      };

      try {
        const response = await fetch(`http://localhost:3001/sendmessage/${loggedInUsername}/${selectedUser.username}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(messageData)
        });

        if (response.ok) {
          const newMsg = {
            from: loggedInUsername,
            text: messageData.message,
            time: new Date(),
            messageType: 'text'
          };
          setMessages(prev => [...prev, newMsg]);
          setNewMessage("");
          setShowEmojiPicker(false);
          setTimeout(() => handleUserClick(selectedUser), 500);
        }
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Render message based on type
  const renderMessage = (msg, idx) => {
    const isOwn = msg.from === loggedInUsername;
    
    const baseClasses = `max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
      isOwn 
        ? 'bg-indigo-500 text-white rounded-br-md' 
        : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
    }`;

    return (
      <div key={idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <div className={baseClasses}>
          <p className="text-sm">{msg.text}</p>
          <p className={`text-xs mt-1 text-right ${
            isOwn ? 'text-indigo-200' : 'text-gray-500'
          }`}>
            {msg.time ? new Date(msg.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
          </p>
        </div>
      </div>
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Users List */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col shadow-lg">
        {/* Sidebar Header */}
        <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
              {loggedInUsername?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold">{loggedInUsername}</h3>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-white text-indigo-600 hover:bg-indigo-100 px-3 py-1 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Logout
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 px-4 py-2">
            Conversations
          </div>
          {users.length > 0 ? (
            users.map(user => (
              <div
                key={user.username}
                onClick={() => handleUserClick(user)}
                className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
                  selectedUser?.username === user.username ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''
                }`}
              >
                <div>
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3 shadow-sm">
                    {user.username?.charAt(0)?.toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{user.username}</h4>
                  {user.latestMessage && (
                    <p className="text-sm text-gray-500 truncate mt-1">{user.latestMessage}</p>
                  )}
                </div>
                {user.unreadCount > 0 && (
                  <span className="bg-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {user.unreadCount}
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="mt-2">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center shadow-sm">
              <div>
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3 shadow-sm">
                  {selectedUser.username?.charAt(0)?.toUpperCase()}
                </div>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{selectedUser.username}</h2>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}>
              {messages.length > 0 ? (
                messages.map((msg, idx) => renderMessage(msg, idx))
              ) : (
                <div className="text-center text-gray-500 mt-20">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-gray-600">No messages yet</p>
                  <p className="text-sm">Start the conversation by sending a message!</p>
                </div>
              )}
            </div>

            {/* Message Input Area */}
            <div className="bg-white border-t border-gray-200 p-4 shadow-md">
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-20 right-4 bg-white rounded-lg shadow-xl border p-4 z-30 max-w-sm">
                  <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
                    {commonEmojis.map((emoji, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleEmojiSelect(emoji)}
                        className="text-xl hover:bg-gray-100 rounded p-1 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => setShowEmojiPicker(false)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                {/* Emoji Button */}
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                  title="Emojis"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>

                {/* Message Input */}
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                />

                {/* Send Button */}
                <button
                  onClick={() => handleSend()}
                  disabled={!newMessage.trim()}
                  className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white p-2 rounded-full transition-colors shadow-sm"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center bg-gray-50" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}>
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">Welcome to Chat App</h3>
              <p className="text-gray-500 mb-4">Select a user from the sidebar to start chatting or search for new connections</p>
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-left text-sm text-indigo-700">
                <p className="font-medium mb-1">Tip:</p>
                <p>Use the search bar to find other users and start conversations</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
