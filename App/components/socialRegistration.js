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
	Alert,
	BackHandler
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import MenuComponent from '../utils/components/NavigationDrawer';
import Css from '../utils/Css/Style';
import NameInput from '../utils/components/InputField';
import ModalDropdown from 'react-native-modal-dropdown';
import PopupDialog from 'react-native-popup-dialog';
import url from '../utils/Api';
import { backAction } from '../utils/navigationAction';
import { registration } from '../utils/internationalisation';
//import ImagePicker from 'react-native-image-picker';
import Autocomplete from 'react-native-autocomplete-input';

var streetayyar = [];
var zonearray=[];
export default class SocialRegistration extends Component {
	static navigationOptions = {
		header: false,
	}
	constructor(props){
		super(props);

		this.state = {
			avatarSource : null,
			usernameText: '',
			firstnameText:'',
			lastnameText: '',
			passwordText: '',
			confPasswordText: '',
			emailText:'',
			contactText: '',
			houseNameText: '',
			pincodeText: '',
			zoneName: [],
			zoneID:[],
			streetName: [],
			streetID: [],
			street_id:'',
			zone_id:0,
			typeName: [],
			typeID: [],
			type_id:'',
			userData:'',
			google_id: '',
			google_token:'',
			facebook_id: '',
			fb_token: '',
			showApartmentDrop: false,
			apartment_Id: '',
			apartmentID: [],
			apartmentName:[],
			apartmentNameText: '',
			localitys: [],
      		query: '',
      		zones: [],
      		query2: '',
      		codePoint:0,
      		couponSuccess: false,
      		couponError: false,
		}
	}

	componentWillMount(){
		//alert(JSON.stringify(this.props.navigation.state.params.socialUser))
		BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
		this.getZone();
		this.getType();
		if(this.props.navigation.state.params.flag === 'google'){
			this.setState({
				userData: this.props.navigation.state.params.socialUser,
				avatarSource: this.props.navigation.state.params.socialUser.photo,
				usernameText: this.props.navigation.state.params.socialUser.name,
				firstnameText: this.props.navigation.state.params.socialUser.givenName,
				lastnameText: this.props.navigation.state.params.socialUser.familyName,
				emailText: this.props.navigation.state.params.socialUser.email,
				google_id: this.props.navigation.state.params.socialUser.id,
				google_token: this.props.navigation.state.params.socialUser.idToken,
			})
		}else if(this.props.navigation.state.params.flag === 'facebook'){
			this.setState({
				userData: this.props.navigation.state.params.socialUser,
				avatarSource: this.props.navigation.state.params.socialUser.picture.data.url,
				usernameText: this.props.navigation.state.params.socialUser.name,
				firstnameText: this.props.navigation.state.params.socialUser.first_name,
				lastnameText: this.props.navigation.state.params.socialUser.last_name,
				emailText: this.props.navigation.state.params.socialUser.email,
				facebook_id: this.props.navigation.state.params.socialUser.id,
			})
		}
		Alert.alert('', 'Please Fill out this form to get started!');
	}

	componentWillUnmount() {
      	BackHandler.removeEventListener('hardwareBackbutton');
	}

 	handleBack(){
 		this.props.navigation.goBack(null);
 		return true;
 	}

	getZone(){
		fetch(url.main + "zone" + url.transform ).then(res => res.json()).then((json) => {
			const { zone: zones } = json;
			this.setState({ zones });
			//alert(JSON.stringify(this.state.zones));
		});
		// fetch(url.main + "zone" + url.transform, {
		// 			method: "GET",
		// 			headers: {
		// 				'Accept': 'application/json',
		// 				'Content-Type': 'application/json'
		// 			}
		// 		}).then((response) => response.json())
		// 		.then((responseData) => {
		// 			//alert(JSON.stringify(responseData.zone));
		// 		 var zoneName = responseData.zone.map(function(zone){
		// 		 	return (zone.name);
		// 		 })
		// 		 var zoneID = responseData.zone.map(function(zone) {
		// 		 	return (zone.id)
		// 		 })
		// 		 this.setState({
		// 		 	zoneName: zoneName,
		// 		 	zoneID: zoneID
		// 		 })
		// 	}).done();
	}

	getStreet(id){
		fetch(url.main + "street" + url.transform + url.filter + "zone_id,eq,"+ id).then(res => res.json()).then((json) => {
			const { street: localitys } = json;
			this.setState({ localitys });
			// alert(JSON.stringify(this.state.localitys));
		});
		// fetch(url.main + "street" + url.transform + url.filter + "zone_id,eq,"+ id, {
		// 			method: "GET",
		// 			headers: {
		// 				'Accept': 'application/json',
		// 				'Content-Type': 'application/json'
		// 			}
		// 		}).then((response) => response.json())
		// 		.then((responseData) => {
		// 			//alert(JSON.stringify(responseData.street));
		// 		 var streetName = responseData.street.map(function(street){
		// 		 	return (street.name);
		// 		 })
		// 		 var streetID = responseData.street.map(function(street) {
		// 		 	return (street.id)
		// 		 })
		// 		 this.setState({
		// 		 	streetName: streetName,
		// 		 	streetID: streetID
		// 		 })
		// 	}).done();
	}

