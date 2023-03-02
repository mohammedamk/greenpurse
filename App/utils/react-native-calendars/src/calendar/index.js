import React, {Component} from 'react';
import {
  View,
  ViewPropTypes,
  Button,
} from 'react-native';
import PropTypes from 'prop-types';

//import { connect } from 'react-redux'
import XDate from 'xdate';
import dateutils from '../dateutils';
import {xdateToData, parseDate} from '../interface';
import styleConstructor from './style';
import Day from './day/basic';
import UnitDay from './day/interactive';
import CalendarHeader from './header';
import shouldComponentUpdate from './updater';
//import { favouriteList } from '../../../../reducers/favouriteReducer'


//Fallback when RN version is < 0.44
const viewPropTypes = ViewPropTypes || View.propTypes;

class Calendar extends Component {
  static propTypes = {
    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    // Collection of dates that have to be marked. Default = {}
    markedDates: PropTypes.object,

    // Specify style for calendar container element. Default = {}
    style: viewPropTypes.style,

    selected: PropTypes.array,
    //import favourites to render them when it's their birthday
    favourites: PropTypes.array,

    birthdays: PropTypes.array,

    // Initially visible month. Default = Date()
    current: PropTypes.any,
    // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
    minDate: PropTypes.any,
    // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
    maxDate: PropTypes.any,

    // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
    firstDay: PropTypes.number,

    // Date marking style [simple/interactive]. Default = 'simple'
    markingType: PropTypes.string,

    // Hide month navigation arrows. Default = false
    hideArrows: PropTypes.bool,
    // Display loading indicador. Default = false
    displayLoadingIndicator: PropTypes.bool,
    // Do not show days of other months in month page. Default = false
    hideExtraDays: PropTypes.bool,
    // Handler which gets executed on day press. Default = undefined
    onDayPress: PropTypes.func,
    // Handler which gets executed when visible month changes in calendar. Default = undefined
    onMonthChange: PropTypes.func,
    onVisibleMonthsChange: PropTypes.func,
    // Replace default arrows with custom ones (direction can be 'left' or 'right')
    renderArrow: PropTypes.func,
    // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
    monthFormat: PropTypes.string,
    //favourites with birthdays

  };


  constructor(props) {
    super(props);
    this.style = styleConstructor(this.props.theme);
    let currentMonth;
    if (props.current) {
      currentMonth = parseDate(props.current);
    } else {
      currentMonth = props.selected && props.selected[0] ? parseDate(props.selected[0]) : XDate();
    }
    this.state = {
      currentMonth

    };

    this.updateMonth = this.updateMonth.bind(this);
    this.addMonth = this.addMonth.bind(this);
    this.isSelected = this.isSelected.bind(this);

  }

  state = {
    favourites: [],
  };

  componentWillReceiveProps(nextProps) {
    this.updateMonth(this.state.currentMonth.clone().addMonths(1, true));
    this.forceUpdate();
    this.setState({favourites: nextProps.favourites});
    console.log('FAVOURITES', nextProps.favourites)
    const current= parseDate(nextProps.current);
    if (current && current.toString('yyyy MM') !== this.state.currentMonth.toString('yyyy MM')) {
      this.setState({
        currentMonth: current.clone()
      });
    }
  }

  updateMonth(day, doNotTriggerListeners) {
    // if (day.toString('yyyy MM') === this.state.currentMonth.toString('yyyy MM')) {
    //   return;
    // }
    this.setState({
      currentMonth: day.clone()
    }, () => {
      if (!doNotTriggerListeners) {
        const currMont = this.state.currentMonth.clone();
        if (this.props.onMonthChange) {
          this.props.onMonthChange(xdateToData(currMont));
        }
        if (this.props.onVisibleMonthsChange) {
          this.props.onVisibleMonthsChange([xdateToData(currMont)]);
        }
      }
    });
  }


  pressDay(day) {
    const minDate = parseDate(this.props.minDate);
    const maxDate = parseDate(this.props.maxDate);
    if (!(minDate && !dateutils.isGTE(day, minDate)) && !(maxDate && !dateutils.isLTE(day, maxDate))) {
      this.updateMonth(day);
      if (this.props.onDayPress) {
        this.props.onDayPress(xdateToData(day));
      }
    }
  }

