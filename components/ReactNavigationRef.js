import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function reset(name, index, params) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: index,
      routes: [{ name: name, params: params }],
      });
  }
}

// add other navigation functions that you need and export them