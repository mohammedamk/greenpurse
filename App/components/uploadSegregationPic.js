import React, { Component } from 'react';
import {
	View,
	Text,
	StatusBar,
	TouchableOpacity, 
	StyleSheet,
	AsyncStorage,
	ListView,
	Alert,
	BackHandler,
	Image,
	TextInput,
	ScrollView
} from 'react-native';

import { header } from '../utils/navigationHeader';
import Drawer from 'react-native-drawer';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import MenuComponent from '../utils/components/NavigationDrawer';
import Css from '../utils/Css/Style';
import PopupDialog from 'react-native-popup-dialog';
import url from '../utils/Api';
import moment from 'moment'; 
import { uploadSegregationPic } from '../utils/internationalisation';
import ImagePicker from 'react-native-image-picker';

export default class UploadSegregationPic extends Component{
	static navigationOptions = {
   		 header: false,
       	 drawerLabel: "Upload Segregation Pic",
 	};

 	state = {
		image1Uri : '',
		image2Uri : '',
		image1Ext : '',
		image2Ext : '',
		image1Data : '',
		image2Data : '',
		image1FileName : '',
		image2FileName : '',
		image1Upload: false,
		image2Upload: false,
		image1Loading: false,
		image2Loading: false,
	}

 	selectWetImage() {
		const options = {
			quality: 1.0,
			maxWidth: 500,
			maxHeight: 500,
			chooseFromLibraryButtonTitle: '',
			storageOptions: {
				skipBackup: true
			}
		};

		ImagePicker.launchCamera(options, (response) => {
			console.log('Response = ', response);

			if (response.didCancel) {
				console.log('User cancelled image picker');
			}
			else if (response.error) {
				console.log('Image Picker Error: ', response.error);
			}
			else if (response.customButton) {
				console.log('User Tapped Cutom Button: ', response.customButton);
			}
			else {
				let fileName = response.fileName
				let ext = response.type
				let chartdata = response.data
		        let source =   response.uri;
		        let ImageUri = {uri: response.uri}

        		//console.log("File Name:-"+response.type);

				this.setState({
					image1FileName: fileName,
					image1Data: chartdata,
					image1Ext: ext,
		            image1Uri: source,
		        });
			}
		});
	}

	selectDryImage() {
		const options = {
			quality: 1.0,
			maxWidth: 500,
			maxHeight: 500,
			chooseFromLibraryButtonTitle: '',
			storageOptions: {
				skipBackup: true
			}
		};

		ImagePicker.launchCamera(options, (response) => {
			console.log('Response = ', response);

			if (response.didCancel) {
				console.log('User cancelled image picker');
			}
			else if (response.error) {
				console.log('Image Picker Error: ', response.error);
			}
			else if (response.customButton) {
				console.log('User Tapped Cutom Button: ', response.customButton);
			}
			else {
				let fileName = response.fileName
				let ext = response.type
				let chartdata = response.data
		        let source =   response.uri;
		        let ImageUri = {uri: response.uri}

        		//console.log("File Name:-"+response.type);

				this.setState({
					image2FileName: fileName,
					image2Data: chartdata,
					image2Ext: ext,
		            image2Uri: source,
				});   
			}
		});
	}

	
	submit(){
		var formData = new FormData();
		formData.append("userid", this.props.navigation.state.params.userData);
		if(this.state.image1Uri != ''){	
			formData.append("wet", {uri:this.state.image1Uri, type: this.state.image1Ext, name: this.state.image1FileName});
		}
		if(this.state.image2Uri != ''){
			formData.append("dry", {uri:this.state.image2Uri, type: this.state.image2Ext, name: this.state.image2FileName});
		}

		if(this.state.image1Uri != ''){
			//alert(JSON.stringify(formData))
			fetch(url.other + "upload_segrigate_image" , {
				method: "POST",
				header: {
					"content-type" : "multipart/form-data"
				},
				body: formData
			}).then((response) => response.json())
			.then((responseData) => {
				//alert(JSON.stringify(responseData));
				if(responseData.code == 200){
					Alert.alert('', 'Congratulations you have earned 50 points today!');
					this.props.navigation.navigate('updatesegregation')
				}else{
					Alert.alert('',responseData.status);
				}
			}).done();
		}else{
			Alert.alert('', "Wet Image is not selected!");
		}
	}

