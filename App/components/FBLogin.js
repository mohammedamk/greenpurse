import React, { Component } from 'react';
import {
  TouchableOpacity,
  Button,
  Text,
  Image,
  View,
  Dimensions,
  AsyncStorage,
  Alert,
} from 'react-native';

import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginButton,
  LoginManager,
} from 'react-native-fbsdk';
import url from '../utils/Api';

export default class FBLogin extends Component {
  static navigationOptions = {
  };

  constructor(props) {
    super(props);

    this.state = {
      user: null
    };
  }

  render() {
    const _this = this;
    return (
      <View style={{margin: 5, elevation: 10}}>
         <LoginButton
          //style = {{elevation: 5}}
          publishPermissions={["publish_actions"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                Alert.alert("","login has error: " + result.error);
              } else if (result.isCancelled) {
                Alert.alert("","login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    //alert(data.accessToken.toString());
                    //console.log("ACcess token data:- "+ JSON.stringify(data));
                    const responseInfoCallback = (error, result) => {
			              if (error) {
			            } else {
                    this.setState({user: result});
                    this.checkSocialUser(result);
			                //alert(JSON.stringify(this.state.user));
                    	    //console.log("Response Info callback:- "+ JSON.stringify(result));
			            }
			        };

			        const infoRequest = new GraphRequest(
	                    '/me',
	                    {
			                accessToken: data.accessToken,
			                parameters: {
			                  fields: {
			                    string: 'email,name,first_name,last_name,friends,birthday,picture'
	                  			}
	                		}
			            },
			              responseInfoCallback
		            );

		            new GraphRequestManager().addRequest(infoRequest).start()
                  },
                )
              }
            }
          }
          onLogoutFinished={() => console.log('log out')}/>          
      </View>
    )
  }

  checkSocialUser(user){
    // alert(this.state.user.id);
    fetch(url.main + "user" + url.transform + url.filter + "facebook_id,eq," + user.id, {
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
              AsyncStorage.setItem("Profile_Image", JSON.stringify(this.state.user.picture.data.url));
              if(responseData.user[0]){
                AsyncStorage.setItem('User', JSON.stringify(responseData.user[0].id));
                AsyncStorage.setItem("Flag", 'facebook');

                this.props.navigation.navigate("authcheck");
                //this.updateSocialData(responseData.user[0]);
               // this.props.navigation.navigate('authcheck');
              }else{
                this.props.navigation.navigate('socialregistration', {socialUser: this.state.user, flag: 'facebook'});
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
        'first_name': this.state.user.first_name,
        'last_name': this.state.user.last_name,
        'profile_pic': this.state.user.picture.data.url,
        'password': this.state.user.id,
      })
    }).then((response) => response.json())
    .then((responseData) => {
      if(responseData === null){
        Alert.alert("","profile update Failed");
      }else{
        //AsyncStorage.setItem("User", JSON.stringify(responseData));
        //alert('Profile Updated!')
        AsyncStorage.setItem("Flag", 'facebook');
        this.props.navigation.navigate("authcheck");
      }
      //alert(JSON.stringify(responseData));
  }).done();
  }
}

