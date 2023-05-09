import { createContext } from 'react';

// credentials context
export const OnlineContext = createContext({onlineUsers: [], setOnlineUsers: () => {}});