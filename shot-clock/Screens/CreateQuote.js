import { View, Text, StyleSheet, FlatList, TextInput, findNodeHandle, TouchableOpacity, Keyboard, Pressable, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react';
import { firebase } from '../config';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Entypo } from '@expo/vector-icons';
import GroupCustomHeader from '../Components/GroupCustomHeader';
import GroupCustomHeaderButtons from '../Components/GroupCustomHeaderButtons';
import { KeyboardAwareFlatList, KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { KeyboardAvoidingView,  } from 'react-native';
import MessageInputBox from '../Components/MessageInputBox';
import QuoteMessage from '../Components/QuoteMessage';
import { sendFirebaseQuote } from '../Utilities/SendFirebaseQuote';
import CustomHeader from '../Components/CustomHeader';
import LabelToggleTextInput from '../Components/LabelToggleTextInput';
import * as ImagePicker from 'expo-image-picker';

import { takeOrPickImage } from '../Utilities/ImageTakerAndPicker';
import LabelToggleButtonDuo from '../Components/LabelToggleButtonDuo';
const CreateQuote = (props) => {
    const [userData] = useState(props.route.params.userData)
    const [groupData] = useState(props.route.params.groupData);

    const [quote, setQuote] = useState('')
    const [saidBy, setSaidBy] = useState('')
    const [dateSaid, setDateSaid] = useState('')

    const [enableSaidBy, setEnableSaidBy] = useState(true)
    const [enableImage, setEnableImage] = useState(true)

    const[data, setData] = useState({quote, saidBy, dateSaid, type: 2})
    const [image, setImage] = useState(null)

    const [status, requestPermission] = ImagePicker.useCameraPermissions();

    let scrollRef = useRef(null)
    // let data = 
    //     {   imageUrl: '', 
    //         quote:'The most exceptional quote.', 
    //         saidBy: '', 
    //         sentBy: userData.uid, 
    //         sentByName: userData.displayName, 
    //         type: 1
    //     }
    const navigation = useNavigation()
    
    useEffect(() => {
        // console.log(currentQuoteData)
        navigation.setOptions({
            headerTitle: 
                () => <CustomHeader name={'Create quote'}/>,
            // headerRight: 
            //     () => <GroupCustomHeaderButtons 
            //         {...groupData} 
            //         onGroupSettingsButtonClicked={() => onGroupSettingsButtonClicked()}
            //         onClickFilter />
            })
      }, [])  

      useEffect(() => {
        // console.log("Test")
        var tempQuote = quote
        if (quote == '')
        {
            tempQuote = 'An exceptional quote.'
        }
        
        let saidByTemp = ''
        saidByTemp = enableSaidBy == true ? saidBy : '';
        if (enableSaidBy == true && saidBy === '')
        {
            saidByTemp = 'Anonymous'
        }

        let imageTemp = ''
        imageTemp = enableImage == true ? image : '';
        // console.log("Image temp:", imageTemp)
        const newData = {
            imageUrl: '', 
            localImageUrl: imageTemp,
            quote: tempQuote, 
            saidBy: saidByTemp, 
            type: 1
        }
        console.log("New data:", newData)
        setData(newData)
      }, [quote, saidBy, dateSaid, image, enableSaidBy, enableImage] )


    const onSendQuotePressed = () => {
        if (quote == '')
        {
            return
        }
        
        const promise = new Promise((resolve, reject) => sendFirebaseQuote({data, userData, groupData}, resolve, reject))
        .then((didSucceed) => 
        {
            console.log("Did succeed(create quote)", didSucceed)
            if (didSucceed) {
                navigation.goBack()
            }          
        }).catch((error) => {
            console.log("Catch", error)
        })
    }

    const onPressImageButton = (shouldTake) => {
        
        const promise = new Promise((resolve) => takeOrPickImage({shouldTake: shouldTake, requestPermission: requestPermission}, resolve)).then((result) => {
            // console.log("Result from button press:", result)
            // alert(result)
            // result is an object with fileName, uri, fileSize, width, height, type
            setImage(result.uri)
        }).catch((error) => {
            console.log(error)
        })
    }

    const scrollToInput = (reactNode) => {
        // Add a 'scroll' ref to your ScrollView
        // console.log(scrollRef)
        scrollRef.current.scrollToFocusedInput(reactNode)
    }
    
  return (
    <KeyboardAwareScrollView 
        // contentContainerStyle={{flex: 1}}
        extraHeight={100}
        ref={scrollRef}
        >
        <View style={styles.container}>
            <Text style={styles.previewText}>Preview:</Text>
            <View style={styles.previewContainer}>
                <QuoteMessage {...data} userData={userData} />
            </View>

            <LabelToggleTextInput
                // onCheckStateChange={(checked) => setEnableSaidBy(checked)}
                label={'Quote:'}
                disableToggle={true}
                onChangeText={(text) => setQuote(text)}          
                placeholder='An exceptional quote.'
                placeholderTextColor="#aaaaaa"
                value={quote}
                underlineColorAndroid="transparent"
                autoCapitalize="true"
                onFocus={(event) => {
                    scrollToInput(findNodeHandle(event.target))
                }}
            />

            <LabelToggleTextInput
                onCheckStateChange={(checked) => setEnableSaidBy(checked)}
                label={'Said by:'}
                onChangeText={(text) => setSaidBy(text)}   
                placeholder='Anonymous'
                placeholderTextColor="#aaaaaa"
                value={saidBy}
                underlineColorAndroid="transparent"
                autoCapitalize="true"
                onFocus={(event) => {
                    scrollToInput(findNodeHandle(event.target))
                }}
            />

            <LabelToggleButtonDuo onPressImageButton={onPressImageButton} 
                onEnableChanged={(enable) => setEnableImage(enable)} 
                label={"Image:"}
            />
            
            {/* <TouchableOpacity
                style={styles.imageButton}
                onPress={() => onPressImageButton()}>
                <Text style={styles.buttonText}>Add Image</Text>
            </TouchableOpacity> */}


            <TouchableOpacity
                        style={quote == '' ? styles.disabledButton :styles.button}
                        onPress={() => onSendQuotePressed()}
                        disabled={quote == ''}
                        >
                        <Text style={styles.buttonText}>Send Quote</Text>
                    </TouchableOpacity>
                {/* <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                /> */}
        </View>
    </KeyboardAwareScrollView>
  )
}

export default CreateQuote

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'black',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    previewContainer: {
        flexDirection: 'row',
        paddingVertical: 30,
        // justifyContent: 'center',
        alignItems: 'flex-start',
        // minHeight: 100,    
        // flex: 1,
        // flexShrink: 1,
        // flexGrow: 1,
        borderColor: '#4b8bfa',
        borderWidth: 1,
        marginHorizontal: 5
    },
    previewText: {
        fontSize: 25,      
        padding: 10
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
    disabledButton:{
        backgroundColor: '#d1d1d1',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 20,
        color: 'white'
    },
    imageButton: {
        backgroundColor: '#788eec',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 5,
        // height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center',
        paddingVertical: 5
    },
    imageButtonText: {
        fontSize: 15,
    }
})