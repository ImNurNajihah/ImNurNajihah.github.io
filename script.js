async function calculateTotalScore() {
    var length_score = checkLength(document.getElementById("password").value);
    var { complexity_score, char_set } = checkComplexity(document.getElementById("password").value);
    var entropy_score = calculateEntropy(document.getElementById("password").value, char_set);
    var predictability_score = await checkPredictability(document.getElementById("password").value); // Await the promise here
    var keyboard_score = await checkKeyboardPatterns(document.getElementById("password").value);
    var dictionary_score = await checkDictionaryWords(document.getElementById("password").value); // Await the promise here
    var reuse_score = checkPasswordReuse();
    var bruteForceTime = calculateBruteForceTime(document.getElementById("password").value, char_set);

    // Calculate the total score
    var total_score = ((length_score + complexity_score + entropy_score + predictability_score + keyboard_score + dictionary_score)/6) + reuse_score;

    //print
    console.log(`length_score = ${length_score}, complexity_score = ${complexity_score}, entropy_score = ${entropy_score}, predictability_score = ${predictability_score}, keyboard_score = ${keyboard_score}, dictionary_score = ${dictionary_score}, reuse_score = ${reuse_score}`);
    console.log(`Est_time: ${bruteForceTime}`);

    // Update the total score
    if (dictionary_score === 0 || keyboard_score === 0) {
        total_score = 0; // Set total_score to 0 if both dictionary word & keyboard pattern was found
    }
    

    // Update the total score wherever it needs to be displayed
    console.log(`total_score = ${total_score.toFixed(2)}`);

    updateStrengthBar(total_score);

    return total_score;
}


// Function to check password length
function checkLength(password) {
    let message1 = document.getElementById("length-message");
    
    if (password.length === 0) {
        message1.textContent = "";
        return 0;
    } else if (password.length >= 12) {
        message1.textContent = ` ${password.length} is Excellent!`;
        return 10;
    } else if (password.length >= 10 && password.length < 12) {
        message1.textContent = ` ${password.length} is good, but try make it 12.`;
        return 8;
    } else if (password.length >= 8 && password.length < 10) {
        message1.textContent = ` ${password.length} is so-so, try make it 12.`;
        return 6;
    } else if (password.length >= 6 && password.length < 8) {
        message1.textContent = ` ${password.length} is quite short, try make it 12.`;
        return 4;
    } else if (password.length < 6){
        message1.textContent = ` ${password.length} is too short, try make it 12.`;
        return 0;
    }
}

