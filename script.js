document.addEventListener('DOMContentLoaded', () => {
    // setup variables to control all elements
    let instructionsModal = document.getElementById('instructionsModal');
    let understoodButton = document.getElementById('understoodButton');
    let modal = document.getElementById('modal');
    let slider = document.getElementById('slider');
    let sliderValue = document.getElementById('sliderValue');
    let saveButton = document.getElementById('saveButton');
    let gridContainer = document.getElementById('gridContainer');
    let winModal = document.getElementById('winModal');
    let winMessage = document.getElementById('winMessage');
    let playAgainButton = document.getElementById('playAgainButton');
    let stopwatch = document.getElementById('stopwatch');
    
    // global variables
    let buttonSize = parseInt(slider.value);
    let correctButtonIndex = null;
    let tries = 0;
    let startTime, timerInterval, elapsedTime = 0;
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    
    // check if its the first time the user is visiting the page
    // we first check if the firstTimeUser key even exists in local storage
    if (!localStorage.getItem('firstTimeUser')) {
        // if it does not exist, show the instructions
        instructionsModal.style.display = 'flex';
        // and hide the change tile size modal
        modal.style.display = 'none';
    } else {
        // if it does exist, meaning that the user has seen the instructions, hide the instructinos, and show the tile size modal
        instructionsModal.style.display = 'none';
        modal.style.display = 'flex';
    }

    // when the users clicks that they understand the instructions
    understoodButton.addEventListener('click', () => {
        // it sets the firstTimeUser value to no in localstorage
        localStorage.setItem('firstTimeUser', 'no');
        // it then hides the instructions modal
        instructionsModal.style.display = 'none';
        // and shows the button change modal
        modal.style.display = 'flex';
    });

    // add event listeners for the button sizes, and playing again
    slider.addEventListener('input', () => {
        sliderValue.textContent = slider.value;
        buttonSize = parseInt(slider.value);
        generateGrid(buttonSize);
    });
    
    saveButton.addEventListener('click', () => {
        let totalButtons = generateGrid(buttonSize);
        correctButtonIndex = Math.floor(Math.random() * totalButtons);
        // for testing purposes
        console.log('Correct Button Index:', correctButtonIndex);
        modal.style.display = 'none';
        startStopwatch();
    });
    
    playAgainButton.addEventListener('click', () => {
        winModal.style.display = 'none';
        modal.style.display = 'flex';
        tries = 0;
        resetStopwatch();
        generateGrid(buttonSize);
    });
    
    // function to set up the buttons
    function generateGrid(size) {
        // reset the grid (when playing again)
        gridContainer.innerHTML = '';
        // get the width and height of the window, to setup the buttons properly
        let width = window.innerWidth;
        let height = window.innerHeight - 50;
        let columns = Math.floor(width / size);
        let rows = Math.floor(height / size);
        let totalButtons = columns * rows;

        // add the grid template feature of css, setting the size of the buttons, and the columns and rows to generate
        gridContainer.style.gridTemplateColumns = `repeat(${columns}, ${size}px)`;
        gridContainer.style.gridTemplateRows = `repeat(${rows}, ${size}px)`;

        // loop through the number of total buttons
        for (let i = 0; i < totalButtons; i++) {
            // create a new button "instance", add the class grid button, and add an event listener for click which runs handleButtonClick() when clicked
            let button = document.createElement('button');
            button.className = 'grid-button';
            button.addEventListener('click', () => handleButtonClick(i));
            // append the button
            gridContainer.appendChild(button);
        }
        return totalButtons;
    }

    // display the top 5 high scores
    function displayHighScores() {
        let highScoresList = document.getElementById('highScoresList');
        highScoresList.innerHTML = '';
        // loop through the 5 highscores
        for (let i = 0; i < highScores.length && i < 5; i++) {
            let score = highScores[i];
            let li = document.createElement('li');
            li.innerHTML = `<b>${i+1}.</b>  Tries: ${score.tries}, Time: ${score.time}s`;
            highScoresList.appendChild(li);
        }
    }


    // we save the new score as an object, where we save the # of tries, and the time
    function saveHighScore(tries, time) {
        let newScore = { tries: tries, time: time };
        highScores.push(newScore);
        // we sort the highscores by time or tries
        highScores.sort((a, b) => a.time - b.time || a.tries - b.tries);
        if (highScores.length > 10) {
            // if there are more than 10 highscores, remove the last one from the local storage
            highScores.pop();
        }
        localStorage.setItem('highScores', JSON.stringify(highScores));
        // display the highscores
        displayHighScores();
    }
    
    // function for when a button is clicked
    function handleButtonClick(index) {
        // add 5 seconds to the time and trigger the red pulse animation
        elapsedTime += 5;
        updateStopwatch();
        stopwatch.classList.add('red-pulse');
        setTimeout(() => stopwatch.classList.remove('red-pulse'), 1000);

        // if the button clicked is the correct one
        if (index == correctButtonIndex) {
            // disable all other buttons
            document.querySelectorAll('.grid-button').forEach(button => {
                button.disabled = true;
                button.style.cursor = 'default';
            });
            // add the select button (green color)
            document.querySelectorAll('.grid-button')[index].classList.add('correct');
            // stop the stopwatch
            stopStopwatch();
            // output the result to the win modal
            let elapsedTime = getElapsedTime();
            winMessage.textContent = `You found the correct button in ${tries} tries and ${elapsedTime} seconds!`;
            saveHighScore(tries, elapsedTime);
            winModal.style.display = 'flex';
        } else {
            // if it's not the correct button, increase the tries count
            tries++;
            // grab all the buttons
            let buttons = document.querySelectorAll('.grid-button');
            // find x position of the correct button 
            let correctX = correctButtonIndex % Math.floor(window.innerWidth / buttonSize);
            // find y position of the correct button 
            let correctY = Math.floor(correctButtonIndex / Math.floor(window.innerWidth / buttonSize));
            // find x position of the clicked button 
            let clickX = index % Math.floor(window.innerWidth / buttonSize);
            // find y position of the clicked button 
            let clickY = Math.floor(index / Math.floor(window.innerWidth / buttonSize));
            // use the distance formula
            let distance = Math.sqrt(Math.pow(correctX - clickX, 2) + Math.pow(correctY - clickY, 2));
            // find the maximum distance between the top left corner of a button and the top left corner of the window
            let maxDistance = Math.sqrt(Math.pow(Math.floor(window.innerWidth / buttonSize), 2) + Math.pow(Math.floor(window.innerHeight / buttonSize), 2));
            // find the intensity of the color (from red to blue)
            let intensity = 1 - (distance / maxDistance);
            // based on the intensity, lower and increase the red or blue color
            buttons[index].style.backgroundColor = `rgb(${Math.floor(255 * intensity)}, 0, ${Math.floor(255 * (1 - intensity))})`;
        }
    }
    
    // the stopwatch updates every 1 second (1000 ms)
    function startStopwatch() {
        startTime = Date.now();
        timerInterval = setInterval(updateStopwatch, 1000);
    }
    // stopStopwatch clears the time interval
    function stopStopwatch() {
        clearInterval(timerInterval);
    }
    // visually reset the stopwatch
    function resetStopwatch() {
        stopwatch.textContent = 'Time: 0s';
        elapsedTime = 0;
    }
    // calculate the elapsed time since the stopwatch started
    function updateStopwatch() {
        let currentTime = Math.floor((Date.now() - startTime) / 1000) + elapsedTime;
        stopwatch.textContent = `Time: ${currentTime}s`;
    }
    // store the stopwatch running time
    function getElapsedTime() {
        return Math.floor((Date.now() - startTime) / 1000) + elapsedTime;
    }
    
    // generate the grid
    // reset and display high scores on play again
    playAgainButton.addEventListener('click', () => {
        winModal.style.display = 'none';
        modal.style.display = 'flex';
        tries = 0;
        resetStopwatch();
        generateGrid(buttonSize);
        displayHighScores();
    });

    // start things up
    displayHighScores();
    generateGrid(buttonSize);
});
