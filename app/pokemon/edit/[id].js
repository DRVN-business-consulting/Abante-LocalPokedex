import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { usePokemons } from '../../../src/context/PokemonContext'

export default function EditLayout() {
    const { id } = useLocalSearchParams()
    const [pokemon, setPokemon] = useState({})
    const [isLoading, setLoading] = useState(true)
    const [inputText, setInputText] = useState('');

    const { getPokemonById, editPokemon } = usePokemons()

    useEffect(() => {
        const data = getPokemonById(id)
        setPokemon(data)
        setLoading(false)
    }, [id])

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
                        placeholder='Change name'
                    />
                </View>
                <Button title='Save' onPress={() => {
                    pokemon.name.english = inputText
                    setPokemon(pokemon)
                    editPokemon(pokemon)
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
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 5,
        borderRadius: 5,
        marginBottom: 20,
    }
})