// Function to check password complexity
function checkComplexity(password) {
    var complexity_score = 0, char_set = 0;
    let message2 = document.getElementById("complexity-message");
    let uppercase = /[A-Z]/.test(password);
    let lowercase = /[a-z]/.test(password);
    let numbers = /[0-9]/.test(password);
    let special_char = /[^A-Za-z0-9]/.test(password);//∼‘!@#$%^&*()-_=+[{]}\|;:”’,<.>/?

    if (!password){
        message2.textContent = "";
    }
    //Contain numbers only
    else if (numbers && !lowercase && !uppercase && !special_char) {
        char_set = 10;
        complexity_score = 1;
        message2.textContent = " Please add uppercase, lowercase & special characters.";
    }
    //Contain uppercase letters only
    else if (uppercase && !lowercase && !numbers && !special_char) {
        char_set = 26;
        complexity_score = 2;
        message2.textContent = " Please add lowercase, numbers & special characters.";
    }
    //Contain lowercase letters only
    else if (lowercase && !uppercase && !numbers && !special_char) {
        char_set = 26;
        complexity_score = 2;
        message2.textContent = " Please add uppercase, numbers & special characters.";
    }
    //Contain special characters only
    else if (special_char && !lowercase && !uppercase && !numbers) {
        char_set = 32;
        complexity_score = 3;
        message2.textContent = " Please add uppercase, lowercase & numbers.";
    }
    //Contain lowercase letters & numbers only
    else if (lowercase && numbers && !uppercase && !special_char) {
        char_set = 36;
        complexity_score = 4;
        message2.textContent = " Please add uppercase & special characters.";
    }
    //Contain uppercase letters & numbers only
    else if (uppercase && numbers && !lowercase && !special_char) {
        char_set = 36;
        complexity_score = 4;
        message2.textContent = " Please add lowercase & special characters.";
    }
    //Contain numbers & special characters only
    else if (numbers && special_char && !uppercase && !lowercase) {
        char_set = 42;
        complexity_score = 5;
        message2.textContent = " Please add uppercase & lowercase letter.";
    }
    //Contain uppercase letters & lowercase letters only
    else if (uppercase && lowercase && !numbers && !special_char) {
        char_set = 52;
        complexity_score = 6;
        message2.textContent = " Please add numbers & special characters.";
    }
    //Contain lowercase letters & special characters only
    else if (lowercase && special_char && !uppercase && !numbers) {
        char_set = 58;
        complexity_score = 7;
        message2.textContent = " Please add numbers & lowercase letters.";
    }
    //Contain uppercase letters & special characters only
    else if (uppercase && special_char && !lowercase && !numbers) {
        char_set = 58;
        complexity_score = 7;
        message2.textContent = " Please add numbers & lowercase letters.";
    }
    //Contain uppercase letters, lowercase letters & numbers only
    else if (uppercase && lowercase && numbers && !special_char) {
        char_set = 62;
        complexity_score = 8;
        message2.textContent = " Please add special characters.";
    }
    //Contain uppercase letters, numbers & special characters only
    else if (uppercase && numbers && special_char && !lowercase) {
        char_set = 68;
        complexity_score = 8;
        message2.textContent = " Please add lowercase letters.";
    }
    //Contain lowercase letters, numbers & special characters only
    else if (lowercase && numbers && special_char && !uppercase) {
        char_set = 68;
        complexity_score = 8;
        message2.textContent = " Please add uppercase letters.";
    }
    //Contain uppercase letters, lowercase letters & special characters only
    else if (uppercase && lowercase && special_char && !numbers) {
        char_set = 84;
        complexity_score = 9;
        message2.textContent = " Please add numbers.";
    }
    //Contain uppercase letters, lowercase letters, numbers & special characters
    else if (uppercase && lowercase && numbers && special_char) {
        char_set = 94;
        complexity_score = 10;
        message2.textContent = " Nice! you include all character types.";
    }

    console.log(`char_set = ${char_set}`);

    return { complexity_score, char_set };
}

// Function to calculate entropy
function calculateEntropy(password, char_set) {
    var entropy_score = 0;
    let message3 = document.getElementById("entropy-message"); 
    //Formula: E = log2(N^L) 
    //N: Size of the character set
    //L: Length of the password 

    entropy = (Math.log2(Math.pow(char_set, password.length))).toFixed(2);

    //Check for Entropy
    if (!password){
        message3.textContent = "";
    }
    else if (entropy === 0) {
        message3.textContent = ""; // Clear the message if the password is empty
    } else if (entropy <= 28) {
        message3.textContent = " Very Low.";
        entropy_score = 2;
    }
    else if(entropy > 28 && entropy <= 47) {
        message3.textContent = " Low.";
        entropy_score = 4;
    }
    else if(entropy > 47 && entropy <= 66) {
        message3.textContent = " Moderate.";
        entropy_score = 6;
    }
    else if(entropy > 66 && entropy <= 85) {
        message3.textContent = " High.";
        entropy_score = 8;
    }
    else if (entropy > 85){
        message3.textContent = " Very High.";
        entropy_score = 10;
    }

    console.log(`entropy = ${entropy}`);

    return entropy_score;
}


