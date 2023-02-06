import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MenuButton from './MenuButton'

export default function GroupCustomHeaderButtons(props) {
  return (
    <View>
      <MenuButton {...props}></MenuButton>
    </View>
  )
}

const styles = StyleSheet.create({})