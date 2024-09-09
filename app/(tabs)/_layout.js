import { Tabs } from "expo-router";
import { useTheme } from "../../src/context/Theme";
import { Image } from "react-native";
import React from 'react'

export default function TabsLayout() {
    const { theme } = useTheme()
    return (
        <Tabs>
            <Tabs.Screen
                name="pokedex/index"
                options={{
                    title: "Pokedex",
                    headerTintColor: 'white',
                    headerStyle: {
                        backgroundColor: theme ? '#C42847' : '#95190C'
                    },
                    headerTitleStyle: {
                        fontStyle: 'italic'
                    },
                    tabBarStyle: {
                        backgroundColor: (theme) ? '#FFF': '#121212'  
                    },
                    tabBarIcon: ({focused, color, size}) => {
                        if (focused)
                            return <Image source={require('../../assets/pokeballActive.png')} resizeMode="contain" style={{ height: 25, width: 25 }} />;
                        else
                            return <Image source={require('../../assets/pokeballInactive.png')} resizeMode="contain" style={{ height: 25, width: 25 }} tintColor={(theme) ?  '#121212' : '#FFF'} />;
                    }
                }}
            />
            <Tabs.Screen
                name="favorite/index"
                options={{
                    title: "Favorite",
                    headerTintColor: 'white',
                    headerStyle: {
                        backgroundColor: theme ? '#C42847' : '#95190C',
                    },
                    headerTitleStyle: {
                        fontStyle: 'italic'
                    },
                    tabBarStyle: {
                        backgroundColor: (theme) ? '#FFF': '#121212'  
                    },
                    tabBarIcon: ({focused, color, size}) => {

                        if (focused)
                            return <Image source={require('../../assets/favorite.png')} resizeMode="contain" style={{ height: 25, width: 25 }} tintColor={'#F06449'}/>;
                        else
                            return <Image source={require('../../assets/favorite.png')} resizeMode="contain" style={{ height: 25, width: 25 }} tintColor={(theme) ?  '#121212' : '#FFF'} />;
                    }
                }}
            />
            <Tabs.Screen
                name="setting/index"
                options={{
                    title: "Settings",
                    headerTintColor: 'white',
                    headerStyle: {
                        backgroundColor: theme ? '#C42847' : '#95190C',
                    },
                    headerTitleStyle: {
                        fontStyle: 'italic'
                    },
                    tabBarStyle: {
                        backgroundColor: (theme) ? '#FFF': '#121212'  
                    },
                    tabBarIcon: ({focused, color, size}) => {
                        if (focused)
                            return <Image source={require('../../assets/settings.png')} resizeMode="contain" style={{ height: 25, width: 25 }} tintColor={'#F06449'} />;
                        else
                            return <Image source={require('../../assets/settings.png')} resizeMode="contain" style={{ height: 25, width: 25 }} tintColor={(theme) ?  '#121212' : '#FFF'} />;
                    }
                }}
            />
        </Tabs>
    )
}