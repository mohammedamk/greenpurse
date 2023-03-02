import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  children,
  AsyncStorage,
  Alert
} from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Drawer from 'react-native-drawer';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { navigation } from 'react-navigation';
import Css from '../Css/slideBar';
import url from '../Api';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import FBLogin from '../../components/FBLogin';
import { createStyles, maxWidth, minWidth } from 'react-native-media-queries';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginButton,
  LoginManager,
} from 'react-native-fbsdk';

export default class NavigationDrawer extends Component {

  state = {
    userData:'',
    flag:''
  }

  componentWillMount(){
    this._setupGoogleSignin();
    AsyncStorage.getItem("User").then((value) => {
        var tmp = JSON.parse(value);
          this.setState({user_id: tmp});
      }).done(() => this.getUser());

    AsyncStorage.getItem("Flag").then((value) => {
      var tmp = value;
      this.setState({
        flag: tmp
      })  
    }).done();
    //alert(JSON.stringify(this.props.navigation.state.params))
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
              alert("Network Error");
            }else{
              //AsyncStorage.setItem("User_Details", JSON.stringify(responseData));
              //alert(JSON.stringify(responseData.user[0]))
              this.setState({
                userData: responseData.user[0],
              })
            }
            //alert(JSON.stringify(responseData));
        }).done()
    }

  render(){
    return(
      <View style={Css.MainConatiner}>
        <TouchableOpacity onPress = {() => this.props.navigation.navigate("profile", {userDetails: this.state.userData})} >
         <View style = {Css.ProfileContainer} >
            <View style = {Css.ProfileImageAndSettingContainer} >
               <Image source = {{uri: this.state.userData.profile_pic}} style = {Styles1.ProfileImage}/>
            </View>
            <View style = {Css.ProfileNameContainer} >
              <Text style = {Css.ProfileNameText} > {this.state.userData.username} </Text>
            </View>
            <View style = {Css.ProfileNameContainer}>
              <Text style = {Css.ProfileNameText} > Unique Id : {this.state.userData.uuid}</Text> 
            </View>
         </View>
        </TouchableOpacity>
         <ScrollView>
           <View style = {Css.MenuContainer}>
              <TouchableOpacity onPress = {() => this.props.navigation.navigate("mypurse")}>
                <View style ={Css.MenuButtonContainer}> 
                    <View style = {Css.MenuButtonIconContainer} >
                      <Image source ={require('../../../public/wallet_black.png')} style = {Css.MenuButtonIconImage}/>
                    </View>
                    <View style = {Css.MenuButtonTitleContainer} >
                      <Text style = {Css.MenuButtonTitleText}>My Purse</Text>
                    </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress = {() => this.props.navigation.navigate("listoffers")}>
                <View style ={Css.MenuButtonContainer}> 
                    <View style = {Css.MenuButtonIconContainer} >
                      <FontAwesome name = "th-list" color = "#7D7885" size = {18} style = {Css.MenuButtonIcon} />
                    </View>
                    <View style = {Css.MenuButtonTitleContainer} >
                      <Text style = {Css.MenuButtonTitleText} >List Offers</Text>
                    </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress = {() => this.props.navigation.navigate("myoffers")}>
                <View style ={Css.MenuButtonContainer}> 
                    <View style = {Css.MenuButtonIconContainer} >
                      <Image source ={require('../../../public/percentage_black.png')} style = {Css.MenuButtonIconImage}/>
                    </View>
                    <View style = {Css.MenuButtonTitleContainer} >
                      <Text style = {Css.MenuButtonTitleText} >My Offers</Text>
                    </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress = {() => this.props.navigation.navigate("updatesegregation")}>
                <View style ={Css.MenuButtonContainer}> 
                    <View style = {Css.MenuButtonIconContainer} >
                      <FontAwesome name = "refresh" color = "#7D7885" size = {18} style = {[Css.MenuButtonIcon,{paddingLeft:3}]} />
                    </View>
                    <View style = {Css.MenuButtonTitleContainer} >
                      <Text style = {Css.MenuButtonTitleText} >Update Segregation</Text>
                    </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress = {() => this.props.navigation.navigate("segregationhistory")}>
                <View style ={Css.MenuButtonContainer}> 
                    <View style = {Css.MenuButtonIconContainer} >
                      <Image source ={require('../../../public/history_black.png')} style = {[Css.MenuButtonIconImage,{marginLeft:3}]}/>
                    </View>
                    <View style = {Css.MenuButtonTitleContainer} >
                      <Text style = {Css.MenuButtonTitleText} >Segregation History</Text>
                    </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress = {() => this.props.navigation.navigate("ranking")}>
                <View style ={Css.MenuButtonContainer}> 
                    <View style = {Css.MenuButtonIconContainer} >
                      <Image source ={require('../../../public/ranking2.png')} style = {[Css.MenuButtonIconImage,{marginLeft:3}]}/>
                    </View>
                    <View style = {Css.MenuButtonTitleContainer} >
                      <Text style = {Css.MenuButtonTitleText} >User Ranking</Text>
                    </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress = {() => this.props.navigation.navigate("arearanking")}>
                <View style ={Css.MenuButtonContainer}> 
                    <View style = {Css.MenuButtonIconContainer} >
                      <Image source ={require('../../../public/ranking2.png')} style = {[Css.MenuButtonIconImage,{marginLeft:3}]}/>
                    </View>
                    <View style = {Css.MenuButtonTitleContainer} >
                      <Text style = {Css.MenuButtonTitleText} >Zone Ranking</Text>
                    </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress = {() => this.props.navigation.navigate("updates")}>
                <View style ={Css.MenuButtonContainer}> 
                    <View style = {Css.MenuButtonIconContainer} >
                      <Image source ={require('../../../public/Update_2.png')} style = {[Css.MenuButtonIconImage,{marginLeft:3}]}/>
                    </View>
                    <View style = {Css.MenuButtonTitleContainer} >
                      <Text style = {Css.MenuButtonTitleText} >Blogs</Text>
                    </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress = {() => this.props.navigation.navigate("contactus")}>
                <View style ={Css.MenuButtonContainer}> 
                    <View style = {Css.MenuButtonIconContainer} >
                      <Image source ={require('../../../public/contact_us_2.png')} style = {[Css.MenuButtonIconImage,{marginLeft:3}]}/>
                    </View>
                    <View style = {Css.MenuButtonTitleContainer} >
                      <Text style = {Css.MenuButtonTitleText} >Contact Us</Text>
                    </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress = {() => this.props.navigation.navigate("segregationtips")}>
                <View style ={Css.MenuButtonContainer}> 
                    <View style = {Css.MenuButtonIconContainer} >
                       <MaterialCommunityIcons name = "tooltip" color = "#7D7885" size = {18} style = {[Css.MenuButtonIcon,{paddingLeft:3}]} />
                    </View>
                    <View style = {Css.MenuButtonTitleContainer} >
                      <Text style = {Css.MenuButtonTitleText} >Segregation Tips</Text>
                    </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress = {() => this.props.navigation.navigate("termsandconditions")}>
                <View style ={Css.MenuButtonContainer}> 
                    <View style = {Css.MenuButtonIconContainer} >
                      <Image source ={require('../../../public/Term_and_Condition2.png')} style = {[Css.MenuButtonIconImage,{marginLeft:3}]}/>
                    </View>
                    <View style = {Css.MenuButtonTitleContainer} >
                      <Text style = {Css.MenuButtonTitleText} >Terms & Conditions</Text>
                    </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress = {() => this.props.navigation.navigate("instruction")}>
                <View style ={Css.MenuButtonContainer}> 
                    <View style = {Css.MenuButtonIconContainer} >
                      <Image source ={require('../../../public/instructions2.png')} style = {[Css.MenuButtonIconImage,{marginLeft:3}]}/>
                    </View>
                    <View style = {Css.MenuButtonTitleContainer} >
                      <Text style = {Css.MenuButtonTitleText} >Instructions</Text>
                    </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress = {() => this.props.navigation.navigate("faqs")}>
                <View style ={Css.MenuButtonContainer}> 
                    <View style = {Css.MenuButtonIconContainer} >
                      <MaterialIcons name = "question-answer" color = "#7D7885" size = {18} style = {[Css.MenuButtonIcon,{paddingLeft:3}]} />
                    </View>
                    <View style = {Css.MenuButtonTitleContainer} >
                      <Text style = {Css.MenuButtonTitleText} >FAQs</Text>
                    </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress = {() => this.logOut()}>
                <View style ={[Css.MenuButtonContainer, {marginBottom:20}]}> 
                  <View style = {Css.MenuButtonIconContainer} >
                    <Image source ={require('../../../public/Log_Out_2.png')} style = {[Css.MenuButtonIconImage,{marginLeft:3}]}/>
                  </View>
                  <View style = {Css.MenuButtonTitleContainer} >
                    <Text style = {Css.MenuButtonTitleText} >Log Out</Text>
                  </View>
                </View>
              </TouchableOpacity>
           </View>
         </ScrollView>
      </View>
      )
  }

  logOut(){
    //alert(this.state.flag)
    AsyncStorage.removeItem("User");
    if(this.state.flag === 'google'){
       GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
          Alert.alert('', 'Logout Successful!');
       })
        .done();
    }else if(this.state.flag === 'facebook'){
      LoginManager.logOut();
    }

    AsyncStorage.removeItem("Flag");
    AsyncStorage.removeItem('Profile_Image');
    this.props.navigation.navigate('authcheck');
  }
}

const base = {
  ProfileImage: {
    width: responsiveWidth(19.2), 
    height:responsiveHeight(12), 
    borderRadius: 100, 
  }
}

const twoeighty = {
  ProfileImage: {
    width: responsiveWidth(19.2), 
    height:responsiveHeight(12), 
    borderRadius: 100, 
  }
}

const threesixty = {
  ProfileImage: {
    width: responsiveWidth(22), 
    height:responsiveHeight(12), 
    borderRadius: 100, 
  }
}

const foursixteen = {
  ProfileImage: {
    width: responsiveWidth(19.2), 
    height:responsiveHeight(11), 
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

      