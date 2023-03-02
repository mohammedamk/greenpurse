import React, { Component } from 'react';
import {
  TouchableOpacity,
  Button,
  Text,
  Image,
  View,
  Dimensions,
  AsyncStorage,
  StyleSheet, 
  ScrollView,
  Alert,
} from 'react-native';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import url from '../utils/Api';

export default class GoogleLogin extends Component {

	constructor(props){
		super(props);

	this.state = {
      user: null
    };
	}

	componentWillMount() {
        this._setupGoogleSignin();
    }

    async _setupGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        webClientId: '604833102740-1e9lvj99uitpvn0edi0l0m796am0k3bt.apps.googleusercontent.com',
        offlineAccess: false
      });

      const user = await GoogleSignin.currentUserAsync();
      console.log(user);
      this.setState({user});
    }
    catch(err) {
      console.log("Play services error", err.code, err.message);
    }
  }

  _signIn() {
    GoogleSignin.configure({
        webClientId: '604833102740-1e9lvj99uitpvn0edi0l0m796am0k3bt.apps.googleusercontent.com',
        offlineAccess: false
      }).done(() => {
         GoogleSignin.signIn()
    .then((user) => {
     // alert(JSON.stringify(user));
      console.log(JSON.stringify(user));
      this.setState({user: user});
      this.checkSocialUser(user);
    })
    .catch((err) => {
      console.log('WRONG SIGNIN', err);
    })
    .done(() => {
    });
      });

   
  }

  checkSocialUser(user){
    // alert(this.state.user.id);
    fetch(url.main + "user" + url.transform + url.filter + "google_id,eq," + user.id, {
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
              //alert(JSON.stringify(responseData.user[0]));
              AsyncStorage.setItem("Profile_Image", JSON.stringify(this.state.user.photo));
              if(responseData.user[0]){
                AsyncStorage.setItem('User', JSON.stringify(responseData.user[0].id));
                this.updateSocialData(responseData.user[0]);
               // this.props.navigation.navigate('authcheck');
              }else{
                this.props.navigation.navigate('socialregistration', {socialUser: this.state.user, flag: 'google'});
              }
            }
            //alert(JSON.stringify(responseData));
        }).done();
  }

  updateSocialData(user){
    fetch(url.main + "user/" + user.id, {
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'username': this.state.user.name,
        'first_name': this.state.user.givenName,
        'last_name': this.state.user.familyName,
        'email': this.state.user.email,
        'profile_pic': this.state.user.photo,
        'password': this.state.user.id,
      })
    }).then((response) => response.json())
    .then((responseData) => {
      if(responseData === null){
        Alert.alert("","profile update Failed");
      }else{
        //AsyncStorage.setItem("User", JSON.stringify(responseData));
        //alert('Profile Updated!')
        AsyncStorage.setItem("Flag", 'google');
        this.props.navigation.navigate("authcheck");
      }
      //alert(JSON.stringify(responseData));
  }).done();
  }

  _signOut() {
    GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
      this.setState({user: null});
    })
    .done();
  }

	render(){
		if (!this.state.user) {
		return(
			<View>
				<TouchableOpacity onPress = {() => this._signIn()} style ={{flexDirection: 'row',alignSelf:'center', width: responsiveWidth(53), height: responsiveHeight(4.9),borderWidth: 0.5, borderColor: '#333333', }} >
          <View style = {{width: responsiveWidth(8.5), justifyContent:'center', alignItems:'center'}} >
            <Image source = {require('../../public/search.png')} style = {{width: responsiveWidth(4.6), height: responsiveHeight(2.85)}} />
          </View>
          <View style = {{alignItems:'flex-start', justifyContent:'center'}} >
            <Text style = {{fontFamily: 'Muli-Bold', fontColor: '#000', fontSize: responsiveFontSize(2)}} >Sign in with Google</Text>
          </View>
        </TouchableOpacity>
        
			</View>
			)
		}
		 if (this.state.user) {
	      return (
	          <TouchableOpacity onPress={() => {this._signOut(); }} style = {{justifyContent:'center',alignItems:'center'}} >
	            <View>
	              <Text>Log out</Text>
	            </View>
	          </TouchableOpacity>
        	);
        }	
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});