 	render(){
 		return(
 			<View style={{flex:1, backgroundColor:'#eee'}}>
				<View style={Css.header_main}>
					<View style = {Css.header_menu_view}>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('updatesegregation')}>
							<Feather name = 'arrow-left' color = "#fff" size = {20}/>
						</TouchableOpacity>
					</View>
					<View style = {Css.header_main_text_view}>
						<Text style ={Css.header_main_text}>{uploadSegregationPic.headerTitle}</Text>
					</View>
				</View>
				<View style = {{flex: 1, flexDirection: 'column'}} >
					<ScrollView>
						<View style = {{alignItems:'center', marginTop: 15}} >
							<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(3), fontFamily:'Muli-ExtraBold'}}>{uploadSegregationPic.mainHeading}</Text>
						</View>
						<View style = {{height: responsiveHeight(8), alignItems:'center', justifyContent:'center', width: responsiveWidth(88), alignSelf: 'center'}}>
							<Text style = {{fontSize: responsiveFontSize(2), fontFamily: 'Muli-Regular', color:'black' }}>Please upload the picture of your dry and wet garbage bag/bin to earn 50 points today.</Text>
						</View>
						<View style = {{marginTop: 20, alignSelf:'center', flexDirection:'row'}}>
							<TextInput
					            value= {this.state.image1Uri}
					            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(88) , backgroundColor:'transparent', borderRadius: 3, paddingLeft: 15, fontSize: responsiveFontSize(1.8), fontFamily: 'Muli-Light', borderWidth: 1, borderColor:'#7A7A7A' }}
					            placeholder= {uploadSegregationPic.image1Placeholder}
					            placeholderTextColor = "#000"
					            underlineColorAndroid = 'transparent'
					            editable={false}
					            secureTextEntry = {false}
					          />       
							</View>
						<TouchableOpacity onPress = {() => this.selectWetImage()} style = {{height: responsiveHeight(6), width: responsiveWidth(88), borderRadius: 3, backgroundColor:"#46b07b", justifyContent:'center', alignItems:'center', alignSelf:'center', marginTop: 10}} >
							<Text style = {{color:'#fff', fontSize: responsiveFontSize(2.6), fontFamily:'Muli-ExtraBold'}} >{uploadSegregationPic.browseButtonText}</Text>
						</TouchableOpacity>
						<View style = {{marginTop: 20, alignSelf:'center', flexDirection:'row'}}>
							<TextInput
					            value= {this.state.image2Uri}
					            style={{ color: '#000', height: responsiveHeight(6), width: responsiveWidth(88) , backgroundColor:'transparent', borderRadius: 3, paddingLeft: 15, fontSize: responsiveFontSize(1.8), fontFamily: 'Muli-Light', borderWidth: 1, borderColor:'#7A7A7A' }}
					            placeholder= {uploadSegregationPic.image2Placeholder}
					            placeholderTextColor = "#000"
					            underlineColorAndroid = 'transparent'
					            editable={false}
					            secureTextEntry = {false}
					          />
						</View>
						<TouchableOpacity onPress = {() => this.selectDryImage()} style = {{height: responsiveHeight(6), width: responsiveWidth(88), borderRadius: 3, backgroundColor:"#46b07b", justifyContent:'center', alignItems:'center', alignSelf:'center', marginTop: 10}} >
							<Text style = {{color:'#fff', fontSize: responsiveFontSize(2.6), fontFamily:'Muli-ExtraBold'}} >{uploadSegregationPic.browseButtonText}</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress = {() => this.submit()} style = {{height: responsiveHeight(6), width: responsiveWidth(88), borderRadius: 3, backgroundColor:"#46b07b", justifyContent:'center', alignItems:'center', alignSelf:'center', marginTop: 20}} >
							<Text style = {{color:'#fff', fontSize: responsiveFontSize(2.6), fontFamily:'Muli-ExtraBold'}} >{uploadSegregationPic.submitButtonText}</Text>
						</TouchableOpacity>
					</ScrollView>
				</View>
 			</View>
 		);
 	}
}