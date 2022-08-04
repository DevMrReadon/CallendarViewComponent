let testArray=[
    {"cropStageId":3953,"startDate":"2022-06-12T00:00:00","endDate":"2022-09-09T00:00:00","order":1,"cropStageName":"Flowering"},{"cropStageId":3952,"startDate":"2022-09-10T00:00:00","endDate":"2022-12-08T00:00:00","order":2,"cropStageName":"Maturing"},{"cropStageId":3951,"startDate":"2022-12-09T00:00:00","endDate":"2023-03-08T00:00:00","order":3,"cropStageName":"Harvest"},{"cropStageId":3950,"startDate":"2023-03-09T00:00:00","endDate":"2023-06-11T00:00:00","order":4,"cropStageName":"Growth"}
  ]

$( document ).ready(function(){  
let jobArray = Array();
let ranges = Array();
let currentCropStageIndex = 0;
let monthes = Array();
let elements = Array();
// let _dotNetHelper = dotNetHelper;
function initializeCropStageCalendar( cropStages) {
    // _dotNetHelper = dotNetHelper;
    $(document).ready(function () {
        initCropStageCalendarLocal(cropStages)
        // unslick();
        // initCropStageCalendarLocal(cropStages)
    });
}

//initialize component
function initCropStageCalendarLocal(testArray) {
    
    jobArray = testArray;
    changeStage('default');
    ranges = getDateRanges(jobArray);
    elements = createCalendar(rev_slider, monthes);
    startSlickSlider(elements);
    getColoredDates(ranges);
    addEventListeners(ranges);
    initializeSelectedStage(ranges);
}
//render calendar
function createCalendar(elem, datesToRender) {
    let elements = Array();
    datesToRender.forEach((element, key) => {
        let data = element.split('-');
        let mon = data[0] - 1;
        let fullMonth = data[0];
        let year = data[1];
        let d = new Date(year, mon)
        let dateNow = new Date();
        let normilizedDateNow = dateNow.getDate() + "_" + (dateNow.getMonth() + 1) + "_" + dateNow.getFullYear();

        let monthName = d.toLocaleString('eng', { month: 'long' });
        let table = "<div class='slide-container'><div class='slide'><div id='calendar' class='calendar'><div class='stages_calendar_width'></div><div class='stages_calendar_width stages_calendar_label'>" + monthName + " " + year + "</div>" +
            "<table class='stages_table'><tr><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th><th>Su</th></tr><tr>";

        // пробелы для первого ряда
        // с понедельника до первого дня месяца
        // * * * 1  2  3  4
        for (let i = 0; i < getDay(d); i++) {
            table += "<td></td>";
        }

        // <td> ячейки календаря с датами
        while (d.getMonth() == mon) {
            if ((d.getDate() + "_" + fullMonth + "_" + year) == normilizedDateNow) {
                table += "<td class='" + "slide_" + key + "' id='" + "td_" + d.getDate() + "_" + fullMonth + "_" + year + "'><span class='date_cell currentDate'>" + d.getDate() + "</span></td>";
            }
            else {
                table += "<td class='" + "slide_" + key + "' id='" + "td_" + d.getDate() + "_" + fullMonth + "_" + year + "'><span class='date_cell'>" + d.getDate() + "</span></td>";
            }


            if (getDay(d) % 7 == 6) {
                // вс, последний день - перевод строки
                table += "</tr><tr>";
            }

            d.setDate(d.getDate() + 1);
        }

        // добить таблицу пустыми ячейками, если нужно
        // 29 30 31 * * * *
        if (getDay(d) != 0) {
            for (let i = getDay(d); i < 7; i++) {
                table += "<td></td>";
            }
        }

        // закрыть таблицу
        table += "</tr></table></div></div></div>";
        elements.push(table);
    })
    return elements;
}

//get dates for calendar
function getDay(date) {
    // получить номер дня недели, от 0 (пн) до 6 (вс)
    let day = date.getDay();
    if (day == 0) day = 7; // сделать воскресенье (0) последним днем
    return day - 1;
}

//get date ranges
function getDateRanges(testArray) {
    let dateRangesArray = Array();
    testArray.forEach(element => {
        let startDate = new Date(element.startDate);
        startDate.setHours(0, 0, 0, 0);
        let endDate = new Date(element.endDate);
        endDate.setHours(0, 0, 0, 0);
        let newArray = Array();
        while (startDate <= endDate) {
            let monthAndYear = (startDate.getMonth() + 1) + '-' + startDate.getFullYear();
            if (monthes.indexOf(monthAndYear) == -1) {
                monthes.push(monthAndYear);
            }
            newArray.push(startDate.getDate() + '_' + (startDate.getMonth() + 1) + '_' + startDate.getFullYear());
            startDate.setDate(startDate.getDate() + 1);
        }
        dateRangesArray.push(newArray)
    })
    return dateRangesArray;
}

//get colored dates & classNames
function getColoredDates(ranges) {

    let colorList = [
        '#64D991','#4CA2FF','#F0DC75','#A980DE','#FF8E7E','#FEB47F','#6EE7E0'
    ];
    // // let colorListHeadings = [
    // //     '#41BB70','#2486F2','#FFDC24','#9762DB','#FF725F','#F69B59','#3EDED4'
    // // ];

    ranges.map((element, key) => {
        element.forEach((item) => {
            $('#td_' + item).addClass('item_' + key);
            $('#td_' + item).css('color', colorList[key % colorList.length]);
           
        })
    })
}

//start slider
function initializeSelectedStage(ranges) {
    let date = new Date();
    let stageNum = null;
    let currentDate = date.getDate() + "_" + (date.getMonth() + 1) + "_" + date.getFullYear();
    ranges.map((element, key) => {
        element.forEach(item => {
            if (currentDate == item) {
                stageNum = key;
                paintSelected(key);
            }
        })
    });
    if (stageNum != null) {
        currentCropStageIndex = stageNum;
        let item = document.getElementsByClassName('item_' + stageNum)[0];

        let slideNum = (($(item).attr('class')).split(" ")[0]).replace('slide_', "");
        let elements = document.querySelectorAll('.slide');
        elements.forEach(element => {
            if ($(element).attr("data-slick-index") == slideNum) {

                setTimeout(() => {
                    $('.rev_slider').slick('slickGoTo', $(element).attr("data-slick-index"));
                }, 100)
            }
        })
    }
}

//get selected stage
function paintSelected(id) {
    let colorsArray = {
        'rgb(100, 217, 145)':'rgb(65, 187, 112)',
        'rgb(76, 162, 255)':'rgb(36, 134, 242)',
        'rgb(240, 220, 117)':'rgb(255, 220, 36)',
        'rgb(169, 128, 222)':'rgb(151, 98, 219)',
        'rgb(255, 142, 126)':'rgb(255, 114, 95)',
        'rgb(254, 180, 127)':'rgb(246, 155, 89)',
        'rgb(110, 231, 224)':'rgb(62, 222, 212)',
        'rgb(65, 187, 112)':'rgb(100, 217, 145)',
        'rgb(36, 134, 242)':'rgb(76, 162, 255)',
        'rgb(255, 220, 36)':'rgb(240, 220, 117)',
        'rgb(151, 98, 219)':'rgb(169, 128, 222)',
        'rgb(255, 114, 95)':'rgb(255, 142, 126)',
        'rgb(246, 155, 89)':'rgb(254, 180, 127)',
        'rgb(62, 222, 212)':'rgb(110, 231, 224)',
    };  

    if(!$('#td_' + ranges[id][0])[0].classList.contains('selected'))
    {
        setTimeout(()=>{
            let items = document.querySelectorAll('.selected');
            if (items.length != 0 && items.length != null) {
                // for (var j = 0; j <= items.length - 1; j++) {
                //     if(j==0||j==items.length-1)
                //     {
                //     items[j].classList.remove("selected");
                //     let color = items[j].style.background;
                //     items[j].style.color = color;
                //     items[j].style.background = '#ffffff';
                //     }
                //     else
                //     {
                //     items[j].classList.remove("selected");
                //     let color = items[j].style.background;
                //     items[j].style.color = color;
                //     items[j].style.background = '#ffffff';
                //     }
                // };
                items.forEach((element,key)=>{
                    if(key==0||key==items.length-1)
                    {
                    element.classList.remove("selected");
                    let color = element.style.background;
                    element.style.color = colorsArray[color];
                    element.style.background = '#ffffff';
                    }
                    else
                    {
                    element.classList.remove("selected");
                    let color = element.style.background;
                    element.style.color = color;
                    element.style.background = '#ffffff';
                    }
                })
            }

        },100);

        setTimeout(()=>{
        ranges[id].forEach((element, key) => {
            if(key==0||key==ranges[id].length-1)
            {
                $('#td_' + element).addClass('selected');
                let color = $('#td_' + element).css('color');
                $('#td_' + element).css('background', colorsArray[color]);
                $('#td_' + element).css('color', 'white');
            }
            else
            {
                $('#td_' + element).addClass('selected');
                let color = $('#td_' + element).css('color');
                $('#td_' + element).css('background', color);
                $('#td_' + element).css('color', 'white');
            }
        });
        },100);
    }
    
}

//add event listeners
function addEventListeners(ranges) {
    ranges.map((element, key) => {
        let elements = document.querySelectorAll('.item_' + key);
        for (let i = 0; i < elements.length; i++) {
            $(elements[i]).click(() => {
                if (elements[i].classList[2] != 'selected')
                {
                setSelectedStageOnClick(elements[i])
                }
            });

            elements[i].addEventListener('mouseover', function () {
                let elementsNext = document.querySelectorAll('.item_' + key);
                elementsNext.forEach(elementNext => {
                    if (elementNext.classList[2] != 'selected') {
                        elementNext.classList.add('over');
                    }
                })
            })

            elements[i].addEventListener('mouseout', function () {
                let elementsNext = document.querySelectorAll('.item_' + key);
                elementsNext.forEach(elementNext => {
                    if (elementNext.classList[2] != 'selected') {
                        elementNext.classList.remove('over');
                    }
                })
            })
        }
    })
}

function selectStageById(cropStageId) {
    let index = jobArray.findIndex(x => x.cropStageId == cropStageId);
    paintSelected(index)
    let slideNum = $('.item_' + index).attr('class').split(" ")[0];
    let num = slideNum.replace('slide_', '');
    console.log(num);
    $('.rev_slider').slick('slickGoTo', num);
}

//select Stages by click on date
function setSelectedStageOnClick(item) {
    
    let id = $(item).attr('id');
    let startDate = "";
    ranges.map(element => {
        element.forEach(item => {
            if (item == id.replace('td_', '')) {
                currentCropStageIndex = ranges.indexOf(element);
                paintSelected(currentCropStageIndex)
                startDate = element[0];
            }
        })
    })
    let slideNum = $('#td_' + startDate).attr('class').split(" ")[0];
    
    let elements = document.querySelectorAll('.slick-slide');
    elements.forEach(element => {
        if ($(element).attr("data-slick-index") == slideNum.replace('slide_', '')) {
            
            $('.rev_slider').slick('slickGoTo', $(element).attr("data-slick-index"));
        }
    })
    // _dotNetHelper.invokeMethodAsync('OnJSCropStageSelected', jobArray[currentCropStageIndex].cropStageId)
}

//change Stages controller for stage buttons
function changeStage(action) {
    switch (action) {
        case 'prev':
            if (currentCropStageIndex > 0) {
                currentCropStageIndex--;
                paintSelected(currentCropStageIndex)
                let start = new Date(jobArray[currentCropStageIndex].startDate);
                let currDate = start.getDate() + "_" + (start.getMonth() + 1) + "_" + start.getFullYear();


                let slideNum = $('#td_' + currDate).attr('class').split(" ")[0];
                let elements = document.querySelectorAll('.slide');
                elements.forEach(element => {
                    if ($(element).attr("data-slick-index") == slideNum.replace('slide_', '')) {
                        $('.rev_slider').slick('slickGoTo', $(element).attr("data-slick-index"));
                    }
                })
            }
            break;


        case 'next':
            if (currentCropStageIndex < jobArray.length - 1) {
                currentCropStageIndex++;
                paintSelected(currentCropStageIndex)
                let start = new Date(jobArray[currentCropStageIndex].startDate);
                let currDate = start.getDate() + "_" + (start.getMonth() + 1) + "_" + start.getFullYear();


                let slideNum = $('#td_' + currDate).attr('class').split(" ")[0];
                let elements = document.querySelectorAll('.slide');
                elements.forEach(element => {
                    if ($(element).attr("data-slick-index") == slideNum.replace('slide_', '')) {
                        $('.rev_slider').slick('slickGoTo', $(element).attr("data-slick-index"));
                    }
                })
            }
            break;


        case 'default':
            currentCropStageIndex = 0;
            break;
        default:
            break;
    }
}

//start slider
function startSlickSlider(elements, active) {
    $(".rev_slider").slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        swipeToSlide: true,
        dots: true,
        speed: 400,
        respondTo: "slider",
        responsive: [
            {
                breakpoint: 1100,
                settings: {
                    infinite: false,
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    arrows: false,
                    speed: 400,
                },
            },
            {
                breakpoint: 750,
                settings: {
                    infinite: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    speed: 400,
                },
            },
        ],
    });
    $(".left").click(function () {
        $(".rev_slider").slick("slickPrev");
    });

    $(".right").click(function () {
        $(".rev_slider").slick("slickNext");
    });
    elements.forEach(element => {
        $(".rev_slider").slick('slickAdd', element);
    });
}

function unslick()
{
    $(".rev_slider").slick('unslick');
    $(".rev_slider").empty();
}

initializeCropStageCalendar(testArray);
});
