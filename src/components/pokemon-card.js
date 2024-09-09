import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/Theme';
import { useRouter } from 'expo-router';
import { useFavorites } from '../context/FavoritePokemon';

export default function ProfileCard({ id, name, type, imageUrl }) {
    const { theme } = useTheme();
    const { addFavorite, removeFavorite, favorites } = useFavorites();
    const router = useRouter();

    const handlePress = () => {
        router.push(`/pokemon/${id}`);
    };

    const isFavorite = favorites.some((fav) => fav.id === id);

    const toggleFavorite = () => {
        if (isFavorite) {
            removeFavorite(id);
        } else {
            addFavorite({ id, name, type, imageUrl });
        }
    };

    const styles = StyleSheet.create({
        card: {
            flexDirection: 'row',
            padding: 10,
            margin: 10,
            borderRadius: 10,
            backgroundColor: theme ? '#FFF' : '#1D1C21',
            elevation: 3,
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        image: {
            width: 80,
            height: 80,
            borderRadius: 40,
        },
        details: {
            marginLeft: 15,
            flex: 1,
        },
        id: {
            fontSize: 14,
            color: theme ? '#888' : '#FFF',
        },
        name: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme ? '#000' : '#FFF',
        },
        type: {
            fontSize: 16,
            color: '#555',
            marginTop: 5,
        },
        favoriteIcon: {
            padding: 10,
        },
    });

    const typeColor = (element) => {
        switch (element) {
            case 'Normal': return theme ? '#1D1C21' : '#FAFAC6';
            case 'Grass': return 'green';
            case 'Fire': return 'orange';
            case 'Water': return '#00B0E0';
            case 'Electric': return '#D6FF0A';
            case 'Ice': return '#BFDBF7';
            case 'Fighting': return 'red';
            case 'Poison': return 'purple';
            case 'Ground': return '#F2F269';
            case 'Flying': return 'violet';
            case 'Psychic': return '#CF8BA9';
            case 'Bug': return '#9EB25D';
            case 'Rock': return 'gold';
            case 'Ghost': return '#CEC2FF';
            case 'Dragon': return '#B3B3F1';
            case 'Dark': return 'brown';
            case 'Steel': return 'silver';
            case 'Fairy': return '#FECDAA';
            default: return '#555';
        }
    };

    return (
        <View style={styles.card}>
            <Image
                style={styles.image}
                source={{ uri: imageUrl }}
            />

            <TouchableOpacity onPress={handlePress} style={styles.details}>
                <Text style={styles.id}>ID: {id}</Text>
                <Text style={styles.name}>Name: {name}</Text>
                <Text style={styles.type}>
                    Type: {type.map((element, index) => (
                        <Text key={index} style={{ color: typeColor(element), fontWeight: 'bold' }}>
                            {element}{' '}
                        </Text>
                    ))}
                </Text>
            </TouchableOpacity>

            {/* Favorite Icon */}
            <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteIcon}>
                <Image
                    source={require('../../assets/favorite.png')}
                    resizeMode="contain"
                    style={{ height: 25, width: 25 }}
                    tintColor={isFavorite ? '#F06449' : (theme ? '#000' : '#FFF')} // Change icon color based on favorite status
                />
            </TouchableOpacity>
        </View>
    );
}
