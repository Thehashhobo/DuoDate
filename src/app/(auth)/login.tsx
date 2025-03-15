import { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, Text } from 'react-native';
import { supabase } from '../../lib/supabase'; 
import { useRouter } from 'expo-router';
import { Button } from '@rneui/themed';

export default function PhoneAuth() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  async function sendOtp() {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) Alert.alert('Error', error.message);
    else setConfirming(true);
  }

  async function verifyOtp() {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
    //   await supabase.auth.setSession({
    //     expiresIn: 60 * 60 * 24 * 90, // 90 days session
    //   });

      Alert.alert('Success', 'Logged in!');
      router.replace('/(home)/(tabs)/discoveryScreen'); // Navigate to discoveryScreen
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{confirming ? "Enter OTP" : "Enter Phone Number"}</Text>
      
      {!confirming ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#888"
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoFocus
          />
          <Button title="Send OTP" onPress={sendOtp} buttonStyle={styles.button} titleStyle={styles.buttonText} />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            placeholderTextColor="#888"
            onChangeText={setOtp}
            keyboardType="numeric"
            autoFocus
          />
          <Button title="Verify OTP" onPress={verifyOtp} buttonStyle={styles.button} titleStyle={styles.buttonText} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    backgroundColor: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

