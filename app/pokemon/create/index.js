import React, { useEffect, useState } from 'react'
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { usePokemons } from '../../../src/context/PokemonContext'
import { router } from 'expo-router'

export default function CreateLayout() {

    const { getPokemonById, pokemons, addPokemon } = usePokemons()
    const [isLoading, setLoading] = useState(true)
    const [inputText, setInputText] = useState('');
    const [newPokemon, setNewPokemon] = useState({})



    useEffect(() => {

        setLoading(false)
    }, [])

    return (
        isLoading ?
            <View style={styles.container}>
                <Text>Loading</Text>
            </View> :
            <View style={[styles.container]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>Name: </Text>
                    <TextInput
                        style={styles.input}
                        value={inputText} // Bind state value to TextInput
                        onChangeText={(text) => setInputText(text)} // Update state when user types
                        placeholder="Name of the Pokemon"
                    />
                </View>
                <Button title='Save' onPress={() => {
                    const data = {
                        "id": pokemons.map(p => p.id).reverse()[0] + 1,
                        "name": {
                            "english": inputText,
                            "japanese": "フシギバナ",
                            "chinese": "妙蛙花",
                            "french": "Florizarre"
                        },
                        "type": [
                            "Grass",
                            "Poison"
                        ],
                        "base": {
                            "HP": 80,
                            "Attack": 82,
                            "Defense": 83,
                            "Sp. Attack": 100,
                            "Sp. Defense": 100,
                            "Speed": 80
                        },
                        "species": "Seed Pokémon",
                        "description": "There is a large flower on Venusaur’s back. The flower is said to take on vivid colors if it gets plenty of nutrition and sunlight. The flower’s aroma soothes the emotions of people.",
                        "evolution": {
                            "prev": [
                                "2",
                                "Level 32"
                            ]
                        },
                        "profile": {
                            "height": "2 m",
                            "weight": "100 kg",
                            "egg": [
                                "Monster",
                                "Grass"
                            ],
                            "ability": [
                                [
                                    "Overgrow",
                                    "false"
                                ],
                                [
                                    "Chlorophyll",
                                    "true"
                                ]
                            ],
                            "gender": "87.5:12.5"
                        },
                        "image": {
                            "sprite": "/image/sprite/3.png",
                            "thumbnail": "/image/thumbnail/3.png",
                            "hires": "https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/images/pokedex/hires/003.png",
                            "hi_res": "/image/hi_res/3.png"
                        }
                    }

                    addPokemon(data)
                    Alert.alert('Created a Pokemon!', data.name.english)
                    router.back()
                }} />
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})