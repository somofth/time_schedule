//변수 선언
var addclass = document.getElementById('addclass');
var deleteclass = document.getElementById('deleteclass');
var reset = document.getElementById('reset');
var classLists = document.querySelector('.class-list');
var classItem = classLists.querySelectorAll('.class-list-item');
const classList = document.querySelectorAll('.class-list-item');
const timeSchedule = document.querySelector('.time-schedule');
const timeScheduleHeader = document.querySelector('.time-schedule-header');
const credit_sum = document.getElementById('credit-sum');
let selecteditem = [];
let selectedclass = [];
let credit = 0
credit_sum.innerHTML = credit;

let currentitem = null;


//연도와 학기 표시
let date = document.getElementById('date');
let d = new Date();
let current_year = d.getFullYear();
let current_semester = d.getMonth() + 1;
if (current_semester <= 3) {
    current_semester = '1';
} else if (current_semester <= 6) {
    current_semester = '여름';
} else if (current_semester <= 9) {
    current_semester = '2';
} else {
    current_semester = '겨울';
}

date.innerHTML = current_year + '년 ' + current_semester + '학기';


//수업 색깔 맵
const classColorMap = {
    "0": "#CD5C5C",
    "1": "#F08080",
    "2": "#FA8072",
    "3": "#E9967A",
    "4": "#FFA07A",
    "5": "#EEC2BD",
    "6": "#FFD700"
};
var colornum = 0;

let existclasscolor = document.querySelectorAll('.class-list-item-name');
for (let i = 0; i < existclasscolor.length; i++) {
    existclasscolor[i].style.backgroundColor = classColorMap[i % 7];
}



// 수업 선택
classLists.addEventListener('click', (e) => {
    // 클릭된 요소나 그 부모가 class-list-item인지 확인
    if (classItem) {
        //클릭할 때마다 값 초기화
        for (let i = 0; i < e.currentTarget.children.length; i++) {
            e.currentTarget.children[i].classList.remove('active');
        }
        for (var i = 1; i < timeSchedule.rows.length; i++) {
            for (var j = 0; j < timeSchedule.rows[i].cells.length; j++) {
                timeSchedule.rows[i].cells[j].classList.remove('noneaddclass');
                if (!selecteditem.includes(timeSchedule.rows[i].cells[j]) && !timeSchedule.rows[i].cells[j].classList.contains('time')) {
                    timeSchedule.rows[i].cells[j].innerHTML = ''
                }
            }
        }
        //클릭시 수업 선택
        var classone = e.target.closest('.class-list-item');
        classone.classList.add('active');
        currentitem = classone;
    }
    //클릭시 시간표에서 미리보기
    for (var i = currentitem.dataset.starttime; i <= currentitem.dataset.endtime; i++) {
        timeSchedule.rows[i].cells[currentitem.dataset.day].innerHTML = currentitem.dataset.name;
        timeSchedule.rows[i].cells[currentitem.dataset.day].classList.add('noneaddclass');
    }
}
);

//수업 더블클릭시 시간표에 넣기
classLists.addEventListener('dblclick', (e) => {
    for (var i = currentitem.dataset.starttime; i <= currentitem.dataset.endtime; i++) {
        if (!timeSchedule.rows[i].cells[currentitem.dataset.day].classList.contains('addclass')) {
            timeSchedule.rows[i].cells[currentitem.dataset.day].innerHTML = currentitem.dataset.name;
            timeSchedule.rows[i].cells[currentitem.dataset.day].classList.remove('noneaddclass')
            timeSchedule.rows[i].cells[currentitem.dataset.day].classList.add('addclass');
            timeSchedule.rows[i].cells[currentitem.dataset.day].style.backgroundColor = currentitem.dataset.color;
            selecteditem.push(timeSchedule.rows[i].cells[currentitem.dataset.day]);
        } else if (confirm('이미 수업이 있습니다. 수업을 추가하시겠습니까?')) {
            timeSchedule.rows[i].cells[currentitem.dataset.day].innerHTML = currentitem.dataset.name;
            timeSchedule.rows[i].cells[currentitem.dataset.day].classList.remove('noneaddclass')
            timeSchedule.rows[i].cells[currentitem.dataset.day].classList.add('addclass');
            timeSchedule.rows[i].cells[currentitem.dataset.day].style.backgroundColor = currentitem.dataset.color;
            selecteditem.push(timeSchedule.rows[i].cells[currentitem.dataset.day]);
        } else {
            return;
        }
    }
    selectedclass.push(currentitem);
    credit_sum_calculate();

})

//수업 시간표 내에서 수업 삭제
timeSchedule.addEventListener('dblclick', (e) => {
    if (e.target.classList.contains('addclass') && confirm('수업을 삭제하시겠습니까?')) {
        const className = e.target.innerHTML;
        // 시간표에서 같은 수업명을 가진 모든 셀 찾아서 초기화
        for (let i = 1; i < timeSchedule.rows.length; i++) {
            for (let j = 1; j < timeSchedule.rows[i].cells.length; j++) {
                if (timeSchedule.rows[i].cells[j].innerHTML === className) {
                    timeSchedule.rows[i].cells[j].innerHTML = '';
                    timeSchedule.rows[i].cells[j].classList.remove('addclass');
                    timeSchedule.rows[i].cells[j].style.backgroundColor = 'white';
                }
            }
        }
        selectedclass = selectedclass.filter(item => item.dataset.name !== className);
        credit_sum_calculate();
    }
});


