import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useState } from 'react'
import BouncyCheckbox from "react-native-bouncy-checkbox";

const LabelToggleTextInput = (props) => {
    const [isChecked, setIsChecked] = useState(true)
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
            isChecked={isChecked}
            onPress={() => { setIsChecked(!isChecked), props.onCheckStateChange(!isChecked) }}  />
      }
    
            <Text style={isChecked ? styles.label : styles.labelDisabled}>{props.label}</Text>
      
            {(isChecked || props.disableToggle) && <TextInput style={styles.input} {...props} onFocus={props.onFocus} />}
    </View>
  )
}

export default LabelToggleTextInput

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
    }
})