import React, { Component } from 'react';
import {
	View,
	Text,
	StatusBar,
	TouchableOpacity, 
	StyleSheet,
	WebView,
	BackHandler,
} from 'react-native';
import { header } from '../utils/navigationHeader';
import Drawer from 'react-native-drawer';
import Entypo from 'react-native-vector-icons/Entypo';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import MenuComponent from '../utils/components/NavigationDrawer';
import Css from '../utils/Css/Style';
import { termsAndConditions } from '../utils/internationalisation';

export default class TermsAndCondition extends Component {

	static navigationOptions = {
   		 header: false,
       drawerLabel: "Terms & Conditions",
 	 	};

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

	render() {
		return(
			<View style={{flex:1, backgroundColor:'#eee'}}>
				<View style={Css.header_main}>
					<View style = {Css.header_menu_view}>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerToggle')}>
							<Entypo name="menu" size={25} color="white" />
						</TouchableOpacity>
					</View>
					<View style = {Css.header_main_text_view}>
						<Text style ={Css.header_main_text}>{termsAndConditions.headerTitle}</Text>
					</View>
				</View>
				<WebView 
          			source = {{ uri : 'http://mygreenpurse.com/terms-and-conditions/'}} 
          			startInLoadingState = {true}
          			decelerationRate="normal" />
			</View>
		);
	}
}