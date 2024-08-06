const readline = require('readline-sync');

function processInput() {
    let i = 10;
    console.log("Hello Cloud9!");
    console.log("i is " + i);

    while (true) {
        const input = readline.question("Enter a number (or 'q' to quit): ");

        if (input === 'q') {
            console.log('OK, exiting.');
            break;
        }

        const numberInput = Number(input);
        if (isNaN(numberInput)) {
            console.log('Invalid input. Please enter a number or \'q\' to quit.');
            continue;
        }

        i += numberInput;
        console.log("i is now " + i);
    }

    console.log("Goodbye!");
}

processInput();
