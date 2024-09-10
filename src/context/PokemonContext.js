// PokemonContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useContext, useEffect } from 'react';// Or 'expo-secure-store' if you're using Expo

const PokemonContext = createContext();

export const PokemonProvider = ({ children }) => {
  const [pokemons, setPokemons] = useState([]);
  const API_URL = 'http://192.168.0.13'

  useEffect(() => {
    // Load initial Pokémon data from AsyncStorage on mount
    const loadPokemons = async () => {
      try {
        const storedPokemons = await AsyncStorage.getItem('pokemons');
        if (storedPokemons) {
          setPokemons(JSON.parse(storedPokemons));
        }
      } catch (error) {
        console.error('Failed to load pokemons from AsyncStorage', error);
      }
    };

    loadPokemons();
  }, []);

  // Function to fetch Pokémon data from the API
  const fetchPokemons = async () => {
    try {
      const response = await fetch('http://192.168.0.13/pokemon');
      const data = await response.json();
      
      // Filter out duplicates based on `.id`
      const uniquePokemons = data.reduce((acc, pokemon) => {
        if (!acc.some(p => p.id === pokemon.id)) {
          acc.push(pokemon);
        }
        return acc;
      }, []);
      
      setPokemons(uniquePokemons);
      await AsyncStorage.setItem('pokemons', JSON.stringify(uniquePokemons));
    } catch (error) {
      console.error('Failed to fetch pokemons', error);
    }
  };

  // Function to add a Pokémon
  const addPokemon = async (newPokemon) => {
    try {
      setPokemons(prevPokemons => {
        const updatedPokemons = [...prevPokemons, newPokemon];
        AsyncStorage.setItem('pokemons', JSON.stringify(updatedPokemons));
        return updatedPokemons;
      });
    } catch (error) {
      console.error('Failed to add pokemon', error);
    }
  };

  // Function to edit a Pokémon
  const editPokemon = async (updatedPokemon) => {
    try {
      setPokemons(prevPokemons => {
        const updatedPokemons = prevPokemons.map(pokemon =>
          pokemon.id === updatedPokemon.id ? updatedPokemon : pokemon
        );
        AsyncStorage.setItem('pokemons', JSON.stringify(updatedPokemons));
        return updatedPokemons;
      });
    } catch (error) {
      console.error('Failed to edit pokemon', error);
    }
  };

  // Function to delete a Pokémon
  const deletePokemon = async (pokemonId) => {
    try {
      setPokemons(prevPokemons => {
        const updatedPokemons = prevPokemons.filter(pokemon => pokemon.id !== pokemonId);
        AsyncStorage.setItem('pokemons', JSON.stringify(updatedPokemons));
        return updatedPokemons;
      });
    } catch (error) {
      console.error('Failed to delete pokemon', error);
    }
  };

  const getPokemonById = (pokemonId) => {
    const response = pokemons.find(pokemon => pokemon.id == pokemonId);
    console.log(response)
    return response
  };
  const reset = () => {
    setPokemons([])
  };

  return (
    <PokemonContext.Provider
      value={{
        pokemons,
        fetchPokemons,
        addPokemon,
        editPokemon,
        deletePokemon,
        getPokemonById,
        API_URL,
        reset
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemons = () => useContext(PokemonContext);
