import React, {
      StyleSheet,
      Dimensions,
      PixelRatio
    } from "react-native";
import { responsiveHeight, responsiveWidth, responsiveFontSize} from 'react-native-responsive-dimensions';

export default StyleSheet.create({
  header_main: {
    height:responsiveHeight(8),
	  marginTop:0,
    backgroundColor: '#46b07b',
    flexDirection: 'row',
  },
  header_menu_view:{
    width: responsiveWidth(14),
    alignItems:'center',
    justifyContent:'center',
  },
  header_main_text_view:{
    alignItems:"center",
    width:responsiveWidth(70),
    justifyContent:'center', 
  },
  header_main_text: {
    color:'white',
    fontFamily:'Muli-ExtraBold',
    fontSize: responsiveFontSize(3.2),
  },
  header_cart_view:{
    width:responsiveWidth(14),
    alignItems:'center',
    paddingTop:8
  },
});