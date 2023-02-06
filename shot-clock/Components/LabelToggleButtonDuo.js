import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import BouncyCheckbox from "react-native-bouncy-checkbox";

const LabelToggleButtonDuo = (props) => {
    const [isEnabled, setIsEnabled] = useState(true)
  return (
    <View style={styles.container}>
      
      {!props.disableToggle && 
      <BouncyCheckbox 
            fillColor='#4b8bfa'
            // unfillColor='#'
            style={styles.checkBox}
            iconStyle={{borderRadius: 7} }
            innerIconStyle={{borderRadius: 7} }
            disableBuiltInState
            isChecked={isEnabled}
            onPress={() => { setIsEnabled(!isEnabled), props.onEnableChanged(!isEnabled) }}  />
      }   
            <Text style={isEnabled ? styles.label : styles.labelDisabled}>{props.label}</Text>

            {(isEnabled || props.disableToggle) && (
            <View style={styles.buttonsContainer}>
                
                    <TouchableOpacity
                    style={styles.imageButton}
                    onPress={() => props.onPressImageButton(false)}>
                        <Text style={styles.imageButtonText}>Add</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    style={styles.imageButton}
                    onPress={() => props.onPressImageButton(true)}>
                        <Text style={styles.imageButtonText}>Take</Text>
                    </TouchableOpacity>
                
            </View>
            )
            }
            
    </View>
  )
}

export default LabelToggleButtonDuo

const styles = StyleSheet.create({
    container: {
        // flex: 1, 
        marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        // paddingVertical: 20,
        minHeight: 35,
        marginVertical: 5,
        paddingLeft: 10
        // backgroundColor: 'black',
    },
    label: {
        fontSize: 20,
        alignSelf: 'center',
        // width: 70,
        flexShrink: 1,
        marginRight: 10
    },
    labelDisabled: {
        fontSize: 20,
        color: '#a1a0a0',
        alignSelf: 'center',
        marginRight: 10,
        textDecorationLine: 'line-through', 
        textDecorationStyle: 'solid'
    },
    input: {
        flex: 1,
        // height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        // marginTop: 5,
        // marginBottom: 5,
        paddingLeft: 8,
        marginRight: 10
    },
    checkBox: {
        // marginLeft: 10,
    }, 
    buttonsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'stretch',
        // backgroundColor: 'black',
        flexDirection: 'row'
    },
    imageButton: {
        flex: 1,
        backgroundColor: '#788eec',
        marginHorizontal: 20,
        // marginLeft: 30,
        // marginRight: 30,
        // marginTop: 5,
        // height: 48,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: 'center',
        paddingVertical: 5
    },
    imageButtonText: {
        fontSize: 20,
        color: 'white'
    }
})