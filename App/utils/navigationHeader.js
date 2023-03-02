import React, { Component } from 'react';
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { Header } from 'react-navigation' ;
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import Drawer from 'react-native-drawer';
//import updateSegregation from '../components/updatesegregation';


export const header = {
  title: 'Green Wallet',
  headerTitleStyle: { fontWeight: 'bold', color: 'white', alignSelf:'center' },
  header: (props) => <GradientHeader {...props} />,
  headerLeft: (
          <TouchableOpacity style={{ flexDirection: 'row', paddingLeft: 20 }} onPress = {() => alert()} >
            <View style={{width: 60, height: 60, flexDirection: 'row', alignItems: 'center'}}>
              <Entypo name="menu" color="white" size={30} />
            </View>
          </TouchableOpacity>
        ),
  headerStyle: {
    backgroundColor:"#46b07b",
  },
  
};

const GradientHeader = props => (
  <View style={{ backgroundColor: '#46b07b' }}>
    <Header {...props} style={{ backgroundColor: '#46b07b' }}/>
    <Drawer {...props} />
  </View>
);

const styles = StyleSheet.create({
	linearGradient:{

	},
})