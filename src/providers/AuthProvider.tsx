import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  fetchProfile: () => Promise<void>;  // expose fetchProfile in the context
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  fetchProfile: async () => {},
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);

  // Pull your fetchProfile logic into a reusable function
  const fetchProfile = async () => {
    if (!session?.user) {
      setProfile(null);
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error(error);
      return;
    }
    setProfile(data);
  };

  useEffect(() => {
    // initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // listen for session changes
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    // automatically call fetchProfile whenever the user changes
    fetchProfile();
  }, [session?.user]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        fetchProfile, // provide the method here
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
