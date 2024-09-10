import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Switch, Text, View, Alert } from 'react-native';
import { useTheme } from '../../../src/context/Theme';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { usePokemons } from '../../../src/context/PokemonContext';

export default function SettingTab() {
  const { theme, setTheme } = useTheme();
  const {fetchPokemons, reset} = usePokemons()

  // Function to clear downloaded images from filesystem
  const clearDownloadedImages = async () => {
    try {
      const dirUri = FileSystem.documentDirectory;
      const files = await FileSystem.readDirectoryAsync(dirUri);
      
      // Filter files for those that match the Pokémon image naming convention
      const pokemonImages = files.filter(file => file.includes('pokemon_') && file.includes('_hi_res'));

      // Loop through and delete each Pokémon image
      for (const file of pokemonImages) {
        await FileSystem.deleteAsync(dirUri + file);
        console.log(`Deleted file: ${file}`);
      }

      console.log('Downloaded images cleared successfully.');
    } catch (error) {
      console.error('Error clearing downloaded images:', error);
    }
  };

  // Function to clear AsyncStorage and images
  const clearStorage = async () => {
    try {
      await AsyncStorage.clear(); // Clear AsyncStorage
      await clearDownloadedImages(); // Clear downloaded images
      reset()
      Alert.alert('Success', 'Storage and downloaded images cleared successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear storage.');
      console.error(error);
    }
  };


  const addPokemon = () =>{
    router.push('/pokemon/create')
  }

  const toggleTheme = (isTrue) => {
    if (isTrue) setTheme('dark');
    else setTheme('light');
  };

  return (
    <View style={[styles.container, (theme ? styles.background : styles.backgroundDark)]}>
      <Text style={(theme ? styles.text : styles.textDark)}>
        Current Theme: {theme ? 'Light Mode' : 'Dark Mode'} !
      </Text>

      <Switch
        value={theme}
        onValueChange={setTheme}
      />

      <Button title='Log out' onPress={() => { router.replace('/'); }} />

      <Button title='Clear Storage' onPress={clearStorage} />

      <Button title='Add pokemon' onPress={addPokemon} />
      <Button title='Fetch' onPress={fetchPokemons} />

      <StatusBar style="auto" />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    backgroundColor: '#FFF',
  },
  backgroundDark: {
    backgroundColor: '#121212',
  },
  text: {
    color: '#121212',
  },
  textDark: {
    color: '#FFF',
  },
});
