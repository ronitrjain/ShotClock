import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import styles from './styles';
import { firebase, } from '../config'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function RegistrationScreen() {
    const [displayName, setDisplayName] = useState('')
    const [uniqueUsername, setUniqueUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const navigation = useNavigation();

    const uniqueUsernamesRef = firebase.firestore().collection('uniqueUsernames');

    const onFooterLinkPress = () => {
        navigation.navigate('Login')
    }

    const onRegisterPress = () => {
        if (password !== confirmPassword) {
            alert("Passwords don't match.")
            return
        }

        uniqueUsernamesRef.doc(uniqueUsername.trim())
        .get()
        .then((document) => {
            // if the unique username doc doesn't exist            
            if (!document.exists)
            {
                uniqueUsernamesRef.doc(uniqueUsername)
                .set({})
                .then(() => {
                    // alert("Successful unique account creation")
                    
                    firebase
                    .auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then((response) => {
                        response.user.updateProfile({
                            displayName: uniqueUsername
                        })
                        const uid = response.user.uid
                        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
                        const data = {
                            uid: uid,
                            displayName: displayName,
                            uniqueUsername: uniqueUsername,
                            email: email,
                            accountCreationTimestamp: timestamp,
                            groups: []
                        };
                        const usersRef = firebase.firestore().collection('users')
                        usersRef
                            .doc(uid)
                            .set(data)
                            .then(() => {
                                alert("Successfully created account! Please login so you remember your password!")
                                navigation.navigate('Login', {autoLogin: false})
                            })
                            .catch((error) => {
                                console.log(error)
                            });
                    })
                    .catch((error) => {
                        alert(error)
                    });
                }).catch((error) => {
                    alert(error)
                })                
            }
            else
            {
                alert("That username is taken. Try a different one")    
            }
        }).catch((error) => {
            console.log("ERROR in catch", error)        
        })
        
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={require('../assets/icon.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Unique Username (Cannot change)'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setUniqueUsername(text)}
                    value={uniqueUsername}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='Display Name'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setDisplayName(text)}
                    value={displayName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Confirm Password'
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onRegisterPress()}>
                    <Text style={styles.buttonTitle}>Create account</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Already got an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Log in</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    title: {

    },
    logo: {
        flex: 1,
        height: 120,
        width: 90,
        alignSelf: "center",
        margin: 30
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
