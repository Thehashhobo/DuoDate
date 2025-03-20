import { View, StyleSheet, Alert } from "react-native";
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../providers/AuthProvider'
import { Button, Input } from '@rneui/themed'
import Avatar from '../../../components/avatar'
import { ScrollView } from "react-native-gesture-handler";


export default function ProfileScreen() {
  const {session} = useAuth()
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (session) getProfile()
      console.log('looking for profile', session)
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

        const { data: profileData, error: profileError, status: profileStatus } = await supabase
        .from('profiles')
        .select(`name, age`)
        .eq('id', session?.user.id)
        .single();
  
      if (profileError && profileStatus !== 406) {
        throw profileError;
      }

      const { data: photosData, error: photosError } = await supabase
      .from('profile_photos')
      .select(`file_path`)
      .eq('user_id', session?.user.id);
      console.log('Got photos filepath', photosData)

      if (photosError) {
        throw photosError;
      }
      if (profileData) {
        console.log('Got profile data', profileData.age)
        setName(profileData.name)
        setAge(profileData.age.toString())
        // setAvatarUrl(data.avatar_url)
      }

      if (photosData) {
        const photoUrls = photosData.map((photo) => photo.file_path);
        setAvatarUrl(photoUrls[0]); // Assuming you have a state variable `setPhotos`
      }

  
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    name,
    age,
    // avatar_url,
  }: {
    name: string
    age: number
    // avatar_url: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        name,
        age,
        // avatar_url,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <Avatar
          size={200}
          url={avatarUrl}
          onUpload={(url: string) => {
            setAvatarUrl(url)
            updateProfile({ 
              name, 
              age: Number(age), 
              // avatar_url: url })
            })
          }}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Name" value={name || ''} onChangeText={(text) => setName(text)} />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Age" value={age} onChangeText={(text) => setAge(text)} keyboardType="numeric" />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() => updateProfile({ name, age: Number(age) })}
          disabled={loading}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})
