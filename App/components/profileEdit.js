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
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import MenuComponent from '../utils/components/NavigationDrawer';
import Css from '../utils/Css/Style';
import NameInput from '../utils/components/InputField';
import ModalDropdown from 'react-native-modal-dropdown';
import PopupDialog from 'react-native-popup-dialog';
import url from '../utils/Api';
import { backAction } from '../utils/navigationAction';
import { profileEdit } from '../utils/internationalisation';
//import ImagePicker from 'react-native-image-picker';
import Autocomplete from 'react-native-autocomplete-input';
import { createStyles, maxWidth, minWidth } from 'react-native-media-queries';

var streetayyar = [];
var zonearray=[];
export default class ProfileEdit extends Component {
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
			addressData:'',
			zoneData:'',
			streetData:'',
			typeData:'',
			typeDrop:'',
			zoneDrop:'',
			streetDrop:'',
			socialPic: '',
			showApartmentDrop: false,
			apartment_Id: '',
			apartmentID: [],
			apartmentName:[],
			apartmentNameText: '',
			apartmentNameShowText: '',
			localitys: [],
      		query: '',
      		zones: [],
      		query2: '',
		}
	}

	componentWillMount(){
		this.getZone();
		this.getType();
		AsyncStorage.getItem('Profile_Image').then((value) => {
			var tmp = JSON.parse(value);
			if(tmp == null){
			}else{
				this.setState({
					socialPic: tmp
				})
			}
		})
		this.setState({
			userData: this.props.navigation.state.params.userData,
			addressData: this.props.navigation.state.params.addressData,
			zoneData: this.props.navigation.state.params.zoneData,
			streetData: this.props.navigation.state.params.streetData,
			typeData: this.props.navigation.state.params.typeData,
			usernameText: this.props.navigation.state.params.userData.username,
			firstnameText: this.props.navigation.state.params.userData.first_name,
			lastnameText: this.props.navigation.state.params.userData.last_name,
			avatarSource: this.props.navigation.state.params.userData.profile_pic,
			emailText: this.props.navigation.state.params.userData.email,
			contactText: this.props.navigation.state.params.userData.phone_no,
			houseNameText: this.props.navigation.state.params.addressData.house_name,
			pincodeText: this.props.navigation.state.params.addressData.pincode,
			typeDrop: this.props.navigation.state.params.typeData.name,
			zoneDrop: this.props.navigation.state.params.zoneData.name,
			streetDrop: this.props.navigation.state.params.streetData.name,
			type_id : this.props.navigation.state.params.typeData.id,
			zone_id : this.props.navigation.state.params.zoneData.id,
			street_id : this.props.navigation.state.params.streetData.id,
		})

		if(this.props.navigation.state.params.apartmentData == null){

		}else{
			this.on_select_type(this.props.navigation.state.params.typeData.id,this.props.navigation.state.params.typeData.name);
			this.setState({

				apartmentNameShowText: this.props.navigation.state.params.apartmentData.name,
				apartment_Id: this.props.navigation.state.params.apartmentData.id
			})
		}
	}

	getZone(){
		 fetch(url.main + "zone" + url.transform ).then(res => res.json()).then((json) => {
      	const { zone: zones } = json;
      	this.setState({ zones });
      //alert(JSON.stringify(this.state.zones));
    });
		/*fetch(url.main + "zone" + url.transform, {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).then((response) => response.json())
			.then((responseData) => {
				var zoneName = responseData.zone.map(function(zone){
			 	return (zone.name);
			 })
			 var zoneID = responseData.zone.map(function(zone) {
			 	return (zone.id)
			 })
			 this.setState({
			 	zoneName: zoneName,
			 	zoneID: zoneID
			 })
		}).done();*/
	}

	getStreet(id){

		  fetch(url.main + "street" + url.transform + url.filter + "zone_id,eq,"+ id).then(res => res.json()).then((json) => {
      	const { street: localitys } = json;
      	this.setState({ localitys });
     // alert(JSON.stringify(this.state.localitys));
    });
		/*fetch(url.main + "street" + url.transform + url.filter + "zone_id,eq,"+ id, {
					method: "GET",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}).then((response) => response.json())
				.then((responseData) => {
					var abc=responseData.street;
					abc.sort(function(a, b) {
    				var textA = a.name.toUpperCase();
   					 var textB = b.name.toUpperCase();
    					return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
					});
					//alert(JSON.stringify(responseData.street));
				 var streetName = responseData.street.map(function(street){
				 	return (street.name);
				 })
				 var streetID = responseData.street.map(function(street) {
				 	return (street.id)
				 })
				 this.setState({
				 	streetName: streetName,
				 	streetID: streetID
				 })
			}).done();*/
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
		// alert(JSON.stringify(localitys))
    const regex = new RegExp(`${query.trim()}`, 'i');
		//alert(JSON.stringify(regex))
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
					console.log(JSON.stringify(responseData))
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
		//alert(idx);
		this.setState({
			type_id: this.state.typeID[idx],
			typeDrop: value
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

	on_select_zone(idx, value){
		//alert(this.state.zoneID[idx]);
		this.setState({
			zone_id: this.state.zoneID[idx],
			zoneDrop: value
		})
		this.getStreet(this.state.zoneID[idx]);
	}

	select_street(){
		//alert(idx + value);
		this.getApartment(this.state.street_id);
	}

	on_select_street(idx, value){
		//alert(idx + value);
		this.setState({
			street_id: this.state.streetID[idx],
			streetDrop: value
		})
		this.getApartment(this.state.streetID[idx]);
	}

	on_select_apartment(idx, value){
		this.setState({
			apartment_Id: this.state.apartmentID[idx],
			apartmentNameShowText : value
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

	submitDetails(){
		var apartmentId, houseName;
		if(this.state.showApartmentDrop){
			apartmentID = this.state.apartment_Id;
			houseName = 0;
		}else{
			apartmentID = '';
			houseName = this.state.houseNameText;
		}
		fetch(url.main + "address/" + this.state.userData.address_id , {
			method: "PUT",
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
			this.createUser();
	}).done();
}

	createUser(){
		//var uuid = (this.state.zone_id).toString() + (this.state.street_id).toString() + (address_id).toString();
		//alert(uuid)
		//alert(this.state.userData.address_id)
		//alert(this.state.usernameText)
		fetch(url.main + "user/" + this.state.userData.id, {
			method: "PUT",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'username': this.state.usernameText,
				'first_name': this.state.firstnameText,
				'last_name': this.state.lastnameText,
				'email': this.state.emailText,
				'phone_no': this.state.contactText,
				'profile_pic': this.state.avatarSource,
			})
		}).then((response) => response.json())
		.then((responseData) => {
			if(responseData === null){
				Alert.alert("","profile update Failed");
			}else{
				//AsyncStorage.setItem("User", JSON.stringify(responseData));
				Alert.alert('','Profile Updated!')
				this.props.navigation.navigate("profile");
			}
			//alert(JSON.stringify(responseData));
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
						<TouchableOpacity onPress = {() => this.props.navigation.navigate('profile')}>
							<Feather name = 'arrow-left' color = "#fff" size = {20}/>
						</TouchableOpacity>
					</View>
					<View style = {{width: responsiveWidth(70), alignItems:'center', justifyContent:'center'}}>
						<Text style ={Css.header_main_text}>{profileEdit.headerTitle}</Text>
					</View>
				</View>
				<View style = {{flex:1}} >
					<ScrollView>
					<View style = {{alignItems:'center', marginTop: 15}} >
						<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(3), fontFamily:'Muli-ExtraBold'}}>{profileEdit.mainHeading}</Text>
					</View>
					<TouchableOpacity onPress = {() => this.popupDialog.show() } style = {{borderRadius: 100, alignSelf:'center', marginTop: 10}} >
						{
							this.state.avatarSource === null ? <View style = {{width: responsiveWidth(30.5),height:responsiveHeight(17.5),borderRadius: 100, backgroundColor:'#fff', marginTop: 9,alignSelf:'center'}} ><Image source = {require('../../public/user.png')} style = {Styles1.ProfileImage} /></View> :
							<Image source = {{uri: this.state.avatarSource}} style = {Styles1.ProfileImage} />
						}
					</TouchableOpacity>
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 20, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor: '#46b07b'}}>
				    		<EvilIcons name = "user" color = "#fff" size = {22} style = {{}}/>
						</View>
						<TextInput
				            value= {this.state.usernameText}
				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(79) , backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light', }}
				            placeholder= {profileEdit.usernamePlaceholder}
				            placeholderTextColor = "#000"
				            underlineColorAndroid = 'transparent'
				            onChangeText={e => this.usernameField(e)}
				            editable={true}
				            secureTextEntry = {false}
				          />
					</View>
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor: '#46b07b'}}>
				    		<Feather name = "user" color = "#fff" size = {15} style = {{}}/>
						</View>
						<TextInput
				            value= {this.state.firstnameText}
				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(79) , backgroundColor:'transparent', borderRadius: 3,  fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light' }}
				            placeholder= {profileEdit.firstnamePlaceholder}
				            placeholderTextColor = "#000"
				            underlineColorAndroid = 'transparent'
				            onChangeText={e => this.firstNameField(e)}
				            editable={true}
				            secureTextEntry = {false}
				          />
					</View>
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor: '#46b07b'}}>
				    		<Feather name = "users" color = "#fff" size = {15} style = {{}}/>
						</View>
						<TextInput
				            value= {this.state.lastnameText}
				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(79) , backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light' }}
				            placeholder= {profileEdit.lastnamePlaceholder}
				            placeholderTextColor = "#000"
				            underlineColorAndroid = 'transparent'
				            onChangeText={e => this.lastNameField(e)}
				            editable={true}
				            secureTextEntry = {false}
				          />
					</View>
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor: '#46b07b'}}>
				    		<Ionicons name = "ios-mail-outline" color = "#fff" size = {20} style = {{}}/>
						</View>
						<TextInput
				            value= {this.state.emailText}
				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(79) , backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light',}}
				            placeholder= {profileEdit.emailPlaceholder}
				            placeholderTextColor = "#000"
				            underlineColorAndroid = 'transparent'
				            onChangeText={e => this.emailField(e)}
				            editable={true}
				            secureTextEntry = {false}
				          />
					</View>
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor: '#46b07b'}}>
				    		<Ionicons name = "ios-phone-portrait-outline" color = "#fff" size = {20} style = {{}}/>
						</View>
						<TextInput
				            value= {this.state.contactText}
				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(79) , backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light'}}
				            placeholder= {profileEdit.contactPlaceholder}
				            placeholderTextColor = "#000"
				            underlineColorAndroid = 'transparent'
				            onChangeText={e => this.contactField(e)}
				            editable={true}
				            secureTextEntry = {false}
				          />
					</View>
					<View style = {{width: responsiveWidth(88), alignSelf:'center', marginTop: 15}} >
						<Text style = {{color:'#46b07b', fontFamily:'Muli-ExtraBold', fontSize: responsiveFontSize(2.5)}} > {profileEdit.addressHeading} </Text>
					</View>
					<View style = {{marginTop:10, alignSelf: 'center', flexDirection:'row', width: responsiveWidth(88)}}>
						<Text style = {{color:"#46b07b", fontSize: responsiveFontSize(2), fontFamily:"Muli-ExtraBold"}} >{profileEdit.typeHeading} : </Text>
						<Text style = {{color:"#7A7A7A", fontSize: responsiveFontSize(2), fontFamily:"Muli-Light"}} >{this.state.typeDrop}</Text>
					</View>
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor: '#46b07b'}}>
				    		<SimpleLineIcons name = "home" color = "#fff" size = {15} style = {{}}/>
						</View>
						<ModalDropdown
		                    style={{ width: responsiveWidth(79), backgroundColor: 'transparent', height:responsiveHeight(6),borderRadius: 3}}
		                    textStyle={{fontFamily: 'Muli-Light', paddingLeft: 5, fontSize: responsiveFontSize(1.7), color:'#000', paddingTop: 10,}}
		                    defaultValue={profileEdit.typeDrop}
		                     dropdownStyle={{width: responsiveWidth(79),height: responsiveHeight(20.5), marginTop: 10, backgroundColor:'transparent', borderColor:'#7A7A7A'}}
		                    dropdownTextStyle={{color:'#000', fontSize: responsiveFontSize(1.7), fontFamily:'Muli-Light', paddingLeft:10,backgroundColor:'#fff'}}
		                    options = {this.state.typeName}
		                    //defaultIndex = {this.state.nameIndex}
		                    onSelect={(idx, value) => this.on_select_type(idx, value)} />
		            </View>
	                <View style = {{marginTop:10, alignSelf: 'center', flexDirection:'row', width: responsiveWidth(88)}}>
						<Text style = {{color:"#46b07b", fontSize: responsiveFontSize(2), fontFamily:"Muli-ExtraBold"}} >{profileEdit.zoneHeading} : </Text>
						<Text style = {{color:"#7A7A7A", fontSize: responsiveFontSize(2), fontFamily:"Muli-Light"}} >{this.state.zoneDrop}</Text>
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
					          placeholder={profileEdit.zoneDrop}
					          renderItem={({ name,id }) => (
					            <TouchableOpacity onPress={() => {this.setState({ query2: name,zone_id:id }); this.getStreet(id);}}>

					              <Text>
					                {name}
					              </Text>
					            </TouchableOpacity>
					          )}
					        />
					        </View>
					   </View>
	                <View style = {{marginTop:10, alignSelf: 'center', flexDirection:'row', width: responsiveWidth(88)}}>
						<Text style = {{color:"#46b07b", fontSize: responsiveFontSize(2), fontFamily:"Muli-ExtraBold"}} >{profileEdit.streetHeading} : </Text>
						<Text style = {{color:"#7A7A7A", fontSize: responsiveFontSize(2), fontFamily:"Muli-Light"}} >{this.state.streetDrop}</Text>
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
					          containerStyle={{width: responsiveWidth(79),position:'absolute',zIndex:1,fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light'}}
					          inputContainerStyle={{height: responsiveHeight(7.2),borderRadius: 3,borderWidth: 1.2,borderColor:'#7A7A7A'}}
					          listContainerStyle={{width: responsiveWidth(79),position:'relative', backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light',}}
					          data={localitys.length === 1 && comp(query, localitys[0].name) ? [] : localitys}
					          defaultValue={query}
										onEndEditing = {() => this.checkstreet()}
										onSubmitEditing = {() => this.checkstreet()}
					          onChangeText={text => this.setState({ query: text })}
					          placeholder={profileEdit.streetDrop}
					          renderItem={({ name,id }) => (
					            <TouchableOpacity onPress={() => {this.setState({ query: name,street_id:id }); this.select_street(id)}}>

					              <Text>
					                {name}
					              </Text>
					            </TouchableOpacity>
					          )}
					        />
					        </View>
					   </View>
		            {this.state.showApartmentDrop && <View style = {{marginTop:10, alignSelf: 'center', flexDirection:'row', width: responsiveWidth(88)}}>
		            						<Text style = {{color:"#46b07b", fontSize: responsiveFontSize(2), fontFamily:"Muli-ExtraBold"}} >{profileEdit.apartmentHeading} : </Text>
		            						<Text style = {{color:"#7A7A7A", fontSize: responsiveFontSize(2), fontFamily:"Muli-Light"}} >{this.state.apartmentNameShowText}</Text>
		            					</View>
		            }
	                {!this.state.showApartmentDrop && <View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
	                				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor: '#46b07b'}}>
	                				    		<Ionicons name = "ios-home-outline" color = "#fff" size = {20} style = {{}}/>
	                						</View>
	                						<TextInput
	                				            value= {this.state.houseNameText}
	                				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(79) , backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light' }}
	                				            placeholder= {profileEdit.housenamePlaceholder}
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
    		                    defaultValue={profileEdit.apartmentDrop}
    		                    dropdownStyle={{width: responsiveWidth(60),height: responsiveHeight(20.5), marginTop: 10, backgroundColor:'transparent', borderColor:'#7A7A7A'}}
    		                    dropdownTextStyle={{color:'#000', fontSize: responsiveFontSize(1.7), fontFamily:'Muli-Light', paddingLeft:10,backgroundColor:'#fff'}}
    		                    options = {this.state.apartmentName}
    		                    //defaultIndex = {this.state.nameIndex}
    		                    onSelect={(idx, value) => this.on_select_apartment(idx, value)} />
    		            	</View>

    	                }
    	                <View style = {{width: responsiveWidth(19), height: responsiveHeight(6), justifyContent: 'flex-end'}}><TouchableOpacity style = {{width: responsiveWidth(15), height: responsiveHeight(6), backgroundColor: '#46b07b', alignSelf: 'flex-end', borderRadius: 3, justifyContent:'center', alignItems:'center'}} onPress = {() => this.addApartmentPopupDialog.show()}>
    						<Text style = {{color:'#fff', fontFamily:'Muli-ExtraBold', fontSize: responsiveFontSize(1.7), textAlign: 'center'}}>{profileEdit.addApartment}</Text>
    	                </TouchableOpacity></View>
    	                </View>
	                }
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor: '#46b07b'}}>
				    		<FontAwesome name = "map-pin" color = "#fff" size = {15} style = {{}}/>
						</View>
						<TextInput
				            value= {this.state.pincodeText}
				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(79) , backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light'}}
				            placeholder= {profileEdit.pincodePlaceholder}
				            placeholderTextColor = "#000"
				            underlineColorAndroid = 'transparent'
				            onChangeText={e => this.pincodeField(e)}
				            editable={true}
				            secureTextEntry = {false}
				          />
					</View>
					<TouchableOpacity onPress = {() => this.submitDetails()} style = {{width: responsiveWidth(88), height: responsiveHeight(6), backgroundColor:'#46b07b', alignSelf:'center', marginBottom:10, borderRadius: 3, justifyContent:'center', marginTop: 10}} >
						<Text style = {{color:'#fff', fontFamily:'Muli-ExtraBold', fontSize: responsiveFontSize(2.5), textAlign: 'center'}}>{profileEdit.submitButtonText}</Text>
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
            				<Text style = {{color: '#46b07b', fontSize: responsiveFontSize(2.8), fontFamily:'Muli-ExtraBold'}} >{profileEdit.popupSelectAvatarText}</Text>
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
            				{this.state.socialPic != '' && <TouchableOpacity onPress = {() => {
            				            					this.popupDialog.dismiss();
            				            					this.setState({avatarSource: this.state.socialPic})
            				            				}} style = {{width: responsiveWidth(22.5), height: responsiveHeight(13.5), borderRadius: 50, marginTop: 10, marginLeft: 15}} >
            				            					<Image source = {{uri : this.state.socialPic}} style = {{width: responsiveWidth(22.5), height: responsiveHeight(13.3), borderRadius: 50}} />
            				            				</TouchableOpacity>}
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
            					<Text style = {{color: '#46b07b', fontSize: responsiveFontSize(2.8), fontFamily:'Muli-ExtraBold'}} >{profileEdit.popupAddApartmentText}</Text>
            				</View>
		            		<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(79),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
        				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor:'#46b07b'}}>
        				    		<Ionicons name = "ios-home-outline" color = "#fff" size = {20} style = {{}}/>
        						</View>
        						<TextInput
        				            value= {this.state.apartmentNameText}
        				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(70) , backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light' }}
        				            placeholder= {profileEdit.apartmentNamePlaceholder}
        				            placeholderTextColor = "#000"
        				            underlineColorAndroid = 'transparent'
        				            onChangeText={e => this.apartmentNameField(e)}
        				            editable={true}
        				            secureTextEntry = {false}
        				          />
	                		</View>
	                		<TouchableOpacity style = {{width: responsiveWidth(50), alignSelf:'center', height: responsiveHeight(6), backgroundColor: '#46b07b', marginTop: 20, borderRadius: 3, alignItems:'center', justifyContent:'center'}} onPress = {() => this.addApartment()}>
	                			<Text style = {{color:'#fff', fontFamily:'Muli-ExtraBold', fontSize: responsiveFontSize(2.5), textAlign: 'center'}}>{profileEdit.popupAddButtonText}</Text>
	                		</TouchableOpacity>
            			</View>
            	</PopupDialog>
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


