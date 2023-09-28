var MessageColor = "#700";
// Variables to track user activity and state
var isLogged = false;
var lastPostDate;
// Constants for initial and inactivity timeout settings
const InitialTimeoutMinutes = 0.15;
const InactivityTimeoutMinutes = 2;
const DB = [];

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
    if (searchString != Password2) MessageColor = "#009";
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

function GoToChatPage() {
  const chatPage = document.getElementById("chat-page");
  const imgs = document.getElementsByClassName("btn-aref");
  const btnSend = document.getElementById("f2");
  const MessageInput = document.getElementById("e2");
  var messageString;
  DisplayAll();
  setInterval(() => DisplayAll(lastPostDate), 2000);

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
    if (messageString) AddMessage(messageString);
    messageString = "";
    MessageInput.value = "";
  });

  function AddMessage(string) {
    const lastMessageDate = lastPostDate ?? 1695923848325;
    // const lastMessageDate = DB.at(-1).date ?? 1695923848325;
    AddMessageToDB(string, MessageColor);
    DisplayAll(lastMessageDate);
  }
  function DisplayAll(lastMessageDate = false) {
    GetMessages().forEach((element) => {
      if (!lastMessageDate || element.date > lastMessageDate) {
        DisplayMessage(element.message, element.color, element.date);
      }
    });
  }
  function DisplayMessage(
    string,
    color = MessageColor,
    date = new Date(Date.now())
  ) {
    lastPostDate = date;
    const div = document.getElementById("chat-container");
    const newDiv = document.createElement("p");

    date = new Date(date).toLocaleString("en-GB", { timeZone: "UTC" });
    console.log(date);
    if (color == "#009") {
      newDiv.style.textAlign = "end";
      newDiv.style.marginLeft = "20%";
    } else {
      newDiv.style.marginRight = "20%";
    }
    newDiv.style.background = `${color}1`;
    newDiv.style.color = color;
    newDiv.classList.add("message");
    newDiv.innerText = string;
    div.appendChild(newDiv);

    const span = document.createElement("span");
    span.innerText = "\n" + date;
    span.style.fontSize = "0.6rem";
    newDiv.appendChild(span);
    div.scrollTop = div.scrollHeight;
  }
}

function GetMessages() {
  return DB_cloud;
}
function AddMessageToDB(message, color) {
  DB_cloud.push({ color, message, date: Date.now() });
}

var DB_cloud = [
  {
    color: "#009",
    message: "0000",
    date: 1695923848335,
  },
  {
    color: "#009",
    message: "1111",
    date: 1695923870539,
  },
  {
    color: "#700",
    message: "222",
    date: 1695923872330,
  },
  {
    color: "#009",
    message: "3333",
    date: 1695923873357,
  },
  {
    color: "#700",
    message: "4444",
    date: 1695923874512,
  },
];
