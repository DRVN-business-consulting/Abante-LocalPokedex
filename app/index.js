import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useTheme } from '../src/context/Theme';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function App() {
  const { theme } = useTheme();
  const [token, setToken] = useState('');

  const TOKEN_KEY = 'authToken';
  const HARDCODED_TOKEN = 'pass';
  const SHIFT = 3;

  const encryptToken = (token, shift) => {
    return token
      .split('')
      .map(char => String.fromCharCode(char.charCodeAt(0) + shift))
      .join('');
  };

  const decryptToken = (token, shift) => {
    return token
      .split('')
      .map(char => String.fromCharCode(char.charCodeAt(0) - shift))
      .join('');
  };

  const saveToken = async (token) => {
    const encryptedToken = encryptToken(token, SHIFT);
    await SecureStore.setItemAsync(TOKEN_KEY, encryptedToken);
  };

  const getToken = async () => {
    const encryptedToken = await SecureStore.getItemAsync(TOKEN_KEY);
    return encryptedToken ? decryptToken(encryptedToken, SHIFT) : null;
  };

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await getToken();
      if (!storedToken) {
        await saveToken(HARDCODED_TOKEN);
      }
    };

    checkToken();
  }, []);

  const validate = async () => {
    const storedToken = await getToken();

    if (token === storedToken) {
      router.replace('/(tabs)/pokedex');
    } else {
      Alert.alert('Log in Failed.');
    }
  };

  return (
    <View style={[styles.container, (theme ? styles.background : styles.backgroundDark)]}>
      
        <>
          <Text
            style={[(theme ? styles.text : styles.textDark), { fontSize: 30, fontWeight: 'bold', fontStyle: 'italic' }]}
          >
            Login
          </Text>

          <TextInput
            style={(theme ? styles.textInput : styles.textInputDark)}
            value={token}
            onChangeText={setToken}
            placeholder='token'
            placeholderTextColor={(theme) ? '#121212' : '#FFF'}
            secureTextEntry
          />

          <TouchableOpacity
            style={(theme ? styles.button : styles.buttonDark)}
            onPress={validate}
          >
            <Text style={theme ? styles.text : styles.textDark}>Log in</Text>
          </TouchableOpacity>
        </>


      <StatusBar style="auto" />
    </View>
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
  textInput: {
    margin: 10,
    padding: 5,
    borderColor: '#121212',
    borderWidth: 1,
    borderRadius: 4,
    width: '40%',
    height: '4%',
    color: '#121212',
  },
  textInputDark: {
    margin: 10,
    padding: 5,
    borderColor: '#FFF',
    borderWidth: 1,
    borderRadius: 4,
    width: '40%',
    height: '4%',
    color: '#FFF',
  },
  button: {
    borderWidth: 1,
    borderColor: '#121212',
    borderRadius: 3,
    padding: 4,
  },
  buttonDark: {
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 3,
    padding: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
  },
});
