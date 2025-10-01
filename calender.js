const TODAY = new Date();
const DEFAULT_LANG = 'de';
const MONTHS_DAYS = {1:31, 2:28, 3:31, 4:30, 5:31, 6:30, 7:31, 8:31, 9:30, 10:31, 11:30, 12:31};
const CALENDER_WORDS_DE = {'weekdays' : ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']
    , 'months' : ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
    , 'cw' : 'KW'
    , 'today' : 'Heute'
};
const CALENDER_WORDS_EN = {'weekdays' : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    , 'months' : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    , 'cw' : 'CW'
    , 'today' : 'Today'
};

//_________________________________________________________________________________________________
const isLeapYear = (year) => ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);

//_________________________________________________________________________________________________
const getCwByDate = (date_) => {
    let date = new Date(date_.getTime());

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    
    const thursday1stWeek = new Date(date.getFullYear(), 0, 4);
    
    return 1 + Math.round(((date.getTime() - thursday1stWeek.getTime()) / (24 * 3600 * 1000) - 3 + (thursday1stWeek.getDay() + 6) % 7) / 7);
};

//_________________________________________________________________________________________________
function validateConfigWords(words){
    const wordsConf = Object.getOwnPropertyNames(words);
    const wordsKeyConstraints =  Object.getOwnPropertyNames(CALENDER_WORDS_DE);
    
    for(let i = 0; i < wordsKeyConstraints.length; i++){
        let wkey = wordsKeyConstraints[i];
        if(!wordsConf.includes(wkey))
        {
            console.warn("invalid given words config: missing: "+ wkey);
            return undefined;
        }
        switch(wkey){
            case 'months':
            case 'weekdays':
                const sizeValidation = (wkey == 'weekdays' ? 7 : 12);
                if(!Array.isArray(words[wkey] ) || words[wkey].length != sizeValidation){
                    console.warn("invalid given words config: "+wkey+" is no array or length != "+sizeValidation+" => ", words[wkey]);
                    return undefined;
                } 
                break;
            case 'cw':
        }
    }
    return words;        
}

