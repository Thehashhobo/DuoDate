import { View, Text, Button, Alert } from 'react-native';
import { useState } from 'react';
import * as Location from 'expo-location';
import { useOnboarding } from "../../providers/OnboardingProvider";
import { useRouter, Href } from 'expo-router';

const LocationScreen = () => {
  const { updateField } = useOnboarding();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUseGPS = async () => {
    try {
      setLoading(true);
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please enable location services for better matches.'
        );
        setLoading(false);
        return;
      }

      // Get current position
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      // Reverse geocode for city and country
      const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      const geoData = reverseGeocode && reverseGeocode[0];
      const city = geoData?.city || 'Unknown City';
      const country = geoData?.country || 'Unknown Country';

      // Ask user to confirm
      Alert.alert(
        'Confirm Location',
        `We found: ${city}, ${country}. Do you want to proceed?`,
        [
          { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) },
          {
            text: 'OK',
            onPress: () => {
              updateField('location', { city, country, latitude, longitude });
              console.log('Location set to:', city, country, latitude, longitude);
              setLoading(false);
              router.push('/(onboarding)/pronounGenderSexualityScreen' as Href);
            },
          },
        ]
      );
    } catch (error) {
      console.warn(error);
      Alert.alert('Error', 'Failed to get location. Check your device settings.');
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ marginBottom: 20, fontSize: 20 }}>
        Let us detect your location for a better matching experience.
      </Text>

      <Button
        title={loading ? 'Detecting...' : 'Use GPS'}
        onPress={handleUseGPS}
        disabled={loading}
      />
    </View>
  );
};

export default LocationScreen;
