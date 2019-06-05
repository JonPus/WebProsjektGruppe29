
/*function setCookie(cname,cvalue,exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  var user=getCookie("username");
  if (user != "") {
    alert("Welcome again " + user);
  } else {
     user = prompt("Please enter your name:","");
     if (user != "" && user != null) {
       setCookie("username", user, 30);
     }
  }
}*/

function removeCards(id){

  var card = getElementById("spanBar");
  return card.parentNode.removeChild(id);

}



/*Progress Bar funksjonen */

function moveFinished() {
  var elem = document.getElementById("spanBar"); 
  var width = 10;
  var id = setInterval(frame, 10);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++; 
      elem.style.width = width + '%'; 
      
    }
  }
}

function moveBar() {
  var elem = document.getElementById("spanBar"); 
  var width = 0;
  var id = setInterval(frame, 25);

  function frame() {
    if (width >= 10) {
      clearInterval(id);
    } else {
      width++; 
      elem.style.width = width + '%'; 
      
    }
  }

}

function showContainer(){

  var status = document.getElementById("chatContainer");
  if (status.style.display === "none") {
    status.style.display = "block";
  } else {
    status.style.display = "none";
  }

}



(function() {

  var UI = {
      elBoard: document.getElementById('board'),
      elTotalCardCount: document.getElementById('totalCards'),
      elCardPlaceholder: null,
    },
    lists = [],
    todos = [],
    isDragging = false,
    _listCounter = 0, 
    _cardCounter = 0;

  function live(eventType, selector, callback) {
    document.addEventListener(eventType, function (e) {
      if (e.target.webkitMatchesSelector(selector)) {
        callback.call(e.target, e);
      }
    }, false);
  }
  
  live('dragstart', '.list .card', function (e) {
    isDragging = true;
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
    e.dataTransfer.dropEffect = "copy";
    e.target.classList.add('dragcard');
  });
  live('dragend', '.list .card', function (e) {
    this.classList.remove('dragcard');
    UI.elCardPlaceholder && UI.elCardPlaceholder.remove();
    UI.elCardPlaceholder = null;
    isDragging = false;
  });

  live('dragover', '.list, .list .card, .list .card-placeholder', function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if(this.className === "list") {
      this.appendChild(getCardPlaceholder());
    } else if(this.className.indexOf('card') !== -1) { 
      this.parentNode.insertBefore(getCardPlaceholder(), this);
    }
  });
  
  live('drop', '.list, .list .card-placeholder', function (e) {
    e.preventDefault();
    if(!isDragging) return false;
    var todo_id = +e.dataTransfer.getData('text');
    var todo = getTodo({_id: todo_id});
    var newListID = null; 
    if(this.className === 'list') { 
      newListID = this.dataset.id;
      this.appendChild(todo.dom);
    } else { 
      newListID = this.parentNode.dataset.id;
      this.parentNode.replaceChild(todo.dom, this);
    }
    moveCard(todo_id, +newListID);
  });
  
  function createCard(text, listID, index) {
    if(!text || text === '') return false;
    var newCardId = ++_cardCounter;
    var card = document.createElement("div");
    var list = getList({_id: listID});
    card.draggable = true;
    card.dataset.id = newCardId;
    card.dataset.listId = listID;
    card.id = 'todo_'+newCardId;
    card.className = 'card';
    card.innerHTML = text.trim();
    var todo = {
      _id: newCardId,
      listID: listID,
      text: text,
      dom: card,
      index: index || list.cards+1 
    };
    todos.push(todo);
    
    ++list.cards;
    
    return card;
  }

  function addCard(text, listID, index, updateCounters) {

    var text = prompt("Task");

    listID = listID || 1;
    if(!text) return false;
    var list = document.getElementById('list_'+listID);
    var card = createCard(text, listID, index);
    if(index) {
      list.insertBefore(card, list.children[index]);
    } else {
      list.appendChild(card);
    }

    if(updateCounters !== false) updateCardCounts();

  }

  function newList(name) {

    var name = prompt("New List");

    name = name.trim();
    if(!name || name === '') return false;
    var newListID = ++_listCounter;
    var list = document.createElement("div");
    var heading = document.createElement("h3");
    var listCounter = document.createElement("span");
    
    list.dataset.id = newListID;
    list.id = 'list_'+newListID;
    list.className = "list";
    list.appendChild(heading);
    
    heading.className = "listname";
    heading.innerHTML = name;
    heading.appendChild(listCounter)

    listCounter.innerHTML = 0;
    
    lists.push({
      _id: newListID,
      name: name,
      cards: 0,
      elCounter: listCounter,
    });
    
    UI.elBoard.append(list);

  }

  function getList (obj) {
    return _.find(lists, obj);
  }
  
  function getTodo (obj) {
    return _.find(todos, obj);
  }
  
  function updateCardCounts (listArray) {
    lists.map(function (list) {
      list.elCounter.innerHTML = list.cards;
    })
  }
  
  function moveCard(cardId, newListId, index) {
    if(!cardId) return false;
    try {
      var card = getTodo({_id: cardId});
      if(card.listID !== newListId) {
        --getList({_id: card.listID}).cards;
        card.listID = newListId;
        ++getList({_id: newListId}).cards;
        updateCardCounts();
        moveBar();
      }
    
      if(index){
        card.index = index;
      }
      
    } catch (e) {
      console.log(e.message)
    }
  }
  
  live('submit', '#addCard', function (e) {
    e.preventDefault();
    addCard(_.trim(this.todoText.value));
    this.reset();
    return false;
  });
  live('submit', '#newList', function (e) {
    e.preventDefault();
    newList(_.trim(this.list_name.value));
    this.reset();
    return false;
  });
  
  function getCardPlaceholder () {
    if(!UI.elCardPlaceholder) { 
      UI.elCardPlaceholder = document.createElement('div');
      UI.elCardPlaceholder.className = "card-placeholder";
    }
    return UI.elCardPlaceholder;
  }
  
  function init() {

    updateCardCounts();
    
    moveCard(2, 1, 3);
  }

  document.addEventListener("DOMContentLoaded", function() {
    init();
  });
  
})();

