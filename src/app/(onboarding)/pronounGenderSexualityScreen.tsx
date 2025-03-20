import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import { useState } from 'react';
import { useOnboarding } from "../../providers/OnboardingProvider";
import { Href, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const PronounGenderSexualityScreen = () => {
  const { updateField } = useOnboarding();
  const router = useRouter();

  // Pronoun state
  const [pronoun, setPronoun] = useState('');
  const [customPronoun, setCustomPronoun] = useState('');

  // Gender state
  const [gender, setGender] = useState('');
  const [customGender, setCustomGender] = useState('');

  // Sexuality state
  const [sexuality, setSexuality] = useState('');
  const [customSexuality, setCustomSexuality] = useState('');

  const handleNext = () => {
    if (!pronoun || !gender || !sexuality) {
      Alert.alert('Missing Fields', 'Please select or enter values for all fields.');
      return;
    }

    updateField('pronoun', pronoun === 'Custom' ? customPronoun.trim() : pronoun);
    updateField('gender', gender === 'Custom' ? customGender.trim() : gender);
    updateField('sexuality', sexuality === 'Custom' ? customSexuality.trim() : sexuality);

    router.push('/(onboarding)/photoUploadScreen' as Href);
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      {/* Pronoun Section */}
      <Text>What pronouns do you use?</Text>
      <Picker selectedValue={pronoun} onValueChange={setPronoun}
              itemStyle={{ color: '#007AFF' }}>
        <Picker.Item label="Select..." value="" />
        <Picker.Item label="He/Him" value="He/Him" />
        <Picker.Item label="She/Her" value="She/Her" />
        <Picker.Item label="They/Them" value="They/Them" />
        <Picker.Item label="Custom" value="Custom" />
      </Picker>
      {pronoun === 'Custom' && (
        <TextInput
          placeholder="Enter custom pronoun"
          value={customPronoun}
          onChangeText={setCustomPronoun}
        />
      )}

      {/* Gender Identity Section */}
      <Text>What is your gender identity?</Text>
      <Picker selectedValue={gender} onValueChange={setGender}
              itemStyle={{ color: '#007AFF' }}>
        <Picker.Item label="Select..." value="" />
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
        <Picker.Item label="Non-binary" value="Non-binary" />
        <Picker.Item label="Custom" value="Custom" />
      </Picker>
      {gender === 'Custom' && (
        <TextInput
          placeholder="Enter custom gender"
          value={customGender}
          onChangeText={setCustomGender}
        />
      )}

      {/* Sexuality Section */}
      <Text>What is your sexual orientation?</Text>
      <Picker selectedValue={sexuality} onValueChange={setSexuality} 
              itemStyle={{ color: '#007AFF' }}>
        <Picker.Item label="Select..." value="" />
        <Picker.Item label="Straight" value="Straight" />
        <Picker.Item label="Gay" value="Gay" />
        <Picker.Item label="Bisexual" value="Bisexual" />
        <Picker.Item label="Asexual" value="Asexual" />
        <Picker.Item label="Pansexual" value="Pansexual" />
        <Picker.Item label="Custom" value="Custom" />
      </Picker>
      {sexuality === 'Custom' && (
        <TextInput
          placeholder="Enter custom sexuality"
          value={customSexuality}
          onChangeText={setCustomSexuality}
        />
      )}

      <Button title="Next" onPress={handleNext} />
    </ScrollView>
  );
};

export default PronounGenderSexualityScreen;
