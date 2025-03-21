import { View, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "../../../providers/AuthProvider";
import { Button, Input } from "@rneui/themed";
import Avatar from "../../../components/avatar";
import { ScrollView } from "react-native-gesture-handler";
import { supabase } from "../../../lib/supabase";

export default function ProfileScreen() {
  const { session, profile, photos,  isLoading, fetchProfile, fetchProfilePhoto, } = useAuth();
  
  const [name, setName] = useState(profile?.name || "");
  const [age, setAge] = useState(profile?.age?.toString() || "");
  const [ethnicity, setEthnicity] = useState(profile?.ethnicity || "");
  const [familyPlans, setFamilyPlans] = useState(profile?.family_plans || "");
  const [height, setHeight] = useState(profile?.height?.toString() || "");
  const [zodiacSign, setZodiacSign] = useState(profile?.zodiac_sign || "");
  const [pets, setPets] = useState(profile?.pets ? "Yes" : "No");
  const [avatarUrl, setAvatarUrl] = useState((photos?.[0] ?? "") || "");

  useEffect(() => {
    fetchProfile(); 
    fetchProfilePhoto();
  }, []);
  console.log("profile in profile screen is: ", avatarUrl);
  async function updateProfile() {
    try {
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session.user.id,
        name,
        age: Number(age) || null,
        ethnicity,
        family_plans: familyPlans,
        height: Number(height) || null,
        zodiac_sign: zodiacSign,
        pets: pets === "Yes",
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;

      fetchProfile();
      fetchProfilePhoto();
 // Refresh context data after update
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Avatar
          size={200}
          url={avatarUrl}
          onUpload={(url: string) => {
            setAvatarUrl(url);
            updateProfile();
          }}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Name" value={name} onChangeText={setName} />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Ethnicity" value={ethnicity} onChangeText={setEthnicity} />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Family Plans" value={familyPlans} onChangeText={setFamilyPlans} />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Height (cm)" value={height} onChangeText={setHeight} keyboardType="numeric" />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Zodiac Sign" value={zodiacSign} onChangeText={setZodiacSign} />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Pets" value={pets} onChangeText={setPets} />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title={isLoading ? "Loading ..." : "Update"} onPress={updateProfile} disabled={isLoading} />
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});