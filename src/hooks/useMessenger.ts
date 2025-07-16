import { useState, useEffect, useCallback } from 'react';
import { Message, Chat, User, MessageReaction } from '../types';

// Sample data
const sampleUsers: Record<string, User> = {
  'user1': {
    id: 'user1',
    name: 'Alice Johnson',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    status: 'Available',
    isOnline: true,
    lastSeen: new Date(),
    bio: 'Love to travel and explore new places 🌍',
    email: 'alice@example.com',
    phone: '+1 (555) 123-4567',
    joinedDate: new Date('2023-01-15')
  },
  'user2': {
    id: 'user2',
    name: 'Bob Smith',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    status: 'In a meeting',
    isOnline: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000),
    bio: 'Software engineer and coffee enthusiast ☕',
    email: 'bob@example.com',
    phone: '+1 (555) 987-6543',
    joinedDate: new Date('2023-02-20')
  },
  'user3': {
    id: 'user3',
    name: 'Team Updates',
    avatar: 'https://images.pexels.com/photos/1181562/pexels-photo-1181562.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    status: 'Group chat',
    isOnline: true,
    lastSeen: new Date(),
    bio: 'Team collaboration and updates',
    email: 'team@example.com',
    phone: '',
    joinedDate: new Date('2023-03-01')
  }
};

const sampleChats: Record<string, Chat> = {
  'user1': {
    id: 'user1',
    name: 'Alice Johnson',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    type: 'direct',
    participants: ['current-user', 'user1'],
    lastMessage: null,
    unreadCount: 2,
    isPinned: true,
    isMuted: false,
    isArchived: false,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date(),
    isTyping: false,
    typingUsers: []
  },
  'user2': {
    id: 'user2',
    name: 'Bob Smith',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    type: 'direct',
    participants: ['current-user', 'user2'],
    lastMessage: null,
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date(),
    isTyping: false,
    typingUsers: []
  },
  'user3': {
    id: 'user3',
    name: 'Team Updates',
    avatar: 'https://images.pexels.com/photos/1181562/pexels-photo-1181562.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    type: 'group',
    participants: ['current-user', 'user1', 'user2', 'user3'],
    lastMessage: null,
    unreadCount: 5,
    isPinned: true,
    isMuted: false,
    isArchived: false,
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date(),
    isTyping: false,
    typingUsers: []
  }
};

const sampleMessages: Record<string, Message[]> = {
  'user1': [
    {
      id: '1',
      content: 'Hey! How are you doing today? 😊',
      type: 'text',
      sender: 'user1',
      timestamp: new Date(Date.now() - 3600000),
      isOwn: false,
      isRead: true,
      reactions: [],
      replyTo: null,
      isEdited: false
    },
    {
      id: '2',
      content: 'I\'m doing great! Just finished a big project at work 🎉',
      type: 'text',
      sender: 'current-user',
      timestamp: new Date(Date.now() - 3300000),
      isOwn: true,
      isRead: true,
      reactions: [{ emoji: '🎉', users: ['user1'], count: 1 }],
      replyTo: null,
      isEdited: false
    },
    {
      id: '3',
      content: 'That\'s amazing! What kind of project was it?',
      type: 'text',
      sender: 'user1',
      timestamp: new Date(Date.now() - 3000000),
      isOwn: false,
      isRead: true,
      reactions: [],
      replyTo: null,
      isEdited: false
    },
    {
      id: '4',
      content: 'It was a new messenger app actually! Really excited about how it turned out',
      type: 'text',
      sender: 'current-user',
      timestamp: new Date(Date.now() - 2700000),
      isOwn: true,
      isRead: false,
      reactions: [],
      replyTo: null,
      isEdited: false
    }
  ],
  'user2': [
    {
      id: '5',
      content: 'Are we still on for coffee tomorrow? ☕',
      type: 'text',
      sender: 'user2',
      timestamp: new Date(Date.now() - 7200000),
      isOwn: false,
      isRead: true,
      reactions: [],
      replyTo: null,
      isEdited: false
    },
    {
      id: '6',
      content: 'Absolutely! 2 PM at the usual place?',
      type: 'text',
      sender: 'current-user',
      timestamp: new Date(Date.now() - 7000000),
      isOwn: true,
      isRead: true,
      reactions: [{ emoji: '👍', users: ['user2'], count: 1 }],
      replyTo: null,
      isEdited: false
    },
    {
      id: '7',
      content: 'Perfect! See you then 👋',
      type: 'text',
      sender: 'user2',
      timestamp: new Date(Date.now() - 6800000),
      isOwn: false,
      isRead: true,
      reactions: [],
      replyTo: null,
      isEdited: false
    }
  ],
  'user3': [
    {
      id: '8',
      content: 'Good morning team! 🌅',
      type: 'text',
      sender: 'user1',
      timestamp: new Date(Date.now() - 1800000),
      isOwn: false,
      isRead: true,
      reactions: [],
      replyTo: null,
      isEdited: false
    },
    {
      id: '9',
      content: 'Morning! Ready for the big presentation today?',
      type: 'text',
      sender: 'user2',
      timestamp: new Date(Date.now() - 1700000),
      isOwn: false,
      isRead: true,
      reactions: [],
      replyTo: null,
      isEdited: false
    },
    {
      id: '10',
      content: 'Yes! Everything looks great. Thanks for all the help 🙏',
      type: 'text',
      sender: 'current-user',
      timestamp: new Date(Date.now() - 1600000),
      isOwn: true,
      isRead: false,
      reactions: [{ emoji: '🙏', users: ['user1', 'user2'], count: 2 }],
      replyTo: null,
      isEdited: false
    }
  ]
};

