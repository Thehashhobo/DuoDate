import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity  } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useOnboarding } from '../../providers/OnboardingProvider';
import { useRouter, Href } from 'expo-router';

const HeightScreen = () => {
  const { updateField } = useOnboarding();
  const router = useRouter();
  const [feet, setFeet] = useState('5');    // default 5 ft
  const [inches, setInches] = useState('6'); // default 6 in

  const handleNext = () => {
    // Calculate total inches, e.g. 5 ft 6 in => 66
    const totalInches = parseInt(feet) * 12 + parseInt(inches);

    // Update with a number instead of a string
    updateField('height', totalInches);

    Alert.alert(
      'Confirm Height',
      `You've selected ${feet}ft ${inches}in. Proceed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => router.push('/(onboarding)/locationScreen' as Href),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Your Height</Text>

    <View style={styles.row}>
    {/* FEET PICKER */}
      <Picker
        style={styles.picker}
        selectedValue={feet}
        onValueChange={(value) => setFeet(value)}
        itemStyle={{ color: '#007AFF' }}
      >
        <Picker.Item label="2" value={'2'} />
        <Picker.Item label="3" value={'3'} />
        <Picker.Item label="4" value={'4'} />
        <Picker.Item label="5" value={'5'} />
        <Picker.Item label="6" value={'6'} />
        <Picker.Item label="7" value={'7'} />
      </Picker>
      <Text style={styles.label}>Feet</Text>

    {/* INCHES PICKER */}
      <Picker
        style={styles.picker}
        selectedValue={inches}
        onValueChange={(value) => setInches(value)
            
        }itemStyle={{ color: '#007AFF' }}
      >
        <Picker.Item label="0" value={'0'} />
        <Picker.Item label="1" value={'1'} />
        <Picker.Item label="2" value={'2'} />
        <Picker.Item label="3" value={'3'} />
        <Picker.Item label="4" value={'4'} />
        <Picker.Item label="5" value={'5'} />
        <Picker.Item label="6" value={'6'} />
        <Picker.Item label="7" value={'7'} />
        <Picker.Item label="8" value={'8'} />
        <Picker.Item label="9" value={'9'} />
        <Picker.Item label="10" value={'10'} />
        <Picker.Item label="11" value={'11'} />
      </Picker>
      <Text style={styles.label}>Inches</Text>
    </View>


    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HeightScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center', // 🟢 Align pickers in center
    alignItems: 'center', // 🟢 Ensure vertical alignment
    marginBottom: 30,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
    color: '#333',
  },
  picker: {
    width: 120,
    height: 50,
  },
  nextButton: {
    marginTop: 50, // Large Top Margin for Spacing
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

});