// Function to check predictability
async function checkPredictability(password) {
    // ... Your existing code ...
    var predictability_score = 8;
    let message4 = document.getElementById("predectability-message");

    // Initialize an array to store found consecutive characters
    let consecutiveTripletsFound = [];

    // Function to check for consecutive triplets in the password
    function checkConsecutiveTriplets(password, consecutiveTriplets) {
        let consecutiveCount = 0;
        let foundTriplet = null;
        for (const triplet of consecutiveTriplets) {
            if (password.includes(triplet)) {
                consecutiveCount++;
                foundTriplet = triplet;
                if (consecutiveCount >= 9) {
                    return { score: 0, triplet: foundTriplet }; // If more than 9 consecutive triplets are found, score is 0
                }
                consecutiveTripletsFound.push(triplet); // Store found triplet
            }
        }
        // If fewer than 10 consecutive triplets are found, deduct 1 from the score for each occurrence
        console.log(`consecutive characters: ${consecutiveTripletsFound.join(', ')}`);
        return { score: Math.max(8 - consecutiveCount, 0), triplet: foundTriplet };
    }

    return new Promise((resolve) => {
        // Fetch the contents of Consecutives.txt and check for consecutive triplets
        fetch('Consecutives.txt') // Replace 'Consecutives.txt' with the actual path to your file
            .then(response => response.text())
            .then(consecutivePatterns => {
                const consecutiveTriplets = consecutivePatterns.split('\n').map(pattern => pattern.trim());
                const password = document.querySelector('#password').value;
                const result = checkConsecutiveTriplets(password, consecutiveTriplets);
                predictability_score = result.score;
                console.log(`predictability_score = ${predictability_score}`);

                if (!password) {
                    message4.textContent = "";
                } else if (predictability_score === 0) {
                    message4.textContent = " Too many consecutive triplets! Please change your password :(";
                } else if (predictability_score === 7) {
                    message4.textContent = " 1 triplet of consecutive characters was found! Please change your password :(";
                } else if (predictability_score === 6) {
                    message4.textContent = " 2 triplets of consecutive characters were found! Please change your password :(";
                } else if (predictability_score === 5) {
                    message4.textContent = " 3 triplets of consecutive characters were found! Please change your password :(";
                } else if (predictability_score === 4) {
                    message4.textContent = " 4 triplets of consecutive characters were found! Please change your password :(";
                } else if (predictability_score === 3) {
                    message4.textContent = " 5 triplets of consecutive characters were found! Please change your password :(";
                } else if (predictability_score === 2) {
                    message4.textContent = " 6 triplets of consecutive characters were found! Please change your password :(";
                } else if (predictability_score === 1) {
                    message4.textContent = " 7 triplets of consecutive characters were found! Please change your password :(";
                } else {
                    message4.textContent = " Good, no consecutive characters found.";
                }

                resolve(predictability_score); // Resolve the promise with the predictability_score
            })
            .catch(error => {
                console.error('Error reading Consecutives.txt:', error);
                message4.textContent = ""; // Clear the message on error
                resolve(predictability_score); // Resolve the promise with the predictability_score (default 8)
            });
    });
}


// Function to check keyboard patterns
function checkKeyboardPatterns(password) {
    var keyboard_score = 8; // Initialize keyboard_score to 8 by default (no pattern found)
    let message5 = document.getElementById("keyboard-message");

    // Array of pattern files to check
    const patternFiles = [
        { fileName: 'Diagonal.txt', message: " Please change your password, it contains diagonal keyboard pattern :(" },
        { fileName: 'Repetitive.txt', message: " Please change your password, it contains repetitive keyboard pattern :(" },
        { fileName: 'SeqByCol.txt', message: " Please change your password, it contains sequential keyboard pattern by column :(" },
        { fileName: 'SeqByRow.txt', message: " Please change your password, it contains sequential keyboard pattern by row :(" }
    ];


    const patternPromises = patternFiles.map(patternFiles => {
        return fetch(patternFiles.fileName)
            .then(response => response.text())
            .then(patterns => {
                const patternLines = patterns.split('\n');
                for (const pattern of patternLines) {
                    if (typeof password === 'string') {
                        const trimmedPattern = pattern.trim();
                        
                        if (password === trimmedPattern) {
                            keyboard_score = 0;
                            console.log(`Found (Keyboard Pattern): ${trimmedPattern}`);
                            message5.textContent = patternFiles.message;
                            return;
                        }
                        
                        if (password.includes(trimmedPattern)) {
                            keyboard_score = 2;
                            console.log(`Found as part (Keyboard Pattern): ${trimmedPattern}`);
                            message5.textContent = patternFiles.message;
                            return;
                        }
                    }
                }
            })
            .catch(error => {
                console.error(`Error reading ${patternFiles.fileName}:`, error);
            });
    });

    return Promise.all(patternPromises).then(() => {
        if (!password) {
            message5.textContent = "";
        } else if (keyboard_score === 8) {
            message5.textContent = " Good! Your password does not contain keyboard pattern.";
        }
        return keyboard_score;
    });
}


