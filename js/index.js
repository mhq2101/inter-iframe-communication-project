//All iframe Nodes will be stored here
var frames = [];

//making sure frames dont get stacked on top of eachother
var tope = 110;
var left = 0;

//Message from child Event Listener
var eventMethod = window.addEventListener
  ? "addEventListener"
  : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod === "attachEvent"
  ? "onmessage"
  : "message";

//Message Event Handler  
eventer(messageEvent, function (e) {
  if (frames.length) {
    frames.forEach((source, i) => {
      //if the source of the message matches the one of our frames we then use this info to identify to other users who sent the message
      if (source.contentWindow === e.source) {
        //We want to take all child iframes and send our message out to them
        frames.forEach((frame, j) => {
          // if the message came from the user
          if (i===j) {
            var self = true;
          }
          else {
            var self = false;
          }
          //this is the data object we send over to everyone, containing the date sent, the message, the self boolean
          var tempData = {
            message: `[User ${i + 1}]: ${e.data}`,
            time: new Date(),
            self
          }
          frame.contentWindow.postMessage(tempData, "*");
        })
        return;
      }
    })
  }
});

//this bit of code allows us to drag our chat boxes
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

//helper function assist in positioning of boxes
function positionAdder() {
  if (left>=900) {
    left = 0
    tope += 350;
  }
  else {
    left += 300
  }
}

//this is our + button onclick handler
//this will create a new chat box iframe to be used both appending it to the dom and storing it in our frames array
function addChat() {
  var newDiv = document.createElement('div')
  newDiv.style.top = tope + 'px';
  newDiv.style.left = left + 'px';
  positionAdder()
  newDiv.setAttribute('id', 'mydiv' + frames.length.toString());
  newDiv.setAttribute('class', 'mydiv');
  var newDivHeader = document.createElement('div')
  newDivHeader.setAttribute('id', 'mydivheader' + frames.length.toString());
  newDivHeader.setAttribute('class', 'mydivheader');
  newDivHeader.innerHTML += "User " + (frames.length + 1).toString();
  var newFrame = document.createElement("iframe")
  newFrame.setAttribute("src", "frame.html")
  newFrame.setAttribute("width", "300")
  newFrame.setAttribute("height", "300")
  newFrame.setAttribute("id", 'frame' + frames.length.toString())
  //send a message to each existing child node that a new user has joined
  frames.forEach((frame) => {
    frame.contentWindow.postMessage([frames.length+1], '*')
  });
  frames.push(newFrame)
  newDiv.appendChild(newDivHeader)
  newDiv.appendChild(newFrame)
  document.body.appendChild(newDiv)
  dragElement(newDiv);
}