//수업과 수업 정보 추가 
addclass.addEventListener('click', () => {
    let newclassitem = document.createElement('div');
    let newclassitemName = document.createElement('div');
    let newclassitemDetail = document.createElement('div');
    newclassitem.setAttribute('class', 'class-list-item');
    newclassitemName.setAttribute('class', 'class-list-item-name');
    newclassitemDetail.setAttribute('class', 'class-list-item-detail');
    newclassitemName.innerHTML = prompt('수업 이름을 입력하세요');
    newclassitem.dataset.name = newclassitemName.innerHTML;
    var day = prompt('수업 요일을 입력하세요');
    switch (day) {
        case '월':
            newclassitem.dataset.day = 1;
            break;
        case '화':
            newclassitem.dataset.day = 2;
            break;
        case '수':
            newclassitem.dataset.day = 3;
            break;
        case '목':
            newclassitem.dataset.day = 4;
            break;
        case '금':
            newclassitem.dataset.day = 5;
            break;
        case '토':
            newclassitem.dataset.day = 6;
            break;
        case '일':
            newclassitem.dataset.day = 7;
            break;
    }
    newclassitem.dataset.starttime = prompt('수업 시작 교시를 입력하세요 (숫자)');
    if (isNaN(newclassitem.dataset.starttime)) {
        alert('숫자를 입력해주세요');
        return;
    }
    newclassitem.dataset.endtime = prompt('수업 종료 교시를 입력하세요 (숫자)');
    if (isNaN(newclassitem.dataset.endtime)) {
        alert('숫자를 입력해주세요');
        return;
    } else if (newclassitem.dataset.starttime >= newclassitem.dataset.endtime) {
        alert('시작 교시가 종료 교시보다 크거나 같을 수 없습니다.');
        return;
    }
    newclassitem.dataset.credit = newclassitem.dataset.endtime - newclassitem.dataset.starttime + 1;
    newclassitemName.style.backgroundColor = classColorMap[colornum % 7];
    newclassitem.dataset.color = classColorMap[colornum % 7];
    colornum++;
    newclassitemDetail.innerHTML = day + '요일 ' + newclassitem.dataset.starttime + '-' + newclassitem.dataset.endtime + '교시';
    newclassitem.appendChild(newclassitemName);
    newclassitem.appendChild(newclassitemDetail);
    classLists.appendChild(newclassitem);
});

//수업 삭제
deleteclass.addEventListener('click', () => {
    if (currentitem) {
        currentitem.remove();
    }
});

//학점 합계 계산
function credit_sum_calculate() {
    credit = 0;
    for (let i = 0; i < selectedclass.length; i++) {
        credit += parseInt(selectedclass[i].dataset.credit);
        credit_sum.innerHTML = credit;
    }
    if (credit > 20) {
        alert('학점이 20을 초과합니다.');
        return;
    }
}


//시간표 초기화하기
reset.addEventListener('click', () => {
    if (confirm('시간표를 초기화하시겠습니까?')) {
        for (var i = 1; i < timeSchedule.rows.length; i++) {
            for (var j = 1; j < timeSchedule.rows[i].cells.length; j++) {
                timeSchedule.rows[i].cells[j].removeAttribute('class');
                timeSchedule.rows[i].cells[j].innerHTML = '';
                timeSchedule.rows[i].cells[j].style.backgroundColor = 'white';
            }
        }
    }
});


//시간표 출력하기
const element = document.querySelector("#capture");
const options = {
    backgroundColor: '#ffffff',
    scale: 2
};
let capturebutton = document.querySelector('#capture-button');
capturebutton.addEventListener('click', () => {
    for (var i = 1; i < timeSchedule.rows.length; i++) {
        for (var j = 0; j < timeSchedule.rows[i].cells.length; j++) {
            timeSchedule.rows[i].cells[j].classList.remove('noneaddclass');
            if (!selecteditem.includes(timeSchedule.rows[i].cells[j])) {
                timeSchedule.rows[i].cells[j].innerHTML = ''
            }
        }
    }
    html2canvas(element, options).then(canvas => {
        console.log('찰칵');
        let imgbox = document.createElement('div');
        let msg = document.createElement('div');
        msg.innerHTML = '캡쳐 완료';
        imgbox.setAttribute('class', 'imgbox');
        imgbox.appendChild(canvas);
        imgbox.appendChild(msg);
        //document.body.appendChild(imgbox);

        const imageURL = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = imageURL;
        link.download = "시간표.png"; // 저장될 파일 이름
        link.click();
    });
    alert('캡쳐 완료');
});

