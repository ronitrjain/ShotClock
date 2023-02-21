
import { View, Text, Share, StyleSheet, FlatList, TextInput, TouchableOpacity, Keyboard, Pressable, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react';
import { firebase } from '../config';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaFrame } from 'react-native-safe-area-context';
import GroupButton from '../Components/GroupButton';
// import { Modal } from 'react-native';
import Modal from 'react-native-modal';
import { assertionError } from '@firebase/util';
import * as Clipboard from 'expo-clipboard';
// import Slider from 'react-native-custom-slider';

export default function Home(props) {
    const [userData, setUserData] = useState({} ?? props.route.params.user);

    const usersRef = firebase.firestore().collection('users');

    const navigation = useNavigation();

    const [modalGroupCode, setModalGroupCode] = useState('')

    const isFocused = useIsFocused();

    const [isJoinModaVisible, setIsJoinModalVisible] = React.useState(false)

    const [groupCodeError, setGroupCodeError] = useState('')

    const onClickCopy = (id) => 
    {
        Clipboard.setStringAsync(id)
    }

    const onSettingsPressed = () => {
        navigation.navigate('Settings', userData)
    };

    // auth.onAuthStateChanged((user) => {
    //     if (user) {

    //         const uid = user.uid;
    //         alert(user);
    //     } else {
    //         alert("User is signed out")
    //     }
    // });

    firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const uid = user.uid;
                console.log("Signed in", uid)
                setUserData({uid: uid})
            } else {
                console.log("Signed out")
                // signInAnon();
            }
        })
        
    function signInAnon() {
        firebase.auth().signInAnonymously()
        .then(() => {
                // Signed in..
                // console.log("signed in anon")
            })
            .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("error signing in")

            // ...
            });

    }

    useEffect(() => {
        signInAnon()
    }, [])
        

  return (
    
    <SafeAreaView style={styles.entireContainer}>

        <Modal isVisible={isJoinModaVisible} 
            animationIn={'fadeInUp'} 
            animationOut={'fadeOut'}
            // animationOutTiming={2000}
            avoidKeyboard={true}
            onBackdropPress={() => setIsJoinModalVisible(false)}
            backdropOpacity={0.5}
            useNativeDriverForBackdrop={true} //makes animation smooth         
            onBackButtonPress={() => setIsJoinModalVisible(false)}>
            <View style={modalStyles.container}>
                <View style={modalStyles.bg}>
                    <Text style={modalStyles.title}>Join New Group</Text>
                    <TextInput 
                        style={modalStyles.textInput}
                        placeholder='Enter group code'
                        placeholderTextColor="#aaaaaa"
                        onChangeText={(text) => setModalGroupCode(text)}
                        value={modalGroupCode}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    {groupCodeError != '' && <Text style={modalStyles.error}>{groupCodeError}</Text> }
                    <TouchableOpacity style={modalStyles.button} onPress={() => onJoinGroupPressed()}>
                        <Text style={modalStyles.buttonTitle}>Join Group</Text>    
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>


        <View style={styles.container}>
                <Text style={styles.titleText}>
                    Shot Clock
                </Text>

                <View style={styles.topRightButtons}>
                    {/* <TouchableOpacity onPress={ () => {
                        onPlusPressed();
                    }}>
                        <FontAwesome name="plus-square-o"  style={styles.plus}/>
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={ () => {
                        onSettingsPressed();
                    }}>
                        <FontAwesome name='cog' color={'black'} style={styles.settingsCog}/>
                    </TouchableOpacity>
                </View>
            </View>
            
        {/* <View style={{flex: 1}}>
            <Text style={{fontSize: 30, alignSelf: 'center', marginTop: 20}}>
                Current Line: {currentLength < 0.2 ? 'short' : currentLength < 0.7 ? 'mid' : 'long'}
            </Text>

            <View style={{flexDirection: 'row', justifyContent: 'space-between',
                    marginHorizontal: 20, marginTop: 300, marginBottom: 20}}>
                <Text style={{alignSelf: 'flex-start'}}>No Line</Text>
                <Text style={{alignSelf: 'center'}}>Mid Line</Text>
                <Text style={{alignSelf: 'flex-end'}}>Long Line</Text>
            </View>
            
            <TouchableOpacity style={{marginTop: 40, padding: 30,borderRadius: 10, backgroundColor: '#60a5da', marginHorizontal: 40, alignContent: 'center', justifyContent: 'center'}}
                onPress={onPressSendLine}>
                <Text style={{alignSelf: 'center', color: '#fff', fontSize: 25}}>Enter Line Wait</Text>
            </TouchableOpacity>        
        </View> */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    entireContainer: {
        flex: 1,
        flexDirection:'column',
        justifyContent: 'flex-start',
        // alignContent: 'center'
    },
    trackStyle: {
        height: 50,

        // marginHorizontal: 50
    },
    container:{
        padding: 15,
        // marginTop: 30,
        flexDirection: 'row',
        // backgroundColor: 'red',
        justifyContent: 'center',
        justifyContent: 'space-between',
        alignContent: 'center'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        
    },
    join: {
      backgroundColor: '#91a1e9',

      marginLeft: 8,
      marginRight: 8,
    //   marginTop: 20,
      height: 48,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: 'center'
    },
    joinText:{
        fontSize: 16,
        color: 'white',
    },
    topRightButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        textAlign: 'center',
        textAlignVertical: 'center' 
    },
    titleText:{
        fontSize: 30,
        color:'black'
    },
    plus:
    {
        fontSize: 40,
        alignSelf: 'center',
        marginRight: 20,
    },
    settingsCog: {
        fontSize: 40,
        // alignSelf: 'center',
        // position: 'absolute',
        // textAlign: 'center',
        // right: 20
    },
    button:{
        height: 47,
        borderRadius: 5,
        backgroundColor:'blue',
        alignItems: 'center',
        justifyContent: 'center'
    },
    item: {
        height: 100,
        backgroundColor: '#cccccc',
        padding: 10,
        marginHorizontal: 10,
        marginBottom: 10,
        borderRadius: 10,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
        // justifyContent: 'space-around',
    },
    trash: {
        fontSize: 30
    },
    itemText:{
        fontSize: 100,
        // paddingHorizontal: 10
    }
})

const modalStyles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'stretch',    
    },
    bg: {
        backgroundColor: '#e6e6e6ff',       
        padding: 20,
        borderRadius: 5,
        alignItems: 'stretch',
        justifyContent: 'center'
    },
    title: {
        marginBottom: 10,
        fontSize: 25,
        textAlign: 'center'
    },
    textInput: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },
    button:{
        backgroundColor: "#788eec",
        alignItems: 'center',
        marginHorizontal: 80,
        // marginTop: 5,
        padding: 10,
        borderRadius: 10,
        marginTop: 10
    },
    buttonTitle:
    {
        fontSize: 20,
        color: 'white'
    },
    error: {
        color: "#f32714",
        textAlign: 'center',

    }
})
