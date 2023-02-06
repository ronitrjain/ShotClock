import React, { useState } from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { firebase } from '../config'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings(props) {
    const [userData, setUserData] = useState(props.route.params.user);
    const navigation = useNavigation();
    const onLogOutPress = () => {
        firebase
        .auth()
        .signOut()
        .then(() => {
            console.log('User logged out!'); 
            navToSignIn();
            AsyncStorage.removeItem('@loginInfo')
        }
            
        );
    };

    const navToSignIn = () => {
        navigation.navigate('Login')
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollView}
                keyboardShouldPersistTaps="always">
                    <Text style={styles.titleText}>{firebase.auth().currentUser.displayName}</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => onLogOutPress()}>
                        <Text style={styles.buttonTitle}>Log Out</Text>
                    </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
          
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
    },
    titleText:{
        fontSize: 30,
        textAlign:'center'
    },
    scrollView: { 
        flex: 1,
        // alignItems: 'stret',

    },
    logo: {
        flex: 1,
        height: 120,
        width: 90,
        alignSelf: "center",
        margin: 15
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },
    button: {
        backgroundColor: '#788eec',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold"
    },
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: 20
    },
    footerText: {
        fontSize: 16,
        color: '#2e2e2d'
    },
    footerLink: {
        color: "#788eec",
        fontWeight: "bold",
        fontSize: 16
    }
})


