import { View, Text, StyleSheet, Alert, Image, FlatList, TouchableOpacity } from "react-native";
import { useState } from 'react';
import { useOnboarding } from "../../providers/OnboardingProvider";
import { Button } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';

export default function PhotoUploadScreen() {
  const { state, updateField, submitOnboardingData } = useOnboarding();
  const [loading, setLoading] = useState(false);

  const photos = state.photo || []; // Get stored photos

  async function uploadPhoto() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only images
        allowsEditing: false, // Enable cropping
        allowsMultipleSelection: true, // Select multiple images
        quality: 0.8, // Image quality
      });

      if (result.canceled) return;

      const selectedImages = result.assets.map(asset => asset.uri);
      const updatedPhotos = [...photos, ...selectedImages];
      // console.log('Selected images:', updatedPhotos);
      updateField('photo', updatedPhotos);
    } catch (error) {
      Alert.alert("Error", "Failed to pick images.");
    }
  }

  async function completeOnboarding() {
    await submitOnboardingData();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload Your Photos</Text>

      {/* Display selected photos in a grid */}
      <FlatList
        data={photos}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.image} />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => updateField('photo', photos.filter(photo => photo !== item))}
            >
              <Text style={styles.deleteText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Button title="Upload Photo" onPress={uploadPhoto} disabled={loading} />
      <Button title="Complete Onboarding" onPress={completeOnboarding} style={styles.nextButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    margin: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  nextButton: {
    marginTop: 20,
  },
});