// Function to check dictionary words
function checkDictionaryWords(password) {
    var dictionary_score = 8;
    let message6 = document.getElementById("dictionary-message");

    const dictionaryFiles = [
        { fileName: 'john.txt', message: " Did not survived dictionary-attack, please change your password :(" },
    ];

    const patternPromises = dictionaryFiles.map(dictionaryFile => {
        return fetch(dictionaryFile.fileName)
            .then(response => response.text())
            .then(patterns => {
                const patternLines = patterns.split('\n');
                for (const pattern of patternLines) {
                    if (typeof password === 'string') {
                        const trimmedPattern = pattern.trim();
                        
                        if (password === trimmedPattern) {
                            dictionary_score = 0;
                            console.log(`Found (dictionary): ${trimmedPattern}`);
                            message6.textContent = dictionaryFile.message;
                            return;
                        }
                        
                        if (password.includes(trimmedPattern)) {
                            dictionary_score = 2;
                            console.log(`Found as part (dictionary): ${trimmedPattern}`);
                            message6.textContent = " Please change your password, it contains dictionary word :(";
                            return;
                        }
                    }
                }
            })
            .catch(error => {
                console.error(`Error reading ${dictionaryFile.fileName}:`, error);
            });
    });

    return Promise.all(patternPromises).then(() => {
        if (!password) {
            message6.textContent = "";
        } else if (dictionary_score === 8) {
            message6.textContent = " Good! Your password does not contain dictionary word.";
        }
        return dictionary_score;
    });
}


// Function to check password reuse
function checkPasswordReuse() {
    var reuse_score = 0;
    let message7 = document.getElementById("passreuse-message");

    let password = document.querySelector('#password').value;

    if (!password) {
        message7.textContent = ""; // Clear the message if the password is empty
        return reuse_score;
    }

    // Update reuse_score based on checkbox status
    if (document.getElementById("checkbox").checked) {
        reuse_score = -2;
        message7.textContent = " Please avoid using the same password for multiple accounts. Attackers can use it to compromise your other accounts that share the same password.";
    } else {
        reuse_score = 0;
        message7.textContent = " Nice! You are not reusing the same password for multiple accounts.";
    }

    console.log(`reuse_score: ${reuse_score}`);
    return reuse_score;
}

// Call checkPasswordReuse when the page loads to initialize the score
window.onload = function () {
    checkPasswordReuse();
};

// Listen for changes in the checkbox
document.getElementById("checkbox").addEventListener("change", function () {
    checkPasswordReuse();
    const total_score = calculateTotalScore(); // Calculate the total score
    updateStrengthBar(total_score); // Update the strength bar based on the total score
});




