var updatedTime = 0;
//  document.getElementById('submit').onclick =
document.querySelector('form').onsubmit = function (e) {
  e.preventDefault();
  var message = document.getElementById('message').value;
  parent.postMessage(message, "*");
  document.getElementById('message').value = ""
}

//MESSAGE FROM PARENT EVENT LISTENER
var eventMethod = window.addEventListener
  ? "addEventListener"
  : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod === "attachEvent"
  ? "onmessage"
  : "message";

//MESSAGE EVENT HANDLER
eventer(messageEvent, function (e) {
  // if a new user joins
  if (Array.isArray(e.data)) {
    var messageBody = document.createElement('div')
    messageBody.setAttribute("class", "message")
    messageBody.setAttribute("class", "system");
    messageBody.innerHTML += `[system]: User ${e.data[0]} has joined!`
    document.getElementById('scroll').appendChild(messageBody)
    // if a user posts a message
  } else {
    var messageBody = document.createElement('div')
    if (e.data.time - updatedTime > 60000) {
      updatedTime = e.data.time
      var hour = e.data.time.getHours()
      var minute = e.data.time.getMinutes()
      var time = document.createElement('div')
      time.setAttribute('class', 'time')
      if (minute < 10) {
        time.innerHTML += `${hour}:0${minute}`
      }
      else {
        time.innerHTML += `${hour}:${minute}`
      }
      document.getElementById('scroll').appendChild(time)
    }
    messageBody.setAttribute("class", "message")
    if (e.data.self) {
      messageBody.setAttribute('class', 'self')
    }
    messageBody.innerHTML += e.data.message;
    document.getElementById('scroll').appendChild(messageBody);
  }
});