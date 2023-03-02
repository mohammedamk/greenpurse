import React, { Component } from 'react';
import {
	StyleSheet,
	Image,
	Text,
	TouchableOpacity,
	View,
	BackHandler
} from 'react-native';

import Login from './login';
import UpdateSegregation from './updatesegregation';
import MyPurse from './myPurse';
import ListOffers from './listOffers';
import MyOffers from './myOffers';
import SegregationHistory from './segregationHistory';
import Ranking from './ranking';
import Blogs from './updates';
import ContactUs from './contactUs';
import TermsAndConditions from './terms&condition';
import Instructions from './instructions&Faqs';
import Profile from './profile';
import Registration from './registration';
import AuthCheck from './authCheck';
import ProfileEdit from './profileEdit';
import SocialRegistration from './socialRegistration';
import SegregationTips from './segregationTips';
import Faqs from './faqs';
import ForgotPassword from './forgotPassword';
import AreaRanking from './areaRanking';
import UploadSegregationPic from './uploadSegregationPic';

import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import NavigationDrawer from '../utils/components/NavigationDrawer';
import { StackNavigator, navigation, DrawerNavigator } from 'react-navigation';

const Drawerstack = DrawerNavigator({
	updatesegregation : { screen: UpdateSegregation },
  listoffers : { screen: ListOffers },
  mypurse : { screen: MyPurse },
  myoffers : { screen: MyOffers },
  segregationhistory : { screen: SegregationHistory },
  ranking : { screen: Ranking },
  updates : { screen: Blogs },
  contactus : { screen: ContactUs },
  termsandconditions : { screen: TermsAndConditions },
  instruction : { screen: Instructions },
  profile : { screen: Profile },
  segregationtips : { screen: SegregationTips },
  arearanking : { screen: AreaRanking },
  faqs : {screen: Faqs },
},{
	contentComponent: NavigationDrawer,
})

const Index = StackNavigator({
  authcheck : { screen: AuthCheck },
  login: { screen: Login },
  registration : { screen: Registration },
  uploadsegregationpic :{ screen: UploadSegregationPic},
  profileedit : { screen: ProfileEdit },
  socialregistration : { screen: SocialRegistration },
  forgotpassword : { screen: ForgotPassword },
  drawerstack: { screen: Drawerstack },
},
 {
    headerMode: 'none'
});

export default Index;


