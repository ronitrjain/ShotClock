import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { Entypo } from '@expo/vector-icons';


export default function CustomHeader ({name}) {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>{name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    title: {
        fontSize: 25
    }
})
