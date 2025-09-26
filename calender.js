isLeapYear = (year) => ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
const cur_date = new Date();
const MONTHS_DAYS = {1:31
    , 2:(isLeapYear(cur_date.getYear()) ? 29 :28)
    , 3:31
    , 4:30
    , 5:31
    , 6:30
    , 7:31
    , 8:31
    , 9:30
    , 10:31
    , 11:30
    , 12:31
};

function initCalender(){
    let calender = document.getElementById("calender");
    
    let curMonth = cur_date.getMonth() + 1;
    let curMonthDays = MONTHS_DAYS[curMonth];
    
    let fields = 6*7*12; // 6=rows,7=weekdays,12=months
    const WEEKDAYS = {0:'Mo', 1:'Di',2:'Mi',3:'Do',4:'Fr',5:'Sa',6:'So'};

    let tmpDate = new Date();
    tmpDate.setDate(1)
    let firstMonthWeekday = tmpDate.getDay()-1;
    firstMonthWeekday = (firstMonthWeekday == -1 ? 6 : firstMonthWeekday);
    tmpDate.setDate(0)
    let lastMonthDay = tmpDate.getDate();
    
    let dateCounter = 0;
    
    function createDayField(date, weekday, dayMonth=0){
        let divDay = document.createElement("DIV");
        divDay.classList.add(dayMonth == 0 ? "cur-month-day" : (dayMonth == -1 ? "last-month-day" : "next-month-day"));
        divDay.title = WEEKDAYS[weekday];
        divDay.innerHTML = "<div><p>"+date+"</p></div>"

        return divDay;
    }
    let weekdayIter = 0;
    for(weekdayIter;weekdayIter < 7; weekdayIter++){
        if(firstMonthWeekday == weekdayIter)
            break;

        let date = lastMonthDay - weekdayIter;
        calender.append(createDayField(date, weekdayIter, -1));
    }
    let dayMonthIndicator = 0;
    for(let row=0; row < 6;row++){
        for(let weekday = weekdayIter; weekday < 7; weekday++){
            if(dateCounter < curMonthDays){
                ++dateCounter;
            }else{
                dateCounter = 1;
                dayMonthIndicator = 1
            }
            calender.append(createDayField(dateCounter,weekday, dayMonthIndicator));
        }
        weekdayIter = 0;
    }
}
initCalender();