// Function to calculate brute-force time estimation
function calculateBruteForceTime(password, char_set) {
    const option = parseInt(document.getElementById("option").value);
    var R;

    if (option === 4) {
        // If option 4 is selected, use the custom R value entered by the user
        const customR = parseInt(document.getElementById("customR").value);
        if (isNaN(customR)) {
            document.getElementById("bruteForceTimeMessage").textContent = "0 seconds";
            return;
        }
        R = customR;
    } 
    else if (option === 1) {
        R = 2071500000; // Option 1
    } 
    else if (option === 2) {
        R = 1285500000; // Option 2
    } 
    else if (option === 3) {
        R = 645000000;  // Option 3
    } 
    else {
        document.getElementById("bruteForceTimeMessage").textContent = "Error";
        return;
    }

    console.log(`R: ${R}`);

    const length = password.length;
    

    /*Time = C/R where C = m^n
    where:
        Time: in seconds
        C: Possible combinations/Search Space
        m: Character set
        n: Password length
        R: Number of Attempts per Second*/

    var C = Math.pow(char_set, length);
    var Est_time = C / R;

    console.log(`charset_size: ${char_set}, L: ${length}, C: ${C}`);
    console.log(`Est_time (s): ${Est_time.toFixed(2)}`);

    // Round off the estimated time to 2 decimal places
    const roundedEst_time = parseFloat(Est_time.toFixed(2));

    let message8;

    // Calculate time in different units
    if (roundedEst_time < 60) {
        message8 = `${roundedEst_time} seconds`;
    } else if (roundedEst_time < 3600) {
        const time_minute = Math.floor(roundedEst_time / 60);
        message8 = `${time_minute} minutes`;
    } else if (roundedEst_time < 86400) {
        const time_hour = Math.floor(roundedEst_time / 3600);
        message8 = `${time_hour} hours`;
    } else if (roundedEst_time < 604800) {
        const time_day = Math.floor(roundedEst_time / 86400);
        message8 = `${time_day} days`;
    } else if (roundedEst_time < 2629746) {
        const time_week = Math.floor(roundedEst_time / 604800);
        message8 = `${time_week} weeks`;
    } else if (roundedEst_time < 31557600) {
        const time_month = Math.floor(roundedEst_time / 2629746);
        message8 = `${time_month} months`;
    } else if (roundedEst_time < 315360000) {
        const time_year = Math.floor(roundedEst_time / 31557600);
        message8 = `${time_year} years`;
    } else if (roundedEst_time < 3153600000) {
        const time_decade = Math.floor(roundedEst_time / 315360000);
        message8 = `${time_decade} decades`;
    } else if (roundedEst_time < 31536000000) {
        const time_century = Math.floor(roundedEst_time / 3153600000);
        message8 = `${time_century} centuries`;
    } else {
        const time_millennium = Math.floor(roundedEst_time / 31536000000);
        message8 = `${time_millennium} millenniums`;
    }
    

    console.log(`Est_time: ${message8}`);

    document.getElementById("bruteForceTimeMessage").textContent = message8;

    // Show/hide the custom R input field based on the option
    const customRInput = document.getElementById("customRInput");
    customRInput.style.display = option === 4 ? "block" : "none";

    return message8;
}

// Listen for changes in the option select element
document.getElementById("option").addEventListener("change", function () {
    const selectedOption = parseInt(this.value);
    if (selectedOption === 4) {
        // Show the custom R input field when Custom is selected
        document.getElementById("customRInput").style.display = "block";
    } else {
        // Hide the custom R input field for other options
        document.getElementById("customRInput").style.display = "none";
    }
    
});


// Function to update the strength bar based on the total_score
function updateStrengthBar(total_score) {
    let strength_bar = document.querySelector('.container');
    document.addEventListener("keyup",function(e){
    let password = document.querySelector('#password').value;

    if (!password) {
        strength_bar.classList.remove('veryweak');
        strength_bar.classList.remove('weak');
        strength_bar.classList.remove('moderate');
        strength_bar.classList.remove('strong');
        strength_bar.classList.remove('verystrong');

    } else if (total_score < 1) {
        strength_bar.classList.add('veryweak');
        strength_bar.classList.remove('weak');
        strength_bar.classList.remove('moderate');
        strength_bar.classList.remove('strong');
        strength_bar.classList.remove('verystrong');
    }
    else if (total_score >= 1 && total_score < 3) {
        strength_bar.classList.remove('veryweak');
        strength_bar.classList.add('weak');
        strength_bar.classList.remove('moderate');
        strength_bar.classList.remove('strong');
        strength_bar.classList.remove('verystrong');
    }
    else if (total_score >= 3 && total_score < 6) {
        strength_bar.classList.remove('veryweak');
        strength_bar.classList.remove('weak');
        strength_bar.classList.add('moderate');
        strength_bar.classList.remove('strong');
        strength_bar.classList.remove('verystrong');
    }
    else if (total_score >= 6 && total_score < 8) {
        strength_bar.classList.remove('veryweak');
        strength_bar.classList.remove('weak');
        strength_bar.classList.remove('moderate');
        strength_bar.classList.add('strong');
        strength_bar.classList.remove('verystrong');
    }
    else if (total_score >= 8) {
        strength_bar.classList.remove('veryweak');
        strength_bar.classList.remove('weak');
        strength_bar.classList.remove('moderate');
        strength_bar.classList.remove('strong');
        strength_bar.classList.add('verystrong');
    }
    })
}


function toggle(){
  let password = document.getElementById("password");
  let eye = document.getElementById("toggle");

  if(password.getAttribute("type") == "password"){
      password.setAttribute("type","text");
      eye.style.color = "#46ca2b";
  }
  else{
      password.setAttribute("type","password");
      eye.style.color = "#808080";
  }
} 

