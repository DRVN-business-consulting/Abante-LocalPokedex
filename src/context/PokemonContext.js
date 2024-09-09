import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const PokemonContext = createContext();

const API_URL = 'http://192.168.1.14:80';

const cleanPokemonData = (data) => {
    console.log(data);
    return data.map(pokemon => ({
        id: pokemon.id || null,
        name: {
            english: pokemon?.name?.english || '',
            japanese: pokemon?.name?.japanese || '',
            chinese: pokemon?.name?.chinese || '',
            french: pokemon?.name?.french || ''
        },
        type: pokemon.type || [],
        base: {
            HP: pokemon?.base?.HP || 0,
            Attack: pokemon?.base?.Attack || 0,
            Defense: pokemon?.base?.Defense || 0,
            'Sp Attack': pokemon?.base?.["Sp. Attack"] || 0,
            'Sp Defense': pokemon?.base?.["Sp. Defense"] || 0,
            Speed: pokemon?.base?.Speed || 0,
        },
        species: pokemon.species || '',
        description: pokemon.description || '',
        evolution: {
            prev: pokemon?.evolution?.prev ? {
                id: pokemon.evolution.prev[0] || null,
                condition: pokemon.evolution.prev[1] || ''
            } : null,
            next: pokemon?.evolution?.next ? pokemon.evolution.next.map(evo => ({
                id: evo[0] || null,
                condition: evo[1] || ''
            })) : []
        },
        profile: {
            height: pokemon?.profile?.height || '',
            weight: pokemon?.profile?.weight || '',
            eggGroups: pokemon?.profile?.egg || [],
            ability: pokemon?.profile?.ability?.map(ability => ({
                name: ability[0] || '',
                hidden: ability[1] === "true"
            })) || [],
            gender: pokemon?.profile?.gender || ''
        },
        image: {
            sprite: pokemon?.image?.sprite || '',
            thumbnail: pokemon?.image?.thumbnail || '',
            hi_res: pokemon?.image?.hi_res || '',
            hires: pokemon?.image?.hires || ''
        }
    }));
};


const PokemonProvider = ({ children }) => {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);

    // Helper to check if a file exists locally
    const checkIfFileExists = async (fileUri) => {
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        return fileInfo.exists;
    };

    const downloadImagesThrottled = async (pokemonList, maxConcurrentDownloads = 5) => {
        const queue = [...pokemonList];
        const promises = [];

        const downloadPokemonImage = async (pokemon) => {
            const localUri = FileSystem.documentDirectory + `pokemon_${pokemon.id}_hi_res`;

            // Check if the Pokémon image is already saved locally
            const fileExists = await checkIfFileExists(localUri);

            if (fileExists) {
                console.log(`Image for Pokémon ID: ${pokemon.id} already exists at ${localUri}`);
                // Load the cached image from local storage
                const updatedPokemon = { ...pokemon, image: { ...pokemon.image, cache_hi_res: localUri } };
                setPokemons((prevPokemons) =>
                    prevPokemons.map((p) => (p.id === pokemon.id ? updatedPokemon : p))
                );
            } else {
                console.log("Downloading image from:", API_URL + pokemon.image.hi_res);

                const downloadResumable = FileSystem.createDownloadResumable(
                    API_URL + pokemon.image.hi_res,
                    localUri,
                    {}
                );
                try {
                    const { uri } = await downloadResumable.downloadAsync();
                    console.log(`Downloaded image for Pokémon ID: ${pokemon.id} to ${uri}`);

                    const updatedPokemon = { ...pokemon, image: { ...pokemon.image, cache_hi_res: uri } };
                    await AsyncStorage.setItem(`pokemon_${pokemon.id}`, JSON.stringify(updatedPokemon));

                    setPokemons((prevPokemons) =>
                        prevPokemons.map((p) => (p.id === pokemon.id ? updatedPokemon : p))
                    );
                } catch (error) {
                    console.error(`Error downloading image for Pokémon ID: ${pokemon.id}`, error);
                }
            }
        };

        while (queue.length > 0) {
            const batch = queue.splice(0, maxConcurrentDownloads);
            const batchPromises = batch.map((pokemon) => downloadPokemonImage(pokemon));

            promises.push(...batchPromises);
            await Promise.all(batchPromises);
        }
        return Promise.all(promises);
    };

    const fetchPokemonData = async () => {
        try {
            console.log('Fetching all data from API...');
            const response = await fetch(API_URL + '/pokemon');
            const data = await response.json();
            const uniqueData = data.filter((item, index, self) =>
                index === self.findIndex((t) => t.id === item.id)
            );

            const cleanedData = cleanPokemonData(uniqueData);
            setPokemons(cleanedData);

            downloadImagesThrottled(cleanedData, 5);

            console.log('Data fetched and saved to AsyncStorage.');
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPokemonData();
    }, []);

    const getPokemon = async (id) => {
        try {
            const pokemonData = await AsyncStorage.getItem(`pokemon_${id}`);
            if (!pokemonData) {
                throw new Error(`Pokemon with ID ${id} not found`);
            }
            return JSON.parse(pokemonData);
        } catch (error) {
            console.error(`Error retrieving Pokémon with ID ${id}:`, error);
            return null;
        }
    };

    const addPokemon = async (pokemon) => {
        setPokemons((prev) => [...prev, pokemon]);
        await AsyncStorage.setItem(`pokemon_${pokemon.id}`, JSON.stringify(pokemon));
    };

    const editPokemon = async (updatedPokemon) => {
        setPokemons((prev) => prev.map(pokemon =>
            pokemon.id === updatedPokemon.id ? updatedPokemon : pokemon
        ));
        await AsyncStorage.setItem(`pokemon_${updatedPokemon.id}`, JSON.stringify(updatedPokemon));
    };

    const deletePokemon = async (id) => {
        setPokemons((prev) => prev.filter(pokemon => pokemon.id !== id));
        await AsyncStorage.removeItem(`pokemon_${id}`);
    };

    return (
        <PokemonContext.Provider value={{ pokemons, loading, addPokemon, editPokemon, deletePokemon, getPokemon }}>
            {children}
        </PokemonContext.Provider>
    );
};

const usePokemons = () => useContext(PokemonContext);

export { PokemonProvider, usePokemons };
