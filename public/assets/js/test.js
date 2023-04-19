// Get the elements
const clue2Link = document.getElementById("clue-2-link");
const clue2 = document.getElementById("clue-2");

// Hide the Clue 2 link and text initially
clue2Link.style.display = "none";
clue2.style.display = "none";

// Get the hidden smiley face image and transparent image
const hiddenImage = document.querySelector(".hidden-image");
const transparentImage = document.querySelector(".transparent-image");//useless

// Function to reveal the hidden smiley face image and Clue 2
function revealImage() {
    // Reveal the hidden smiley face image
    hiddenImage.style.display = "block";

    // Reveal the Clue 2 link and text
    clue2Link.style.display = "block";
    clue2.style.display = "block";

    // Hide the reveal image button
    document.getElementById("reveal-image-btn").style.display = "none";
}

// Check if the hidden smiley face image has been found
function checkSmileyFace() {
    if (hiddenImage.style.display === "block") {
        //do nothing
    }
    else {
        // alert("You need to find the hidden smiley face first!");
    }
}

// Add an event listener to the Clue 2 link to check if the hidden smiley face has been found
clue2Link.addEventListener("click", checkSmileyFace);

//test 1
function myFunction() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}
  //