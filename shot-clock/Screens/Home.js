
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
    const [todos, setTodos] = useState([]);
    const [userData, setUserData] = useState(props.route.params.user);
    const lineDataRef = firebase.firestore().collection('lines');
    const usersRef = firebase.firestore().collection('users');

    const [addData, setAddData] = useState('');
    const navigation = useNavigation();

    const [lineData, setLineData] = useState([]);

    const [currentLength, setCurrentLength] = useState(0);

    const [modalGroupCode, setModalGroupCode] = useState('')

    const isFocused = useIsFocused();

    const [isJoinModaVisible, setIsJoinModalVisible] = React.useState(false)

    const [groupCodeError, setGroupCodeError] = useState('')

    const [sliderValue, setSliderValue] = useState(0.5)

    const onShare = async (groupData) => {
        try {
          const result = await Share.share({
            // title: 'Join ' + groupData.groupName + ' by using this code:',
            message:
              `Join ${groupData.groupName} by using this code: \n${groupData.groupCode}`,
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          alert(error.message);
        }
      };

    const onClickCopy = (id) => 
    {
        Clipboard.setStringAsync(id)
    }

    //fetch or read data from firebase
    const fetchGroups = (userData) => {
        // console.log(userData)
        if (userData.groups.length > 0)
        {
            const groupsIds = []
            userData.groups.forEach(element => {
                groupsIds.push(element)
                // console.log(element)
            }); 
            const groupData = []
            // alert("IDS:" + groupsIds)

            // TODO: paginate this in the future.
            groupRef.where('id', 'in', groupsIds).get()
            .then(data => {
                setGroupData([])
                data.docs.forEach((doc) => {
                    // console.log(doc.data().id)
                    const members = doc.data().members
                    // make sure that the group doc has this user in it
                    members.forEach(member => {
                        if (member === userData.uid){
                            // console.log("Member matches")
                            groupData.push(doc.data())
                        }
                    })
                    // console.log("Members for", doc.data().groupName, members)
                })
                setGroupData(groupData)  
            }).catch((error) => {
                console.log(error)
            })
        } 
    }

    const setData = () => {
        usersRef.doc(userData.uid).onSnapshot(dataSnapshot => {
            setUserData(dataSnapshot.data())
            fetchGroups(dataSnapshot.data()) 
          })
    }

    const onSettingsPressed = () => {
        navigation.navigate('Settings', userData)
    };

    const onPlusPressed = () => {
        navigation.navigate('CreateGroup', userData)
    };

    const onGroupButtonClicked = (data) => {
        // alert(id)
        // console.log("Group with id", id, "was clicked")
        navigation.navigate('GroupView', {groupData: data, userData: userData})
    }


    const onPressSendLine = () => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        // console.log(sliderValue);
        const data = {
            uid: userData.uid,
            displayName: userData.displayName,
            timestamp: timestamp,
            length: sliderValue
        };
        lineDataRef
            .doc()
            .set(data)
            .then(() => {
                alert("Successfully submitted line data")
                // navigation.navigate('Login', {autoLogin: false})
            })
            .catch((error) => {
                console.log(error)
            });
    }
    
    useEffect(() => {
        // const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        
        lineDataRef
        .orderBy('timestamp', 'desc')
        .limit(10)
        .onSnapshot((snapshot) => {
            let d = []
            snapshot.docs.forEach((doc) => {
                // console.log(doc.data());  
                let temp = doc.data().timestamp
                console.log("Temp:", temp)
                if (temp != null)
                {
                    var timestamp = doc.data().timestamp.toDate()
                }                
                let now = Date.now()
                let difference = (now - timestamp) / 36e5;
                if (difference < 0.5)
                {
                    d.push(doc.data());
                }
                console.log("difference", difference)
            })
            setLineData(d);
            if (d == 0)
            {
                return;
            }
            
            console.log("Data:", d)
            let totalLength = 0;
            let weight = 1;
            // let minWeight = 0.5;
            console.log("Data:", d)
            for (let i = 0; i < d.length; i++) {
                const element = d[i];
                totalLength += element.length * weight;
                // weight -= i / (d.length - 1)
                // if (weight < minWeight)
                // {
                //     weight = minWeight;
                // }
            }

            let average = totalLength / d.length; 
            setCurrentLength(average)
            console.log("Total length: ", average)
        })
    }, [])


    const renderItem = ({data}) => {
        // console.log(data)
        return (
            <View style={{flex: 1}}>
                <Text style={{color: 'black'}}>{data}</Text>
            </View>
        )
    } 

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


// export default function Home(props) {
//     const [todos, setTodos] = useState([]);
//     const [userData, setUserData] = useState(props.route.params.user);
//     const groupRef = firebase.firestore().collection('groups');
//     const usersRef = firebase.firestore().collection('users');

//     const [addData, setAddData] = useState('');
//     const navigation = useNavigation();

//     const [groupData, setGroupData] = useState([])
//     const [modalGroupCode, setModalGroupCode] = useState('')

//     const isFocused = useIsFocused();

//     const [isJoinModaVisible, setIsJoinModalVisible] = React.useState(false)

//     const [groupCodeError, setGroupCodeError] = useState('')
//     // const test = props.test

//     // useEffect(() =>
//     // {
//     //     setAddData(userData.fullName)
//     // }, [todos])

//     const onJoinGroupPressed = () => {
//         groupRef.where('groupCode', '==', modalGroupCode)
//         .get()
//         .then((snapshot) => {
//             // console.log(snapshot.docs.length)    
//             if (snapshot.docs.length === 1)
//             {
//                 // add user to group members list
//                 let doc = snapshot.docs[0].data()
//                 let id = doc.id
//                 let members = [...doc.members] // copy of array
//                 let isAlreadyPartOfGroup = false
//                 if (members.includes(userData.uid))
//                 {
//                     isAlreadyPartOfGroup = true
//                 }               

//                 // add group to user groups list
//                 let groups = [...userData.groups];
//                 let isAlreadyInUser = false
//                 if (groups.includes(doc.id))
//                 {
//                     isAlreadyInUser = true                }
                
//                 if (isAlreadyInUser && isAlreadyPartOfGroup)
//                 {
//                     setGroupCodeError("You are already part of this group")
//                 }
//                 else
//                 {
//                     // push data to backend
//                     if (!isAlreadyPartOfGroup)
//                     {
//                         members.push(userData.uid)
//                         groupRef.doc(id).update({members: members})
//                     }
                    
//                     if(!isAlreadyInUser)
//                     {
//                         groups.push(doc.id)
//                         usersRef.doc(userData.uid)
//                         .update({groups: groups})
//                     }
//                     alert("You joined a new group!")
//                     setGroupCodeError('')
//                     setIsJoinModalVisible(false)
//                     setData()
//                     // TODO: navigate to the group view
//                 }
                
//             }
//             else if (snapshot.docs.length < 1)
//             {
//                 setGroupCodeError('That code is invalid. Try a different code.')
//             }
//             else
//             {
//                 setGroupCodeError('Error. Please email an3developer@gmail.com with the group code you tried to use.')
//                 // alert("Error. Please email an3developer@gmail.com with the group code you tried to use.")
//             }
//         }).catch((error) => {
//             setGroupCodeError(error.toString())
//         })
//     }

//     const onShare = async (groupData) => {
//         try {
//           const result = await Share.share({
//             // title: 'Join ' + groupData.groupName + ' by using this code:',
//             message:
//               `Join ${groupData.groupName} by using this code: \n${groupData.groupCode}`,
//           });
//           if (result.action === Share.sharedAction) {
//             if (result.activityType) {
//               // shared with activity type of result.activityType
//             } else {
//               // shared
//             }
//           } else if (result.action === Share.dismissedAction) {
//             // dismissed
//           }
//         } catch (error) {
//           alert(error.message);
//         }
//       };

//     const onClickCopy = (id) => 
//     {
//         Clipboard.setStringAsync(id)
//     }

//     //fetch or read data from firebase
//     const fetchGroups = (userData) => {
//         // console.log(userData)
//         if (userData.groups.length > 0)
//         {
//             const groupsIds = []
//             userData.groups.forEach(element => {
//                 groupsIds.push(element)
//                 // console.log(element)
//             }); 
//             const groupData = []
//             // alert("IDS:" + groupsIds)

//             // TODO: paginate this in the future.
//             groupRef.where('id', 'in', groupsIds).get()
//             .then(data => {
//                 setGroupData([])
//                 data.docs.forEach((doc) => {
//                     // console.log(doc.data().id)
//                     const members = doc.data().members
//                     // make sure that the group doc has this user in it
//                     members.forEach(member => {
//                         if (member === userData.uid){
//                             // console.log("Member matches")
//                             groupData.push(doc.data())
//                         }
//                     })
//                     // console.log("Members for", doc.data().groupName, members)
//                 })
//                 setGroupData(groupData)  
//             }).catch((error) => {
//                 console.log(error)
//             })
//         } 
//     }

//     const setData = () => {
//         usersRef.doc(userData.uid).onSnapshot(dataSnapshot => {
//             setUserData(dataSnapshot.data())
//             fetchGroups(dataSnapshot.data()) 
//           })
//     }
    
//     useEffect(() => {
//         // console.log("Use effect")
//         setData()
//     }, [isFocused]);

//     const onSettingsPressed = () => {
//         navigation.navigate('Settings', userData)
//     };

//     const onPlusPressed = () => {
//         navigation.navigate('CreateGroup', userData)
//     };

//     const onGroupButtonClicked = (data) => {
//         // alert(id)
//         // console.log("Group with id", id, "was clicked")
//         navigation.navigate('GroupView', {groupData: data, userData: userData})
//     }

//   return (
    
//     <SafeAreaView style={styles.entireContainer}>

//         <Modal isVisible={isJoinModaVisible} 
//             animationIn={'fadeInUp'} 
//             animationOut={'fadeOut'}
//             // animationOutTiming={2000}
//             avoidKeyboard={true}
//             onBackdropPress={() => setIsJoinModalVisible(false)}
//             backdropOpacity={0.5}
//             useNativeDriverForBackdrop={true} //makes animation smooth         
//             onBackButtonPress={() => setIsJoinModalVisible(false)}>
//             <View style={modalStyles.container}>
//                 <View style={modalStyles.bg}>
//                     <Text style={modalStyles.title}>Join New Group</Text>
//                     <TextInput 
//                         style={modalStyles.textInput}
//                         placeholder='Enter group code'
//                         placeholderTextColor="#aaaaaa"
//                         onChangeText={(text) => setModalGroupCode(text)}
//                         value={modalGroupCode}
//                         underlineColorAndroid="transparent"
//                         autoCapitalize="none"
//                     />
//                     {groupCodeError != '' && <Text style={modalStyles.error}>{groupCodeError}</Text> }
//                     <TouchableOpacity style={modalStyles.button} onPress={() => onJoinGroupPressed()}>
//                         <Text style={modalStyles.buttonTitle}>Join Group</Text>    
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </Modal>

//         <FlatList 
//             ListHeaderComponent={
//                 <View style={styles.container}>
//                     <Text style={styles.titleText}>
//                         Friend Quotes
//                     </Text>

//                     <View style={styles.topRightButtons}>
//                         <TouchableOpacity onPress={ () => {
//                             onPlusPressed();
//                         }}>
//                             <FontAwesome name="plus-square-o"  style={styles.plus}/>
//                         </TouchableOpacity>
//                         <TouchableOpacity onPress={ () => {
//                             onSettingsPressed();
//                         }}>
//                             <FontAwesome name='cog' color={'black'} style={styles.settingsCog}/>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             }
//             data={groupData}
//             numColumns={1}
//             renderItem = { ({item}) => (
//                 <GroupButton key={item.id} 
//                     {...item} 
//                     onClickShare={() => onShare(item)}
//                     onClickCopy={() => onClickCopy(item.groupCode)}
//                     onClick={() => onGroupButtonClicked(item)} />
//             )
//             }

//             ListFooterComponent={
//                 <TouchableOpacity style={styles.join} onPress={() => {setIsJoinModalVisible(true)}}>
//                     <View style={styles.header}>
//                         <Text ellipsizeMode='tail' numberOfLines={1} style={styles.joinText}>Join new group?</Text>
//                         {/* <FontAwesome name='trash-o' color={'black'} style={styles.trash}/>               */}
//                     </View>
//                     {/* <Text>Members: {props.members.length}</Text> */}
//                 </TouchableOpacity>
//             }
//         />
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//     entireContainer: {
//         flex: 1,
//         flexDirection:'column',
//         justifyContent: 'center',
//         // alignContent: 'center'
//     },
//     container:{
//         padding: 15,
//         // marginTop: 30,
//         flexDirection: 'row',
//         // backgroundColor: 'red',
//         justifyContent: 'center',
//         justifyContent: 'space-between',
//         alignContent: 'center'
//     },
//     row: {
//         flexDirection: 'row',
//         justifyContent: 'flex-start',
        
//     },
//     join: {
//       backgroundColor: '#91a1e9',

//       marginLeft: 8,
//       marginRight: 8,
//     //   marginTop: 20,
//       height: 48,
//       borderRadius: 5,
//       alignItems: "center",
//       justifyContent: 'center'
//     },
//     joinText:{
//         fontSize: 16,
//         color: 'white',
//     },
//     topRightButtons: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         textAlign: 'center',
//         textAlignVertical: 'center' 
//     },
//     titleText:{
//         fontSize: 30,
//         color:'black'
//     },
//     plus:
//     {
//         fontSize: 40,
//         alignSelf: 'center',
//         marginRight: 20,
//     },
//     settingsCog: {
//         fontSize: 40,
//         // alignSelf: 'center',
//         // position: 'absolute',
//         // textAlign: 'center',
//         // right: 20
//     },
//     button:{
//         height: 47,
//         borderRadius: 5,
//         backgroundColor:'blue',
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//     item: {
//         height: 100,
//         backgroundColor: '#cccccc',
//         padding: 10,
//         marginHorizontal: 10,
//         marginBottom: 10,
//         borderRadius: 10,
//         justifyContent: 'flex-start',
//         alignItems: 'flex-start',
//         flexDirection: 'row',
//         // justifyContent: 'space-around',
//     },
//     trash: {
//         fontSize: 30
//     },
//     itemText:{
//         fontSize: 100,
//         // paddingHorizontal: 10
//     }
// })

// const modalStyles = StyleSheet.create({
//     container: {
//         justifyContent: 'center',
//         alignItems: 'stretch',    
//     },
//     bg: {
//         backgroundColor: '#e6e6e6ff',       
//         padding: 20,
//         borderRadius: 5,
//         alignItems: 'stretch',
//         justifyContent: 'center'
//     },
//     title: {
//         marginBottom: 10,
//         fontSize: 25,
//         textAlign: 'center'
//     },
//     textInput: {
//         height: 48,
//         borderRadius: 5,
//         overflow: 'hidden',
//         backgroundColor: 'white',
//         marginTop: 10,
//         marginBottom: 5,
//         marginLeft: 30,
//         marginRight: 30,
//         paddingLeft: 16
//     },
//     button:{
//         backgroundColor: "#788eec",
//         alignItems: 'center',
//         marginHorizontal: 80,
//         // marginTop: 5,
//         padding: 10,
//         borderRadius: 10,
//         marginTop: 10
//     },
//     buttonTitle:
//     {
//         fontSize: 20,
//         color: 'white'
//     },
//     error: {
//         color: "#f32714",
//         textAlign: 'center',

//     }
// })