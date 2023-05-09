import { createContext } from 'react';

// credentials context
export const ExperimentalFeaturesEnabledContext = createContext({experimentalFeaturesEnabled: {}, setExperimentalFeaturesEnabled: () => {}});