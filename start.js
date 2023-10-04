// Variables to track user activity and state
var URL = "http://localhost:5065";
var DB_cloud = [];
var MessageColor = "#700";
var MessageColor2 = "#009";
var isLogged = false;
// Constants for initial and inactivity timeout settings
const InitialTimeoutMinutes = 15;
const InactivityTimeoutMinutes = 2;

// Password for authentication
const Password = "lipstick";
const Password2 = "voy";

// DOM elements
const Btn = document.getElementById("btn-j");
const SearchInput = document.getElementById("e");

// Initialize the timeout
var lastTimeout;
setNewTimeout(InitialTimeoutMinutes);

// Initialize a variable to store the user's search string
var searchString = "contact lens";

// Event listener for input changes
SearchInput.addEventListener("input", (event) => {
  searchString = event.target.value;
});

// Event listener for button click
Btn.addEventListener("click", (click) => {
  // Check if the entered password is correct
  if (
    searchString.trim().toLowerCase() == Password ||
    searchString == Password2
  ) {
    if (searchString != Password2) MessageColor = MessageColor2;
    isLogged = true;
    setNewTimeout(); // Reset the inactivity timeout
    SearchInput.value = ""; // Clear the input field
    console.log("LOADING SECRET CHAT");
    GoToChatPage();
  }
  searchString = ""; // Clear the search string
});

// Event listeners for user activity (touch and mousemove)
document.addEventListener("touchstart", (m) => {
  if (isLogged) setNewTimeout(); // Reset the inactivity timeout on touch activity
});
document.addEventListener("mousemove", (m) => {
  if (isLogged) setNewTimeout(); // Reset the inactivity timeout on mouse movement
});

// Function to redirect to the home page with the given search string
function redirectToHome(string = searchString) {
  window.location.replace(
    string == ""
      ? "https://www.amazon.co.uk/"
      : `https://www.amazon.co.uk/s?k=${string}&ref=404_search`
  );
}

// Function to set a new inactivity timeout
function setNewTimeout(time = InactivityTimeoutMinutes) {
  clearTimeout(lastTimeout); // Clear any previous timeout
  lastTimeout = setTimeout(() => {
    redirectToHome(searchString); // Redirect to the home page on inactivity
  }, time * 60 * 1000); // Convert minutes to milliseconds
}

async function GoToChatPage() {
  const chatPage = document.getElementById("chat-page");
  const imgs = document.getElementsByClassName("btn-aref");
  const btnSend = document.getElementById("f2");
  const MessageInput = document.getElementById("e2");
  var messageString;
  setInterval(() => DisplayAll(), 2000);

  MessageInput.addEventListener("input", (event) => {
    messageString = event.target.value;
  });

  chatPage.style.display = "block";
  document.getElementById("login-page").style.display = "none";
  for (var i = 0; i < imgs.length; i++) {
    imgs[i].addEventListener("click", () => redirectToHome("glass lenses"));
  }
  btnSend.addEventListener("click", () => {
    messageString = messageString.trim();
    if (messageString) AddMessage(messageString, MessageColor);
    messageString = "";
    MessageInput.value = "";
  });
}
async function DisplayAll() {
  await GetMessages().then((messages) => {
    if (DB_cloud.length != messages.length) {
      let newMessages = findMissingObjects(messages, DB_cloud);
      newMessages.forEach((m) => DisplayMessage(m.text, m.color, m.time));
    }
    DB_cloud = messages;
  });
}
function DisplayMessage(
  text,
  color = MessageColor,
  time = new Date(Date.now())
) {
  lastPostDate = time;
  const div = document.getElementById("chat-container");
  const newDiv = document.createElement("p");

  time = new Date(time).toLocaleString("en-GB", { timeZone: "UTC" });
  if (color == MessageColor2) {
    newDiv.style.textAlign = "end";
    newDiv.style.marginLeft = "20%";
  } else {
    newDiv.style.marginRight = "20%";
  }
  newDiv.style.background = `${color}1`;
  newDiv.style.color = color;
  newDiv.classList.add("message");
  newDiv.innerText = text;
  div.appendChild(newDiv);

  const span = document.createElement("span");
  span.innerText = "\n" + time;
  span.style.fontSize = "0.6rem";
  newDiv.appendChild(span);
  div.scrollTop = div.scrollHeight;
}

async function GetMessages() {
  var res = [];
  await fetch(URL)
    .then((response) => response.json())
    .then((json) => {
      res = json;
    })
    .catch((error) => console.log("Authorization failed : " + error.message));

  return res;
}
async function AddMessage(message, color) {
  const messageObject = { color, text: message, time: Date.now() };
  await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageObject),
  })
    .then((response) => response.json())
    .then((json) => {
      res = json;
    })
    .catch((error) => console.log("Authorization failed : " + error.message));
}

function findMissingObjects(arr1, arr2) {
  // Extract the 'time' values from both arrays into sets
  const timeSet1 = new Set(arr1.map((obj) => obj.time));
  const timeSet2 = new Set(arr2.map((obj) => obj.time));

  // Find the 'time' values that are missing in arr2 compared to arr1
  const missingTimes = [...timeSet1].filter((time) => !timeSet2.has(time));

  // Create an array of objects with the missing 'time' values
  const missingObjects = arr1.filter((obj) => missingTimes.includes(obj.time));

  return missingObjects;
}
