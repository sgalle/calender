function initCalender(id="calender", cur_date = new Date(), cssDateStyle = "date-simple", lang="de", cb_dayFieldClick=null){
    let calender = document.getElementById(id);
    const TODAY = new Date();
    
    const isLeapYear = (year) => ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    const MONTHS_DAYS = {1:31, 2:28, 3:31, 4:30, 5:31, 6:30, 7:31, 8:31, 9:30, 10:31, 11:30, 12:31};
    
    const getKw = (date) => {
        const jan1st = new Date(date.getFullYear(), 0, 1);
        jan1st.setDate(jan1st.getDate() + (jan1st.getDay() % 7));
        return Math.round((date - jan1st) / (7 * 24 * 3600 * 1000));
      };

    
    const WORDS_DE = {'weekdays' : ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag']
        , 'months' : ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September','Oktober','November','Dezember']
        , 'cw' : 'KW'
    };

    const WORDS_ENG = {'weekdays' : ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
        , 'months' : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September','October','November','December']
        , 'cw' : 'CW'
    };

    let WORDS = WORDS_DE;

    switch(lang){
        case 'eng':
            WORDS = WORDS_ENG;
            break;
        default:
    }
    document.documentElement.style.setProperty('--prefix-CW', "'"+WORDS['cw']+"'");

    const selMonthId = "sel_"+calender.id + "_month";
    const selYearId = "sel_"+calender.id + "_year";

    let control = document.createElement("DIV");
    control.classList.add("control");
    control.innerHTML = "<div><select id='"+selMonthId+"'></select><select id='"+selYearId+"'></select></div>";
    control.innerHTML += "<div><i></i></div>"

    WORDS['months'].forEach(el =>control.firstChild.firstChild.innerHTML += "<option seleceted value="+WORDS['months'].indexOf(el)+" "+(WORDS['months'].indexOf(el) == cur_date.getMonth() ? 'selected' : '')+">"+el+"</option>");
    for(let y = 2020; y < 2030; y++){control.firstChild.lastChild.innerHTML += "<option value="+y+" "+(y == cur_date.getFullYear() ? 'selected' : '')+">"+y+"</option>";}
    WORDS['weekdays'].forEach(el =>control.lastChild.innerHTML += "<i>"+el.substring(0,2)+"</i>")

    calender.append(control);

    let dates = document.createElement("DIV");
    dates.id = calender.id + "_divDates";
    dates.classList.add("dates");
    dates.classList.add("date-simple");
    calender.append(dates);

    let tmpDate = new Date();

    function updateCalenderFields(){

        const selYear = document.getElementById(selYearId).value;
        const selMonth = Number(document.getElementById(selMonthId).value);
        const selMonthDays =  (selMonth == 1 && isLeapYear(selYear) ? 29 : MONTHS_DAYS[selMonth + 1]);
        
        tmpDate.setFullYear(selYear);
        tmpDate.setMonth(selMonth);
        
        const firstKwOfMonth = getKw(tmpDate);

        function createKwField(cw){
            let divKw = document.createElement("DIV");
            divKw.innerHTML = "<span>"+cw+"</span>";
            return divKw;
        }
        function createDayField(date, weekday, dayMonth=0, cb_onclick=cb_dayFieldClick){
            let divDay = document.createElement("DIV");
    
            divDay.id = calender.id +"-datefield-"+selYear + "-" +selMonth + "-" + date;
            divDay.classList.add(cssDateStyle);
            divDay.classList.add(dayMonth == 0 ? "cur-month-day" : (dayMonth == -1 ? "last-month-day" : "next-month-day"));
            if(date  == TODAY.getDate() && selMonth == TODAY.getMonth() && selYear == TODAY.getFullYear()) divDay.classList.add("cur-day");
            divDay.title = WORDS['weekdays'][weekday-1] ;
            divDay.innerHTML = "<span>"+date+"</span><div style='display:none;'>"+date+"</div>"
    
            divDay.onclick = () =>{if(cb_onclick) cb_onclick(divDay);}
            return divDay;
        }
    
        dates.replaceChildren();
        
        tmpDate.setDate(1);
        console.log("tmpDate.getTime()", tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate(), firstKwOfMonth)
        
        let firstMonthWeekday = tmpDate.getDay()-1;
        firstMonthWeekday = (firstMonthWeekday == -1 ? 6 : firstMonthWeekday) + 1;
        tmpDate.setDate(0)
        const lastMonthDay = tmpDate.getDate();
        
        console.log(firstKwOfMonth, firstMonthWeekday, selMonthDays)
        
        let dateCounter = 0;
        let weekdayIter = 1;

        for(weekdayIter;weekdayIter <= 7; weekdayIter++){
            if(firstMonthWeekday == weekdayIter)
                break;

            let date = (lastMonthDay+1) - weekdayIter;
            dates.prepend(createDayField(date, weekdayIter, -1));
        }
        
        dates.prepend(createKwField(firstKwOfMonth));

        let dayMonthIndicator = 0;
        for(let row=0; row < 6;row++){
            for(let weekday = weekdayIter; weekday <= 7; weekday++){
                if(weekday == 0){
                    // console.log(firstKwOfMonth, row)
                    dates.append(createKwField(firstKwOfMonth+row));
                    continue
                }
                if(dateCounter < selMonthDays){
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
    updateCalenderFields();

    control.firstChild.firstChild.onchange = (ev) =>{
        updateCalenderFields();
    }

}
initCalender();
