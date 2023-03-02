import React, { Component } from 'react';
import {
	View,
	Text,
	StatusBar,
	TouchableOpacity,
	StyleSheet,
	Image,
	ScrollView,
	AsyncStorage,
	ListView,
	Alert,
	BackHandler
} from 'react-native';
import { header } from '../utils/navigationHeader';
import Drawer from 'react-native-drawer';
import Entypo from 'react-native-vector-icons/Entypo';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import MenuComponent from '../utils/components/NavigationDrawer';
import Css from '../utils/Css/Style';
import  { Calendar }  from 'react-native-calendars';
import moment from 'moment';
import url from '../utils/Api';
import { segregationHistory } from '../utils/internationalisation';
import { createStyles, maxWidth, minWidth } from 'react-native-media-queries';
//import moment from 'moment';

export default class SegregationHistory extends Component {

	static navigationOptions = {
   		 header: false,
       drawerLabel: "Segregation History",
 	 	};

 	 	state = {
 	 		current : moment().format('YYYY-MM-DD'),
 	 		seg:'',
 	 		dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
              }),
 	 	}

 	 	componentWillMount(){
 	 		alert(this.state.current)
 	 		BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
 	 		var date = moment().format('YYYY-MM-DD');
 	 		//this.setState({current: });
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
	              //alert(JSON.stringify(responseData))
	              this.setState({
	                userData: responseData
	              })
	            }
	            //alert(JSON.stringify(responseData));
	      }).done(() => this.getSegregationHistory())
    }

    getSegregationHistory(){
      fetch(url.main + 'segregation' + url.transform + url.filter + 'user_id,eq,' + this.state.userData.user[0].id, {
          method: "GET",
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
          }
      }).then((response) => response.json())
      .then((responseData) => {
        //alert(JSON.stringify(responseData.segregation[1]))
       // alert(i)
       var segDate = responseData.segregation.map(function(seg){
       	return(seg.date);
       })
       var markeddate = {};
       segDate.map(function(date){
       	return markeddate[date] = { "selected" : true }
       })
       //alert(JSON.stringify(markeddate))
       //alert(JSON.stringify(segDate))

      	var segReverse = responseData.segregation;
      	segReverse.reverse();

        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(segReverse),
          seg: markeddate
        })
      }).done();
    }




	render() {
		//alert(JSON.stringify(this.state.seg))
		// var segDate = this.state.seg.map(function(seg){
		// 	return (seg.date);
		// })
		// alert(JSON.stringify(segDate))
		return(
			<View style={{flex:1, backgroundColor:'#eee'}}>
				<View style={Css.header_main}>
					<View style = {Css.header_menu_view}>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerToggle')}>
							<Entypo name="menu" size={25} color="white" />
						</TouchableOpacity>
					</View>
					<View style = {Css.header_main_text_view}>
						<Text style ={Css.header_main_text}>{segregationHistory.headerTitle}</Text>
					</View>
				</View>
				<View style = {{flex: 1, flexDirection: 'column'}} >
					<View style = {{alignItems:'center', marginTop: 15}} >
						<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(3), fontFamily:'Muli-ExtraBold'}}>{segregationHistory.mainHeading}</Text>
					</View>
					<View style = {{marginTop: 15, height: responsiveHeight(53), alignSelf:'center'}} >
						<Calendar
				          style={styles.calendar}
				          current={this.state.current}
				          //firstDay={1}
				          //markingType={'simple'}
				          markedDates={this.state.seg}
				          theme={{
				            calendarBackground: '#fff',
				            textSectionTitleColor: '#000',
				            //dayTextColor: '#000',	
				            headerBackgroundColor: '#46b07b',		
				            todayTextColor: '#46b07b',
				            selectedDayTextColor: 'white',
				            monthTextColor: 'white',
				            selectedDayBackgroundColor: '#46b07b',
				            arrowColor: 'white',
				        }}
				          // disabledByDefault={true}
        					/>
					</View>
					<ScrollView>
						<View style = {{marginTop:20}}>
							 <ListView
		                          dataSource = {this.state.dataSource}
		                          renderRow = {this.rendersegregation.bind(this)}
		                          /**contentContainerStyle = {{flexDirection: 'row',flexWrap: 'wrap', }}**//>
						</View>
					</ScrollView>
				</View>
			</View>
		);
	}

	rendersegregation(seg){
		//alert(JSON.stringify(seg))
		var date = new Date(seg.date);
		return(
			<View style = {{height:responsiveHeight(8), width: responsiveWidth(88), backgroundColor:'#fff', alignSelf:'center', flexDirection:'row', marginBottom: 10}} >
				<View style = {{width: responsiveWidth(21), alignItems:'center',justifyContent: 'center'}} >
					<Entypo name = "check" color = "#46b07b" size = {23} />
				</View>
				<View style = {{width: responsiveWidth(47), alignItems:'center',justifyContent: 'center'}}>
					<Text style = {{fontFamily: 'Muli-Regular', fontSize: responsiveFontSize(2.3), color: "#000"}} >{date.getDate()}/{date.getMonth()+1}/{date.getFullYear()}</Text>
				</View>
				<View style = {{width: responsiveWidth(12), alignItems:'center',justifyContent: 'flex-end', flexDirection:'row',}} >
					<Text style = {{fontFamily: 'Muli-Regular', fontSize: responsiveFontSize(2.3), color: "#000"}} >50</Text>
					<Image source = {require("../../public/dollor.png")} style = {styles1.dollorImage}/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	calendar: {
    borderTopWidth: 1,
    paddingTop: 0,
    borderBottomWidth: 1,
    borderColor: '#838383',
    height: responsiveHeight(20),
    width: responsiveWidth(88),
  },
})

const base = {
	dollorImage: {
		width:responsiveWidth(4),
		height: responsiveHeight(2.5),
		marginLeft: 5
		
	}
}

const threesixty = {
	dollorImage: {
		width:responsiveWidth(4.6),
		height: responsiveHeight(2.5),
		marginLeft: 5
	}
}

const twoeighty = {
	dollorImage: {
		width:responsiveWidth(4),
		height: responsiveHeight(2.5),
		marginLeft: 5
	}
}

const foursixteen = {
	dollorImage: {
		width:responsiveWidth(4.5),
		height: responsiveHeight(2.5),
		marginLeft: 5
	}
}

const styles1 = createStyles(
	base,
	minWidth(280, maxWidth(349, twoeighty)),
  	minWidth(350, maxWidth(415, threesixty)),
	minWidth(416, maxWidth(767, foursixteen)),
	minWidth(768, maxWidth(1440, threesixty)),
);