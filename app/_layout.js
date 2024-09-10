import { Stack } from "expo-router";
import { ThemeProvider } from "../src/context/Theme";
import { FavoritePokemonProvider } from "../src/context/FavoritePokemon";
import { PokemonProvider } from "../src/context/PokemonContext";


export default function AppLayout() {
    return (

        <ThemeProvider>
            <PokemonProvider>

                <FavoritePokemonProvider>
                    <Stack>
                        <Stack.Screen
                            name="index"
                            options={{
                                headerShown: false
                            }}
                        />
                        <Stack.Screen
                            name="(tabs)"
                            options={{
                                headerShown: false
                            }}
                        />
                        <Stack.Screen
                            name="pokemon/[id]"
                            options={{
                                title: 'Pokemon Profile',
                                headerShown: true
                            }}
                        />
                        <Stack.Screen
                            name="pokemon/create/index"
                            options={{
                                title: 'Create Pokemon',
                                headerShown: true
                            }}
                        />
                        <Stack.Screen
                            name="pokemon/edit/[id]"
                            options={{
                                title: 'Change Pokemon Name',
                                headerShown: true
                            }}
                        />
                    </Stack>
                </FavoritePokemonProvider>
            </PokemonProvider>
        </ThemeProvider >
    )
}