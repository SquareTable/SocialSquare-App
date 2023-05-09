import { createContext } from 'react';

// credentials context
export const SocketContext = createContext({socket: {}, setSocket: () => {}});