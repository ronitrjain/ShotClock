import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Keyboard, Pressable, KeyboardAvoidingView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react';
import { firebase } from '../config';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Divider } from '@rneui/themed/dist/Divider';
import { Entypo } from '@expo/vector-icons';
import GroupCustomHeader from '../Components/GroupCustomHeader';
import GroupCustomHeaderButtons from '../Components/GroupCustomHeaderButtons';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
// import { KeyboardAvoidingView,  } from 'react-native';
import QuoteMessage from '../Components/QuoteMessage';
import { sendFirebaseMessage } from '../Utilities/SendFirebaseMessage';
const MessageInputBox = (props) => {
  const [message, setMessage] = useState('')

  const getResult = (didSucceed) => {
    if (didSucceed)
    {
        setMessage('')
    }
    else{
        console.log("Message input received failed send")
    }
  }

  return (
    <View style={styles.container}>   
        <TextInput
            autoFocus={true}
            style={styles.input}
            placeholder='Message'
            placeholderTextColor="#393939"
            onChangeText={(text) => setMessage(text)}
            value={message}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            multiline={true}
            numberOfLines={2}
        />

        <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.sendButton} onPress={() => props.onQuoteButtonClicked()}>
                {message.length == 0 && <Text style={styles.sendText}>Quote</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendButton} onPress={() => message.length > 0 && props.onSendButtonClicked(message, getResult)}>
                <Text style={message.length > 0 ? styles.sendText : styles.sendTextNoInput}>Send</Text>
            </TouchableOpacity>
        </View>
        
    </View>
  )
}

export default MessageInputBox

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#dcdcdc',      
        borderRadius: 10,
        margin: 10,
        marginBottom: 3,
        padding: 5,
        marginTop: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // flexShrink: 1
    },
    input: {
        fontSize: 15,
        // marginVertical: 10,
        paddingLeft: 10,
        flexShrink: 1,
        flex:1
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginRight: 10,
    },
    sendButton: {
        // backgroundColor: 'black',
        flex: 0,
        justifyContent: 'center',
        borderRadius: 10,
        paddingLeft: 10,
        marginVertical: 2
    },
    sendText: {
        color: '#546ee3',
        fontSize: 17
    },
    sendTextNoInput: {
        color: '#acb4d7',
        fontSize: 17
    }
    
})