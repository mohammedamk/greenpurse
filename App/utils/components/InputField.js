import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

export default class NameInput extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    
  }

  render() {
    const { updateText, name, disable, placeholder, secure } = this.props;
    return (
      <View style={styles.nameInput}>
          <TextInput
            value={name}
            style={{ color: '#86b817', height: responsiveHeight(7.5), width: responsiveWidth(88) , backgroundColor:'#fff', borderRadius: 3, paddingLeft: 35, fontSize: 17, fontFamily: 'Muli-Regular' }}
            placeholder= {placeholder}
            placeholderTextColor = "#86b817"
            underlineColorAndroid = 'white'
            onChangeText={e => updateText(e)}
            editable={disable}
            secureTextEntry = {secure}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bodyText: {
    color: 'white',
    fontSize: 25,
    marginBottom: 10,
    fontWeight: '300',
    backgroundColor: 'transparent'
  },
  nameInput: {
    margin: 0,
  },
  nameInputField: {
    padding: 15,
    backgroundColor: '#00a8c3',
  },
});