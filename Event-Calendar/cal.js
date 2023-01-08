var events = [];
var startHours = 0;
var timeslotInterval = 15;
const daysInaWeek = 7;
var eventContainer = document.getElementsByClassName("event-container")[0];
var maindims = eventContainer.getBoundingClientRect();
var sections = daysInaWeek;
var eventsByDay = [];
if(!JSON.parse(localStorage.getItem("calendar-events"))){
  localStorage.setItem("calendar-events", "{}")
} else{
  eventsByDay = JSON.parse(localStorage.getItem("calendar-events") || "{}");
}
var eventDate = document.getElementById("date");
var start = document.getElementById("starttime");
var end = document.getElementById("endtime");
var id = Number(localStorage.getItem("calendar-id") || "1");
var taskSelector = document.querySelector("#calendar-add-selector");
var deleteSelector = document.querySelector("#calendar-delete-selector");
var deleteButton = document.getElementById("calendar-delete-button");

var selectorValuesStr = [];

if (localStorage.getItem("calendar-delete-selector-value") == null){
  localStorage.setItem("calendar-delete-selector-value", JSON.stringify("{}")); // setting empty array
} else {
  selectorValuesStr = localStorage.getItem("calendar-delete-selector-value").split(",");
}


var todosData = "[]";

Window.onload = loadPage();

function loadPage(){
  //update delete selector with data from storage
  for(let i=1; i < selectorValuesStr.length; i++){
    deleteSelector.add(new Option(selectorValuesStr[i], Number(selectorValuesStr[i])), undefined);
  }

  //update add selector
  todosData = JSON.parse(localStorage.getItem("todos")|| "[]");
  for(let i=0; i<todosData.length; i++){
    taskSelector.add(new Option(todosData[i].content, todosData[i].content), undefined) //TODO: create task id?
  }

  //update page with events from storage
  processEvents();
  loadEvents();
}

//delete events
document.querySelector(".delete-event-button").onclick = function() {
  let deleteTaskId = deleteSelector.options[deleteSelector.selectedIndex].value;
  if(deleteTaskId == "defaultPrompt"){
    return;
  }

  //remove event from eventsByDay and calendar screen
  Object.keys(eventsByDay).forEach(e => {
    const eventsForThisDay = eventsByDay[e];
    Object.keys(eventsForThisDay).forEach(c => {
      const events = eventsForThisDay[c];
      for (var i = 0; i < events.length; i++) {
        if (events[i].id.toString() == deleteTaskId){
          events.splice(i, 1); //remove that element
        }
      }
    })
  })
  localStorage.setItem("calendar-events", JSON.stringify(eventsByDay));
  eventContainer.innerHTML = "";
  loadEvents();

  //remove event from selector
  deleteSelector.remove(deleteSelector.selectedIndex);
  selectorValuesStr.splice(selectorValuesStr.indexOf(deleteTaskId.toString()), 1);
  localStorage.setItem("calendar-delete-selector-value", selectorValuesStr);
}

//clear all
document.querySelector(".clear-all-events-button").onclick = function() {
  //restart id
  id = 1;
  localStorage.setItem("calendar-id", id.toString());

  //clear delete selector
  deleteSelector.innerHTML = null;
  deleteSelector.add(new Option("Element id to remove", "defaultPrompt"), undefined);
  selectorValuesStr=["{}"];
  localStorage.setItem("calendar-delete-selector-value", selectorValuesStr);

  //remove all events
  Object.keys(eventsByDay).forEach(e => {
    const eventsForThisDay = eventsByDay[e];
    Object.keys(eventsForThisDay).forEach(c => {
      const events = eventsForThisDay[c];
      for (let i = 0; i < events.length; i++) {
        events.splice(i, 1); //remove that element
      }
    })
  })
  localStorage.setItem("calendar-events", JSON.stringify(eventsByDay));
  eventContainer.innerHTML = "";
  loadEvents();
}

// add events
document.querySelector(".add-event-button").onclick = function() {
  let addValue = taskSelector.options[taskSelector.selectedIndex].value;
  if(addValue == "defaultPrompt"){
    return;
  }

  if(start.value >= end.value){
    alert("End time must be after start time");
    return;
  }
  
  let currentTaskColor = "red";
  for(let i=0; i<todosData.length; i++){
    if(todosData[i].content == addValue){
      currentTaskColor = todosData[i].color;
      break;
    }
  }
  const evt = {
    id: id,
    starttime: start.value,
    endtime: end.value,
    date: eventDate.value,
    taskName: addValue,
    taskColor: currentTaskColor
  };

  //update selector
  deleteSelector.add(new Option(id.toString(), id), undefined);
  selectorValuesStr.push(id.toString());
  localStorage.setItem("calendar-delete-selector-value", selectorValuesStr);

  //update calendar
  eventContainer.innerHTML = "";
  events = [];
  events.push(evt);
  processEvents();
  loadEvents();
  
  //update storage
  id++;
  localStorage.setItem("calendar-id", id.toString());
  localStorage.setItem("calendar-events", JSON.stringify(eventsByDay));
};

function processEvents() {
  eventsByDay = JSON.parse(localStorage.getItem("calendar-events") || "[]");
  events.forEach(evt => {
    const cell = getCell(evt.starttime);

    // check if exist
    if (!eventsByDay[evt.date]) {
      eventsByDay[evt.date] = {};
      eventsByDay[evt.date][cell] = [];
    }

    if (!eventsByDay[evt.date][cell]) {
      eventsByDay[evt.date][cell] = [];
    }

    eventsByDay[evt.date][cell].push(evt);
  });
}

