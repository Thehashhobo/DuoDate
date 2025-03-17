import { PropsWithChildren, createContext, useContext, useEffect, useState} from "react";
import { supabase} from "../lib/supabase";
import { Session, User } from "@supabase/supabase-js";

type AuthContext = {
    session: Session | null;
    user: User | null;
    profile: any | null;
    setOnboardingComplete: (value: boolean) => void; // <-- Add this
}

const AuthContext = createContext<AuthContext>({
    session: null,
    user: null,
    profile: null,
    setOnboardingComplete: () => {},

});

export default function AuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<Session| null>(null)
    const [profile, setProfile] = useState(null)
    const [onboardingComplete, setOnboardingComplete] = useState<boolean| null>(null) // <-- Add this

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session)
        })
    
        supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session)
        })


      }, [])

    useEffect(() => {
        if (!session?.user) {
            setProfile(null);
            return;
          }
      
        const fetchProfile = async () => {
            if (session?.user) {
                const { data, error } = await supabase
                    .from("profiles")
                    .select('*')
                    .eq("id", session.user.id)
                    .single();
                if (!error && data) {
                    // console.log("Profile data: ", data);
                    // console.log("Profile data onboarding: ", data.onboarding);
                    setProfile(data);
                    // setOnboardingComplete(data.onboarding);
                } else {
                    console.error(error);
                }
            }
        };

        fetchProfile();
        
    }, [session?.user])
    

    return (
        <AuthContext.Provider value={{ session, user: session?.user ?? null, profile, setOnboardingComplete}}>
            {children}
        </AuthContext.Provider>
    )
}   

export const useAuth = () => useContext(AuthContext)