// when the whole window loads
document.addEventListener('DOMContentLoaded', () => {
    // we setup the variables to control all the elements
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
    let startTime, timerInterval;
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    
    // add event listeners for the button sizes, playing again
    slider.addEventListener('input', () => {
        sliderValue.textContent = slider.value;
        buttonSize = parseInt(slider.value);
        generateGrid(buttonSize);
    });
    
    saveButton.addEventListener('click', () => {
        let totalButtons = generateGrid(buttonSize);
        correctButtonIndex = Math.floor(Math.random() * totalButtons);
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
    
    // this function is responsible for setting up the buttons
    function generateGrid(size) {
        // this allows us to reset the grid (when playing again)
        gridContainer.innerHTML = '';
        // get the width and height of the widow, to setup the buttons properly
        let width = window.innerWidth;
        let height = window.innerHeight - 50;
        let columns = Math.floor(width / size);
        let rows = Math.floor(height / size);
        let totalButtons = columns * rows;

        // adding the grid template feature of css, where we set the size of the buttons, and the columns and rows to generate
        gridContainer.style.gridTemplateColumns = `repeat(${columns}, ${size}px)`;
        gridContainer.style.gridTemplateRows = `repeat(${rows}, ${size}px)`;

        // for loop to loop through the number of total buttons
        for (let i = 0; i < totalButtons; i++) {
            // it creates a new button "instance", adds the class grid button, and adds an event listening for click which runs handleButtonClick() when clicked
            let button = document.createElement('button');
            button.className = 'grid-button';
            button.addEventListener('click', () => handleButtonClick(i));
            // lastly we append it
            gridContainer.appendChild(button);
        }
        return totalButtons;
    }

    // displays the top 5 highscores
    function displayHighScores() {
        let highScoresList = document.getElementById('highScoresList');
        highScoresList.innerHTML = '';
        for (let i = 0; i < highScores.length && i < 5; i++) {
            let score = highScores[i];
            let li = document.createElement('li');
            li.innerHTML = `<b>${i+1}.</b>  Tries: ${score.tries}, Time: ${score.time}s`;
            highScoresList.appendChild(li);
        }
    }
    

    function saveHighScore(tries, time) {
        let newScore = { tries: tries, time: time };
        highScores.push(newScore);
        highScores.sort((a, b) => a.time - b.time || a.tries - b.tries);
        if (highScores.length > 10) {
            highScores.pop();
        }
        localStorage.setItem('highScores', JSON.stringify(highScores));
        displayHighScores();
    }
    
    // function for when people click on the button
    function handleButtonClick(index) {
        // if the button clicked is the correct one
        if (index == correctButtonIndex) {
            // we disable all other buttons
            document.querySelectorAll('.grid-button').forEach(button => {
                button.disabled = true;
                button.style.cursor = 'default';
            });
            // and then add the select button (green color)
            document.querySelectorAll('.grid-button')[index].classList.add('correct');
            // we stop the stopwatch
            stopStopwatch();
            // and output the result to the win modal
            let elapsedTime = getElapsedTime();
            winMessage.textContent = `You found the correct button in ${tries} tries and ${elapsedTime} seconds!`;
            saveHighScore(tries, elapsedTime);
            winModal.style.display = 'flex';
        } else {
            // if its not the correct button, we add to the tries count
            tries++;
            // grab all the buttons
            let buttons = document.querySelectorAll('.grid-button');
            // find x position of the correct button 
            let correctX = correctButtonIndex % Math.floor(window.innerWidth / buttonSize);
            // find y position of the correct button 
            let correctY = Math.floor(correctButtonIndex / Math.floor(window.innerWidth / buttonSize));
            // find x position of the clicked button 
            let clickX = index % Math.floor(window.innerWidth / buttonSize);
            // find y position of the correct button 
            let clickY = Math.floor(index / Math.floor(window.innerWidth / buttonSize));
            // use the distance formula
            let distance = Math.sqrt(Math.pow(correctX - clickX, 2) + Math.pow(correctY - clickY, 2));
            // find the max distance possible
            let maxDistance = Math.sqrt(Math.pow(Math.floor(window.innerWidth / buttonSize), 2) + Math.pow(Math.floor(window.innerHeight / buttonSize), 2));
            // find the intensity of the color (from red to blue)
            let intensity = 1 - (distance / maxDistance);
            // based off the intensity we will lower or increase the red and blue color
            buttons[index].style.backgroundColor = `rgb(${Math.floor(255 * intensity)}, 0, ${Math.floor(255 * (1 - intensity))})`;
        }
    }
    
    // the stopwatch updates every 1 second
    function startStopwatch() {
        startTime = Date.now();
        timerInterval = setInterval(updateStopwatch, 1000);
    }
    // stopStopwatch clears the time interval
    function stopStopwatch() {
        clearInterval(timerInterval);
    }
    // this visually resets the stopwatch
    function resetStopwatch() {
        stopwatch.textContent = 'Time: 0s';
    }
    // we take the find which we started the stopwatch at, and the current time, and minus it to get the elapsed time
    function updateStopwatch() {
        stopwatch.textContent = `Time: ${getElapsedTime()}s`;
    }
    // stores the stopwatch running time
    function getElapsedTime() {
        return Math.floor((Date.now() - startTime) / 1000);
    }
    
    // lastly, we generate the grid
    // Reset and display high scores on play again
    playAgainButton.addEventListener('click', () => {
        winModal.style.display = 'none';
        modal.style.display = 'flex';
        tries = 0;
        resetStopwatch();
        generateGrid(buttonSize);
        displayHighScores();
    });

    // Initialize
    displayHighScores();
    generateGrid(buttonSize);
});
