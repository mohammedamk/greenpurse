import React, { Component } from 'react';
import {
	View,
	Text,
	StatusBar,
	TouchableOpacity,
	Image,
	ScrollView,
	TextInput,
	AsyncStorage,
	Alert,
	BackHandler,
	Dimensions
} from 'react-native';
import { header } from '../utils/navigationHeader';
import InputField from '../utils/components/InputField';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import Hr from 'react-native-hr';
import { debugActivate } from '../utils/debug';
import FBLogin from './FBLogin';
import GoogleLogin from './GoogleLogin';
import { login } from '../utils/internationalisation';
import url from '../utils/Api';
import { createStyles, maxWidth, minWidth } from 'react-native-media-queries';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginButton,
  LoginManager,
} from 'react-native-fbsdk';

var {height, width} = Dimensions.get('window');


export default class Login extends Component {
	static navigationOptions = {
    header: false
  };

  state = {
  	usernameField: '',
  	fieldDisable: true,
  	userpasswordField: '',
  }

  componentWillMount(){
 	 	BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
 	 	//alert(width)
 	}

 	componentWillUnmount() {
      	BackHandler.removeEventListener('hardwareBackbutton');
	}

 	handleBack(){
 		BackHandler.exitApp();
 	}

  usernameInput(input){
  	//alert(input)
  	this.setState({
  		usernameField: input
  	})
  }

  userpasswordInput(input){
  	this.setState({
  		userpasswordField: input
  	})
  }