	findZone(query2) {
		if (query2 === '') {
			return [];
		}
		zonearray = [];
		const { zones } = this.state;
		const regex = new RegExp(`${query2.trim()}`, 'i');
		zonearray = zones.filter(zone => zone.name.search(regex) >= 0);

		return zonearray;
	}

	checkzone(){
		if(zonearray.length == 0 ){
			if(this.state.query2 != ''){
				this.addZone();
			}
		}
	}

	addZone(){
		fetch(url.main + "zone" + url.transform, {
					method: "POST",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						'name' : this.state.query2,
					})
				}).then((response) => response.json())
				.then((responseData) => {
					//alert(JSON.stringify(responseData.street));
					if(responseData == ''){
						//Alert.alert('', 'Locality not added!');
					}else{
						// alert(responseData);
						this.setState({
							zone_id:responseData
						})
						//Alert.alert('','Locality successfully added!');

					}
			}).done(() => {});
	}

	findLocality(query) {
	    if (query === '') {
	      return [];
	    }
			streetayyar = [];
	    const { localitys } = this.state;
	    const regex = new RegExp(`${query.trim()}`, 'i');
			streetayyar =  localitys.filter(locality => locality.name.search(regex) >= 0);
		 //alert(JSON.stringify(streetayyar));
		 return streetayyar;
  	}

		checkstreet(){
			if(streetayyar.length == 0 ){
				if(this.state.query != ''){
					this.addLocality();
				}
			}
		}

		addLocality(){
			fetch(url.main + "street" + url.transform, {
						method: "POST",
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							'name' : this.state.query,
							'zone_id': this.state.zone_id
						})
					}).then((response) => response.json())
					.then((responseData) => {
						//alert(JSON.stringify(responseData.street));
						if(responseData == ''){
							//Alert.alert('', 'Locality not added!');
						}else{
							// alert(responseData);
							this.setState({
								street_id:responseData
							})
							//Alert.alert('','Locality successfully added!');

						}
				}).done(() => {});
		}

	getApartment(id){
		fetch(url.main + "apartment" + url.transform + url.filter + "street_id,eq,"+ id, {
					method: "GET",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}).then((response) => response.json())
				.then((responseData) => {
					//alert(JSON.stringify(responseData.street));
				 var apartmentName = responseData.apartment.map(function(apartment){
				 	return (apartment.name);
				 })
				 var apartmentID = responseData.apartment.map(function(apartment) {
				 	return (apartment.id)
				 })
				 this.setState({
				 	apartmentName: apartmentName,
				 	apartmentID: apartmentID
				 })
			}).done();
	}

	addApartment(){
		fetch(url.main + "apartment" + url.transform, {
					method: "POST",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						'name' : this.state.apartmentNameText,
						'street_id': this.state.street_id
					})
				}).then((response) => response.json())
				.then((responseData) => {
					//alert(JSON.stringify(responseData.street));
					if(responseData == ''){
						Alert.alert('', 'Apartment not added!');
					}else{
						Alert.alert('','Apartment successfully added!');
						this.addApartmentPopupDialog.dismiss();
					}
			}).done(() => this.getApartment(this.state.street_id));
	}

	getType(){
		fetch(url.main + "type" + url.transform, {
					method: "GET",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}).then((response) => response.json())
				.then((responseData) => {
					//alert(JSON.stringify(responseData.zone));
				 var typeName = responseData.type.map(function(type){
				 	return (type.name);
				 })
				 var typeID = responseData.type.map(function(type) {
				 	return (type.id)
				 })
				 this.setState({
				 	typeName: typeName,
				 	typeID: typeID,
				 })
			}).done();
	}

	usernameField(input) {
		this.setState({usernameText: input})
	}

	firstNameField(input){
		this.setState({firstnameText: input})
	}

	lastNameField(input){
		this.setState({lastnameText: input})
	}

	passwordField(input){
		this.setState({passwordText: input})
	}

	confPasswordField(input){
		this.setState({confPasswordText: input})
	}

	emailField(input){
		this.setState({emailText: input})
	}

	contactField(input){
		this.setState({contactText: input})
	}

	on_select_type(idx, value){
		//alert(idx + value);
		this.setState({
			type_id: this.state.typeID[idx]
		})

		if(value == 'Apartment'){
			this.setState({
				showApartmentDrop: true,
				houseNameText: '0'

			})
		}else{
			this.setState({
				showApartmentDrop: false,
				houseNameText: '',

			})
		}
	}

	on_select_zone(id){
		//alert(this.state.zoneID[idx]);
		this.getStreet(id);
	}

	on_select_street(id){
		//alert(idx + value);
		this.getApartment(id);
	}

	on_select_apartment(idx, value){
		this.setState({
			apartment_Id: this.state.apartmentID[idx]
		})
	}

	housenameField(input){
		this.setState({houseNameText: input})
	}

	pincodeField(input){
		this.setState({pincodeText: input})
	}

	apartmentNameField(input){
		this.setState({apartmentNameText: input})
	}

	couponCodeField(input){
		this.setState({couponCode: input})
	}

	submitDetails(){
		var apartmentId, houseName;
		if(this.state.showApartmentDrop){
			apartmentID = this.state.apartment_Id;
			houseName = 0;
		}else{
			apartmentID = '';
			houseName = this.state.houseNameText;
		}
		if(this.state.usernameText && this.state.firstnameText && this.state.lastnameText && this.state.contactText && this.state.houseNameText && this.state.zone_id && this.state.street_id && this.state.type_id && this.state.pincodeText){
			var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			if(this.state.emailText.match(mailformat)){
				if(this.state.avatarSource){
					fetch(url.main + "address" , {
						method: "POST",
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							'zone_id': this.state.zone_id,
							'street_id': this.state.street_id,
							'house_name': houseName,
							'pincode': this.state.pincodeText,
							'type_id': this.state.type_id,
							'apartment_id': apartmentID
						})
					}).then((response) => response.json())
					.then((responseData) => {
						//alert(JSON.stringify(responseData));
						if(this.props.navigation.state.params.flag === 'facebook'){
							this.createUser2(responseData);
						}else if(this.props.navigation.state.params.flag === 'google'){
							this.createUser(responseData);
						}

				}).done();
				}else{
					Alert.alert('','Image is not selected!')
				}
			}else{
				Alert.alert("","Email is incorrect!")
			}
		}else{
			Alert.alert('','Field is empty!')
		}
	}

	checkCoupon(){
		this.setState({
			couponError : false,
			couponSuccess: false
		})
		fetch(url.other + "checkcode", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'code': this.state.couponCode
			})
		}).then((response) => response.json())
		.then((responseData) => {
			if(responseData.code == 200){
				this.setState({
					couponSuccess: true,
					codePoint: responseData.point
				})
			}else if(responseData.code == 100){
				this.setState({
					couponError: true
				})
			}else{
			}
			//alert(JSON.stringify(responseData));
		}).done();
	}

	createUser(address_id){
		var uuid = (this.state.zone_id).toString() + (this.state.street_id).toString() + (address_id).toString();
		//alert(uuid)
		fetch(url.main + "user", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'uuid': uuid,
				'username': this.state.usernameText,
				'first_name': this.state.firstnameText,
				'last_name': this.state.lastnameText,
				'address_id': address_id,
				'email': this.state.emailText,
				'phone_no': this.state.contactText,
				'points': this.state.codePoint,
				'profile_pic': this.state.avatarSource,
				'password': this.state.google_id,
				'google_id': this.state.google_id,
				'google_token': this.state.google_token,

			})
		}).then((response) => response.json())
		.then((responseData) => {
			if(responseData === null){
				Alert.alert("","Email Already exists!");
			}else{
				AsyncStorage.setItem("User", JSON.stringify(responseData));
				AsyncStorage.setItem("Flag", 'google');
				this.props.navigation.navigate("updatesegregation");
				this.getBonus(responseData);
				this.updatePointTransaction(responseData);
			}
			//alert(JSON.stringify(responseData));
	}).done();
}

	getBonus(id){
		fetch(url.other + "register/bonus", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'user_id': id
			})
		}).then((response) => response.json())
		.then((responseData) => {
			if(responseData.code == 200){
				Alert.alert('', 'Congratulations! you have earned 300 points as early registration bonus!');
			}else if(responseData.code == 202){

			}else{
				this.getBonus(id);
			}
			//alert(JSON.stringify(responseData));
		}).done();
	}

	createUser2(address_id){
		var uuid = (this.state.zone_id).toString() + (this.state.street_id).toString() + (address_id).toString();
		//alert(uuid)
		fetch(url.main + "user", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'uuid': uuid,
				'username': this.state.usernameText,
				'first_name': this.state.firstnameText,
				'last_name': this.state.lastnameText,
				'address_id': address_id,
				'email': this.state.emailText,
				'phone_no': this.state.contactText,
				'points': this.state.codePoint,
				'profile_pic': this.state.avatarSource,
				'password': this.state.facebook_id,
				'facebook_id': this.state.facebook_id,


			})
		}).then((response) => response.json())
		.then((responseData) => {
			if(responseData === null){
				Alert.alert("","Email Already exists!");
			}else{
				AsyncStorage.setItem("User", JSON.stringify(responseData));
				AsyncStorage.setItem("Flag", 'facebook');
				this.props.navigation.navigate("updatesegregation");
				this.getBonus(responseData);
				this.updatePointTransaction(responseData);
			}
			//alert(JSON.stringify(responseData));
		}).done();
	}

	updatePointTransaction(id){
		fetch(url.main + 'points_transaction' , {
          method: "POST",
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({
          'user_id' : id,
          'amount' : this.state.codePoint,
          'type' : 'Bonus'
        })
      }).then((response) => response.json())
      .then((responseData) => {
        //alert()
      }).done();
	}


	render(){
		const { query } = this.state;
    	const localitys = this.findLocality(query);
    	const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    	const { query2 } = this.state;
    	const zones = this.findZone(query2);
    	const comp1 = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
		return(
			<View style={{flex:1,backgroundColor:'#fff', flexDirection:'column'}}>
				<View style={Css.header_main}>
					<View style = {{width: responsiveWidth(15), alignItems:'center', justifyContent:'center'}} >
						<TouchableOpacity onPress = {() => this.props.navigation.navigate('login')}>
							<Feather name = 'arrow-left' color = "#fff" size = {20}/>
						</TouchableOpacity>
					</View>
					<View style = {{width: responsiveWidth(80), alignItems:'center', justifyContent:'center'}}>
						<Text style ={Css.header_main_text}>{registration.headerTitle}</Text>
					</View>
				</View>
				<View style = {{flex:1}} >
					<ScrollView>
					<View style = {{alignItems:'center', marginTop: 15}} >
						<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(3), fontFamily:'Muli-ExtraBold'}}>{registration.mainHeading}</Text>
					</View>
					<TouchableOpacity onPress = {() => this.popupDialog.show() } style = {{width: responsiveWidth(30.5),height:responsiveHeight(19.5),borderRadius: 100, alignSelf:'center'}} >
						{
							this.state.avatarSource === null ? <View style = {{width: responsiveWidth(30.5),height:responsiveHeight(17.5),borderRadius: 100, backgroundColor:'#fff', marginTop: 9,alignSelf:'center', justifyContent:'center'}} ><Text style = {{textAlign:'center',fontSize:responsiveFontSize(2), fontFamily:'Muli-Bold'}}>{registration.selectAvatarText}</Text></View> :
							<Image source = {{uri: this.state.avatarSource}} style = {{width: responsiveWidth(30.5),height:responsiveHeight(17.5),marginTop:9,alignSelf:'center', borderRadius: 100}} />
						}
					</TouchableOpacity>
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 20, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor:'#46b07b'}}>
				    		<EvilIcons name = "user" color = "#fff" size = {22} style = {{}}/>
						</View>
						<TextInput
				            value= {this.state.usernameText}
				             style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(79) , backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light', }}
				            placeholder= {registration.usernamePlaceholder}
				            placeholderTextColor = "#000"
				            underlineColorAndroid = 'transparent'
				            onChangeText={e => this.usernameField(e)}
				            editable={true}
				            secureTextEntry = {false}
				          />
					</View>
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor:'#46b07b'}}>
				    		<Feather name = "user" color = "#fff" size = {15} style = {{}}/>
						</View>
						<TextInput
				            value= {this.state.firstnameText}
				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(79) , backgroundColor:'transparent', borderRadius: 3,  fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light' }}
				            placeholder= {registration.firstnamePlaceholder}
				            placeholderTextColor = "#000"
				            underlineColorAndroid = 'transparent'
				            onChangeText={e => this.firstNameField(e)}
				            editable={true}
				            secureTextEntry = {false}
				          />
					</View>
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor:'#46b07b'}}>
				    		<Feather name = "users" color = "#fff" size = {15} style = {{}}/>
						</View>
						<TextInput
				            value= {this.state.lastnameText}
				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(79) , backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light' }}
				            placeholder= {registration.lastnamePlaceholder}
				            placeholderTextColor = "#000"
				            underlineColorAndroid = 'transparent'
				            onChangeText={e => this.lastNameField(e)}
				            editable={true}
				            secureTextEntry = {false}
				          />
					</View>
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor:'#46b07b'}}>
				    		<Ionicons name = "ios-mail-outline" color = "#fff" size = {20} style = {{}}/>
						</View>
						<TextInput
				            value= {this.state.emailText}
				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(79) , backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light'}}
				            placeholder= {registration.emailPlaceholder}
				            placeholderTextColor = "#000"
				            underlineColorAndroid = 'transparent'
				            onChangeText={e => this.emailField(e)}
				            editable={true}
				            secureTextEntry = {false}
				          />
					</View>
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor:'#46b07b'}}>
				    		<Ionicons name = "ios-phone-portrait-outline" color = "#fff" size = {20} style = {{}}/>
						</View>
						<TextInput
				            value= {this.state.contactText}
				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(79) , backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light',  }}
				            placeholder= {registration.contactPlaceholder}
				            placeholderTextColor = "#000"
				            underlineColorAndroid = 'transparent'
				            onChangeText={e => this.contactField(e)}
				            keyboardType = 'numeric'
				            editable={true}
				            secureTextEntry = {false}
				          />
					</View>
					<View style = {{width: responsiveWidth(88), alignSelf:'center', marginTop: 15}} >
						<Text style = {{color:'#46b07b', fontFamily:'Muli-ExtraBold', fontSize: responsiveFontSize(3)}} > {registration.addressHeading} </Text>
					</View>
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor:'#46b07b'}}>
				    		<SimpleLineIcons name = "home" color = "#fff" size = {15} style = {{}}/>
						</View>
						<ModalDropdown
		                    style={{ width: responsiveWidth(79), backgroundColor: 'transparent', height:responsiveHeight(6),borderRadius: 3}}
		                    textStyle={{fontFamily: 'Muli-Light', fontSize: responsiveFontSize(1.7), color:'#000', paddingTop: 10,paddingLeft: 5}}
		                    defaultValue={registration.typeDrop}
		                    dropdownStyle={{width: responsiveWidth(79),height: responsiveHeight(20.5), marginTop: 10, backgroundColor:'transparent', borderColor:'#7A7A7A'}}
		                    dropdownTextStyle={{color:'#000', fontSize: responsiveFontSize(1.7), fontFamily:'Muli-Light', paddingLeft:10,backgroundColor:'#fff'}}
		                    options = {this.state.typeName}
		                    //defaultIndex = {this.state.nameIndex}
		                    onSelect={(idx, value) => this.on_select_type(idx, value)} />
		            </View>
		             <View style = {{flexDirection: 'row', width: responsiveWidth(88), alignSelf:'center', height: responsiveHeight(7.2), marginTop: 10}}>
	                	<View style = {{flexDirection:'row',height: responsiveHeight(7.2), width: responsiveWidth(9),backgroundColor:'transparent',borderRadius: 3,borderWidth: 1, alignSelf:'center', borderColor:'#7A7A7A' }} >
    				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor:'#46b07b'}}>
    				    		<Feather name = "map-pin" color = "#fff" size = {15} style = {{}}/>
    						</View>
    					</View>
    					<View style = {{width: responsiveWidth(60), height: responsiveHeight(7.2)}}>
    		                <Autocomplete
    		               	  autoCapitalize="none"
					          autoCorrect={false}
					          containerStyle={{width: responsiveWidth(79),position:'absolute',zIndex:2,fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light'}}
					          inputContainerStyle={{height: responsiveHeight(7.2),borderRadius: 3,borderWidth: 1.2,borderColor:'#7A7A7A'}}
					          listContainerStyle={{width: responsiveWidth(79),position:'relative', backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light',}}
					          data={zones.length === 1 && comp1(query2, zones[0].name) ? [] : zones}
					          defaultValue={query2}
										onEndEditing = {() => this.checkzone()}
										onSubmitEditing = {() => this.checkzone()}
					          onChangeText={text => this.setState({ query2: text })}
					          placeholder={registration.zoneDrop}
					          renderItem={({ name,id }) => (
					            <TouchableOpacity onPress={() => {this.setState({ query2: name,zone_id:id }); this.on_select_zone(id);}}>
					              <Text>
					                {name}
					              </Text>
					            </TouchableOpacity>
					          )}
					        />
					    </View>
					   </View>
		            <View style = {{flexDirection: 'row', width: responsiveWidth(88), alignSelf:'center', height: responsiveHeight(7.2), marginTop: 12}}>
	                	<View style = {{flexDirection:'row',height: responsiveHeight(7.2), width: responsiveWidth(9),backgroundColor:'transparent',borderRadius: 3,borderWidth: 1, alignSelf:'center', borderColor:'#7A7A7A' }} >
    				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor:'#46b07b'}}>
    				    		<Entypo name = "address" color = "#fff" size = {20} style = {{}}/>
    						</View>
    					</View>
    					<View style = {{width: responsiveWidth(60), height: responsiveHeight(7.2)}}>
    		                <Autocomplete
    		               	  autoCapitalize="none"
					          autoCorrect={false}
					          containerStyle={{width: responsiveWidth(79),position:'absolute',zIndex:1,fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light', backgroundColor
					          :'transparent'}}
					          inputContainerStyle={{height: responsiveHeight(7.2),borderRadius: 3,borderWidth: 1.2,borderColor:'#7A7A7A', backgroundColor:'transparent'}}
					          listContainerStyle={{width: responsiveWidth(79),position:'relative', backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light',}}
					          data={localitys.length === 1 && comp(query, localitys[0].name) ? [] : localitys}
					          defaultValue={query}
										onEndEditing = {() => this.checkstreet()}
										onSubmitEditing = {() => this.checkstreet()}
					          onChangeText={text => this.setState({ query: text })}
					          placeholder={registration.streetDrop}
					          renderItem={({ name,id }) => (
					            <TouchableOpacity onPress={() => {this.setState({ query: name,street_id:id }); this.on_select_street(id);}}>

					              <Text>
					                {name}
					              </Text>
					            </TouchableOpacity>
					          )}
					        />
					        </View>
					   </View>

	                {!this.state.showApartmentDrop && <View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
	                				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor:'#46b07b'}}>
	                				    		<Ionicons name = "ios-home-outline" color = "#fff" size = {20} style = {{}}/>
	                						</View>
	                						<TextInput
	                				            value= {this.state.houseNameText}
	                				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(79) , backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light' }}
	                				            placeholder= {registration.housenamePlaceholder}
	                				            placeholderTextColor = "#000"
	                				            underlineColorAndroid = 'transparent'
	                				            onChangeText={e => this.housenameField(e)}
	                				            editable={true}
	                				            keyboardType = 'numeric'
	                				            secureTextEntry = {false}
	                				          />
	                					</View>
	                }
	                {this.state.showApartmentDrop && <View style = {{flexDirection: 'row', width: responsiveWidth(88), alignSelf:'center', height: responsiveHeight(6), marginTop: 10,}}>
	                	                {this.state.showApartmentDrop && <View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(69),backgroundColor:'transparent', borderRadius: 3, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
	                	                				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor:'#46b07b'}}>
	                	                				    		<Ionicons name = "ios-home-outline" color = "#fff" size = {20} style = {{}}/>
	                	                						</View>
	                	                		                <ModalDropdown
	                	                		                    style={{width: responsiveWidth(60), backgroundColor: 'transparent', height:responsiveHeight(6),borderRadius: 3}}
	                	                		                    textStyle={{fontFamily: 'Muli-Light', paddingLeft: 5, fontSize: responsiveFontSize(1.7), color:'#000', paddingTop: 10}}
	                	                		                    defaultValue={registration.apartmentDrop}
	                	                		                    dropdownStyle={{width: responsiveWidth(59),height: responsiveHeight(20.5), marginTop: 10, backgroundColor:'transparent', borderColor:'#7A7A7A'}}
	                	                		                    dropdownTextStyle={{color:'#000', fontSize: responsiveFontSize(1.7), fontFamily:'Muli-Light', paddingLeft:10,backgroundColor:'#fff'}}
	                	                		                    options = {this.state.apartmentName}
	                	                		                    //defaultIndex = {this.state.nameIndex}
	                	                		                    onSelect={(idx, value) => this.on_select_apartment(idx, value)} />
	                	                		            </View>

	                	                }
	                	                <View style = {{width: responsiveWidth(19), height: responsiveHeight(6), justifyContent: 'flex-end'}}><TouchableOpacity style = {{width: responsiveWidth(15), height: responsiveHeight(6), backgroundColor: '#46b07b', alignSelf: 'flex-end', borderRadius: 3, justifyContent:'center', alignItems:'center'}} onPress = {() => this.addApartmentPopupDialog.show()}>
	                						<Text style = {{color:'#fff', fontFamily:'Muli-ExtraBold', fontSize: responsiveFontSize(1.7), textAlign: 'center'}}>{registration.addApartment}</Text>
	                	                </TouchableOpacity></View>
	                	                </View>
	                }
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor:'#46b07b'}}>
				    		<FontAwesome name = "map-pin" color = "#fff" size = {15} style = {{}}/>
						</View>
						<TextInput
				            value= {this.state.pincodeText}
				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(79) , backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light'}}
				            placeholder= {registration.pincodePlaceholder}
				            placeholderTextColor = "#000"
				            underlineColorAndroid = 'transparent'
				            onChangeText={e => this.pincodeField(e)}
				            editable={true}
				            keyboardType = 'numeric'
				            secureTextEntry = {false}
				          />
					</View>
					{this.state.couponSuccess === true && <View style = {{width: responsiveWidth(88), alignSelf:'center', marginBottom: 5}}>
					    		        	<Text style = {{color:'green', fontFamily:'Muli-Bold', fontSize: responsiveFontSize(1.7)}}>Code added you got {this.state.codePoint}</Text>
					    		        </View>}
					 {this.state.couponError === true && <View style = {{width: responsiveWidth(88), alignSelf:'center', marginBottom: 5}}>
					    		        	<Text style = {{color:'red', fontFamily:'Muli-Bold', fontSize: responsiveFontSize(1.7)}}>Invalid Code</Text>
					    		        </View>}
					<View style = {{flexDirection: 'row', width: responsiveWidth(88), alignSelf:'center', height: responsiveHeight(6), marginTop: 17,}}>
						<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(69),backgroundColor:'transparent', borderRadius: 3, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
							<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor:'#46b07b'}}>
    				    		<MaterialIcons name = "local-offer" color = "#fff" size = {15} style = {{}}/>
    						</View>
    		                <TextInput
				            value= {this.state.couponCode}
				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(79) , backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light'}}
				            placeholder= {registration.couponCodePlaceholder}
				            placeholderTextColor = "#000"
				            underlineColorAndroid = 'transparent'
				            onChangeText={e => this.couponCodeField(e)}
				            editable={true}
				            maxLength = {6}
				            autoCapitalize = 'characters'

				            secureTextEntry = {false}
				          />
    		            </View>
    		            <View style = {{width: responsiveWidth(19), height: responsiveHeight(6), justifyContent: 'flex-end'}}><TouchableOpacity style = {{width: responsiveWidth(15), height: responsiveHeight(6), backgroundColor: '#46b07b', alignSelf: 'flex-end', borderRadius: 3, justifyContent:'center', alignItems:'center'}} onPress = {() => this.checkCoupon()}>
    						<Text style = {{color:'#fff', fontFamily:'Muli-ExtraBold', fontSize: responsiveFontSize(1.7), textAlign: 'center'}}>{registration.getCouponText}</Text>
    	                </TouchableOpacity></View>
    		        </View>
    		        <View style = {{width: responsiveWidth(88), alignSelf:'center', marginBottom: 5}}>
    		        	<Text style = {{color:'#000', fontFamily:'Muli-Light', fontSize: responsiveFontSize(1.7)}}>( For new users code is NEW200 ).</Text>
    		        </View>
					<TouchableOpacity onPress = {() => this.submitDetails()} style = {{width: responsiveWidth(88), height: responsiveHeight(6), backgroundColor:'#46b07b', alignSelf:'center', marginBottom:10, borderRadius: 3, justifyContent:'center', marginTop: 10}} >
						<Text style = {{color:'#fff', fontFamily:'Muli-ExtraBold', fontSize: responsiveFontSize(2.5), textAlign: 'center'}}>{registration.submitButtonText}</Text>
					</TouchableOpacity>
					</ScrollView>
				</View>
				<PopupDialog
            		ref={(popupDialog) => { this.popupDialog = popupDialog; }}
            		width = {responsiveWidth(85)}
            		height = {responsiveHeight(55)} >
            		<View style = {{width: responsiveWidth(85), height: responsiveHeight(40)}}>
            			<TouchableOpacity onPress = {() => this.popupDialog.dismiss()}  style = {{position: 'absolute',width: responsiveWidth(5), height: responsiveHeight(3), backgroundColor:'#46b07b', zIndex: 999, borderRadius: 100, top: 0, right: 0,alignItems:'center', justifyContent:'center'}}>
	            			<FontAwesome name = "close" color = '#fff' size ={13} />
            			</TouchableOpacity>
            			<View style = {{width: responsiveWidth(85), height:responsiveHeight(8),borderBottomWidth:2, borderColor:'#46b07b', alignItems:'center', justifyContent:'center'}} >
            				<Text style = {{color: '#46b07b', fontSize: responsiveFontSize(2.8), fontFamily:'Muli-ExtraBold'}} >{registration.popupSelectAvatarText}</Text>
            			</View>
            			<View style = {{flexDirection:'row', }}>
            				<TouchableOpacity onPress = {() => {
            					this.popupDialog.dismiss();
            					this.setState({avatarSource: "https://www.shareicon.net/data/2016/09/01/822711_user_512x512.png"})
            				}} style = {{width: responsiveWidth(22.5), height: responsiveHeight(13.5), borderRadius: 50, marginTop: 10, marginLeft: 15}} >
            					<Image source = {{uri : 'https://www.shareicon.net/data/2016/09/01/822711_user_512x512.png'}} style = {{width: responsiveWidth(22.5), height: responsiveHeight(13.3), borderRadius: 50}} />
            				</TouchableOpacity>
            				<TouchableOpacity onPress = {() => {
            					this.popupDialog.dismiss();
            					this.setState({avatarSource: "https://www.shareicon.net/download/2016/05/24/770116_people_512x512.png"})
            				}} style = {{width: responsiveWidth(22.5), height: responsiveHeight(13.5), borderRadius: 50, marginTop: 10, marginLeft: 15}} >
            					<Image source = {{uri : 'https://www.shareicon.net/download/2016/05/24/770116_people_512x512.png'}} style = {{width: responsiveWidth(22.5), height: responsiveHeight(13.3), borderRadius: 50}} />
            				</TouchableOpacity>
            				<TouchableOpacity onPress = {() => {
            					this.popupDialog.dismiss();
            					this.setState({avatarSource: "https://brooklyngamelab.com/wp-content/uploads/2016/12/man-2.png"})
            				}} style = {{width: responsiveWidth(22.5), height: responsiveHeight(13.5), borderRadius: 50, marginTop: 10, marginLeft: 15}} >
            					<Image source = {{uri : 'https://brooklyngamelab.com/wp-content/uploads/2016/12/man-2.png'}} style = {{width: responsiveWidth(22.5), height: responsiveHeight(13.3), borderRadius: 50}} />
            				</TouchableOpacity>
            			</View>
            			<View style = {{flexDirection:'row', }}>
            				<TouchableOpacity onPress = {() => {
            					this.popupDialog.dismiss();
            					this.setState({avatarSource: "https://www.hellomethod.co.uk/assets/templates/method/images/icon/user.png"})
            				}} style = {{width: responsiveWidth(22.5), height: responsiveHeight(13.5), borderRadius: 50, marginTop: 10, marginLeft: 15}} >
            					<Image source = {{uri : 'https://www.hellomethod.co.uk/assets/templates/method/images/icon/user.png'}} style = {{width: responsiveWidth(22.5), height: responsiveHeight(13.3), borderRadius: 50}} />
            				</TouchableOpacity>
            				<TouchableOpacity onPress = {() => {
            					this.popupDialog.dismiss();
            					this.setState({avatarSource: "https://inexus.eu/themes/resurrection/images/avatar/7.png"})
            				}} style = {{width: responsiveWidth(22.5), height: responsiveHeight(13.5), borderRadius: 50, marginTop: 10, marginLeft: 15}} >
            					<Image source = {{uri : 'https://inexus.eu/themes/resurrection/images/avatar/7.png'}} style = {{width: responsiveWidth(22.5), height: responsiveHeight(13.3), borderRadius: 50}} />
            				</TouchableOpacity>
            				<TouchableOpacity onPress = {() => {
            					this.popupDialog.dismiss();
            					this.setState({avatarSource: "https://www.shareicon.net/data/128x128/2016/05/24/770002_people_512x512.png"})
            				}} style = {{width: responsiveWidth(22.5), height: responsiveHeight(13.5), borderRadius: 50, marginTop: 10, marginLeft: 15}} >
            					<Image source = {{uri : 'https://www.shareicon.net/data/128x128/2016/05/24/770002_people_512x512.png'}} style = {{width: responsiveWidth(22.5), height: responsiveHeight(13.3), borderRadius: 50}} />
            				</TouchableOpacity>
            			</View>
            			<View style = {{flexDirection:'row', }}>
            				<TouchableOpacity onPress = {() => {
            					this.popupDialog.dismiss();
            					this.setState({avatarSource: "https://www.shareicon.net/data/128x128/2016/05/24/770122_people_512x512.png"})
            				}} style = {{width: responsiveWidth(22.5), height: responsiveHeight(13.5), borderRadius: 50, marginTop: 10, marginLeft: 15}} >
            					<Image source = {{uri : 'https://www.shareicon.net/data/128x128/2016/05/24/770122_people_512x512.png'}} style = {{width: responsiveWidth(22.5), height: responsiveHeight(13.3), borderRadius: 50}} />
            				</TouchableOpacity>
            				<TouchableOpacity onPress = {() => {
            					this.popupDialog.dismiss();
            					this.setState({avatarSource: "https://www.shareicon.net/data/128x128/2016/05/24/770130_people_512x512.png"})
            				}} style = {{width: responsiveWidth(22.5), height: responsiveHeight(13.5), borderRadius: 50, marginTop: 10, marginLeft: 15}} >
            					<Image source = {{uri : 'https://www.shareicon.net/data/128x128/2016/05/24/770130_people_512x512.png'}} style = {{width: responsiveWidth(22.5), height: responsiveHeight(13.3), borderRadius: 50}} />
            				</TouchableOpacity>
            			</View>
            		</View>
            	</PopupDialog>
            	<PopupDialog
            		ref={(popupDialog) => { this.addApartmentPopupDialog = popupDialog; }}
            		width = {responsiveWidth(85)}
            		height = {responsiveHeight(28)} >
            			<View style = {{width: responsiveWidth(85), height: responsiveHeight(40)}}>
            				<TouchableOpacity onPress = {() => this.addApartmentPopupDialog.dismiss()}  style = {{position: 'absolute',width: responsiveWidth(5), height: responsiveHeight(3), backgroundColor:'#46b07b', zIndex: 999, borderRadius: 50, top: 0, right: 0,alignItems:'center', justifyContent:'center'}}>
	            				<FontAwesome name = "close" color = '#fff' size ={13} />
            				</TouchableOpacity>
            				<View style = {{width: responsiveWidth(85), height:responsiveHeight(8),borderBottomWidth:2, borderColor:'#46b07b', alignItems:'center', justifyContent:'center'}} >
            					<Text style = {{color: '#46b07b', fontSize: responsiveFontSize(2.8), fontFamily:'Muli-ExtraBold'}} >{registration.popupAddApartmentText}</Text>
            				</View>
		            		<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(79),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
        				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor:'#46b07b'}}>
        				    		<Ionicons name = "ios-home-outline" color = "#fff" size = {20} style = {{}}/>
        						</View>
        						<TextInput
        				            value= {this.state.apartmentNameText}
        				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(70) , backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light' }}
        				            placeholder= {registration.apartmentNamePlaceholder}
        				            placeholderTextColor = "#000"
        				            underlineColorAndroid = 'transparent'
        				            onChangeText={e => this.apartmentNameField(e)}
        				            editable={true}
        				            secureTextEntry = {false}
        				          />
	                		</View>
	                		<TouchableOpacity style = {{width: responsiveWidth(50), alignSelf:'center', height: responsiveHeight(6), backgroundColor: '#46b07b', marginTop: 20, borderRadius: 3, alignItems:'center', justifyContent:'center'}} onPress = {() => this.addApartment()}>
	                			<Text style = {{color:'#fff', fontFamily:'Muli-ExtraBold', fontSize: responsiveFontSize(2.5), textAlign: 'center'}}>{registration.popupAddButtonText}</Text>
	                		</TouchableOpacity>
            			</View>
            	</PopupDialog>
			</View>
		);
	}
}