//_________________________________________________________________________________________________
function initCalender(id="calender", config = {}){
    let calender = document.getElementById(id);

    if(calender == undefined){
        console.error("calender div not found by given id "+id+" => calender is undefined => abort calender initalization!");
        return;
    }
    const selMonthId = "sel_"+calender.id + "_month";
    const selYearId = "sel_"+calender.id + "_year";
    const curDecade = Number(String(TODAY.getFullYear()).substring(0,3) + "0");

    const givenConfig = Object.getOwnPropertyNames(config);
    const curDate = givenConfig.includes('curDate') ? config['curDate'] : new Date();
    const fixedYear = givenConfig.includes('fixedYear') ? config['fixedYear'] : undefined;
    const cssDateStyle = givenConfig.includes('cssDateStyle') ? config['cssDateStyle'] : "date-simple";
    const lang = givenConfig.includes('lang') ? config['lang'] : DEFAULT_LANG;
    const showCwTxt = givenConfig.includes('showCwTxt') ? Boolean(config['showCwTxt']) : true;
    const cb_dayFieldClick = givenConfig.includes('cb_dayFieldClick') ? config['cb_dayFieldClick'] : null;

    let CALENDER_WORDS = givenConfig.includes('words') ? validateConfigWords(config['words']) : undefined;

    if(CALENDER_WORDS == undefined){
        switch(lang){
            case 'en':
                CALENDER_WORDS = CALENDER_WORDS_EN;
                break;
            default:
                CALENDER_WORDS = CALENDER_WORDS_DE;
                break;
        }
    }
    if(!CALENDER_WORDS.hasOwnProperty('weekdays_short')){
        CALENDER_WORDS['weekdays_short'] = [];
        CALENDER_WORDS['weekdays'].forEach(el =>  CALENDER_WORDS['weekdays_short'].push(el.substring(0,2)));
    }
    if(!CALENDER_WORDS.hasOwnProperty('months_short')){
        CALENDER_WORDS['months_short'] = [];
        CALENDER_WORDS['months'].forEach(el =>  CALENDER_WORDS['months_short'].push(el.substring(0,3)));
    }

    if(showCwTxt) document.documentElement.style.setProperty('--prefix-CW', "'"+CALENDER_WORDS['cw']+"'");

    let control = document.createElement("DIV");
    control.classList.add("control");
    control.innerHTML = "<div><select id='"+selMonthId+"'></select><select id='"+selYearId+"'></select></div>";
    control.innerHTML += "<div><button title='"+CALENDER_WORDS['today']+"'>⦾</button></div>"

    CALENDER_WORDS['months'].forEach(el =>control.firstChild.firstChild.innerHTML += "<option value="+CALENDER_WORDS['months'].indexOf(el)+" "+(CALENDER_WORDS['months'].indexOf(el) == curDate.getMonth() ? 'selected' : '')+">"+el+"</option>");
    
    for(let y = curDecade; y < curDecade+10; y++){control.firstChild.lastChild.innerHTML += "<option value="+y+" "+(y == curDate.getFullYear() ? 'selected' : '')+">"+y+"</option>";}
    if(fixedYear != undefined){
        control.firstChild.lastChild.style.display ='none';
        control.firstChild.innerHTML += "<span style='margin-top: 0.3rem; margin-left: 1rem;'>"+fixedYear+"</span>";
    }
    
    CALENDER_WORDS['weekdays_short'].forEach(el =>control.lastChild.innerHTML += "<i>"+el+"</i>")

    calender.append(control);

    let divDates = document.createElement("DIV");
    divDates.id = calender.id + "_divDates";
    divDates.classList.add("dates");
    divDates.classList.add("date-simple");
    calender.append(divDates);

    let selDate = new Date();

    function updateCalenderFields(){

        const selYear = Number(document.getElementById(selYearId).value);
        const selMonth = Number(document.getElementById(selMonthId).value);
        const selMonthDays = (selMonth == 1 && isLeapYear(selYear) ? 29 : MONTHS_DAYS[selMonth + 1]);

        divDates.replaceChildren();

        selDate.setFullYear(selYear);
        selDate.setMonth(selMonth);
        selDate.setMonth(selMonth); // q&d: twice otherwise the month february is considered as march for prev month and cws => dont know why yet
        selDate.setDate(1);
        let firstCwOfMonth = getCwByDate(selDate);
        let firstMonthWeekday = selDate.getDay()-1;
        firstMonthWeekday = (firstMonthWeekday == -1 ? 6 : firstMonthWeekday) + 1;
        
        selDate.setDate(selMonthDays);
        let lastMonthWeekday = selDate.getDay()-1;
        lastMonthWeekday = (lastMonthWeekday == -1 ? 6 : lastMonthWeekday) + 1;
        
        selDate.setDate(0);
        const lastMonthDay = selDate.getDate();


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
            if(date  == TODAY.getDate() && selMonth == TODAY.getMonth() && selYear == TODAY.getFullYear() && dayMonth == 0) divDay.classList.add("cur-day");
            divDay.title = CALENDER_WORDS['weekdays'][weekday-1] ;
            divDay.innerHTML = "<span>"+date+"</span><div style='display:none;'>"+date+"</div>"
    
            divDay.onclick = () =>{if(cb_onclick) cb_onclick(divDay);}
            return divDay;
        }
    
        let dateCounter = 0;
        let weekdayIter = 1;

        for(weekdayIter;weekdayIter <= 7; weekdayIter++){
            if(firstMonthWeekday == weekdayIter)
                break;

            let date = (lastMonthDay+1) - weekdayIter;
            divDates.prepend(createDayField(date, weekdayIter, -1));
        }

        divDates.prepend(createKwField(firstCwOfMonth));

        firstCwOfMonth = (selMonth == 0 && firstCwOfMonth > 1 ? 0 : firstCwOfMonth); // edge case when jan 1st is not first in first calender week

        let dayMonthIndicator = 0;
        for(let row=0; row < 6;row++){
            for(let weekday = weekdayIter; weekday <= 7; weekday++){
                if(weekday == 0){
                    let cw = firstCwOfMonth+row;
                    cw = (cw < 53 ? cw : (lastMonthWeekday > 3 ? (dateCounter > 25 && dateCounter < selMonthDays ? 53 : 1) : dateCounter > 2 && dateCounter < 10  ? 2 :1) ); // edge case overlap of cw into next year 
                    divDates.append(createKwField(cw));
                    continue
                }
                if(dateCounter < selMonthDays){
                    ++dateCounter;
                }else{
                    dateCounter = 1;
                    dayMonthIndicator = 1
                }
                divDates.append(createDayField(dateCounter, weekday, dayMonthIndicator));
            }
            weekdayIter = 0;
        }
    }
    updateCalenderFields();

    control.firstChild.firstChild.onchange = (ev) =>{updateCalenderFields();}
    control.firstChild.lastChild.onchange = (ev) =>{updateCalenderFields();}
    control.lastChild.firstChild.onclick = () =>{
        document.getElementById(selMonthId).value = TODAY.getMonth();
        document.getElementById(selYearId).value = TODAY.getFullYear();
        updateCalenderFields();
    }

}
//_________________________________________________________________________________________________
initCalender('calender', {});
// initCalender('calender', {'showCwTxt':false});
//_________________________________________________________________________________________________