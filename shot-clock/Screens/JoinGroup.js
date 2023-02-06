import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import styles from './styles';
import { firebase } from '../config'
import { useNavigation, StackActions } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values'
import { customAlphabet } from 'nanoid';
// import { nanoid } from 'nanoid';

export default function JoinGroup(props) {
  const [groupCode, setGroupCode] = useState('')
  const [userData, setUserData] = useState(props.route.params);
  const groupsRef = firebase.firestore().collection('groups')
  const usersRef = firebase.firestore().collection('users')

  const navigator = useNavigation()
  useEffect(() => {
    // alert(userData.uid) 
    // usersRef.doc(userData.uid).get().then(data => {
    //   setUserData(userData)
    //   alert("set")
    // })
    usersRef.doc(userData.uid).onSnapshot(dataSnapshot => {
      setUserData(dataSnapshot.data())
      // alert("set")

    })
    // .then(data => {
    //   setUserData(userData)
    //   alert("set")
    // })
  }, [])

  const navHome = () => {
    navigator.goBack();
  }
  const onCreateJoin = (code) => {
    
  }
  const onCreatePress = (groupName) => {
      // const uid = response.user.uid
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const nanoid = customAlphabet(alphabet, 8);
      const groupCode = nanoid() //=> "5VTDOfg2"
      
      const doc = groupsRef.doc()
      // alert(doc.id)
      const data = {
        createdAt: timestamp, 
        createdBy: userData.uid, 
        groupCode, 
        id: doc.id, 
        lastQuote: "", 
        modifiedAt: timestamp, 
        groupName, 
        members: [userData.uid],
        type: 1
      };

      doc.set(data)
      .then(() => {
        // alert(doc.id)
        // TODO: update the groups the user belongs to
        let groups = [...userData.groups];
        groups.push(doc.id)
        // alert(groups)
        usersRef.doc(userData.uid)
        .update({groups: groups})

        navHome()
      }).catch((error) => {
        alert(error)
      })
  }

  return (
    <SafeAreaView style={styles.container}>
            <ScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                {/* <Image
                    style={styles.logo}
                    source={require('../assets/icon.png')}
                /> */}
                <TextInput
                    style={styles.input}
                    placeholder='Group Name'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setGroupCode(text)}
                    value={groupCode}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                {/* <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                /> */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onCreatePress(groupCode)}>
                    <Text style={styles.buttonTitle}>Start Quoting</Text>
                </TouchableOpacity>
                {/*<View style={styles.footerView}>
                    <Text style={styles.footerText}>Don't have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
                </View>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}><Text onPress={onForgotPasswordPress} style={styles.footerLink}>Forgot your password?</Text></Text>
                </View> */}
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