  loginRequest(){
  	if(debugActivate === true){
  		console.log("Login Request");
  	}
  	//this.props.navigation.navigate('updatesegregation');
  	//alert(this.state.userpasswordField)
  	if(this.state.usernameField === ''){
  		Alert.alert("","Enter your email address!")
  	}else if(this.state.userpasswordField === ''){
  		Alert.alert("","Enter your password!")
  	}else{
  	fetch(url.other + "login", {
  		method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        	'email' : this.state.usernameField,
        	'password' : this.state.userpasswordField
        })
      }).then((response) => response.json())
          .then((responseData) => {
            if(responseData.message === 'success'){
            	AsyncStorage.setItem("User", JSON.stringify(responseData.user_id));
            	this.props.navigation.navigate('authcheck')
            }else{
            	Alert.alert('',JSON.stringify(responseData.message))
            }
            //alert(JSON.stringify(responseData.user_id));
        }).done();
 	}
  }


	render() {
		const { navigate } = this.props.navigation;
		return(
			<View style = {{backgroundColor:"#fff", flex: 1,  alignItems: 'center'}} >
			    <View style = {{height:responsiveHeight(30), justifyContent:'center'}} >
			    	<Image source = {require('../../public/Logo_192.png')} style = {styles.logo}/>
			    </View>
			    <View style = {{height: responsiveHeight(25.5)}} >
			    	<View style = {{flexDirection:'row',height: responsiveHeight(7.5), width: responsiveWidth(88),backgroundColor:'#46b07b', borderRadius: 3,marginTop: 20}} >
				    	<EvilIcons name = "user" color = "#fff" size = {28} style = {{alignSelf:'center', paddingLeft: 8}}/>
					    <TextInput
				            //value={this.state.usernameField}
				            style={{ color: '#fff', width: responsiveWidth(76) , backgroundColor:'transparent', fontSize: 17, fontFamily: 'Muli-Regular' }}
				            placeholder= {'Email'}
				            placeholderTextColor = "#fff"
				            underlineColorAndroid = '#46b07b'
				            onChangeText={(e) => this.usernameInput(e)}
				            editable={true}
				            secureTextEntry = {false}
				          />
				    </View>
				    <View style = {{flexDirection:'row',height: responsiveHeight(7.5), width: responsiveWidth(88),backgroundColor:'#46b07b', borderRadius: 3, marginTop: 20}}>
				    	<EvilIcons name = "lock" color = "#fff" size = {28} style = {{alignSelf:'center', paddingLeft: 8}}/>
					    <TextInput
				            //value={this.state.userpasswordField}
				            style={{ color: '#fff', width: responsiveWidth(88) , backgroundColor:'transparent', fontSize: 17, fontFamily: 'Muli-Regular' }}
				            placeholder= {'Password'}
				            placeholderTextColor = "#fff"
				            underlineColorAndroid = '#46b07b'
				            onChangeText={(e) => this.userpasswordInput(e)}
				            editable={true}
				            secureTextEntry = {true}
				          />
				    </View>
			    </View>
			    <View>
			    	<TouchableOpacity style = {{height: responsiveHeight(7.5), width: responsiveWidth(88), backgroundColor:"#46b07b", justifyContent: 'center', alignItems:'center', borderRadius: 3, flexDirection: 'row'}} onPress = {() => this.loginRequest()}>
			    		<View>
			    			<Text style = {{fontFamily: 'Muli-Bold', color: "#fff", fontSize: 17}}>{login.loginLabel}</Text>
			    		</View>
			    		<View>
			    			<Entypo name = "login" color = "#fff" size = {16} style = {{paddingTop:5,paddingLeft:5}} />
			    		</View>
			    	</TouchableOpacity>
			    </View>
			    <View style = {{flexDirection:'row',marginTop:10, width: responsiveWidth(88), alignSelf:'center'}} >
			    	<View style = {{alignSelf:'flex-start', width: responsiveWidth(25)}} >
			    		<TouchableOpacity onPress = {() => this.props.navigation.navigate('registration')}>
			    			<Text style = {{fontFamily:'Muli-Regular', fontSize:15, color:'#46b07b'}} >{login.signupLabel}</Text>
			    		</TouchableOpacity>
			    	</View>
			    	<View style = {{width:responsiveWidth(23)}}></View>
			    	<View style = {{alignSelf:'flex-end', width: responsiveWidth(40), justifyContent: 'flex-end', alignItems: 'flex-end'}} >
			    		<TouchableOpacity onPress = {() => this.props.navigation.navigate('forgotpassword')}>
			    			<Text style = {{fontFamily:'Muli-Regular', fontSize:15,paddingLeft:15, color:'#46b07b'}} >{login.forgotPasswordLabel}</Text>
			    		</TouchableOpacity>
			    	</View>
			    </View>
			    <View style = {{marginTop:40}} ></View>
			    <Hr marginLeft = {10} lineColor = "#46b07b" text = {login.otherConnect}  textStyle = {{textAlign: 'center'}} lineStyle = {{height:1.5, backgroundColor: '#46b07b'}} /> 
				<View style = {{flexDirection:'column', justifyContent:'center', alignItems:'center', marginTop:10}} >
					<FBLogin navigation = {this.props.navigation}/>
					<GoogleLogin navigation = {this.props.navigation}/>
				</View>
			</View>
		);
	}
}

const base = {
	logo: {
		width:responsiveWidth(42),
		height: responsiveHeight(25),
		borderRadius: 50
	}
}

const threesixty = {
	logo: {
		width:responsiveWidth(43.5),
		height: responsiveHeight(25),
		borderRadius: 50
	}
}

const twoeighty = {
	logo: {
		width:responsiveWidth(42),
		height: responsiveHeight(25),
		borderRadius: 50
	}
}

const foursixteen = {
	logo: {
		width:responsiveWidth(42),
		height: responsiveHeight(23),
		borderRadius: 50
	}
}

const styles = createStyles(
	base,
	minWidth(280, maxWidth(349, twoeighty)),
	minWidth(350, maxWidth(415, threesixty)),
	minWidth(416, maxWidth(767, foursixteen)),
	minWidth(768, maxWidth(1440, threesixty)),
);




//<GoogleLogin navigation = {this.props.navigation}/>