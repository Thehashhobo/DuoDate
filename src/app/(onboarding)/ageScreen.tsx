import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useState } from 'react';
import { useOnboarding } from "../../providers/OnboardingProvider";
import { useRouter, Href} from 'expo-router';

const AgeScreen = () => {
  const { updateField } = useOnboarding();
  const router = useRouter();
  const [age, setAge] = useState('');

  const handleNext = () => {
    const parsedAge = parseInt(age);
    if (isNaN(parsedAge) || parsedAge < 18) {
      Alert.alert('Invalid Age', 'You must be at least 18 years old.');
      return;
    }
    updateField('age', parsedAge);
    router.push('/(onboarding)/nameScreen' as Href);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 24, marginBottom: 20, color: '#333' }}>Enter your age:</Text>
      <TextInput
      style={{ height: 50, width: '100%', borderColor: '#ccc', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, marginBottom: 20, backgroundColor: '#fff' }}
      keyboardType="numeric"
      value={age}
      onChangeText={setAge}
      placeholder="18+"
      placeholderTextColor="#999"
      />
      <Button title="Next" onPress={handleNext} color="#007BFF" />
    </View>
  );
};

export default AgeScreen;