/*<View style = {{flex:1}} >
					<ScrollView>
					<View style = {{alignItems:'center', marginTop: 15}} >
						<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(3), fontFamily:'Muli-ExtraBold'}}>{profileEdit.mainHeading}</Text>
					</View>
					<TouchableOpacity onPress = {() => this.popupDialog.show() } style = {{width: responsiveWidth(30.5),height:responsiveHeight(19.5),borderRadius: 100, alignSelf:'center'}} >
						{
							this.state.avatarSource === null ? <View style = {{width: responsiveWidth(30.5),height:responsiveHeight(17.5),borderRadius: 100, backgroundColor:'#fff', marginTop: 9,alignSelf:'center'}} ><Image source = {require('../../public/user.png')} style = {{width: responsiveWidth(30.5),height:responsiveHeight(17.5),alignSelf:'center'}} /></View> :
							<Image source = {{uri: this.state.avatarSource}} style = {{width: responsiveWidth(30.5),height:responsiveHeight(17.5),marginTop:9,alignSelf:'center', borderRadius: 70}} />
						}
					</TouchableOpacity>
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 20, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor: '#46b07b'}}>
				    		<EvilIcons name = "user" color = "#fff" size = {22} style = {{}}/>
						</View>
						<TextInput
				            value= {this.state.usernameText}
				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(79) , backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light', }}
				            placeholder= {profileEdit.usernamePlaceholder}
				            placeholderTextColor = "#000"
				            underlineColorAndroid = 'transparent'
				            onChangeText={e => this.usernameField(e)}
				            editable={true}
				            secureTextEntry = {false}
				          />
					</View>
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor: '#46b07b'}}>
				    		<Feather name = "user" color = "#fff" size = {15} style = {{}}/>
						</View>
						<TextInput
				            value= {this.state.firstnameText}
				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(79) , backgroundColor:'transparent', borderRadius: 3,  fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light' }}
				            placeholder= {profileEdit.firstnamePlaceholder}
				            placeholderTextColor = "#000"
				            underlineColorAndroid = 'transparent'
				            onChangeText={e => this.firstNameField(e)}
				            editable={true}
				            secureTextEntry = {false}
				          />
					</View>
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor: '#46b07b'}}>
				    		<Feather name = "users" color = "#fff" size = {15} style = {{}}/>
						</View>
						<TextInput
				            value= {this.state.lastnameText}
				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(79) , backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light' }}
				            placeholder= {profileEdit.lastnamePlaceholder}
				            placeholderTextColor = "#000"
				            underlineColorAndroid = 'transparent'
				            onChangeText={e => this.lastNameField(e)}
				            editable={true}
				            secureTextEntry = {false}
				          />
					</View>
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor: '#46b07b'}}>
				    		<Ionicons name = "ios-mail-outline" color = "#fff" size = {20} style = {{}}/>
						</View>
						<TextInput
				            value= {this.state.emailText}
				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(79) , backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light',}}
				            placeholder= {profileEdit.emailPlaceholder}
				            placeholderTextColor = "#000"
				            underlineColorAndroid = 'transparent'
				            onChangeText={e => this.emailField(e)}
				            editable={true}
				            secureTextEntry = {false}
				          />
					</View>
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor: '#46b07b'}}>
				    		<Ionicons name = "ios-phone-portrait-outline" color = "#fff" size = {20} style = {{}}/>
						</View>
						<TextInput
				            value= {this.state.contactText}
				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(79) , backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light'}}
				            placeholder= {profileEdit.contactPlaceholder}
				            placeholderTextColor = "#000"
				            underlineColorAndroid = 'transparent'
				            onChangeText={e => this.contactField(e)}
				            editable={true}
				            secureTextEntry = {false}
				          />
					</View>
					<View style = {{width: responsiveWidth(88), alignSelf:'center', marginTop: 15}} >
						<Text style = {{color:'#46b07b', fontFamily:'Muli-ExtraBold', fontSize: responsiveFontSize(2.5)}} > {profileEdit.addressHeading} </Text>
					</View>
					<View style = {{marginTop:10, alignSelf: 'center', flexDirection:'row', width: responsiveWidth(88)}}>
						<Text style = {{color:"#46b07b", fontSize: responsiveFontSize(2), fontFamily:"Muli-ExtraBold"}} >{profileEdit.typeHeading} : </Text>
						<Text style = {{color:"#7A7A7A", fontSize: responsiveFontSize(2), fontFamily:"Muli-Light"}} >{this.state.typeDrop}</Text>
					</View>
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor: '#46b07b'}}>
				    		<SimpleLineIcons name = "home" color = "#fff" size = {15} style = {{}}/>
						</View>
						<ModalDropdown
		                    style={{ width: responsiveWidth(79), backgroundColor: 'transparent', height:responsiveHeight(6),borderRadius: 3}}
		                    textStyle={{fontFamily: 'Muli-Light', paddingLeft: 5, fontSize: responsiveFontSize(1.7), color:'#000', paddingTop: 10,}}
		                    defaultValue={profileEdit.typeDrop}
		                     dropdownStyle={{width: responsiveWidth(79),height: responsiveHeight(20.5), marginTop: 10, backgroundColor:'transparent', borderColor:'#7A7A7A'}}
		                    dropdownTextStyle={{color:'#000', fontSize: responsiveFontSize(1.7), fontFamily:'Muli-Light', paddingLeft:10,backgroundColor:'#fff'}}
		                    options = {this.state.typeName}
		                    //defaultIndex = {this.state.nameIndex}
		                    onSelect={(idx, value) => this.on_select_type(idx, value)} />
		            </View>
	                <View style = {{marginTop:10, alignSelf: 'center', flexDirection:'row', width: responsiveWidth(88)}}>
						<Text style = {{color:"#46b07b", fontSize: responsiveFontSize(2), fontFamily:"Muli-ExtraBold"}} >{profileEdit.zoneHeading} : </Text>
						<Text style = {{color:"#7A7A7A", fontSize: responsiveFontSize(2), fontFamily:"Muli-Light"}} >{this.state.zoneDrop}</Text>
					</View>
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor: '#46b07b'}}>
				    		<Feather name = "map-pin" color = "#fff" size = {15} style = {{}}/>
						</View>
	                    <ModalDropdown
		                    style={{width: responsiveWidth(79), backgroundColor: 'transparent', height:responsiveHeight(6),borderRadius: 3}}
		                    textStyle={{fontFamily: 'Muli-Light', paddingLeft: 5, fontSize: responsiveFontSize(1.7), color:'#000', paddingTop: 10,}}
		                    defaultValue={profileEdit.zoneDrop}
		                    dropdownStyle={{width: responsiveWidth(79),height: responsiveHeight(20.5), marginTop: 10, backgroundColor:'transparent'}}
		                    dropdownTextStyle={{color:'#000', fontSize: responsiveFontSize(1.7), fontFamily:'Muli-Light', paddingLeft:10,backgroundColor:'#fff'}}
		                    options = {this.state.zoneName}
		                    //defaultIndex = {this.state.nameIndex}
		                    onSelect={(idx, value) => this.on_select_zone(idx, value)} />
		            </View>
	                <View style = {{marginTop:10, alignSelf: 'center', flexDirection:'row', width: responsiveWidth(88)}}>
						<Text style = {{color:"#46b07b", fontSize: responsiveFontSize(2), fontFamily:"Muli-ExtraBold"}} >{profileEdit.streetHeading} : </Text>
						<Text style = {{color:"#7A7A7A", fontSize: responsiveFontSize(2), fontFamily:"Muli-Light"}} >{this.state.streetDrop}</Text>
					</View>
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor: '#46b07b'}}>
				    		<Entypo name = "address" color = "#fff" size = {15} style = {{}}/>
						</View>
		                <ModalDropdown
		                    style={{width: responsiveWidth(79), backgroundColor: 'transparent', height:responsiveHeight(6),borderRadius: 3}}
		                    textStyle={{fontFamily: 'Muli-Light', paddingLeft: 5, fontSize: responsiveFontSize(1.7), color:'#000', paddingTop: 10}}
		                    defaultValue={profileEdit.streetDrop}
		                    dropdownStyle={{width: responsiveWidth(79),height: responsiveHeight(20.5), marginTop: 10, backgroundColor:'transparent', borderColor:'#7A7A7A'}}
		                    dropdownTextStyle={{color:'#000', fontSize: responsiveFontSize(1.7), fontFamily:'Muli-Light', paddingLeft:10,backgroundColor:'#fff'}}
		                    options = {this.state.streetName}
		                    //defaultIndex = {this.state.nameIndex}
		                    onSelect={(idx, value) => this.on_select_street(idx, value)} />
		            </View>
		            {this.state.apartmentNameShowText && <View style = {{marginTop:10, alignSelf: 'center', flexDirection:'row', width: responsiveWidth(88)}}>
		            						<Text style = {{color:"#46b07b", fontSize: responsiveFontSize(2), fontFamily:"Muli-ExtraBold"}} >{profileEdit.apartmentHeading} : </Text>
		            						<Text style = {{color:"#7A7A7A", fontSize: responsiveFontSize(2), fontFamily:"Muli-Light"}} >{this.state.apartmentNameShowText}</Text>
		            					</View>
		            }
	                {!this.state.apartmentNameShowText && <View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
	                				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor: '#46b07b'}}>
	                				    		<Ionicons name = "ios-home-outline" color = "#fff" size = {20} style = {{}}/>
	                						</View>
	                						<TextInput
	                				            value= {this.state.houseNameText}
	                				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(79) , backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light' }}
	                				            placeholder= {profileEdit.housenamePlaceholder}
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
    		                    defaultValue={profileEdit.apartmentDrop}
    		                    dropdownStyle={{width: responsiveWidth(60),height: responsiveHeight(20.5), marginTop: 10, backgroundColor:'transparent', borderColor:'#7A7A7A'}}
    		                    dropdownTextStyle={{color:'#000', fontSize: responsiveFontSize(1.7), fontFamily:'Muli-Light', paddingLeft:10,backgroundColor:'#fff'}}
    		                    options = {this.state.apartmentName}
    		                    //defaultIndex = {this.state.nameIndex}
    		                    onSelect={(idx, value) => this.on_select_apartment(idx, value)} />
    		            	</View>

    	                }
    	                <View style = {{width: responsiveWidth(19), height: responsiveHeight(6), justifyContent: 'flex-end'}}><TouchableOpacity style = {{width: responsiveWidth(15), height: responsiveHeight(6), backgroundColor: '#46b07b', alignSelf: 'flex-end', borderRadius: 3, justifyContent:'center', alignItems:'center'}} onPress = {() => this.addApartmentPopupDialog.show()}>
    						<Text style = {{color:'#fff', fontFamily:'Muli-ExtraBold', fontSize: responsiveFontSize(1.7), textAlign: 'center'}}>{profileEdit.addApartment}</Text>
    	                </TouchableOpacity></View>
    	                </View>
	                }
					<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(88),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor: '#46b07b'}}>
				    		<FontAwesome name = "map-pin" color = "#fff" size = {15} style = {{}}/>
						</View>
						<TextInput
				            value= {this.state.pincodeText}
				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(79) , backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light'}}
				            placeholder= {profileEdit.pincodePlaceholder}
				            placeholderTextColor = "#000"
				            underlineColorAndroid = 'transparent'
				            onChangeText={e => this.pincodeField(e)}
				            editable={true}
				            secureTextEntry = {false}
				          />
					</View>
					<TouchableOpacity onPress = {() => this.submitDetails()} style = {{width: responsiveWidth(88), height: responsiveHeight(6), backgroundColor:'#46b07b', alignSelf:'center', marginBottom:10, borderRadius: 3, justifyContent:'center', marginTop: 10}} >
						<Text style = {{color:'#fff', fontFamily:'Muli-ExtraBold', fontSize: responsiveFontSize(2.5), textAlign: 'center'}}>{profileEdit.submitButtonText}</Text>
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
            				<Text style = {{color: '#46b07b', fontSize: responsiveFontSize(2.8), fontFamily:'Muli-ExtraBold'}} >{profileEdit.popupSelectAvatarText}</Text>
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
            				{this.state.socialPic != '' && <TouchableOpacity onPress = {() => {
            				            					this.popupDialog.dismiss();
            				            					this.setState({avatarSource: this.state.socialPic})
            				            				}} style = {{width: responsiveWidth(22.5), height: responsiveHeight(13.5), borderRadius: 50, marginTop: 10, marginLeft: 15}} >
            				            					<Image source = {{uri : this.state.socialPic}} style = {{width: responsiveWidth(22.5), height: responsiveHeight(13.3), borderRadius: 50}} />
            				            				</TouchableOpacity>}
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
            					<Text style = {{color: '#46b07b', fontSize: responsiveFontSize(2.8), fontFamily:'Muli-ExtraBold'}} >{profileEdit.popupAddApartmentText}</Text>
            				</View>
		            		<View style = {{flexDirection:'row',height: responsiveHeight(6), width: responsiveWidth(79),backgroundColor:'transparent', borderRadius: 3,marginTop: 10, alignSelf:'center', borderWidth: 1, borderColor:'#7A7A7A' }} >
        				    	<View style = {{width: responsiveWidth(9), justifyContent:'center', alignItems:'center', backgroundColor:'#46b07b'}}>
        				    		<Ionicons name = "ios-home-outline" color = "#fff" size = {20} style = {{}}/>
        						</View>
        						<TextInput
        				            value= {this.state.apartmentNameText}
        				            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(70) , backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light' }}
        				            placeholder= {profileEdit.apartmentNamePlaceholder}
        				            placeholderTextColor = "#000"
        				            underlineColorAndroid = 'transparent'
        				            onChangeText={e => this.apartmentNameField(e)}
        				            editable={true}
        				            secureTextEntry = {false}
        				          />
	                		</View>
	                		<TouchableOpacity style = {{width: responsiveWidth(50), alignSelf:'center', height: responsiveHeight(6), backgroundColor: '#46b07b', marginTop: 20, borderRadius: 3, alignItems:'center', justifyContent:'center'}} onPress = {() => this.addApartment()}>
	                			<Text style = {{color:'#fff', fontFamily:'Muli-ExtraBold', fontSize: responsiveFontSize(2.5), textAlign: 'center'}}>{profileEdit.popupAddButtonText}</Text>
	                		</TouchableOpacity>
            			</View>
            	</PopupDialog>*/
