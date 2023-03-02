import React, { Component } from 'react';
import {
	View,
	Text,
	StatusBar,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Image,
	ListView,
	AsyncStorage,
	Alert,
	BackHandler
} from 'react-native';
import { header } from '../utils/navigationHeader';
import Drawer from 'react-native-drawer';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import MenuComponent from '../utils/components/NavigationDrawer';
import Css from '../utils/Css/Style';
import PopupDialog from 'react-native-popup-dialog';
import { CheckBox } from 'react-native-elements';
import url from '../utils/Api'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { areaRanking } from '../utils/internationalisation';
import SnapShotView from 'react-native-snapshot-view';
import Share from 'react-native-share';
import { createStyles, maxWidth, minWidth } from 'react-native-media-queries';

var radio_props = [
  {label: 'Zone     ', value: 0 },
  {label: 'Locality', value: 1 },
];

let shareImageBase64 = {};

export default class AreaRanking extends Component {

	static navigationOptions = {
   		header: false,
       	drawerLabel: "Area Ranking",
 	};

 	state = {
 	 		isChecked_gold: false,
	        isChecked_silver: false,
	        isChecked_bronze: false,
	        user_rank:'',
	        dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
              }),
	        filtervalue :'',
	        rankingHeading:'Zone Ranking',
	        shootNum : 0,
	        ssImage: ''
 	 	}

 	 	componentWillMount(){
 	 		 BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
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
        }).done(() => this.rank())
    }

    rank(){
    	//alert(this.state.userData.user[0].id)
    	fetch(url.other + "ranking", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        	'user_id' : this.state.userData.user[0].id,
        	'type' : 'zone'
        })
      }).then((response) => response.json())
          .then((responseData) => {
            this.setState({
            	user_rank: responseData,
            	dataSource: this.state.dataSource.cloneWithRows(responseData.top_10)
            })
            //alert(JSON.stringify(responseData));
        }).done();
    }

    usefilter(){
    	this.filterPopupDialog.dismiss();
    	var filter;
    	if(this.state.filtervalue === 0){
    		filter = 'zone';
    		this.setState({
    			rankingHeading: areaRanking.zoneHeading
    		})
    	}else if(this.state.filtervalue === 1){
    		filter = 'street';
    		this.setState({
    			rankingHeading: areaRanking.streetHeading
    		})
    	}
    	//alert(filter)
    	fetch(url.other + "ranking", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        	'user_id' : this.state.userData.user[0].id,
        	'type' : filter
        })
      }).then((response) => response.json())
          .then((responseData) => {
            this.setState({
            	user_rank: responseData,
            	dataSource: this.state.dataSource.cloneWithRows(responseData.top_10)
            })
            //alert(JSON.stringify(responseData.name));
        }).done();
    }

    shareSs(image){
    	shareImageBase64 = {
		    title: "React Native",
		    message: "Checkout my current rank on myGreenPurse",
		    url: image,
		    subject: "Share Link" //  for email
		};
		//setTimeout(function(){ Share.open(shareImageBase64) }, 3000);
		//setTimeout(, 6000)
		Share.open(shareImageBase64)
    }

	render() {
		var date = new Date();
		return(
			<SnapShotView
            fileName={"Image" + date.getDate()+(date.getMonth()+1)+date.getFullYear()+date.getHours()+date.getMinutes()}
            shotNumber={this.state.shootNum}
            style = {{flex: 1}}
            onShoted={events => {
              this.setState({ssImage : events.nativeEvent.filePath})
              this.shareSs(events.nativeEvent.filePath);
              console.log(' onShoted : ', events.nativeEvent.filePath); // filePath is the .png path
            }}>
			<View style={{flex:1, backgroundColor:'#eee'}}>
				<View style={Css.header_main}>
					<View style = {Css.header_menu_view}>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerToggle')}>
							<Entypo name="menu" size={25} color="white" />
						</TouchableOpacity>
					</View>
					<View style = {Css.header_main_text_view}>
						<Text style ={Css.header_main_text}>{areaRanking.headerTitle}
						</Text>
					</View>
				</View>
				<View style={[Css.header_main, {borderTopWidth:0.5, borderColor:'#fff'}]}>
					<View style = {{width: responsiveWidth(100), alignItems:'center', justifyContent:'center'}}>
						<TouchableOpacity style = {{flexDirection:'row', width:responsiveWidth(49.9)}} onPress = {() => this.filterPopupDialog.show()} >
							<View style = {{justifyContent:'center',alignItems:'flex-end', width: responsiveWidth(40)}}>
								<Text style = {{color: '#fff', fontSize: responsiveFontSize(2.8), fontFamily:'Muli-Bold', paddingRight: 7}} >{areaRanking.filterText}</Text>
							</View>
							<View style = {{justifyContent:'center',alignItems:'flex-start', width: responsiveWidth(20)}}>
								<FontAwesome name = "filter" color = "#fff" size = {16}/>
							</View>
						</TouchableOpacity>
					</View>
				</View>
				<View style = {{flex: 1, flexDirection: 'column'}} >
					<ScrollView>
						<View style = {{alignItems:'center', marginTop: 20}} >
							<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(3), fontFamily:'Muli-ExtraBold'}}>{this.state.rankingHeading}</Text>
						</View>
						<View style = {{alignSelf:'center', width: responsiveWidth(88), height: responsiveHeight(9), backgroundColor:'#fff', marginTop: 20, flexDirection:'row'}} >
							<View style = {{width: responsiveWidth(12), alignItems:'center', justifyContent:'center'}}>
								<Text style = {{fontFamily:'Muli-Bold', fontSize: responsiveFontSize(2.3), color:'#46b07b'}} >{this.state.user_rank.rank}</Text>
							</View>
							<View style = {{width: responsiveWidth(34), justifyContent:'flex-start', alignItems:'center', flexDirection:'row'}} >
								<View style = {{width: responsiveWidth(32.4)}}>
									<Text numberOfLines={1} style = {{fontFamily: 'Muli-Bold', fontSize: responsiveFontSize(2.3), color:'#000', paddingLeft: 20}}>{this.state.user_rank.name}</Text>
								</View>
							</View>
							<View style = {{width: responsiveWidth(23), alignItems:'center', justifyContent:'center', flexDirection:'row', marginLeft: 5}}>
								<Image source = {require("../../public/dollor.png")} style = {styles.dollorImage}/>
								<Text style = {{fontFamily:'Muli-Bold', fontSize: responsiveFontSize(2.3), color:'#000',paddingLeft: 8}} >{this.state.user_rank.points}</Text>
							</View>
							<TouchableOpacity style = {{width: responsiveWidth(10), alignItems:'center', justifyContent:'center'}} onPress = {() => {const shootNum1 = this.state.shootNum + 1; this.setState({shootNum : shootNum1});}}>
							<View style = {{width: responsiveWidth(10), alignItems:'center', justifyContent:'center'}}>
								<Entypo name = "share" color = "#46b07b" size = {22} />
							</View>
							</TouchableOpacity>
						</View>
						<View style = {{alignItems:'center', marginTop: 20, marginBottom: 20}} >
							<Text style = {{color:'#46b07b', fontSize: responsiveFontSize(3), fontFamily:'Muli-ExtraBold'}}>{areaRanking.topTenText}</Text>
						</View>
						<ListView
		                          dataSource = {this.state.dataSource}
		                          renderRow = {this.renderranking.bind(this)}
		                          /**contentContainerStyle = {{flexDirection: 'row',flexWrap: 'wrap', }}**//>
					</ScrollView>
				</View>
				<PopupDialog
            		ref={(popupDialog) => { this.filterPopupDialog = popupDialog; }}
            		width = {responsiveWidth(85)}
            		height = {responsiveHeight(45)}
            		//dialogStyle = {{borderRadius: 0}}
            		>
            		<View style = {{width: responsiveWidth(85), height: responsiveHeight(45)}}>
            			<TouchableOpacity onPress = {() => this.filterPopupDialog.dismiss()}  style = {{position: 'absolute',width: responsiveWidth(5), height: responsiveHeight(3), backgroundColor:'#46b07b', zIndex: 999, borderRadius: 100, top: 0, right: 0,alignItems:'center', justifyContent:'center'}}>
	            			<FontAwesome name = "close" color = '#fff' size ={13} />
            			</TouchableOpacity>
            			<View style = {{width: responsiveWidth(85), height:responsiveHeight(8),borderBottomWidth:2, borderColor:'#46b07b', alignItems:'center', justifyContent:'center'}} >
            				<Text style = {{color: '#46b07b', fontSize: responsiveFontSize(2.8), fontFamily:'Muli-ExtraBold'}} >{areaRanking.popupHeading}</Text>
            			</View>
            			<View style = {{flexDirection:'column'}} >
            				<View style = {{alignItems:'center'}}>
            					<Text style = {{color: '#46b07b', fontFamily:'Muli-ExtraBold', fontSize:responsiveFontSize(2.4), paddingTop: 5}} >{areaRanking.popupFilterHead}</Text>
            				</View>
            				<RadioForm
							  radio_props={radio_props}
							  initial={0}
							  formHorizontal={false}
							  labelHorizontal={true}
							  labelColor = {'#7A7A7A'}
							  buttonColor={'#46b07b'}
							  
							  radioStyle = {{marginTop:5, alignItems:'center'}}
							  buttonSize = {15}
							  labelStyle = {{fontFamily:'Muli-Regular'}}
							 
							  animation={true}
							  onPress={(value) => {this.setState({filtervalue:value})}}
							/>
				            <View style = {{alignItems: 'center', height: responsiveHeight(8), width: responsiveWidth(85),marginTop: 10}} >    
					            <TouchableOpacity onPress = {() => this.usefilter()} style = {{height: responsiveHeight(6), width: responsiveWidth(30), backgroundColor:"#46b07b", alignItems:'center', justifyContent:'center'}} >
					            	<Text style = {{color:'#fff', fontSize: responsiveFontSize(2.4), fontFamily:'Muli-ExtraBold'}} >{areaRanking.applyButtonText}</Text>
					            </TouchableOpacity>
				            </View>
            			</View>
            		</View>	
            	</PopupDialog>
			</View>
			</SnapShotView>
		);
	}

	toggle_gold = (checked) => {
	    this.setState({
	      isChecked_gold: !this.state.isChecked_gold,
	    })
	  }

	  toggle_silver = (checked) => {
	    this.setState({
	      isChecked_silver: !this.state.isChecked_silver,
	    })
	  }

	  toggle_bronze = (checked) => {
	    this.setState({
	      isChecked_bronze: !this.state.isChecked_bronze,
	    })
	  }

	  renderranking(rank){
	  	var points;
	  	if (rank.points === null){
	  		points = 0;
	  	}else{
	  		points = rank.points;
	  	}
	  	return(
	  		<View style = {{alignSelf:'center', width: responsiveWidth(88), height: responsiveHeight(9), backgroundColor:'#fff', marginBottom: 15, flexDirection:'row'}} >
							<View style = {{width: responsiveWidth(12), alignItems:'center', justifyContent:'center'}}>
								<Text style = {{fontFamily:'Muli-Bold', fontSize: responsiveFontSize(2.3), color:'#46b07b'}} >{rank.rank}</Text>
							</View>
							<View style = {{width: responsiveWidth(48), justifyContent:'flex-start', alignItems:'center', flexDirection:'row'}} >
								<View style = {{width: responsiveWidth(44)}}>
									<Text numberOfLines={1} style = {{fontFamily: 'Muli-Bold', fontSize: responsiveFontSize(2.3), color:'#000', paddingLeft: 20}}>{rank.name}</Text>
								</View>
							</View>
							<View style = {{width: responsiveWidth(25), alignItems:'center', justifyContent:'flex-start', flexDirection:'row'}}>
								<Image source = {require("../../public/dollor.png")} style = {styles.dollorImage}/>
								<Text style = {{fontFamily:'Muli-Bold', fontSize: responsiveFontSize(2.3), color:'#000',paddingLeft: 8}} >{points}</Text>
							</View>
						</View>
	  	)
	  }
}

const base = {
	dollorImage: {
		width:responsiveWidth(4),
		height: responsiveHeight(2.5),
		
	}
}

const threesixty = {
	dollorImage: {
		width:responsiveWidth(4.6),
		height: responsiveHeight(2.5),
		
	}
}

const twoeighty = {
	dollorImage: {
		width:responsiveWidth(4),
		height: responsiveHeight(2.5),
		
	}
}

const foursixteen = {
	dollorImage: {
		width:responsiveWidth(4.6),
		height: responsiveHeight(2.5),
		
	}
}

const styles = createStyles(
	base,
	minWidth(280, maxWidth(349, twoeighty)),
  	minWidth(350, maxWidth(415, threesixty)),
	minWidth(416, maxWidth(767, foursixteen)),
	minWidth(768, maxWidth(1440, threesixty)),
);