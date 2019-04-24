//Name: Gabe Unruh
//Course: CSC 337
//Description: This javascript file controls the adding of calendar events to the page
//as well as displaying the events from a selected date.

"use strict";
	
(function() {

	window.onload = function() {
		createCalendar();
		document.getElementById("add").onclick = addEvent;
		document.getElementById("addDate").onclick = clear;
		document.getElementById("search").onclick = getIdFromInput;
		document.getElementById("back").onclick = hideDiv;
		//listens for every square of the calendar to be clicked
		let squares = document.querySelectorAll(".boxes");
		for(let i = 0; i < squares.length; i++) {
			squares[i].onclick = getIdFromBox;
		}
	};

	/*
	* creates the calendar for events to be added to
	*/
	function createCalendar() {
		let grid = document.getElementById("calendar");
		grid.style.display = "block";
		let x = 0;
		let y = 0;
		//creates the boxes for the weekdays
		for(let i = 0; i <= 6; i++){
			let newDiv = document.createElement("div");
			newDiv.classList.add("days");
			//positions the square
			newDiv.style.left = x + 'px';
			newDiv.style.top = y + 'px';
			let day = document.createElement("p");
			if (i==0){day.innerHTML = "Sunday";}
			if (i==1){day.innerHTML = "Monday";}
			if (i==2){day.innerHTML = "Tuesday";}
			if (i==3){day.innerHTML = "Wednesday";}
			if (i==4){day.innerHTML = "Thursday";}
			if (i==5){day.innerHTML = "Friday";}
			if (i==6){day.innerHTML = "Saturday";}
			day.classList.add("weekdays");
			newDiv.appendChild(day);
			x = x + 110;
			grid.appendChild(newDiv);
		}

		x = 0;
		y = 30;
		//creates the calendar boxes
		for(let i = 1; i <= 35; i++){
			//creates the div and assigns its class
			let newDiv = document.createElement("div");
			newDiv.classList.add("boxes");
			//positions the box
			newDiv.style.left = x + 'px';
			newDiv.style.top = y + 'px';
			x = x + 110;
			if(x == 770) {
				x = 0;
				y = y + 80;
			}
			//sets the number in every square
			if (i-3 > 0 && i-3 < 32){
				let number = document.createElement("p");
				number.innerHTML = i-3;
				number.classList.add("numbers");
				newDiv.appendChild(number);
				let name = i-3;
				newDiv.id = name;
			}
			//adds the div to the grid
			grid.appendChild(newDiv);
		}
	}

	/*
	* adds an event to the calendar and posts it to the server
	*/
	function addEvent() {
		//gets all the info from the page
		let id = document.getElementById("date").value;
		let start = document.getElementById("startTime").value;
		let startAP = document.getElementById("startAP").value;
		let end = document.getElementById("endTime").value;
		let endAP = document.getElementById("endAP").value;
		let titleInput = document.getElementById("titleInput").value;
		//creates the event div and adds the time and title to it
		let newDiv = document.createElement("div");
		newDiv.classList.add("event");
		let time = document.createElement("p");
		let title = document.createElement("p");
		let eventTime = start + startAP + '-' + end + endAP;
		time.innerHTML = eventTime;
		time.classList.add("calendarText");
		title.innerHTML = titleInput;
		title.classList.add("calendarText");
		newDiv.appendChild(time);
		newDiv.appendChild(title);
		//adds the event div to the correct box
		let box = document.getElementById(id);
		box.appendChild(newDiv);
		//posts the event to the server
		const message = {id: id, time: eventTime, title: titleInput};
		const fetchOptions = {
			method : 'POST',
			headers : {
				'Accept': 'application/json',
				'Content-Type' : 'application/json'
			},
			body : JSON.stringify(message)
		};
		let status = document.getElementById("status");
		let url = "http://localhost:3000";
		fetch(url, fetchOptions)
			.then(checkStatus)
			.then(function(responseText) {
				status.innerHTML = "Event added!";
			})
			.catch(function(error) {
				status.innerHTML = "Event couldn't be added :(";
			});

	}

	/*
	* deletes the status text from the add event box
	*/
	function clear() {
		let status = document.getElementById("status");
		status.innerHTML = '';
	}

	/*
	* gets the id of the box that was clicked
	*/
	function getIdFromBox() {
		console.log("clicked");
		displayEvents(this.id);
	}

	/*
	* gets the id that was inputted by the user
	*/
	function getIdFromInput() {
		let id = document.getElementById("dateGet").value;
		displayEvents(id);
	}

	/*
	* pops up the display box to show the events from the selected day
	*/
	function displayEvents(id) {
		//Shows the display box
		let displayBox = document.getElementById("displayBox");
		displayBox.style.display = "block";
		let displayArea = document.getElementById("display");
		displayArea.innerHTML = '';
		//adds the header with the correct date
		let newHeader = document.createElement("h2");
		newHeader.innerHTML = "Events on May " + id + ':';
		displayArea.appendChild(newHeader);
		//gets the events to be added to the display box
		let url = "http://app_name.herokuapp.com:";
		fetch(url)
			.then(checkStatus)
			.then(function(responseText) {
				
				let json = JSON.parse(responseText);
				//loops through each line of events.txt and adds the event
				for(let i=0; i<json['events'].length-1; i++) {
					//splits the line into the id, time, and title
					let parts = json['events'][i].split(':::');
					if (parts[0] == id){
						let newEvent = document.createElement("p");
						let times = parts[1].split('-');
						newEvent.innerHTML = parts[2] + " from " + times[0] + " to " + times[1];
						displayArea.appendChild(newEvent);
					}
				}
			})
			.catch(function(error) {
				console.log(error);
			});
	}

	/*
	* hides the display box when close is clicked
	*/
	function hideDiv() {
		let displayBox = document.getElementById("displayBox");
		displayBox.style.display = "none";
	}

	// returns the response text if the status is in the 200s
	// otherwise rejects the promise with a message including the status
	function checkStatus(response) {  
		if (response.status >= 200 && response.status < 300) {  
			return response.text();
		} else if (response.status == 404) {
			// sends back a different error when we have a 404 than when we have
			// a different error
			return Promise.reject(new Error("Sorry, we couldn't find that page")); 
		} else {
			return Promise.reject(new Error(response.status+": "+response.statusText)); 
		} 
	}

}) ();
