import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import styles from './styles';
import { firebase } from '../config'
import { useNavigation, StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onLog } from 'firebase/app';

export default function LoginScreen(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation();

    const getLogin = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@loginInfo')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
          // error reading value
        //   console.log(e)
        }
      }

    const storeLogin = async (email, password) => {
        try {
            const value = {email: email, password: password};
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@loginInfo', jsonValue)
        } catch (e) {
          // saving error
        }
      }

      const autoLogin = () => {
            getLogin().then((data) => 
            {
                if (data !== "{}" && data.email.length > 0 && data.password.length > 0)
                {
                    
                    onLoginPress(data.email, data.password)
                }
                else
                {
                    // console.log("No info")
                }
            }).catch((error) => {
                // console.log(error)
            })
      }
    useEffect(() => {
        if (props.route.params === undefined)
        {
            // TODO: Open loading screen
            autoLogin()
            return
        }
        const propsData = props.route.params.user;
        if (propsData.autoLogin)
            // TODO: Open loading screen
            autoLogin();
    }, [])

    const onFooterLinkPress = () => {
        navigation.navigate('Registration')
    }

    const onForgotPasswordPress = () => {
        navigation.navigate('ForgotPassword')
    }

    const onLoginPress = (email, password) => {
        
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                storeLogin(email, password);
                const uid = response.user.uid
                const usersRef = firebase.firestore().collection('users')
                usersRef
                    .doc(uid)
                    .get()
                    .then(firestoreDocument => {
                        if (!firestoreDocument.exists) {
                            alert("User does not exist anymore.")
                            return;
                        }
                        const user = firestoreDocument.data()
                        // use this to remove the login screen from the nav stack
                        // ENABLE IN PRODUCTION
                        // navigation.dispatch(StackActions.replace('Home', {user: user}))
                        navigation.navigate('Home', {user: user})
                    })
                    .catch(error => {
                        alert(error)
                    });
            })
            .catch(error => {
                alert(error)
            })
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={require('../assets/icon.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text.trim())}
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
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLoginPress(email, password)}>
                    <Text style={styles.buttonTitle}>Log in</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Don't have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
                </View>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}><Text onPress={onForgotPasswordPress} style={styles.footerLink}>Forgot your password?</Text></Text>
                </View>
            </ScrollView>
        </SafeAreaView>
        
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        
    },
    title: {

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

