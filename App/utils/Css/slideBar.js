import React, {
      StyleSheet,
      Dimensions,
      PixelRatio
    } from "react-native";
import { responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';

export default StyleSheet.create({
	MainConatiner:{
		flex: 1, 
		backgroundColor: 'white'
	},
	ProfileContainer:{
		height: responsiveHeight(26), 
		backgroundColor:'#46b07b', 
		flexDirection: 'column'
	},
	ProfileImageAndSettingContainer:{
		height: responsiveHeight(18), 
		justifyContent: 'center', 
		alignItems:'center', 
		flexDirection:'row'
	},
	ProfileImageContainer:{
		//width:responsiveWidth(80), 
		justifyContent:'center', 
		alignItems:'center'
	},
	ProfileImage:{
		width: responsiveWidth(19.2), 
		height:responsiveHeight(12), 
		borderRadius: 100, 
	},
	ProfileSettingContainer:{
		//width:responsiveWidth(15), 
		justifyContent: 'center', 
		alignItems:'center'
	},
	ProfileSetting:{
		paddingBottom:60, 
		paddingRight: 30
	},
	ProfileNameContainer:{
		justifyContent:'center', 
		alignItems:'center'
	},
	ProfileNameText:{
		color: 'white', 
		fontSize: 15, 
		fontFamily: 'Muli-Bold'
	},
	MenuContainer:{
		flexDirection:'column'
	},
	MenuButtonContainer:{
		flexDirection:'row', 
		marginTop:20
	},
	MenuButtonIconContainer:{
		paddingLeft:20
	},
	MenuButtonIconImage:{
		height:responsiveHeight(3), 
		width:responsiveWidth(5)
	},
	MenuButtonTitleContainer:{
		marginLeft: 15
	},
	MenuButtonTitleText:{
		color:"#7D7885", 
		fontSize: 15, 
		fontFamily:'Muli-Bold'
	},
	MenuButtonIcon:{
		paddingTop:3
	},
});