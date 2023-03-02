import React, { Component } from 'react';
import {
	View,
	Text,
	StatusBar,
	TouchableOpacity,
	StyleSheet,
	Image,
	ScrollView,
	Platform,
	Linking,
	TextInput,
	AsyncStorage,
	BackHandler,
} from 'react-native';
import url from '../utils/Api';
import PopupDialog from 'react-native-popup-dialog';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

let Version = "2.5";

export default class AuthCheck extends Component {
	static navigationOptions = {
		header: false,
	};

	constructor(props){
		super(props);
	}

	state = {
		notice:''
	}

	onAuth = (screenName) => {
		this.props.navigation.navigate(screenName);
	}

	componentWillMount(){
		AsyncStorage.getItem('notice').then((value) => {
			var tmp = JSON.parse(value);
			if(tmp == null){
				var notice = {msg: '', status: 'notseen'}
				AsyncStorage.setItem('notice', JSON.stringify(notice))
			}
		})

		BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
		this.checkversion();
	}

	componentWillUnmount() {
      	BackHandler.removeEventListener('hardwareBackbutton');
	}

 	handleBack(){
 		BackHandler.exitApp();
 	}

 	checkversion(){
 		fetch(url.main + 'version' + url.transform, {
			method: 'GET',
			headers: {
	          'Accept': 'application/json',
	          'Content-Type': 'application/json'
	        }
		}).then((response) => response.json())
			.then((responseData) => {
				//alert(JSON.stringify(responseData))
				if(responseData.version[0].version_code == Version){
					AsyncStorage.getItem('User').then((value) => {
						//alert(JSON.parse(value));
						var tmpValue = JSON.parse(value);
						if (tmpValue !== null) {
							console.log(this.props.navigation.navigate)
							this.props.navigation.navigate('updatesegregation');
						}else{
							this.props.navigation.navigate('login');
						}
					})
				}else{
					//this.noticePopupDialog.show();
					this.PopupDialog.show();
				}
			})
 	}



	render(){
		return(
			<View>
				<PopupDialog
            		ref={(popupDialog) => { this.PopupDialog = popupDialog; }}
            		width = {responsiveWidth(85)}
            		height = {responsiveHeight(25)}
            		dismissOnTouchOutside = {false}
            		dismissOnHardwareBackPress = {false}
            		//haveOverlay = {false}
            		//dialogStyle = {{borderRadius: 0}}
            		>
            		<View style = {{width: responsiveWidth(85), height: responsiveHeight(20)}}>
            			<View style = {{width: responsiveWidth(85), height:responsiveHeight(8),borderBottomWidth:2, borderColor:'#46b07b', alignItems:'center', justifyContent:'center'}} >
            				<Text style = {{color: '#46b07b', fontSize: responsiveFontSize(2.8), fontFamily:'Muli-ExtraBold'}} >Notice</Text>
            			</View>
            			<View style = {{alignItems:'center', justifyContent:'center', marginTop: 10}}>
            				<Text style = {{color: '#000', fontSize: responsiveFontSize(2.4), fontFamily: 'Muli-ExtraBold'}}>Please update your App !</Text>
            			</View>
            			<TouchableOpacity onPress = {() => Linking.openURL('https://play.google.com/store/apps/details?id=com.mygreenwallet2&hl=en')} style = {{width: responsiveWidth(30), height: responsiveHeight(7), backgroundColor: '#46b07b', alignSelf:'center', marginTop: 12.5, alignItems:'center', justifyContent:'center', borderRadius: 5}}>
            				<Text style = {{color:'#fff', fontSize: responsiveFontSize(2.4), fontFamily: 'Muli-ExtraBold' }}>Update</Text>
            			</TouchableOpacity>
            		</View>
            	</PopupDialog>
			</View>
		);
	}
}
