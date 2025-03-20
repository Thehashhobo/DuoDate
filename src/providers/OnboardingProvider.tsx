import React, { createContext, useReducer, ReactNode, useContext, PropsWithChildren, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthProvider';
import { Href, router } from 'expo-router';

// Define onboarding data structure
interface OnboardingData {
  age?: number;
  name?: string;
  height?: number;
  location?: string;
  pronoun?: string;
  gender?: string;
  sexuality?: string;
  ethnicity?: string; // not yet implemented
  zodiacSign?: string; // not yet implemented
  pets?: string; // not yet implemented
  photo?: string[]; // At least one required
}

// Define the shape of context state and dispatch functions
interface OnboardingContextType {
  state: OnboardingData;
  updateField: (field: keyof OnboardingData, value: any) => void;
  resetOnboarding: () => void;
  submitOnboardingData: () => Promise<void>;

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
  const { session } = useAuth();
  const [loading, setLoading] = useState(false)
  const [state, dispatch] = useReducer(onboardingReducer, { photo: [] });

  // Action creators
  const updateField = (field: keyof OnboardingData, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { field, value } });
  };

  const resetOnboarding = () => {
    dispatch({ type: 'RESET' });
  };

  const uploadPhotoToSupabase = async (uri: string) => {
    try {
      if (!session?.user) {
        throw new Error("User session not found!");
      }
  
      const fileExt = uri.split('.').pop()?.toLowerCase() ?? 'jpeg';
      const contentType = `image/${fileExt}`;
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;
  
      // ✅ Fetch image and convert to ArrayBuffer
      const arraybuffer = await fetch(uri).then((res) => res.arrayBuffer());
  
      // ✅ Upload the file with contentType specified
      const { data, error } = await supabase.storage
        .from("photos") // Ensure this matches your Supabase bucket name
        .upload(filePath, arraybuffer, { contentType });
  
      if (error) throw error;
  
      console.log("File uploaded successfully:", data);
  
      return supabase.storage.from("photos").getPublicUrl(filePath).data.publicUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };
  



  const submitOnboardingData = async () => {
    if (!session?.user) {
      Alert.alert('Error', 'No user session found.');
      return;
    }

    try {
      setLoading(true);

      // Upload photos & get public URLs
      const uploadedPhotos = await Promise.all(
        (state.photo ?? []).map(async (uri) => await uploadPhotoToSupabase(uri))
      );

      // Save profile info in the `profiles` table
      const updates = {
        id: session.user.id,
        age: state.age || null,
        name: state.name || null,
        height: state.height || null,
        location: state.location ? JSON.stringify(state.location) : null, // Store as JSON
        ethnicity: state.ethnicity || null, // not yet implemented
        children: null,
        family_plans:  null,
        pets: state.pets || null, // not yet implemented
        zodiac_sign: state.zodiacSign || null, // not yet implemented
        onboarding: true, // Mark onboarding as completed
      };
      console.log('Submitting onboarding data:', updates);
      const { error: profileError } = await supabase.from('profiles').upsert(updates);
      if (profileError) throw profileError;

      // Save photos paths in `profile_photos` table
      const photoEntries = uploadedPhotos.map((url, index) => {
        // Extract only the last two parts of the path (folder + filename)
        const filePath = url.split('/').slice(-2).join('/');
        console.log('Photo path:', filePath);
        return {
          user_id: session.user.id,
          file_path: filePath, // Now stores only "folder/filename.jpg"
          is_primary: index === 0, // First photo is primary
        };
      });
      
      const { error: photoError } = await supabase.from('profile_photos').insert(photoEntries);
      if (photoError) throw photoError;

      router.push('/(onboarding)/infoCards' as Href);
      Alert.alert("Success", "Onboarding completed!");
    } catch (error) {
      console.error("Upload failed:", error);
      Alert.alert("Error", error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }
  return (
    <OnboardingContext.Provider value={{ state, updateField, resetOnboarding, submitOnboardingData }}>
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
