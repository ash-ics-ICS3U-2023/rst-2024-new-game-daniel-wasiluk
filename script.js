// add an event listener for when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // when it does, we set the grid container element
    let gridContainer = document.getElementById('gridContainer');

    // generate grid with buttons
    let generateGrid = (size) => {
        gridContainer.innerHTML = '';
        // we find  the width and height of the window the user is using (chrome, or whatever)
        let width = window.innerWidth;
        let height = window.innerHeight;
        // the column are rows are dependent of the pre-determined user decided size of the grid
        console.log(width)
        console.log(height)

        let columns = Math.floor(width / size);
        let rows = Math.floor(height / size);
        console.log(columns)
        console.log(rows)
        // decide the number of ${columns} the number of ${rows} and the ${size} of them
        gridContainer.style.gridTemplateColumns = `repeat(${columns}, ${size}px)`;
        gridContainer.style.gridTemplateRows = `repeat(${rows}, ${size}px)`;
        // this loop creates buttons by...
        for (let i = 0; i < columns * rows; i++) {
            // here we are basically creating a new (how i like to think of it) "instance" of a button, for each iteration of the loop
            // button is equal to the element button
            let button = document.createElement('button');
            // we add a class name called grid-button
            button.className = 'grid-button';
            // when it is clicked, it alerts the user
            button.addEventListener('click', () => {
                // this is just for testing for now, but we will add color changes soon
                alert(`I am button #${i+1}`);
            });
            // append the button at the end
            gridContainer.appendChild(button);
        }
    };
    // we are generating 50px buttons, which will fill in the window as much as it can
    generateGrid(50);
});
