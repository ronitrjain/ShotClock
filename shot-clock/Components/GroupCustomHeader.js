import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { Entypo } from '@expo/vector-icons';

const GroupCustomHeader = (props) => {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>{props.groupName}</Text>
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

export default GroupCustomHeader