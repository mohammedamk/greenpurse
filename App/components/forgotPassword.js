import React, { Component } from 'react';
import {
	View,
	Text,
	StatusBar,
	TouchableOpacity, 
	StyleSheet,
	WebView,
	TextInput,
	Alert,
	BackHandler
} from 'react-native';
import { header } from '../utils/navigationHeader';
import Drawer from 'react-native-drawer';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import MenuComponent from '../utils/components/NavigationDrawer';
import Css from '../utils/Css/Style';
import { forgotPassword } from '../utils/internationalisation';
import url from '../utils/Api';

export default class ForgotPassword extends Component {
	static navigationOptions = {
   		header: false,
       	drawerLabel: "Forgot Password",
 	}; 

 	state = {
 		forgotpasswordText: '',
 	}

 	componentWillMount(){
 	 	BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
 	}

 	componentWillUnmount() {
      	BackHandler.removeEventListener('hardwareBackbutton');
	}

 	handleBack(){
 		this.props.navigation.goBack(null);
 		return true;
 	}

 	forgotPasswordField = (input) => {
 		this.setState({forgotpasswordText: input})
 	}

 	submitDetails(){
 		var formData = new FormData();
 		formData.append('email', this.state.forgotpasswordText);
 		fetch(url.other + 'email', {
          	method: "POST",
          	body: formData
      	}).then((response) => response.json())
      	.then((responseData) => {
        //alert(JSON.stringify(responseData));
        if(responseData.code == 200){
        	Alert.alert('', 'Reset Password Mail Sent!');
        	this.props.navigation.navigate('login');
        }else if(responseData.code == 100){
        	Alert.alert('', 'Email is not registered!');
        }else{
        	Alert.alert('','Network Error');
        }
      }).done();
 	}

 	render(){
 		return(
 			<View style={{flex:1,backgroundColor:'#eee', flexDirection:'column'}}>
				<View style={Css.header_main}>
					<View style = {{width: responsiveWidth(15), alignItems:'center', justifyContent:'center'}} >
						<TouchableOpacity onPress = {() => this.props.navigation.navigate('login')}>
							<Feather name = 'arrow-left' color = "#fff" size = {20}/>
						</TouchableOpacity>
					</View>
					<View style = {{width: responsiveWidth(80), alignItems:'center', justifyContent:'center'}}>
						<Text style ={Css.header_main_text}>{forgotPassword.headerTitle}</Text>
					</View>
				</View>
				<View style = {{flex:1}} >
					<View style = {{alignItems:'center', marginTop: 15}} >
						<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(3), fontFamily:'Muli-ExtraBold'}}>{forgotPassword.mainHeading}</Text>
					</View>
					<View style = {{marginTop: 20, alignSelf:'center'}}>
						<TextInput
				            //value= {this.state.forget}
				            style={{ color: '#000', height: responsiveHeight(7.5), width: responsiveWidth(88) , backgroundColor:'transparent', borderRadius: 3, paddingLeft: 15, fontSize: responsiveFontSize(2.3), fontFamily: 'Muli-Light', borderWidth: 1, borderColor:'#7A7A7A' }}
				            placeholder= {forgotPassword.forgotPasswordPlaceholder}
				            placeholderTextColor = "#000"
				            underlineColorAndroid = 'transparent'
				            onChangeText={e => this.forgotPasswordField(e)}
				            editable={true}
				            secureTextEntry = {false}
				          />
					</View>
					<TouchableOpacity onPress = {() => this.submitDetails()} style = {{width: responsiveWidth(88), height: responsiveHeight(8), backgroundColor:'#46b07b', alignSelf:'center', marginBottom:10, borderRadius: 3, justifyContent:'center',marginTop: 20}} >
						<Text style = {{color:'#fff', fontFamily:'Muli-ExtraBold', fontSize: responsiveFontSize(3), textAlign: 'center'}}>{forgotPassword.submitButtonText}</Text>
					</TouchableOpacity>
				</View>
 			</View>
 		)
 	}
}