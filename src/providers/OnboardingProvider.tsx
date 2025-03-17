import React, { createContext, useReducer, ReactNode, useContext, PropsWithChildren} from 'react';

// Define onboarding data structure
interface OnboardingData {
  age?: number;
  name?: string;
  interests?: string[];
}

// Define the shape of context state and dispatch functions
interface OnboardingContextType {
  state: OnboardingData;
  updateField: (field: keyof OnboardingData, value: any) => void;
  resetOnboarding: () => void;
}

// Create an empty context
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Reducer function to handle state updates
const onboardingReducer = (state: OnboardingData, action: { type: string; payload?: any }) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.payload.field]: action.payload.value };
    case 'RESET':
      return {};
    default:
      return state;
  }
};

// Provider component to wrap around the onboarding screens
export const OnboardingProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(onboardingReducer, {});

  // Action creators
  const updateField = (field: keyof OnboardingData, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { field, value } });
  };

  const resetOnboarding = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <OnboardingContext.Provider value={{ state, updateField, resetOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
};

// Custom hook for accessing the context
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
