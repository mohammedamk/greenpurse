import React, { Component } from 'react';
import {
	View,
	Text,
	StatusBar,
	TouchableOpacity,
	StyleSheet,
	Image,
	AsyncStorage,
	Alert,
	BackHandler
} from 'react-native';
import { header } from '../utils/navigationHeader';
import Drawer from 'react-native-drawer';
import Entypo from 'react-native-vector-icons/Entypo';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import MenuComponent from '../utils/components/NavigationDrawer';
import Css from '../utils/Css/Style';
import url from '../utils/Api';
import { myPurse } from '../utils/internationalisation';

export default class MyPurse extends Component {

	static navigationOptions = {
   		 header: false,
       drawerLabel: "My Purse",
 	 	};

 	 	state = {
 	 		userData:'',
 	 		user_id:'',
 	 		points:''
 	 	}

 	 componentWillMount() {
 	 	 BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
	    AsyncStorage.getItem("User").then((value) => {
	        var tmp = JSON.parse(value);
	        this.setState({user_id: tmp});
	    }).done(() => this.getUser());
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackbutton');
  }

  handleBack(){
    this.props.navigation.goBack(null);
    return true;
  }

    getUser(){
      fetch(url.main + "user" + url.transform + url.filter + "id,eq," + this.state.user_id, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((response) => response.json())
          .then((responseData) => {
            if(responseData === null){
              Alert.alert("","Network Error");
            }else{
              //AsyncStorage.setItem("User_Details", JSON.stringify(responseData));
              //alert(JSON.stringify(responseData))
              this.setState({
                userData: responseData
              })
            }
            //alert(JSON.stringify(responseData));
        }).done(() => this.getPoints());
    }

    getPoints(){
    	fetch(url.other + "points", {
    		method: "POST",
    		headers: {
    			'Accept': 'application/json',
    			'Content-Type': 'application/json'
    		},
    		body: JSON.stringify({
    			'user_id' : this.state.userData.user[0].id
    		})
    		}).then((response) => response.json())
          .then((responseData) => {
            //alert(JSON.stringify(responseData))
            this.setState({
            	points: responseData
            })
    	})
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
						<Text style ={Css.header_main_text}>{myPurse.headerTitle}</Text>
					</View>
				</View>
				<View style = {{flex: 1, flexDirection: 'column'}} >
					<View style = {{alignItems:'center', marginTop: 15}} >
						<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(3), fontFamily:'Muli-ExtraBold'}}>{myPurse.mainHeading}</Text>
					</View>
					<View style = {{marginTop: 20}} >
						<View style = {{flexDirection:'row',width: responsiveWidth(88), height: responsiveHeight(7.5), backgroundColor: '#fff', alignSelf: "center", borderRadius: 3,}}>
							<View style = {{width: responsiveWidth(12), alignItems:'center', justifyContent:'center'}} >
								<Image source = {require("../../public/Total_Remaining_Point.png")} style = {{width: responsiveWidth(7), height: responsiveHeight(4.2), borderRadius: 50}}/>
							</View>
							<View style = {{width: responsiveWidth(57.5), alignItems:'flex-start', justifyContent:'center'}} >
								<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(2.3), fontFamily:'Muli-ExtraBold',paddingLeft: 5}} >{myPurse.totalRPointsText}</Text>
							</View>
							<View style = {{width: responsiveWidth(16), alignItems:'flex-end', justifyContent:'center'}}>
								<Text style = {{color:'#838383', fontSize: responsiveFontSize(2.3), fontFamily:'Muli-Regular'}} >{this.state.points.total_point}</Text>
							</View>
						</View>
						<View style = {{flexDirection:'row',width: responsiveWidth(88), height: responsiveHeight(7.5), backgroundColor: '#fff', alignSelf: "center", borderRadius: 3, marginTop: 15}}>
							<View style = {{width: responsiveWidth(12), alignItems:'center', justifyContent:'center'}} >
								<Image source = {require("../../public/Redeemed_Point_Icon.png")} style = {{width: responsiveWidth(7), height: responsiveHeight(4.2), borderRadius: 50}}/>
							</View>
							<View style = {{width: responsiveWidth(57.5), alignItems:'flex-start', justifyContent:'center'}} >
								<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(2.3), fontFamily:'Muli-ExtraBold',paddingLeft: 5}} >{myPurse.redemedPointsText}</Text>
							</View>
							<View style = {{width: responsiveWidth(16), alignItems:'flex-end', justifyContent:'center'}}>
								<Text style = {{color:'#838383', fontSize: responsiveFontSize(2.3), fontFamily:'Muli-Regular'}} >{this.state.points.total_reedemed}</Text>
							</View>
						</View>
						<View style = {{flexDirection:'row',width: responsiveWidth(88), height: responsiveHeight(7.5), backgroundColor: '#fff', alignSelf: "center", borderRadius: 3, marginTop: 15}}>
							<View style = {{width: responsiveWidth(10.5),marginRight: 5.5, alignItems:'center', justifyContent:'center'}} >
								<Image source = {require("../../public/Penalties.png")} style = {{width: responsiveWidth(7), height: responsiveHeight(4.2), borderRadius: 50}}/>
							</View>
							<View style = {{width: responsiveWidth(57.5), alignItems:'flex-start', justifyContent:'center'}} >
								<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(2.3), fontFamily:'Muli-ExtraBold',paddingLeft: 5}} >{myPurse.penalityText}</Text>
							</View>
							<View style = {{width: responsiveWidth(16), alignItems:'flex-end', justifyContent:'center'}}>
								<Text style = {{color:'#838383', fontSize: responsiveFontSize(2.3), fontFamily:'Muli-Regular'}} >{this.state.points.total_penality}</Text>
							</View>
						</View>
						<View style = {{flexDirection:'row',width: responsiveWidth(88), height: responsiveHeight(7.5), backgroundColor: '#fff', alignSelf: "center", borderRadius: 3, marginTop: 15}}>
							<View style = {{width: responsiveWidth(12), alignItems:'center', justifyContent:'center'}} >
								<Image source = {require("../../public/Total_Earning.png")} style = {{width: responsiveWidth(7), height: responsiveHeight(4.2), borderRadius: 50}}/>
							</View>
							<View style = {{width: responsiveWidth(57.5), alignItems:'flex-start', justifyContent:'center'}} >
								<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(2.3), fontFamily:'Muli-ExtraBold',paddingLeft: 5}} >{myPurse.totalBonusText}</Text>
							</View>
							<View style = {{width: responsiveWidth(16), alignItems:'flex-end', justifyContent:'center'}}>
								<Text style = {{color:'#838383', fontSize: responsiveFontSize(2.3), fontFamily:'Muli-Regular'}} >{this.state.points.total_bonus}</Text>
							</View>
						</View>
						<View style = {{flexDirection:'row',width: responsiveWidth(88), height: responsiveHeight(7.5), backgroundColor: '#fff', alignSelf: "center", borderRadius: 3, marginTop: 15}}>
							<View style = {{width: responsiveWidth(12), alignItems:'center', justifyContent:'center'}} >
								<Image source = {require("../../public/Total_Bonus.png")} style = {{width: responsiveWidth(7), height: responsiveHeight(4.2), borderRadius: 50}}/>
							</View>
							<View style = {{width: responsiveWidth(57.5), alignItems:'flex-start', justifyContent:'center'}} >
								<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(2.3), fontFamily:'Muli-ExtraBold',paddingLeft: 5}} >{myPurse.totalEarnedText}</Text>
							</View>
							<View style = {{width: responsiveWidth(16), alignItems:'flex-end', justifyContent:'center'}}>
								<Text style = {{color:'#838383', fontSize: responsiveFontSize(2.3), fontFamily:'Muli-Regular'}} >{this.state.points.total_earned}</Text>
							</View>
						</View>
					</View>
				</View>
			</View>
		);
	}
}