// add events to user's calendar following tutorial: https://youtu.be/zrLf4KMs71E
require('dotenv').config();

const {google} = require("googleapis") // get google api out of googleapis package

const {OAuth2} = google.auth

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET=process.env.CLIENT_SECRET;
const oAuth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET);

oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
})

const calendar = google.calendar({version: 'v3', auth: oAuth2Client})

// probably prompt in real life
const eventStartTime = new Date()
eventStartTime.setDate(eventStartTime.getDay() + 5) // set for tomorrow
const eventEndTime = new Date()
eventEndTime.setDate(eventEndTime.getDay() + 5)
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45) //45 minutes meeting

// look at docs for all info, can set required to null
const event = {
    summary: 'Meet with David',
    location: '120 4th St, San Francisco, CA 94103',
    description: 'Meeting with David to talk about new client project',
    start: {
        dateTime: eventStartTime,
        timeZone: 'America/Denver'
    },
    end: {
        dateTime: eventEndTime,
        timeZone: 'America/Denver'
    },
    colorId: 1,
}

// query to calendar to see if you have event already there (can ignore if double book is ok)
// timeMin/timeMAx: time chekced, items: all clanedar user has access to
calendar.freebusy.query({
    resource:{
        timeMin: eventStartTime,
        timeMax: eventEndTime,
        timeZone: 'America/Denver',
        items:[{id: 'primary'}]
    }
}, (err, res) => {
    if(err) return console.error("Free Busy Query Error: ", err)
    // if multiple calendar, loop over, busy is array of time ranges
    const eventsArray = res.data.calendars.primary.busy;
    
    if(eventsArray.length == 0) return calendar.events.insert({
        calendarId: 'primary',
        resource: event
        }, err =>{
            if(err) return console.error('Calendar Event Creation Error: ', err)
            return console.log("Calendar Event Created")
        }
    )
    return console.log("Sorry I am Busy")
})
