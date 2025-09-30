isLeapYear = (year) => ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
const cur_date = new Date();
const MONTHS_DAYS = {1:31
    , 2:(isLeapYear(cur_date.getFullYear()) ? 29 :28)
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

const weekOfYear = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    startOfYear.setDate(startOfYear.getDate() + (startOfYear.getDay() % 7));
    return Math.round((date - startOfYear) / (7 * 24 * 3600 * 1000));
  };

function initCalender(cssDateStyle = "date-simple"){
    let calender = document.getElementById("calender");

    let control = document.createElement("DIV");
    control.classList.add("control");
    control.innerHTML = "<div><select>\
        <option value=1>Januar</option>\
        <option value=2>Februar</option>\
        <option value=3>März</option>\
        <option value=4>April</option>\
        <option value=5>Mai</option>\
        <option value=6>Juni</option>\
        <option value=7>Juli</option>\
        <option value=8>August</option>\
        <option value=9>September</option>\
        <option value=10>Oktober</option>\
        <option value=11>November</option>\
        <option value=12>Dezember</option>\
        </select><select>\
        <option value=2020>2020</option>\
        <option value=2021>2021</option>\
        <option value=2022>2022</option>\
        <option value=2023>2023</option>\
        <option value=2024>2024</option>\
        <option value=2025>2025</option>\
        <option value=2026>2026</option>\
        <option value=2027>2027</option>\
        <option value=2028>2028</option>\
        <option value=2029>2029</option>\
        </select></div>"
    control.innerHTML += "<div><i></i><i>Mo</i><i>Di</i><i>Mi</i><i>Do</i><i>Fr</i><i>Sa</i><i>So</i></div>"
    calender.append(control);

    control.firstChild.firstChild.onchange = (ev) =>{
        alert(control.firstChild.firstChild.value )
    }
    let dates = document.createElement("DIV");
    dates.classList.add("dates");
    dates.classList.add("date-simple");
    calender.append(dates);

    let curMonth = cur_date.getMonth() + 1;
    let curMonthDays = MONTHS_DAYS[curMonth];
    
    let fields = 6*7*12; // 6=rows,7=weekdays,12=months
    const WEEKDAYS = {1:'Mo', 2:'Di', 3:'Mi',4:'Do',5:'Fr', 6:'Sa', 7:'So'};

    let tmpDate = new Date();
    tmpDate.setDate(1)
    let firstKwOfMonth = weekOfYear(tmpDate);
    console.log()
    let firstMonthWeekday = tmpDate.getDay()-1;
    firstMonthWeekday = (firstMonthWeekday == -1 ? 6 : firstMonthWeekday) + 1;
    tmpDate.setDate(0)
    let lastMonthDay = tmpDate.getDate();
    
    let dateCounter = 0;
    
    function createKwField(row){
        let divKw = document.createElement("DIV");
        divKw.innerHTML = "<span>"+(firstKwOfMonth + row)+"</span>";
        return divKw;
    }
    function createDayField(date, weekday, dayMonth=0){
        if(weekday < 1) return createKwField(0);
        let divDay = document.createElement("DIV");
        divDay.id = calender.id +"-datefield-"+tmpDate.getFullYear()+"-"+curMonth+"-"+date;
        divDay.classList.add(cssDateStyle);
        divDay.classList.add(dayMonth == 0 ? "cur-month-day" : (dayMonth == -1 ? "last-month-day" : "next-month-day"));
        if(date  == cur_date.getDate()) divDay.classList.add("cur-day");
        divDay.title = WEEKDAYS[weekday] ;
        divDay.innerHTML = "<span>"+date+"</span>"

        return divDay;
    }
    let weekdayIter = 0;
    for(weekdayIter;weekdayIter <= 7; weekdayIter++){
        if(firstMonthWeekday == weekdayIter)
            break;

        let date = lastMonthDay - weekdayIter;
        dates.append(createDayField(date, weekdayIter, -1));
    }
    let dayMonthIndicator = 0;
    for(let row=0; row < 6;row++){
        for(let weekday = weekdayIter; weekday <= 7; weekday++){
            if(weekday == 0){
                dates.append(createKwField(row));
                continue
            }
            if(dateCounter < curMonthDays){
                ++dateCounter;
            }else{
                dateCounter = 1;
                dayMonthIndicator = 1
            }
            dates.append(createDayField(dateCounter, weekday, dayMonthIndicator));
        }
        weekdayIter = 0;
    }
}
initCalender();