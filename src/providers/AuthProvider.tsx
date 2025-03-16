import { PropsWithChildren, createContext, useContext, useEffect, useState} from "react";
import { supabase} from "../lib/supabase";
import { Session, User } from "@supabase/supabase-js";

type AuthContext = {
    session: Session | null;
    user: User | null;
    onboardingComplete: boolean | null;
    setOnboardingComplete: (value: boolean) => void; // <-- Add this
}

const AuthContext = createContext<AuthContext>({
    session: null,
    user: null,
    onboardingComplete: null,
    setOnboardingComplete: () => {},

});

export default function AuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<Session| null>(null)
    const [onboardingComplete, setOnboardingComplete] = useState<boolean|null>(null)

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
            setOnboardingComplete(null);
            return;
          }
      
        const fetchOnboardingStatus = async () => {
            if (session?.user) {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("onboarding")
                    .eq("id", session.user.id)
                    .single();
                if (!error && data && onboardingComplete === null) {
                    setOnboardingComplete(data.onboarding);
                } else {
                    setOnboardingComplete(false);
                }
            }
        };

        fetchOnboardingStatus();
        
    }, [session?.user])
    

    return (
        <AuthContext.Provider value={{ session, user: session?.user ?? null, onboardingComplete, setOnboardingComplete}}>
            {children}
        </AuthContext.Provider>
    )
}   

export const useAuth = () => useContext(AuthContext)