import { createContext } from 'react';

// credentials context
export const ReconnectPromptContext = createContext({afterReconnectPrompt: {}, setAfterReconnectPrompt: () => {}});