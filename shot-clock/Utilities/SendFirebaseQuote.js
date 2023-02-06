import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Keyboard, Pressable, KeyboardAvoidingView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react';
import { firebase, storage } from '../config';
import { customAlphabet } from 'nanoid';
import { getStorage, ref, uploadBytes } from "firebase/storage";



export function sendFirebaseQuote({data, groupData, userData}, resolve) {
    const messagesRef = firebase.firestore().collection('message').doc(groupData.id).collection('messages')
    const timestamp = firebase.firestore.FieldValue.serverTimestamp()
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const nanoid = customAlphabet(alphabet, 20);
    const id = nanoid() //=> "5VTDOfg2"

    const quoteImagesPath = 'QuoteImages/'

    const uploadUri = Platform.OS === 'ios' ? data.localImageUrl.replace('file://', '') : data.localImageUrl;
    // console.log("test")

    const uploadMessage = (additionalData) => {
        messagesRef.doc(id)
        .set(additionalData)
        .then((response) => {
            resolve(true)
        }).catch((error) => {
            alert("Error sending message. " + error)
            resolve(false)
        })
    }

    let additionalData = {
        id: id,  
        sentAt: timestamp, 
        sentBy: userData.uid, 
        sentByName: userData.displayName, 
        ...data
        // type: data.type,
        // imageUrl: data.imageUrl,
        // quote: data.quote,
        // saidBy: data.saidBy,      
    }

    if (data.localImageUrl == undefined || data.localImageUrl == '')
    {
        uploadMessage(additionalData)
        return
    }

    delete additionalData.localImageUrl;

    // upload the image to firebase storage
    const filename = id + uploadUri.substring(uploadUri.lastIndexOf('.'))
    const storageRef = ref(storage, quoteImagesPath + filename);
    // console.log("ref:", reference)
    fetch(uploadUri).then(response => {
        response.blob().then(file => {
            uploadBytes(storageRef, file).then(snapshot => {
                // console.log(snapshot.ref.fullPath)
                let imageUrl = snapshot.ref.fullPath
                additionalData = {...additionalData, imageUrl: imageUrl}
                console.log("Send quote", additionalData)
                uploadMessage(additionalData)    
            })
        })
    }).catch(error => {
        console.log(error)
    })
}
