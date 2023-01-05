var events = [];
var startHours = 1;
var timeslotInterval = 15;
const daysInaWeek = 7;
var eventContainer = document.getElementsByClassName("event-container")[0];
var maindims = eventContainer.getBoundingClientRect();
var sections = daysInaWeek;
var eventsByDay = {};
var eventDate = document.getElementById("date");
var start = document.getElementById("starttime");
var end = document.getElementById("endtime");
var id = 1;
var deleteSelector = document.querySelector("#calendar-delete-selector");
var deleteButton = document.getElementById("calendar-delete-button");

//delete events
document.querySelector(".delete-event-button").onclick = function() {
  let deleteTaskId = deleteSelector.options[deleteSelector.selectedIndex].value;
  if(deleteTaskId == "defaultPrompt"){
    return;
  }

  // getEvents();

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
  deleteSelector.remove(deleteSelector.selectedIndex);
  console.log(JSON.stringify(deleteSelector));
}

// add events
document.querySelector(".add-event-button").onclick = function() {
  // getEvents();
  const evt = {
    id: id,
    starttime: start.value,
    endtime: end.value,
    date: eventDate.value,
    taskName: "Write Essay", //TODO: make this task name
    taskColor: "rgba(167, 223, 217, 1)" //TODO: make this subject color
  };

  deleteSelector.add(new Option(id.toString(), id), undefined);
  // localStorage.setItem("calendar-events", JSON.stringify(evt));
  
  id++;
  eventContainer.innerHTML = "";
  events = [];
  events.push(evt);
  processEvents();
  loadEvents();
  localStorage.setItem("calendar-events", JSON.stringify(eventsByDay));
  console.log(JSON.parse(localStorage.getItem("calendar-events") || "[]"))
};

function processEvents() {
  eventsByDay = JSON.parse(localStorage.getItem("calendar-events") || "[]"); //TODO: load when page is loaded (instead of every time), delete selector
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

  //return t1start.getTime() - t2start.getTime();
  const t1 = +(t1end - t1start);
  const t2 = +(t2end - t2start);

  return t2 - t1;
}

//loadEvents();

function loadEvents() {
  //sortEvents();
  //console.log(eventsByDay);
  // eventsByDay = JSON.parse(localStorage.getItem("calendar-events") || "[]");
  Object.keys(eventsByDay).forEach(e => {
    const eventsForThisDay = eventsByDay[e];
    //console.log(eventsForThisDay);
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
