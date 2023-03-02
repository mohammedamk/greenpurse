import React, { Component } from 'react';
import {
	View,
	Text,
	StatusBar,
	TouchableOpacity,
	StyleSheet,
	Image,
	AsyncStorage,
	ScrollView,
	Alert,
	BackHandler,
} from 'react-native';
import { header } from '../utils/navigationHeader';
import Drawer from 'react-native-drawer';
import Entypo from 'react-native-vector-icons/Entypo';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import MenuComponent from '../utils/components/NavigationDrawer';
import Css from '../utils/Css/Style';
import url from '../utils/Api';
import { profile } from '../utils/internationalisation';
import { createStyles, maxWidth, minWidth } from 'react-native-media-queries';

export default class Profile extends Component {

	static navigationOptions = {
   		 header: false,
       drawerLabel: "Profile",
 	 	};

 	 	state = {
 	 		userData:'',
 	 		addressData:'',
 	 		zoneData:'',
 	 		streetData:'',
 	 		typeData:'',
 	 		apartmentData:null
 	 	}

 	 	componentWillMount(){
 	 		BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
 	 		//alert(JSON.stringify(this.props.navigation.state.params.userDetails.address_id))
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
	              //alert(JSON.stringify(responseData.user[0]))
	              this.setState({
	                userData: responseData.user[0]
	              })
	            }
	            //alert(JSON.stringify(responseData));
	        }).done(() => this.getAddress())
	    }

	 	getAddress(){
	 		var id = this.state.userData.address_id;
	 		fetch(url.main + "address" + url.transform + url.filter + "id,eq," + id , {
				method: "GET",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			}).then((response) => response.json())
			.then((responseData) => {
				//alert(JSON.stringify(responseData.address[0]));
				this.setState({
					addressData: responseData.address[0]
				})
				if(responseData.address[0].apartment_id == null){
						//alert(JSON.stringify(responseData.address[0].apartment_id))
				}else{
					//alert("hi");
					this.getApartment(responseData.address[0].apartment_id);
				}
		}).done(() => {
			this.getZone();
			this.getStreet();
			this.getType();
		});
	}

	getApartment(id){
		fetch(url.main + 'apartment' + url.transform + url.filter + 'id,eq,' + id, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).then((response) => response.json())
		.then((responseData) => {
			this.setState({
				apartmentData : responseData.apartment[0]
			})
		})
	}

	getZone(){
		var id = this.state.addressData.zone_id;
		fetch(url.main + "zone" + url.transform + url.filter + "id,eq," + id , {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
			}).then((response) => response.json())
			.then((responseData) => {
				//alert(JSON.stringify(responseData.zone[0]));
				this.setState({
					zoneData: responseData.zone[0]
				})
		}).done();
	}

	getStreet(){
		var id = this.state.addressData.street_id;
		fetch(url.main + "street" + url.transform + url.filter + "id,eq," + id , {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
			}).then((response) => response.json())
			.then((responseData) => {
				//alert(JSON.stringify(responseData.street[0]));
				this.setState({
					streetData: responseData.street[0]
				})
		}).done();
	}

	getType(){
		var id = this.state.addressData.type_id;
		fetch(url.main + "type" + url.transform + url.filter + "id,eq," + id , {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
			}).then((response) => response.json())
			.then((responseData) => {
				//alert(JSON.stringify(responseData.type[0]));
				this.setState({
					typeData: responseData.type[0]
				})
		}).done();
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
						<Text style ={Css.header_main_text}>{profile.headerTitle}</Text>
					</View>
				</View>
				<View style = {{flex: 1, flexDirection: 'column'}} >
					<ScrollView>
						<View style = {{alignItems:'center', marginTop: 15}} >
							<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(3), fontFamily:'Muli-ExtraBold'}}>{profile.mainHeading}</Text>
						</View>
						<View style = {{alignItems:'center', marginTop: 15}}>		
							<Image source = {{uri: this.state.userData.profile_pic}} style = {Styles1.ProfileImage}/>
						</View>
						<View style = {{marginTop: 15, backgroundColor:'#fff', width: responsiveWidth(88), alignSelf:'center',borderWidth:1, borderColor:"#e2e2e2"}}>
							<View style = {{flexDirection:'row', marginLeft: 25, marginRight: 25,marginTop: 10, marginBottom: 5}} >
								<View style = {{width: responsiveWidth(25)}}>
									<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(1.8), fontFamily:'Muli-ExtraBold',}} >{profile.uniqueIdText} </Text>
								</View>
								<Text style = {{color:'#838383', fontSize: responsiveFontSize(1.8), fontFamily:'Muli-Regular', paddingLeft: 10}} >{this.state.userData.uuid}</Text>
							</View>
							<View style = {{borderBottomWidth:1.5, borderColor:'#eee'}}></View>
							<View style = {{flexDirection:'row', marginLeft: 25, marginRight: 25, marginTop: 5, marginBottom: 5}} >
								<View style = {{width: responsiveWidth(25)}}>
									<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(1.8), fontFamily:'Muli-ExtraBold',}} >{profile.usernameText} </Text>
								</View>
								<Text style = {{color:'#838383', fontSize: responsiveFontSize(1.8), fontFamily:'Muli-Regular', paddingLeft: 10}} >{this.state.userData.username}</Text>
							</View>
							<View style = {{borderBottomWidth:1.5, borderColor:'#eee'}}></View>
							<View style = {{flexDirection:'row', marginLeft: 25, marginRight: 25, marginTop: 5, marginBottom: 5}} >
								<View style = {{width: responsiveWidth(25)}}>
									<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(1.8), fontFamily:'Muli-ExtraBold',}} >{profile.firstnameText} </Text>
								</View>
								<Text style = {{color:'#838383', fontSize: responsiveFontSize(1.8), fontFamily:'Muli-Regular', paddingLeft: 10}} >{this.state.userData.first_name} </Text>
							</View>
							<View style = {{borderBottomWidth:1.5, borderColor:'#eee'}}></View>
							<View style = {{flexDirection:'row', marginLeft: 25, marginRight: 25, marginTop: 5, marginBottom: 5}} >
								<View style = {{width: responsiveWidth(25)}}>
									<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(1.8), fontFamily:'Muli-ExtraBold',}} >{profile.lastnameText} </Text>
								</View>
								<Text style = {{color:'#838383', fontSize: responsiveFontSize(1.8), fontFamily:'Muli-Regular', paddingLeft: 10}} >{this.state.userData.last_name} </Text>
							</View>
							<View style = {{borderBottomWidth:1.5, borderColor:'#eee'}}></View>
							<View style = {{flexDirection:'row', marginLeft: 25, marginRight: 25, marginTop: 5, marginBottom: 5}} >
								<View style = {{width: responsiveWidth(25)}}>
									<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(1.8), fontFamily:'Muli-ExtraBold',}} >{profile.typeText} </Text>
								</View>
								<Text style = {{color:'#838383', fontSize: responsiveFontSize(1.8), fontFamily:'Muli-Regular', paddingLeft: 10}} >{this.state.typeData.name}</Text>
							</View>
							<View style = {{borderBottomWidth:1.5, borderColor:'#eee'}}></View>
							<View style = {{flexDirection:'row', marginLeft: 25, marginRight: 25, marginTop: 5, marginBottom: 5}} >
								<View style = {{width: responsiveWidth(25)}}>
									<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(1.8), fontFamily:'Muli-ExtraBold',}} >{profile.emailText} </Text>
								</View>
								<Text style = {{color:'#838383', fontSize: responsiveFontSize(1.8), fontFamily:'Muli-Regular', paddingLeft: 10}} >{this.state.userData.email}</Text>
							</View>
							<View style = {{borderBottomWidth:1.5, borderColor:'#eee'}}></View>
							<View style = {{flexDirection:'row', marginLeft: 25, marginRight: 25, marginTop: 5, marginBottom: 5}} >
								<View style = {{width: responsiveWidth(25)}}>
									<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(1.8), fontFamily:'Muli-ExtraBold',}} >{profile.phoneText} </Text>
								</View>
								<Text style = {{color:'#838383', fontSize: responsiveFontSize(1.8), fontFamily:'Muli-Regular', paddingLeft: 10}} >{this.state.userData.phone_no}</Text>
							</View>
							<View style = {{borderBottomWidth:1.5, borderColor:'#eee'}}></View>
							<View style = {{flexDirection:'row', marginLeft: 25, marginRight: 25, marginTop: 5, marginBottom: 5}} >
								<View style = {{width: responsiveWidth(25)}}>
									<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(1.8), fontFamily:'Muli-ExtraBold',}} >{profile.addressText} </Text>
								</View>
								<View style = {{flexDirection:'column' ,width:responsiveWidth(56)}} >
									<Text style = {{color:'#838383', fontSize: responsiveFontSize(1.8), fontFamily:'Muli-Regular', paddingLeft: 10}} >{this.state.addressData.house_name}, {this.state.streetData.name}, {this.state.zoneData.name}, {this.state.addressData.city}, {this.state.addressData.state} {this.state.addressData.pincode}</Text>
								</View>
							</View>
							<View style = {{borderBottomWidth:1.5, borderColor:'#eee'}}></View>
						</View>
						<View style = {{alignItems:'center', marginTop: 15, marginBottom: 15}} >
							<TouchableOpacity onPress = {() => this.props.navigation.navigate('profileedit', {userData: this.state.userData, addressData: this.state.addressData, zoneData: this.state.zoneData, streetData: this.state.streetData, typeData: this.state.typeData, apartmentData: this.state.apartmentData })} style = {{width: responsiveWidth(88), height: responsiveHeight(7), backgroundColor:'#46b07b', justifyContent:'center', alignItems:'center'}}>
								<Text style = {{color:'#fff', fontSize: responsiveFontSize(2.5), fontFamily:'Muli-ExtraBold'}}>{profile.editButtonText}</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</View>
			</View>
		);
	}
}

const base = {
  ProfileImage: {
    width: responsiveWidth(35), 
    height:responsiveHeight(20), 
    borderRadius: 100, 
  }
}

const twoeighty = {
  ProfileImage: {
    width: responsiveWidth(35), 
    height:responsiveHeight(20), 
    borderRadius: 100, 
  }
}

const threesixty = {
  ProfileImage: {
    width: responsiveWidth(36.5), 
    height:responsiveHeight(20), 
    borderRadius: 100, 
  }
}

const foursixteen = {
  ProfileImage: {
    width: responsiveWidth(35), 
    height:responsiveHeight(20), 
    borderRadius: 100, 
  }
}

const Styles1 = createStyles(
  base,
  minWidth(280, maxWidth(349, twoeighty)),
  minWidth(350, maxWidth(415, threesixty)),
  minWidth(416, maxWidth(767, foursixteen)),
  minWidth(768, maxWidth(1440, threesixty)),
);