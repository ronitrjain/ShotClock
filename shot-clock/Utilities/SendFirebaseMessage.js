import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Keyboard, Pressable, KeyboardAvoidingView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react';
import { firebase } from '../config';

import { customAlphabet } from 'nanoid';

export function sendFirebaseMessage({message, groupData, userData}, resolve) {
    const messagesRef = firebase.firestore().collection('message').doc(groupData.id).collection('messages')
    let timestamp = firebase.firestore.FieldValue.serverTimestamp()
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const nanoid = customAlphabet(alphabet, 20);
    const id = nanoid() //=> "5VTDOfg2"

    // console.log("test")
    let data = {
        id, 
        quote: message, 
        sentAt: timestamp, 
        sentBy: userData.uid, 
        sentByName: userData.displayName, 
        type: 2        
    }
    // console.log("Send message", data)

    messagesRef.doc(id)
    .set(data)
    .then((response) => {
        resolve(true)
    }).catch((error) => {
        alert("Error sending message. " + error)
        resolve(false)
    })
}