  addMonth(count) {
    this.updateMonth(this.state.currentMonth.clone().addMonths(count, true));
  }

  isSelected(day) {
    let selectedDays = [];
    if (this.props.selected) {
      selectedDays = this.props.selected;
    }
    for (let i = 0; i < selectedDays.length; i++) {
      if (dateutils.sameDate(day, parseDate(selectedDays[i]))) {
        return true;
      }
    }
    return false;
  }

  sameDate(a, b) {
    return a instanceof XDate && b instanceof XDate &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }

  renderWeek(days, id) {
    const week = [];
    days.forEach((day, id2) => {
      week.push(this.renderDay(day, id2));
    }, this);
    return (<View style={this.style.week} key={id}>{week}</View>);
  }



  renderDay(day, id) {

    const minDate = parseDate(this.props.minDate);
    const maxDate = parseDate(this.props.maxDate);
    let state = '';
    if (this.isSelected(day)) {
      state = 'selected';
    } else if ((minDate && !dateutils.isGTE(day, minDate)) || (maxDate && !dateutils.isLTE(day, maxDate))) {
      state = 'disabled';
    } else if (!dateutils.sameMonth(day, this.state.currentMonth)) {
      state = 'disabled';
    } else if (dateutils.sameDate(day, XDate())) {
      state = 'today';
    }
    let dayComp;

    if (!dateutils.sameMonth(day, this.state.currentMonth) && this.props.hideExtraDays) {
      if (this.props.markingType === 'interactive') {
        dayComp = (<View key={id} style={{flex: 1}}/>);
      } else {
        dayComp = (<View key={id} style={{width: 32}}/>);
      }
    } else {
      const DayComp = this.props.markingType === 'interactive' ? UnitDay : Day;
      const markingExists = this.props.markedDates ? true : false;

      const favourites = this.state.favourites;
      // console.log('favourite being sent through props: ', favourites)
      const favResult = [];
      //this is where you pass the birthday into the day component
      if (favourites) {
        favResult = favourites.filter((favourite) => {

          return dateutils.sameMonthAndDay(day, XDate(favourite.date))
        })
      }
      // favResult && console.log('leFavResult: ', favResult[0])
      dayComp = (
        <DayComp
            key={id}
            state={state}
            theme={this.props.theme}
            onPress={this.pressDay.bind(this, day)}
            marked={this.getDateMarking(day)}
            markingExists={markingExists}
            favourite={favResult[0]}
          >
            {day.getDate()}
          </DayComp>
        );
    }
    return dayComp;
  }

  getDateMarking(day) {
    console.log("Marking Day: - " + day.toString('yyyy-MM-dd'));
    console.log("Marked Date Array: - "+ JSON.stringify(this.props.markedDates))
    if (!this.props.markedDates) {
      return false;
    }
    const dates = this.props.markedDates[day.toString('yyyy-MM-dd')] || [];
    if (dates.length || dates) {
      console.log("Dates in the dates:- " + JSON.stringify(dates))
      return dates;
    } else {
      console.log("Dates Else ParT:- ")
      return false;
    }
  }

  renderWeek(days, id) {
    const week = [];
    days.forEach((day, id2) => {
      week.push(this.renderDay(day, id2));
    }, this);
    return (<View style={this.style.week} key={id}>{week}</View>);
  }

  render() {
    const days = dateutils.page(this.state.currentMonth, this.props.firstDay);
    const weeks = [];
    while (days.length) {
      weeks.push(this.renderWeek(days.splice(0, 7), weeks.length));
    }
    let indicator;
    const current = parseDate(this.props.current);
    if (current) {
      const lastMonthOfDay = current.clone().addMonths(1, true).setDate(1).addDays(-1).toString('yyyy-MM-dd');
      if (this.props.displayLoadingIndicator &&
          !(this.props.markedDates && this.props.markedDates[lastMonthOfDay])) {
        indicator = true;
      }
    }
    return (
      <View style={[this.style.container, this.props.style]}>
        <CalendarHeader
          theme={this.props.theme}
          hideArrows={this.props.hideArrows}
          month={this.state.currentMonth}
          addMonth={this.addMonth}
          showIndicator={indicator}
          firstDay={this.props.firstDay}
          renderArrow={this.props.renderArrow}
          monthFormat={this.props.monthFormat}
        />
        {weeks}
      </View>);
  }
}

export default Calendar;
