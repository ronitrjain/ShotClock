import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome, Entypo } from '@expo/vector-icons'
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuOption,
    MenuTrigger,
   } from "react-native-popup-menu";

export default function GroupButton(props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [userData, setUserData] = useState(props);


    useEffect(() => {
        // setUserData(userData)
    }, [])

    const onSharePress = () => {
        props.onClickShare()
        // close
    }

    const onClickCopy = () => {
        props.onClickCopy()
    }

  return (
    <View>
        <TouchableOpacity style={styles.container} 
            activeOpacity={0.7} 
            disabled={isMenuOpen} 
            onPress={() => props.onClick()}>
            <View style={styles.header}>
                <Text ellipsizeMode='tail' numberOfLines={1} style={styles.title}>{props.groupName}</Text>
                {/* <FontAwesome name='trash-o' color={'white'} style={styles.trash}/>               */}
                
                    <Menu style={styles.menu}>
                        <MenuTrigger
                            // text="Click for Option menu"
                            customStyles={{
                            triggerWrapper: {
                                top: 0,
                                padding: 20,
                                paddingRight: 0,
                                paddingTop: 0
                            },   
                            }}
                        >
                            <Entypo name="dots-three-vertical" size={20} color="white" />

                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption style={styles.menuOption} onSelect={() => onSharePress()} text="Share" />
                            <MenuOption style={styles.menuOption} onSelect={() => onClickCopy()} text="Copy Group Code" />
                            
                            {/* <MenuOption onSelect={() => alert(`Delete`)} text="Delete" /> */}
                        </MenuOptions>
                    </Menu>
            </View>
            <Text style={styles.members}>Members: {props.members.length}</Text>
        </TouchableOpacity>
        
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        height: 120,
        backgroundColor: "#7da6ff", 
        padding: 10,
        marginHorizontal: 8,
        marginBottom: 10,
        borderRadius: 10,
        // justifyContent: 'flex-start',
        // alignItems: 'flex-start',
        flexDirection: 'column',
    },
    header: {
        flexDirection: 'row',    
        justifyContent: 'center',
        // textAlign: 'right'
    },
    trash: {
        position:'absolute',
        right: 0
    },
    menu: {
        position: 'absolute',
        right: 0,
        // marginTop: 10,
        padding: 40,
        paddingTop: 0,
        paddingRight: 0
    },
    menuOption: {
        padding: 10
    },
    title: {
        fontSize: 20,
        alignSelf: 'stretch',
        maxWidth: 300,
        fontWeight: 'bold',
        color: 'white'
    },
    members: {
        color: 'white'
    }
})