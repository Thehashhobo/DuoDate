import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useState } from 'react';
import { useOnboarding } from "../../providers/OnboardingProvider";
import { useRouter, Href } from 'expo-router';

const NameScreen = () => {
  const { updateField } = useOnboarding();
  const router = useRouter();
  const [name, setName] = useState('');

  const handleNext = () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your name.');
      return;
    }
    updateField('name', name.trim());
    router.push('/(onboarding)/heightScreen' as Href);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' }}>
    <Text style={{ fontSize: 24, marginBottom: 20, color: '#333' }}>Enter your Name:</Text>
      <TextInput
        style={{ height: 50, width: '100%', borderColor: '#ccc', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, marginBottom: 20, backgroundColor: '#fff' }}
        value={name}
        onChangeText={setName}
        placeholder="Your Name"
      />
      <Button title="Next" onPress={handleNext} color="#007BFF" />
    </View>
    
  );
};

export default NameScreen;
