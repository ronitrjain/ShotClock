import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Keyboard, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { firebase } from '../config';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
// import { Divider } from '@rneui/themed/dist/Divider';
import { Entypo } from '@expo/vector-icons';
import GroupCustomHeader from '../Components/GroupCustomHeader';
import GroupCustomHeaderButtons from '../Components/GroupCustomHeaderButtons';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
// import { KeyboardAvoidingView,  } from 'react-native';
import MessageInputBox from '../Components/MessageInputBox';
import QuoteMessage from '../Components/QuoteMessage';
import { sendFirebaseMessage } from '../Utilities/SendFirebaseMessage';
// import KeyboardSpacer from 'react-native-keyboard-spacer';
// import { KeyboardAvoidingView } from 'react-native';
export default function GroupView(props) {
    const [userData] = useState(props.route.params.userData)
    const [groupData] = useState(props.route.params.groupData);
    const [messagesData, setMessagesData] = useState([]);
    const flatListRef = useRef(null);

    const [topMessage, setTopMessage] = useState({})
    const [bottomMessage, setBottomMessage] = useState('')

    const groupRef = firebase.firestore().collection('groups');
    const messagesRef = firebase.firestore().collection('message').doc(groupData.id).collection('messages')
    // const [addData, setAddData] = useState('');
    const navigation = useNavigation();
    const [isRefreshingList, setIsRefreshingList] = useState(false)

    const getMostRecentMessages = (snapshot) => {
        // let data = [...messagesData]
        let data = []
        snapshot.docs.forEach(doc => {
            data.push(doc.data())
        })
        // data.reverse()
        
        if (data.length > 0)
        {
            // console.log(data[data.length - 1])
            setTopMessage(data[data.length - 1])
            // setBottomMessage(data[data.length - 1].id)
        }
        
        setMessagesData(data)
    }

  useEffect(() => {
    messagesRef.orderBy('sentAt', 'desc').limit(20).onSnapshot(snapshot => {  
        getMostRecentMessages(snapshot)
    })

    // customize header
    navigation.setOptions({
        headerTitle: 
            () => <GroupCustomHeader 
                {...groupData} 
                isHeader={true}>{groupData.groupName}</GroupCustomHeader>,
        headerRight: 
            () => <GroupCustomHeaderButtons 
                {...groupData} 
                onGroupSettingsButtonClicked={() => onGroupSettingsButtonClicked()}
                onClickFilter />
        })
  }, [])  

  const onGroupSettingsButtonClicked = () => 
  {
    alert("Group settings button clicked")
  }

  const onSendButtonClicked = (message, result) => 
  {
    if (message.length > 0)
    {
        const promise = new Promise((resolve, reject) => sendFirebaseMessage({message, userData, groupData}, resolve, reject))
        .then((didSucceed) => 
        {
            console.log("Did succeed(group view)", didSucceed)
            result(didSucceed)
        }).catch((error) => {
            console.log("Catch", error)
        })
    }

    // console.log(flatListRef.current)
    // flatListRef.current.scrollToEnd()   
  }

  const onQuoteButtonClicked = () => {
    navigation.navigate('CreateQuote', {userData, groupData} )
  }

  const onScroll = (event) => {
    let scrollOffset = event.nativeEvent.contentOffset.y
    if (scrollOffset < 100 && !isRefreshingList)
    {
        console.log("Reached bottom")
        // setIsRefreshingList(true)
        // load 10 older messages
    }
    if (isRefreshingList && scrollOffset > 100)
    {
        setIsRefreshingList(false)
    }
    // console.log(scrollOffset)
    // flatListRef.current?.scrollToEnd()
    // .scrollToIndex(animated=false, index=0.5)    
  }

  const onEndReached = () => 
  {
    console.log("Reached end")
    setIsRefreshingList(true)
    loadMoreMessages()
  }

  const loadMoreMessages = () => {
    messagesRef.orderBy('sentAt', 'desc').startAfter(topMessage.sentAt).limit(20).onSnapshot(snapshot => {  
        // console.log("Test")
        //getMostRecentMessages(snapshot)
        let data = []
        snapshot.docs.forEach(doc => {
            data.push(doc.data())
        })
        let oldData = messagesData
        let combinedData = [...oldData, ...data]
        console.log(combinedData)
        // data.reverse()
        if (combinedData.length > 0)
        {
            setTopMessage(combinedData[combinedData.length - 1])
            // setBottomMessage(data[data.length - 1].id)
            console.log()
            setMessagesData(combinedData)
            setIsRefreshingList(false)
        }    
        
    })
    
    
  }

  const renderItem = ({item}) => {
    return (
        <QuoteMessage {...item} userData={userData}/>
        )
  }

  const keyExtractor = useCallback((item) => item.id, [])

  return (
    <View style={styles.container} >
        {/* <TextInput><Text>Test</Text></TextInput> */}
        <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
            {isRefreshingList && <ActivityIndicator style={styles.loadingIndicator} size={50} color={'#000'}/>}
            <FlatList              
                enableAutomaticScroll={true}
                ref={flatListRef}
                enableOnAndroid={true}
                // getItemLayout={(data, index) => {
                //     {length: 100}
                // }}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={true}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.2}
                windowSize={10}
                inverted={true}
                onScroll={onScroll}
                data={messagesData}
                refreshing={isRefreshingList}
                style={styles.flatList}
                contentContainerStyle={{marginVertical: 10, paddingBottom: 20}}
                numColumns={1}                
                renderItem = {renderItem}
            />  
        </KeyboardAvoidingView>
                 
            {/* <Text>Ttest</Text> */}
        {/* <View style={styles.keyboardAvoidingView}> */}
            <MessageInputBox 
                onSendButtonClicked={(message, result) => onSendButtonClicked(message, result)}
                onQuoteButtonClicked={() => onQuoteButtonClicked()} />
        {/* </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column',
        // backgroundColor: 'red',
        // justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: 'rgba(0, 0, 0, 0)'
        // paddingTop: 10
    },
    flatList: {
        // marginTop: 10
        // backgroundColor: 'blue',
        // flex: 1
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
    itemText:{
        fontSize: 100,
        // paddingHorizontal: 10
    },
    keyboardAvoidingView: {
        // backgroundColor: 'transparent',
        flex: 1
    },
    loadingIndicator: {
        position: 'absolute',
        width: '100%'
    }
})