import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { storage } from '../config';
import { getDownloadURL, ref } from 'firebase/storage';

const QuoteMessage = ({dateSaid, description, localImageUrl, imageUrl, quote, saidBy, sentAt, sentBy, sentByName, type, userData}) => {
    const [downloadImageUrl, setDownloadImageUrl] = useState('')
    // const quoteImagesPath = 'QuoteImages/'

    // const pathRef = ref(storage, `/${imageUrl}`)
    useEffect(() =>{
        console.log("Test")
        if (type === undefined)
        {
            type = 2
        }
        // console.log("Quote:", sentBy, userData.uid)
        // console.log(quote)
        // console.log(userData.uid === sentBy ? 1 : 2)
        if (imageUrl != undefined && imageUrl != '')
        {
            console.log("image url", imageUrl)
            getDownloadURL(ref(storage, imageUrl)).then((url) => {
                setDownloadImageUrl(url)
            }).catch((error) => {
                alert(error)
            })
        }
        else if (localImageUrl != undefined && localImageUrl != '')
        {
            console.log("Local: ", localImageUrl)
            setDownloadImageUrl(localImageUrl)
        }
        else
        {
            setDownloadImageUrl('')
        }
        
    }, [localImageUrl])

    const ownMessage = () => {
        return(
            <View style={styles.messageContainer}>
                {/* <Text style={{alignSelf: 'flex-start'}}>Test</Text>                 */}
                <Pressable style={styles.message}>
                    { downloadImageUrl != '' && <Image source={{uri: downloadImageUrl}} 
                        style={styles.image}
                        resizeMode={'contain'}/> }
                    <Text style={styles.messageText}>
                        { quote }
                    </Text>
                </Pressable>         
            </View>
        )
    }

    const otherUserMessage = () => {
        return(
            <View style={{flex: 1}}>
                <Text style={styles.sentByName}>{sentByName}</Text>
                <View style={styles.otherMessageContainer}>
                    <Pressable style={styles.otherMessage}>
                        { downloadImageUrl != '' && <Image source={{uri: downloadImageUrl}} 
                            style={styles.image}
                            resizeMode={'contain'}/> }
                        <Text style={styles.otherMessageText}>
                            { quote }
                        </Text>
                    </Pressable>         
                </View>
            </View>)
        
    }
    

    return (
        <View style={{flex: 1}}>
            { type === 1 &&
                (<View style={styles.container}>
                    {userData.uid !== sentBy && <Text style={styles.sentByName}>{sentByName}</Text>}
                    
                    <Pressable style={styles.quote}>
                        { downloadImageUrl != '' && <Image source={{uri: downloadImageUrl}} 
                            style={styles.image}
                            resizeMode={'contain'}/> }
                        <Text style={styles.quoteText}>
                        { `"${quote}" ` }
                        
                            {saidBy != '' && 
                                <Text style={styles.authorText}>
                                {`-${saidBy}`}
                                </Text>
                            }
                        </Text>
                        
                    </Pressable>         
                </View>)
            }
            {
                type == 2 && (userData.uid === sentBy ? ownMessage() : otherUserMessage())
            }
        </View>
    )
}

export default QuoteMessage

const styles = StyleSheet.create({
    container: { 
        // flex: 1,
        flexShrink: 1,
        flexDirection: 'column',
        // minHeight: 200
        // backgroundColor: 'black'
    }, 
    messageContainer: {
        flex: 1, 
        flexDirection: 'column',        
        alignItems: 'flex-end',
        // marginRight: 10,
        // maxWidth: 300,
    },
    otherMessageContainer: {
        flex: 1, 
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: 10,
        // maxWidth: 300
    },
    quote: {
        // height: 100,
        backgroundColor: '#e7e7e7',
        padding: 10,
        marginHorizontal: 10,
        marginBottom: 10,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#4b8bfa",
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
    },
    quoteText:{
        fontSize: 20,
    },
    authorText: {
        fontSize: 15,
        alignSelf: 'flex-start'
    },
    message: {
        backgroundColor: '#4b8bfa',
        padding: 10,
        marginRight: 10,
        borderRadius: 20,
        maxWidth: 300,
        alignItems: 'flex-start',
        marginBottom: 10
    },
    otherMessage: {
        backgroundColor: '#cccccc',
        padding: 10,
        borderRadius: 20,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        flexDirection: 'column',
        maxWidth: 300,
        marginBottom: 10
        
    },
    messageText: {
        textAlign: 'left',
        fontSize: 20,
        color: '#fff'
    },
    otherMessageText: {
        textAlign: 'left',
        fontSize: 20,
        color: '#000'
    },
    image: {
        width: '100%',
        height: undefined,
        aspectRatio: 4 / 3,
        borderRadius: 20
    },
    sentByName: {
        marginLeft: 15,
        fontSize: 17,
        alignSelf: 'flex-start'
    },
})