function getCell(starttime) {
  const h = +starttime.split(":")[0];
  return h - startHours;
}
/**
 * sort by starttime
 */
function sortcomparer(e1, e2) {
  const t1start = timeFromString(e1.starttime);
  const t1end = timeFromString(e1.endtime);
  const t2start = timeFromString(e2.starttime);
  const t2end = timeFromString(e2.endtime);

  const t1 = +(t1end - t1start);
  const t2 = +(t2end - t2start);

  return t2 - t1;
}

//loadEvents();

function loadEvents() {
  Object.keys(eventsByDay).forEach(e => {
    const eventsForThisDay = eventsByDay[e];
    Object.keys(eventsForThisDay).forEach(c => {
      const events = eventsForThisDay[c];
      events.sort(sortcomparer);
      var totalEventsPerCell = events.length;
      var offset = 0;

      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        
        const colPos = getColumnPosition(event.date);
        const perc = 100 / (sections + 1 - colPos);
        const percW = Math.floor(perc / totalEventsPerCell);

        var wMultiplier = 1.5;
        // for last one is just percW
        if (offset === totalEventsPerCell - 1) {
          wMultiplier = 0.95;
        }

        //format start/end time from 24 hours to 12 hours clock
        const formattedStartHour = (event.starttime.split(":")[0] % 12) || 12;
        const formattedStartMinute = event.starttime.split(":")[1];
        const formattedEndHour = (event.endtime.split(":")[0] % 12) || 12;
        const formattedEndMinute = event.endtime.split(":")[1];

        event["width"] = percW * wMultiplier;
        event["left"] = percW * offset;
        event["time"] = `${formattedStartHour}:${formattedStartMinute} - ${formattedEndHour}:${formattedEndMinute}`;
        renderEvent(event);

        ++offset;
      }
    });
  });
}

function renderEvent(evt) {
  var oneEvent = document.createElement("div");
  var eventStatus = document.createElement("div");
  var eventName = document.createElement("div");
  var eventTime = document.createElement("div");
  eventName.innerHTML = `${evt.id}: ${evt.taskName}`; //TODO: make this multiple lines instead of cutoff
  eventTime.innerHTML = `${evt.time}`;

  oneEvent.appendChild(eventStatus);
  oneEvent.appendChild(eventName);
  oneEvent.appendChild(eventTime);
  eventName.setAttribute("class", "event-name");
  eventTime.setAttribute("class", "event-name");
  eventStatus.setAttribute("class", "event-status");
  oneEvent.setAttribute("class", "slot");

  /**
   * if two events have same start time
   */
  oneEvent.style.background = evt.taskColor;
  oneEvent.style.width = evt.width + "%";
  oneEvent.style.left = evt.left + "%";
  oneEvent.style.zIndex = evt.zindex;
  oneEvent.style.height = getHeight(evt.starttime, evt.endtime) + "px";
  // 100 / ((8-colPos))
  oneEvent.style.gridColumnStart = getColumnPosition(evt.date);
  oneEvent.style.gridRowStart = getRowPosition(evt.starttime);

  /* add to event container */
  eventContainer.appendChild(oneEvent);
}

function getEventsForCell(starttime) {
  const h = starttime.split(":")[0];
  const eventsForCell = events.filter(e => e.starttime.split(":")[0] === h);
  return eventsForCell;
}

function getEventsForDay(day) {
  const eventsForDay = events.filter(e => e.date === day);
  return eventsForDay;
}
/**
 * given a start date returns the column position
 *
 * input: startdate (yy-mm-dd)
 */
function getColumnPosition(startdate) {
  const y = +startdate.split("-")[0];
  const m = +startdate.split("-")[1];
  const d = +startdate.split("-")[2];

  const date = new Date(y, m - 1, d);
  return date.getDay() + 1;
}

/**
 * given start time returns the row position
 *
 * input: starttime (x:xx)
 */
function getRowPosition(starttime) {
  const h = +starttime.split(":")[0];
  const m = +starttime.split(":")[1];
  const totalMinutes = Math.abs(startHours - h) * 60 + m;
  const rowPos = totalMinutes / timeslotInterval + 1;

  return rowPos;
}

/**
 * given start and end times will return the height in px
 *
 * start: x:xx
 * end: x:xx
 */
function getHeight(starttime, endtime) {
  const starthour = starttime.split(":")[0];
  const startmin = starttime.split(":")[1];
  const endhour = endtime.split(":")[0];
  const endmin = endtime.split(":")[1];

  var datestart = new Date();
  var dateend = new Date();
  datestart.setHours(parseInt(starthour));
  datestart.setMinutes(parseInt(startmin));

  dateend.setHours(parseInt(endhour));
  dateend.setMinutes(parseInt(endmin));

  var duration = Math.abs(datestart.valueOf() - dateend.valueOf()) / 1000;
  return duration / 60;
}

function timeFromString(string, local) {
  var d = new Date(0);

  var h = string.split(":")[0];
  var m = string.split(":")[1];

  d.setHours(h);
  d.setMinutes(m);

  return d;
}

/**
 *  fmt: "yyyy-mm-dd"
 */
function dateFromString(string, local) {
  var d = new Date(0);

  const y = +string.split("-")[0];
  const m = +string.split("-")[1];
  const day = +string.split("-")[2];

  d.setFullYear(y, m, d);
  d.setMonth(m);
  d.setDate(day);

  return d;
}
