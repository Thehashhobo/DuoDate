import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  photos: string[] | null;
  isLoading: boolean; // New state to track loading
  fetchProfile: () => Promise<void>;
  fetchProfilePhoto: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  photos: null,
  isLoading: true, // Default to loading state
  fetchProfile: async () => {},
  fetchProfilePhoto: async () => {},
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  // Fetch Profile Data
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      if (!session?.user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      console.log(data);

      if (error) {
        console.error("Error fetching profile:", error);
        setIsLoading(false);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Profile Photos
  const fetchProfilePhoto = async () => {
    try {
      setIsLoading(true);
      if (!session?.user) {
        setPhotos([]);
        setIsLoading(false);
        return;
      }

      const { data: photosData, error: photosError } = await supabase
        .from("profile_photos")
        .select("file_path, is_primary")
        .eq("user_id", session.user.id);

      if (photosError) throw photosError;

      setPhotos(photosData.map((photo: any) => photo.file_path));
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to Listen for Session Changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      console.log("Session in auth provider is: ", session);
    });
    // supabase.auth.signOut()


    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Fetch Profile & Photos on Session Change
  useEffect(() => {
    if (session?.user) {
      fetchProfile();
      fetchProfilePhoto();
    } else {
      setProfile(null);
      setPhotos([]);
      setIsLoading(false);
    }
  }, [session?.user]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        photos,
        isLoading,
        fetchProfile,
        fetchProfilePhoto,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook for using authentication context
export const useAuth = () => useContext(AuthContext);