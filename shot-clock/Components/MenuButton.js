import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { Entypo } from '@expo/vector-icons';

const MenuButton = (props) => {
  return (
    <View style={styles.container}>
        <Menu style={styles.menu}>
            <MenuTrigger
                // text="Click for Option menu"
                customStyles={{
                triggerWrapper: {
                    top: 0,
                    // padding: 20,
                    paddingRight: 0,
                    paddingTop: 0
                },   
                }}>
                <Entypo name="dots-three-vertical" size={20} color="black"/>
            </MenuTrigger>
            <MenuOptions>
                <MenuOption style={styles.menuOption} onSelect={() => props.onGroupSettingsButtonClicked()} text="Group Settings" />
                {/* <MenuOption style={styles.menuOption} onSelect={() => onClickCopy()} text="Copy Group Code" /> */}
                
                {/* <MenuOption onSelect={() => alert(`Delete`)} text="Delete" /> */}
            </MenuOptions>
        </Menu>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    menu: {
        // position: 'absolute',
        // right: 10,
        marginRight: 10,
        // marginTop: 8,
        // padding: 40,

        paddingTop: 0,
        paddingRight: 0
    },
    menuOption: {
        padding: 10
    },
})
export default MenuButton