import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritePokemonContext = createContext();

const FavoritePokemonProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const favoritesData = await AsyncStorage.getItem('favorites');
                if (favoritesData) {
                    setFavorites(JSON.parse(favoritesData));
                }
            } catch (error) {
                console.error('Error loading favorites:', error);
            }
        };

        loadFavorites();
    }, []);

    const addFavorite = async (pokemon) => {
        const updatedFavorites = [...favorites, pokemon];
        setFavorites(updatedFavorites);
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    const removeFavorite = async (id) => {
        const updatedFavorites = favorites.filter(pokemon => pokemon.id !== id);
        setFavorites(updatedFavorites);
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    return (
        <FavoritePokemonContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
            {children}
        </FavoritePokemonContext.Provider>
    );
};

const useFavorites = () => useContext(FavoritePokemonContext);

export { FavoritePokemonProvider, useFavorites };
