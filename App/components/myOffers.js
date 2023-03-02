import React, { Component } from 'react';
import {
	View,
	Text,
	StatusBar,
	TouchableOpacity,
	StyleSheet,
	Linking,
	ScrollView,
	Image,
	Platform,
	AsyncStorage,
	ListView,
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
import ImageSlider from 'react-native-image-slider';
import PopupDialog from 'react-native-popup-dialog';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import url from '../utils/Api';
import { myOffers } from '../utils/internationalisation';
import { createStyles, maxWidth, minWidth } from 'react-native-media-queries';

var radio_props = [
  {label:'Active           ', value: 0 },
  {label:'Reedemed    ', value: 1 }
];
let categoryMap = {};

export default class MyOffers extends Component {

	static navigationOptions = {
   		 header: false,
       drawerLabel: "My Offers",
 	 	};

 	 	state = {
		phoneNo: '9893870563',
		email: 'john.doe@gmail.com',
		user_id: '',
		userData:'',
		offerID:'',
		myoffer:'',
		offerBusiness:'',
		offerCategory:'',
        emptyCheck:true,
        filtervalue :'',
		dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
              }),
	}

	componentWillMount() {
        BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
	    AsyncStorage.getItem("User").then((value) => {
	        var tmp = JSON.parse(value);
	        this.setState({user_id: tmp});
	    }).done(() => {this.getUser(); this.getCategory();});
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
        }).done(() => this.getMyOffers());
    }

    getMyOffers(){
    	fetch(url.main + "user_offer" + url.transform + url.filter + "user_id,eq," + this.state.user_id + "&include=offers,business", {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((response) => response.json())
          .then((responseData) => {
            
            //alert(JSON.stringify(responseData.user_offer));
            // var offerId = [];
            // offerId = responseData.user_offer.map(function(userOffer){
            // 	return (userOffer.offer_id);
            // })
            // userOfferMap = responseData.user_offer;
            var useroffer = responseData.user_offer;
            useroffer.reverse();
            if(responseData == ''){
                this.setState({
                    emptyCheck: true
                })
            }
            this.setState({
            	//offerID: offerId,

                dataSource: this.state.dataSource.cloneWithRows(useroffer),
                emptyCheck: false,
            })
            // alert(JSON.stringify(offerId));
        }).done();
    }

    getCategory(){
      fetch(url.main + "category" + url.transform, {
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
                // console.log("hoooo")
              responseData.category.map(function (category) {
                  categoryMap[category.id] = category;
              })
                console.log(categoryMap);
            }
            //alert(JSON.stringify(responseData));
        }).done();
    }


    usefilter(){
        this.filterPopupDialog.dismiss();
        var filter;
        if(this.state.filtervalue === 0){
            filter = 'Active';
            this.setState({
                filterHeading:'Active Offers'
            })
        }else if(this.state.filtervalue === 1){
            filter = 'InActive';
            this.setState({
                filterHeading: 'InActive Offers'
            })
        }

        fetch(url.main + 'user_offer' + url.transform + url.filterArray + "user_id,eq," + this.state.user_id + url.filterArray + "redemeed,eq," + this.state.filtervalue + "&include=offers,business", {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((response) => response.json())
            .then((responseData) => {
              
            //alert(JSON.stringify(responseData.user_offer));
            // var offerId = [];
            // offerId = responseData.user_offer.map(function(userOffer){
            //  return (userOffer.offer_id);
            // })
            // userOfferMap = responseData.user_offer;
            var useroffer = responseData.user_offer;
            useroffer.reverse();
            if(responseData == ''){
                this.setState({
                    emptyCheck: true
                })
            }
            this.setState({
              //offerID: offerId,

                dataSource: this.state.dataSource.cloneWithRows(useroffer),
                emptyCheck: false,
            })
            // alert(JSON.stringify(offerId));
        }).done();
    
    }


    // getoffers(){
    // 	var fetchUrl = url.main + "offers" + url.transform + "&include=category,business" + url.filter + "id,in," ;
    // 	this.state.offerID.map(function (offer) {
    // 		fetchUrl += offer + ",";
    // 	})
    // 	fetch(fetchUrl, {
    // 		method: "GET",
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     }
    //   }).then((response) => response.json())
    //       .then((responseData) => {  
    //       //alert(JSON.stringify(responseData.offers));
    //      if(responseData.offers == ''){
    //       this.setState({
    //         emptyCheck: true
    //       })
    //      }else{
    //       var offerRev = responseData.offers;
    //       offerRev.reverse();
    //       this.setState({
    //       	dataSource: this.state.dataSource.cloneWithRows(offerRev),
    //         emptyCheck: false
    //       })

    //       // var offerMap = {};
    //       // responseData.offers.map(function  (offer) {
    //       // 	offerMap[offer.id] = offer;
    //       // })
    //     }
    // 	})	
    // }

	openMap(){
		 Platform.select({
        ios: () => {
            Linking.openURL('http://maps.apple.com/maps?ll=' + this.state.offerBusiness.lat + ',' + this.state.offerBusiness.long);
        },
        android: () => {
            Linking.openURL('http://maps.google.com/maps?ll=' + this.state.offerBusiness.lat + ',' + this.state.offerBusiness.long);
        }
    })();
	}

	openCall(){
		Linking.openURL('tel:' + this.state.phoneNo);
	}

	openMail(){
		Linking.openURL('mailto:'+ this.state.email);
	}


	render() {
    var validityDate = new Date(this.state.myoffer.validity);
		return(
			<View style={{flex:1, backgroundColor:'#eee'}}>
				<View style={Css.header_main}>
					<View style = {Css.header_menu_view}>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerToggle')}>
							<Entypo name="menu" size={25} color="white" />
						</TouchableOpacity>
					</View>
					<View style = {Css.header_main_text_view}>
						<Text style ={Css.header_main_text}>{myOffers.headerTitle}</Text>
					</View>
                    <TouchableOpacity style={{paddingTop:15}} onPress = {() => this.filterPopupDialog.show()}>
                        <View style = {{justifyContent:'center',marginLeft:30, width: responsiveWidth(20)}}>
                                    <FontAwesome name = "filter" color = "#fff" size = {16}/>
                        </View>
                    </TouchableOpacity>
				</View>
				<ScrollView>
					<View style = {{flexDirection:'column', alignItems:'center'}} >
						{this.state.emptyCheck == false && <View style = {{flexDirection:'column', alignItems:'center'}} ><ListView
                                                    dataSource = {this.state.dataSource}
                                                    renderRow = {this.renderOffers.bind(this)}
                                                    /**contentContainerStyle = {{flexDirection: 'row',flexWrap: 'wrap', }}**//> 
                                               </View>
            }
            {this.state.emptyCheck == true && <View style = {{flex: 1,width: responsiveWidth(80), alignItems:'center', justifyContent:'center', alignSelf:'center', marginTop: 20 }}>
                                          <Text style = {{color: '#7A7A7A', fontSize: responsiveFontSize(2), fontFamily:"Muli-Regular"}}>You currently do not have any offers!</Text>
                                          <TouchableOpacity onPress = {() => this.props.navigation.navigate('listoffers')} style = {{backgroundColor:'transparent',borderWidth: 1, borderRadius: 5, borderColor:'#7a7a7a', width: responsiveWidth(50), height: responsiveHeight(7), marginTop: 10, alignItems:'center', justifyContent:'center'}} >
                                            <Text style = {{color: '#7A7A7A', fontSize: responsiveFontSize(2), fontFamily:"Muli-Regular"}}>Browse offers now!</Text>
                                          </TouchableOpacity>
                                       </View>
            }					
					</View>
				</ScrollView>
                <PopupDialog
                    ref={(popupDialog) => { this.filterPopupDialog = popupDialog; }}
                    width = {responsiveWidth(85)}
                    height = {responsiveHeight(30)}
                    >
                    <View style = {{width: responsiveWidth(85), height: responsiveHeight(30)}}>
                        <TouchableOpacity onPress = {() => this.filterPopupDialog.dismiss()}  style = {{position: 'absolute',width: responsiveWidth(5), height: responsiveHeight(3), backgroundColor:'#46b07b', zIndex: 999, borderRadius: 100, top: 0, right: 0,alignItems:'center', justifyContent:'center'}}>
                            <FontAwesome name = "close" color = '#fff' size ={13} />
                        </TouchableOpacity>
                        <View style = {{width: responsiveWidth(85), height:responsiveHeight(8),borderBottomWidth:2, borderColor:'#46b07b', alignItems:'center', justifyContent:'center'}} >
                            <Text style = {{color: '#46b07b', fontSize: responsiveFontSize(2.8), fontFamily:'Muli-ExtraBold'}} >Filter</Text>
                        </View>
                        <View style = {{flexDirection:'column'}} >
                            <RadioForm
                              radio_props={radio_props}
                              initial={0}
                              formHorizontal={false}
                              labelHorizontal={true}
                              labelColor = {'#7A7A7A'}
                              buttonColor={'#46b07b'}
                              
                              radioStyle = {{marginTop:7, alignItems:'center'}}
                              buttonSize = {15}
                              labelStyle = {{fontFamily:'Muli-Regular'}}
                             
                              animation={true}
                              onPress={(value) => {this.setState({filtervalue:value})}}
                            />
                            <View style = {{alignItems: 'center', height: responsiveHeight(8), width: responsiveWidth(85),marginTop: 10}} >    
                                <TouchableOpacity onPress = {() => this.usefilter()} style = {{height: responsiveHeight(6), width: responsiveWidth(30), backgroundColor:"#46b07b", alignItems:'center', justifyContent:'center'}} >
                                    <Text style = {{color:'#fff', fontSize: responsiveFontSize(2.4), fontFamily:'Muli-ExtraBold'}} >Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View> 
                </PopupDialog>
				<PopupDialog
            		ref={(popupDialog) => { this.popupDialog = popupDialog; }}
            		width = {responsiveWidth(85)}
            		height = {responsiveHeight(76)} >
            		<View style = {{flexDirection: 'column', position: 'relative'}}>
            			<TouchableOpacity onPress = {() => this.popupDialog.dismiss()}  style = {{position: 'absolute',width: responsiveWidth(5), height: responsiveHeight(3), backgroundColor:'#46b07b', zIndex: 999, borderRadius: 100, top: 0, right: 0,alignItems:'center', justifyContent:'center'}}>
	            			<FontAwesome name = "close" color = '#fff' size ={13} />
            			</TouchableOpacity>
            			<View style = {{marginBottom: 20}}>
            				<ImageSlider images = {[this.state.myoffer.images1,this.state.myoffer.images2, this.state.myoffer.images3]
            					} 
            					position={this.state.position}
                   				onPositionChanged={position => this.setState({position})}
                   				height = {responsiveHeight(23)}
                   				/** style = {{borderRadius: 100}} **/ />
            			</View>
            			<View style = {{alignItems:'center'}}>
            				<Text style = {{color: '#46b07b', fontFamily:'Muli-ExtraBold', fontSize:responsiveFontSize(2.5)}} >{this.state.myoffer.title}</Text>
            			</View>
            			<View style = {{width: responsiveWidth(80), }} >
            				<Text numberOfLines = {3} style = {{color: '#7A7A7A', fontFamily: 'Muli-Light', fontSize: responsiveFontSize(1.5), paddingLeft: 25, paddingTop: 10}} >{this.state.myoffer.description} </Text>
            			</View>
            			<View style = {{width: responsiveWidth(80), flexDirection:'column',alignItems:'center'}} >
            				<Text style = {{color: '#46b07b', fontFamily: 'Muli-ExtraBold', fontSize: responsiveFontSize(2), paddingLeft: 25, paddingTop: 10}} >{this.state.offerBusiness.name}</Text>
            			</View>
            			<View style = {{width: responsiveWidth(80), }} >
            				<Text numberOfLines = {3} style = {{color: '#7A7A7A', fontFamily: 'Muli-Light', fontSize: responsiveFontSize(1.5), paddingLeft: 25, paddingTop: 10}} >{this.state.offerBusiness.description} </Text>
            			</View>
            			<View style = {{width: responsiveWidth(80), flexDirection:'row'}} >
            				<Text style = {{color: '#46b07b', fontFamily: 'Muli-ExtraBold', fontSize: responsiveFontSize(1.5), paddingLeft: 25, paddingTop: 5}} >{myOffers.validityText} :</Text>
            				<Text style = {{color: '#7A7A7A', fontFamily: 'Muli-Light', fontSize: responsiveFontSize(1.5), paddingLeft: 5, paddingTop: 5}}>{validityDate.getDate()}/{validityDate.getMonth()+1}/{validityDate.getFullYear()}</Text>
            			</View>
            			<View style = {{width: responsiveWidth(80), flexDirection:'row'}} >
            				<Text style = {{color: '#46b07b', fontFamily: 'Muli-ExtraBold', fontSize: responsiveFontSize(1.5), paddingLeft: 25, paddingTop: 5}} >{myOffers.pointsText} :</Text>
            				<Text style = {{color: '#7A7A7A', fontFamily: 'Muli-Light', fontSize: responsiveFontSize(1.5), paddingLeft: 5, paddingTop: 5}}>{this.state.offerCategory.point_required} pts</Text>
            			</View>
            			<View style = {{width: responsiveWidth(80), flexDirection:'row'}} >
            				<Text style = {{color: '#46b07b', fontFamily: 'Muli-ExtraBold', fontSize: responsiveFontSize(1.5), paddingLeft: 25, paddingTop: 5}} >{myOffers.locationText} :</Text>
            				<TouchableOpacity onPress = {() => this.openMap()}>
            					<Image source = {require("../../public/google.png")} style = {{width: responsiveFontSize(1.5), height: responsiveHeight(2), marginTop: 8, marginLeft: 5}} />
            				</TouchableOpacity>
            			</View>
            			<View style = {{width: responsiveWidth(80), flexDirection:'row'}} >
            				<Text style = {{color: '#46b07b', fontFamily: 'Muli-ExtraBold', fontSize: responsiveFontSize(1.5), paddingLeft: 25, paddingTop: 5}} >{myOffers.contactText} :</Text>
            				<TouchableOpacity onPress = {() => this.openCall()} >
            					<Text style = {{color: '#7A7A7A', fontFamily: 'Muli-Light', fontSize: responsiveFontSize(1.5), paddingLeft: 5, paddingTop: 5}}>{this.state.offerBusiness.phone_no}</Text>
            				</TouchableOpacity>
            			</View>
            			<View style = {{width: responsiveWidth(80), flexDirection:'row'}} >
            				<Text style = {{color: '#46b07b', fontFamily: 'Muli-ExtraBold', fontSize: responsiveFontSize(1.5), paddingLeft: 25, paddingTop: 5}} >{myOffers.emailText} :</Text>
            				<TouchableOpacity onPress = {() => this.openMail()} >
            					<Text style = {{color: '#7A7A7A', fontFamily: 'Muli-Light', fontSize: responsiveFontSize(1.5), paddingLeft: 5, paddingTop: 5}}>{this.state.offerBusiness.email}</Text>
            				</TouchableOpacity>
            			</View>
            			<View style = {{width: responsiveWidth(80), flexDirection:'row'}} >
            				<Text style = {{color: '#46b07b', fontFamily: 'Muli-ExtraBold', fontSize: responsiveFontSize(1.5), paddingLeft: 25, paddingTop: 5}} >{myOffers.addressText} :</Text>
            				<View style = {{width: responsiveWidth(62)}}>
            					<Text style = {{color: '#7A7A7A', fontFamily: 'Muli-Light', fontSize: responsiveFontSize(1.5), paddingLeft: 5, paddingTop: 5}}>{this.state.offerBusiness.address}</Text>
            				</View>
            			</View>
            			<View style = {{width: responsiveWidth(80), flexDirection:'row'}} >
            				<Text style = {{color: '#46b07b', fontFamily: 'Muli-ExtraBold', fontSize: responsiveFontSize(1.5), paddingLeft: 25, paddingTop: 5}} >{myOffers.websiteText} :</Text>
            				<TouchableOpacity onPress = {() => Linking.openURL('http://'+this.state.offerBusiness.website)}>
            				<Text style = {{color: '#7A7A7A', fontFamily: 'Muli-Light', fontSize: responsiveFontSize(1.5), paddingLeft: 5, paddingTop: 5}}>{this.state.offerBusiness.website}</Text>
            				</TouchableOpacity>
            			</View>
            		</View>
            	</PopupDialog>
			</View>
		);
	}

	openPopup(offer){
		//alert(JSON.stringify(offer));
        var category = categoryMap[offer.offers[0].category_id];
       // console.log(category)
		this.setState({
			myoffer: offer.offers[0],
			offerBusiness: offer.offers[0].business[0],
			offerCategory: category
	})

		this.popupDialog.show();
	}

	renderOffers(offer){
	    var date = new Date(offer.offers[0].validity);
        var category1 = categoryMap[offer.offers[0].category_id];
        var catName = category1.name;
        if(offer.redemeed == 1){
    		return(
    			<TouchableOpacity onPress = {() => this.openPopup(offer) } >
    						<View style = {{marginTop: 15,marginBottom:15,backgroundColor: "#e2e0e0", height: responsiveHeight(34), width: responsiveWidth(85), borderRadius:4,  elevation:6, flexDirection: 'row',}}>
    								<View style = {{width: responsiveWidth(27), alignItems:'center',marginTop:8, marginLeft:4}} >
    									<Image source = {{uri: offer.offers[0].images}} style = {{width: responsiveWidth(19.2), height:responsiveHeight(28),borderRadius: 5, marginTop:12.5 }} />
    								</View>
    								<View style = {{flexDirection:'column', width: responsiveWidth(58)}} >
    									<View style = {{marginTop:15, marginLeft:5, flexDirection:'row'}}>
                        <View style = {{width: responsiveWidth(40)}}>
                          <Text style = {{color: "#46b07b", fontSize: responsiveFontSize(1.9), fontFamily: "Muli-ExtraBold"}} >{offer.offers[0].title}</Text>
                        </View>
                        {catName == 'Gold' && <View style = {{width: responsiveWidth(20), alignItems:'center', justifyContent:'center'}}>
                                        <Image source ={require('../../public/Gold_Icon.png')} style = {styles.dollorImage}/> 
                                      </View>
                        }
                        {catName == 'Silver' && <View style = {{width: responsiveWidth(20), alignItems:'center', justifyContent:'center'}}>
                                        <Image source ={require('../../public/silver_Icon.png')} style = {styles.dollorImage}/> 
                                      </View>
                        }
                        {catName == 'Bronze' && <View style = {{width: responsiveWidth(20), alignItems:'center', justifyContent:'center'}}>
                                        <Image source ={require('../../public/bronze_Icon.png')} style = {styles.dollorImage}/> 
                                      </View>
                        }
                      </View>
    									<View style = {{marginTop:5, marginLeft:5, width: responsiveWidth(53),}}>
    										<Text numberOfLines = {2} style = {{color: "#7A7A7A", fontSize: responsiveFontSize(1.4), fontFamily: "Muli-Light"}} >{offer.offers[0].description}</Text>
    									</View>
    									<View style = {{marginTop:5, marginLeft:5}}>
    										<Text style = {{color: "#46b07b", fontSize: responsiveFontSize(1.9), fontFamily: "Muli-ExtraBold"}} >{offer.offers[0].business[0].name}</Text>
    									</View>
    									<View numberOfLines = {2} style = {{marginTop:5, marginLeft:5, width: responsiveWidth(53)}}>
    										<Text style = {{color: "#7A7A7A", fontSize: responsiveFontSize(1.4), fontFamily: "Muli-Light"}} >{offer.offers[0].business[0].description}</Text>
    									</View>
    									<View style = {{marginTop:5, marginLeft:5, flexDirection:'row', height: responsiveHeight(2)}}>
    										<Text style = {{color: "#46b07b", fontSize: responsiveFontSize(1.4), fontFamily: "Muli-ExtraBold"}} >{myOffers.validityText} : </Text>
    										<Text style = {{color: "#7A7A7A", fontSize: responsiveFontSize(1.4), fontFamily: "Muli-Light"}} > {date.getDate()}/{date.getMonth()+1}/{date.getFullYear()} </Text>
    									</View>
    									<View style = {{marginTop:5, marginLeft:5, flexDirection:'row'}}>
    										<Text style = {{color: "#46b07b", fontSize: responsiveFontSize(1.4), fontFamily: "Muli-ExtraBold"}} >{myOffers.pointsText} : </Text>
    										<Text style = {{color: "#7A7A7A", fontSize: responsiveFontSize(1.4), fontFamily: "Muli-Light"}} > {category1.point_required} pts </Text>
    									</View>
    								</View>
    						</View>
    			</TouchableOpacity>
    		);
        }else{
            return(
                <TouchableOpacity onPress = {() => this.openPopup(offer) } >
                            <View style = {{marginTop: 15,marginBottom:15,backgroundColor: "#fff", height: responsiveHeight(34), width: responsiveWidth(85), borderRadius:4,  elevation:6, flexDirection: 'row',}}>
                                    <View style = {{width: responsiveWidth(27), alignItems:'center',marginTop:8, marginLeft:4}} >
                                        <Image source = {{uri: offer.offers[0].images}} style = {{width: responsiveWidth(19.2), height:responsiveHeight(28),borderRadius: 5, marginTop:12.5 }} />
                                    </View>
                                    <View style = {{flexDirection:'column', width: responsiveWidth(58)}} >
                                        <View style = {{marginTop:15, marginLeft:5, flexDirection:'row'}}>
                        <View style = {{width: responsiveWidth(40)}}>
                          <Text style = {{color: "#46b07b", fontSize: responsiveFontSize(1.9), fontFamily: "Muli-ExtraBold"}} >{offer.offers[0].title}</Text>
                        </View>
                        {catName == 'Gold' && <View style = {{width: responsiveWidth(20), alignItems:'center', justifyContent:'center'}}>
                                        <Image source ={require('../../public/Gold_Icon.png')} style = {styles.dollorImage}/> 
                                      </View>
                        }
                        {catName == 'Silver' && <View style = {{width: responsiveWidth(20), alignItems:'center', justifyContent:'center'}}>
                                        <Image source ={require('../../public/silver_Icon.png')} style = {styles.dollorImage}/> 
                                      </View>
                        }
                        {catName == 'Bronze' && <View style = {{width: responsiveWidth(20), alignItems:'center', justifyContent:'center'}}>
                                        <Image source ={require('../../public/bronze_Icon.png')} style = {styles.dollorImage}/> 
                                      </View>
                        }
                      </View>
                                        <View style = {{marginTop:5, marginLeft:5, width: responsiveWidth(53),}}>
                                            <Text numberOfLines = {2} style = {{color: "#7A7A7A", fontSize: responsiveFontSize(1.4), fontFamily: "Muli-Light"}} >{offer.offers[0].description}</Text>
                                        </View>
                                        <View style = {{marginTop:5, marginLeft:5}}>
                                            <Text style = {{color: "#46b07b", fontSize: responsiveFontSize(1.9), fontFamily: "Muli-ExtraBold"}} >{offer.offers[0].business[0].name}</Text>
                                        </View>
                                        <View numberOfLines = {2} style = {{marginTop:5, marginLeft:5, width: responsiveWidth(53)}}>
                                            <Text style = {{color: "#7A7A7A", fontSize: responsiveFontSize(1.4), fontFamily: "Muli-Light"}} >{offer.offers[0].business[0].description}</Text>
                                        </View>
                                        <View style = {{marginTop:5, marginLeft:5, flexDirection:'row', height: responsiveHeight(2)}}>
                                            <Text style = {{color: "#46b07b", fontSize: responsiveFontSize(1.4), fontFamily: "Muli-ExtraBold"}} >{myOffers.validityText} : </Text>
                                            <Text style = {{color: "#7A7A7A", fontSize: responsiveFontSize(1.4), fontFamily: "Muli-Light"}} > {date.getDate()}/{date.getMonth()+1}/{date.getFullYear()} </Text>
                                        </View>
                                        <View style = {{marginTop:5, marginLeft:5, flexDirection:'row'}}>
                                            <Text style = {{color: "#46b07b", fontSize: responsiveFontSize(1.4), fontFamily: "Muli-ExtraBold"}} >{myOffers.pointsText} : </Text>
                                            <Text style = {{color: "#7A7A7A", fontSize: responsiveFontSize(1.4), fontFamily: "Muli-Light"}} > {category1.point_required} pts </Text>
                                        </View>
                                    </View>
                            </View>
                </TouchableOpacity>
            );
        }
	}
}

const base = {
  dollorImage: {
    width:responsiveWidth(5),
    height: responsiveHeight(3),
    
  }
}

const threesixty = {
  dollorImage: {
    width:responsiveWidth(5.5),
    height: responsiveHeight(3),
    
  }
}

const twoeighty = {
  dollorImage: {
    width:responsiveWidth(5),
    height: responsiveHeight(3),
    
  }
}

const foursixteen = {
  dollorImage: {
    width:responsiveWidth(5.5),
    height: responsiveHeight(3),
    
  }
}

const styles = createStyles(
  base,
  minWidth(280, maxWidth(349, twoeighty)),
  minWidth(350, maxWidth(415, threesixty)),
  minWidth(416, maxWidth(767, foursixteen)),
  minWidth(768, maxWidth(1440, threesixty)),
);