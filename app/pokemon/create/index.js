import React, { useEffect, useState } from 'react'
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { usePokemons } from '../../../src/context/PokemonContext'
import { router } from 'expo-router'

export default function CreateLayout() {

    const { getPokemonById, pokemons, addPokemon } = usePokemons()
    const [dummydata, setDummyData] = useState()
    const [isLoading, setLoading] = useState(true)
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        const data = getPokemonById(100)
        data.id = pokemons.map(p => p.id).reverse()[0] + 1
        setDummyData(data)
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

                    dummydata.name.english = inputText
                    setDummyData(dummydata)
                    addPokemon(dummydata)
                    Alert.alert('Created a Pokemon!', dummydata.name.english)
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