export const useMessenger = () => {
  const [chats, setChats] = useState<Record<string, Chat>>(sampleChats);
  const [messages, setMessages] = useState<Record<string, Message[]>>(sampleMessages);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [currentUser] = useState<User>({
    id: 'current-user',
    name: 'You',
    avatar: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    status: 'Available',
    isOnline: true,
    lastSeen: new Date(),
    bio: 'Hey there! I am using Messenger.',
    email: 'you@example.com',
    phone: '+1 (555) 000-0000',
    joinedDate: new Date('2023-01-01')
  });

  // Update last messages when messages change
  useEffect(() => {
    Object.keys(messages).forEach(chatId => {
      const chatMessages = messages[chatId];
      if (chatMessages.length > 0) {
        const lastMessage = chatMessages[chatMessages.length - 1];
        setChats(prev => ({
          ...prev,
          [chatId]: {
            ...prev[chatId],
            lastMessage,
            updatedAt: new Date()
          }
        }));
      }
    });
  }, [messages]);

  const selectChat = useCallback((chatId: string) => {
    setCurrentChat(chatId);
    // Mark messages as read
    setMessages(prev => ({
      ...prev,
      [chatId]: prev[chatId]?.map(msg => ({ ...msg, isRead: true })) || []
    }));
    // Clear unread count
    setChats(prev => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        unreadCount: 0
      }
    }));
  }, []);

  const sendMessage = useCallback((message: Message) => {
    if (!currentChat) return;

    setMessages(prev => ({
      ...prev,
      [currentChat]: [...(prev[currentChat] || []), message]
    }));

    // Simulate response after delay
    setTimeout(() => {
      if (currentChat && currentChat !== 'user3') {
        const responses = [
          'That sounds great! 😊',
          'I completely agree with you',
          'Thanks for sharing that!',
          'Really interesting perspective 🤔',
          'I\'d love to hear more about it',
          'That\'s exactly what I was thinking!'
        ];
        
        const response: Message = {
          id: Date.now().toString(),
          content: responses[Math.floor(Math.random() * responses.length)],
          type: 'text',
          sender: currentChat,
          timestamp: new Date(),
          isOwn: false,
          isRead: false,
          reactions: [],
          replyTo: null,
          isEdited: false
        };

        setMessages(prev => ({
          ...prev,
          [currentChat]: [...(prev[currentChat] || []), response]
        }));

        setChats(prev => ({
          ...prev,
          [currentChat]: {
            ...prev[currentChat],
            unreadCount: prev[currentChat].unreadCount + 1
          }
        }));
      }
    }, 1000 + Math.random() * 2000);
  }, [currentChat]);

  const addReaction = useCallback((messageId: string, emoji: string, userId: string) => {
    if (!currentChat) return;

    setMessages(prev => ({
      ...prev,
      [currentChat]: prev[currentChat]?.map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find(r => r.emoji === emoji);
          if (existingReaction) {
            if (existingReaction.users.includes(userId)) {
              // Remove reaction
              return {
                ...msg,
                reactions: msg.reactions.map(r => 
                  r.emoji === emoji 
                    ? { ...r, users: r.users.filter(u => u !== userId), count: r.count - 1 }
                    : r
                ).filter(r => r.count > 0)
              };
            } else {
              // Add user to reaction
              return {
                ...msg,
                reactions: msg.reactions.map(r => 
                  r.emoji === emoji 
                    ? { ...r, users: [...r.users, userId], count: r.count + 1 }
                    : r
                )
              };
            }
          } else {
            // Add new reaction
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, users: [userId], count: 1 }]
            };
          }
        }
        return msg;
      }) || []
    }));
  }, [currentChat]);

  const editMessage = useCallback((messageId: string, newContent: string) => {
    if (!currentChat) return;

    setMessages(prev => ({
      ...prev,
      [currentChat]: prev[currentChat]?.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: newContent, isEdited: true, editedAt: new Date() }
          : msg
      ) || []
    }));
  }, [currentChat]);

  const deleteMessage = useCallback((messageId: string) => {
    if (!currentChat) return;

    setMessages(prev => ({
      ...prev,
      [currentChat]: prev[currentChat]?.filter(msg => msg.id !== messageId) || []
    }));
  }, [currentChat]);

  const createGroup = useCallback((name: string, participants: string[]) => {
    const groupId = Date.now().toString();
    const newGroup: Chat = {
      id: groupId,
      name,
      avatar: 'https://images.pexels.com/photos/1181562/pexels-photo-1181562.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
      type: 'group',
      participants: ['current-user', ...participants],
      lastMessage: null,
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      adminIds: ['current-user']
    };

    setChats(prev => ({ ...prev, [groupId]: newGroup }));
    setMessages(prev => ({ ...prev, [groupId]: [] }));
  }, []);

  const updateUserStatus = useCallback((status: string) => {
    // Update current user status
    // This would typically sync with a backend
  }, []);

  const searchChats = useCallback((query: string) => {
    // Search functionality would be implemented here
    // For now, filtering is done in the component
  }, []);

  const pinChat = useCallback((chatId: string) => {
    setChats(prev => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        isPinned: !prev[chatId].isPinned
      }
    }));
  }, []);

  const muteChat = useCallback((chatId: string) => {
    setChats(prev => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        isMuted: !prev[chatId].isMuted
      }
    }));
  }, []);

  const archiveChat = useCallback((chatId: string) => {
    setChats(prev => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        isArchived: !prev[chatId].isArchived
      }
    }));
  }, []);

  return {
    chats,
    currentChat,
    currentUser,
    messages: currentChat ? messages[currentChat] || [] : [],
    selectChat,
    sendMessage,
    addReaction,
    editMessage,
    deleteMessage,
    createGroup,
    updateUserStatus,
    searchChats,
    pinChat,
    muteChat,
    archiveChat
  };
};