/*Kalender Fredrik */

today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
selectYear = document.getElementById("year");
selectMonth = document.getElementById("month");

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);


function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
}

function showCalendar(month, year) {

    let firstDay = (new Date(year, month)).getDay();

    tbl = document.getElementById("calendar-body"); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";

    // filing data about month and in the page via DOM.
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;

    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                cell = document.createElement("td");
                cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth(month, year)) {
                break;
            }

            else {
                cell = document.createElement("td");
                cellText = document.createTextNode(date);
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("bg-info");
                } // color today's date
                cell.appendChild(cellText);
                row.appendChild(cell);
                date++;
            }


        }

        tbl.appendChild(row); // appending each row into calendar body.
    }

}


// check how many days in a month code from https://dzone.com/articles/determining-number-days-month
function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

function hideCalender() {
    var x = document.getElementById("hideCalender");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

  /*Nedteller Fredrik */

  /*const date = new.date();

let timer = date + intput.value; */


document.getElementById('nedtellingButton').addEventListener('click', myFunction);

function myFunction() {

  var selectHours = document.getElementById('scrollHours');
  var vHouers = selectHours[selectHours.selectedIndex].value;

  var selectMinutes = document.getElementById('scrollMinutes');
  var vMinutes = selectMinutes[selectMinutes.selectedIndex].value;
  

  var selectSeconds = document.getElementById('scrollSeconds');
  var vSeconds = selectSeconds[selectSeconds.selectedIndex].value;
 

    var hours = vHouers;
    var minutes = vMinutes;
    var seconds = vSeconds;
    var time = {
        hours: hours * 1,
        minutes: minutes * 1,
        seconds: seconds * 1
  }



    // Save the interval's handle to `timer`
    var timer = setInterval(countdown, 1000);

    function countdown() {
        var container = document.getElementById('count');

        if (time.seconds > 0) {
            time.seconds--;
        }
        else {
            if (time.minutes > 0) {
                time.minutes--;
                time.seconds = 59;
            }
            else {
                time.minutes = 59;
                time.seconds = 59;
                time.hours--;
            }
        }

        

        if (time.hours >= 0) {
            var hoursSpan = document.querySelector('.hours');
            var minutesSpan = document.querySelector('.minutes');
            var secondsSpan = document.querySelector('.seconds');
            
            
              hoursSpan.innerHTML = time.hours
              minutesSpan.innerHTML = time.minutes
              secondsSpan.innerHTML = time.seconds
        }
        else {
            container.innerHTML = 'Time over';
            clearInterval(timer);
        }
        
    }
}

/*Fredrik countdown Shutdown */

document.getElementById('startButton').addEventListener('click', getDatoFuction);

function getDatoFuction() {
    var userDate = document.getElementById('inputDato').value;
      

    var endDate = new Date(userDate).getTime();

    var timer = setInterval(function() {

        let now = new Date().getTime();
        let t = endDate - now;
        if (t >= 0) {
    
            let days = Math.floor(t / (1000 * 60 * 60 * 24));
            let hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let mins = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
            let secs = Math.floor((t % (1000 * 60)) / 1000);
    
            document.getElementById("timer-days").innerHTML = days +
            "<span class='label'>DAY(S)</span>";
    
            document.getElementById("timer-hours").innerHTML = ("0"+hours).slice(-2) +
            "<span class='label'>HR(S)</span>";
    
            document.getElementById("timer-mins").innerHTML = ("0"+mins).slice(-2) +
            "<span class='label'>MIN(S)</span>";
    
            document.getElementById("timer-secs").innerHTML = ("0"+secs).slice(-2) +
            "<span class='label'>SEC(S)</span>";
    
        } else {

            document.getElementById("timer").innerHTML = "The countdown is over!";
    
        }
    
    }, 1000);

}