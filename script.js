function Strength(password){

    //score
    var entropy_score = 0, reuse_score = 0, total_score = 0;

    //let AdjacencyPatterns = [];


    //Check for length
    var length_score = 0;
    let message1 = document.getElementById("length-message");

    
    if (password.length === 0) {
        message1.textContent = ""; // Clear the message if the password is empty
    }
    else if (password.length >= 12) {
        length_score += 10;
        message1.textContent = " Excellent!";
    }
    else if (password.length >= 10 && password.length < 12) {
        length_score += 8;    
        message1.textContent = " Good, but length try make it 12.";
    }
    else if (password.length >= 8 && password.length < 10) {
        length_score += 6;
        message1.textContent = " So-so, try make it 12.";
    }
    else if (password.length >= 6 && password.length < 8) {
        length_score += 4;
        message1.textContent = " Quite short, try make it 12.";
    }
    else if (password.length < 6){
        length_score += 0;
        message1.textContent = " Too short, try make it 12.";
    }

   
    //Check for Complexity
    var complexity_score = 0, char_set = 0;
    let message2 = document.getElementById("complexity-message");
    let uppercase = /[A-Z]/.test(password);
    let lowercase = /[a-z]/.test(password);
    let numbers = /[0-9]/.test(password);
    let special_char = /[^A-Za-z0-9]/.test(password);

    if (!password){
        message2.textContent = "";
    }
    //Contain uppercase letters only
    else if (uppercase && !lowercase && !numbers && !special_char) {
        char_set = 26;
        complexity_score += 2;
        message2.textContent = " Please add lowercase, numbers & special characters.";
    }
    //Contain lowercase letters only
    else if (lowercase && !uppercase && !numbers && !special_char) {
        char_set = 26;
        complexity_score += 2;
        message2.textContent = " Please add uppercase, numbers & special characters.";
    }
    //Contain uppercase letters & numbers only
    else if (uppercase && numbers && !lowercase && !special_char) {
        char_set = 36;
        complexity_score += 4;
        message2.textContent = " Please add lowercase & special characters.";
    }
    //Contain lowercase letters & numbers only
    else if (lowercase && numbers && !uppercase && !special_char) {
        char_set = 36;
        complexity_score += 4;
        message2.textContent = " Please add uppercase & special characters.";
    }
    //Contain uppercase letters & lowercase letters only
    else if (uppercase && lowercase && !numbers && !special_char) {
        char_set = 52;
        complexity_score += 6;
        message2.textContent = " Please add numbers & special characters.";
    }
    //Contain uppercase letters, lowercase letters & numbers only
    else if (uppercase && lowercase && numbers && !special_char) {
        char_set = 62;
        complexity_score += 8;
        message2.textContent = " Please add special characters.";
    }
    //Contain uppercase letters, lowercase letters, numbers & special characters
    else if (uppercase && lowercase && numbers && special_char) {
        char_set = 94;
        complexity_score += 10;
        message2.textContent = " Nice! you include all character types.";
    }


    //Calculate Entropy
    let message3 = document.getElementById("entropy-message"); 
    //Formula: E = log2(N^L) 
    //N: Size of the character set
    //L: Length of the password 

    entropy = Math.log2(Math.pow(char_set, password.length));

    //Check for Entropy
    if (entropy === 0) {
        message3.textContent = ""; // Clear the message if the password is empty
    } else if (entropy <= 28) {
        message3.textContent = " Very Low.";
    }
    else if(entropy > 28 && entropy <= 47) {
        message3.textContent = " Low.";
    }
    else if(entropy > 47 && entropy <= 66) {
        message3.textContent = " Moderate.";
    }
    else if(entropy > 66 && entropy <= 85) {
        message3.textContent = " High.";
    }
    else if (entropy > 85){
        message3.textContent = " Very High.";
    }


    // Check for Keyboard Patterns
    let keyboard_score = 8; // Initialize keyboard_score to 8 by default (no pattern found)
    let message4 = document.getElementById("keyboard-message");

    // Array of pattern files to check
    const patternFiles = [
        { fileName: 'Adjacency.txt', message: " It looks like you are using an adjacency keyboard pattern." },
        { fileName: 'Diagonal.txt', message: " It looks like you are using a diagonal keyboard pattern." },
        { fileName: 'Repetitive.txt', message: " It looks like you are using a repetitive keyboard pattern." },
        { fileName: 'SeqByCol.txt', message: " It looks like you are using a sequential keyboard pattern by column." },
        { fileName: 'SeqByRow.txt', message: " It looks like you are using a sequential keyboard pattern by row." }
    ];

    // Function to check a pattern file
    function checkPatternFile(fileName, message) {
        return fetch(fileName)
            .then(response => response.text())
            .then(patterns => {
                const patternLines = patterns.split('\n');
                for (const pattern of patternLines) {
                    if (!password){
                        message4.textContent = "";
                    }
                    else if (typeof password === 'string' && password.includes(pattern.trim())) {
                        keyboard_score = 5;
                        message4.textContent = message;
                        return; // Exit the function if a match is found
                    }
                }
            })
            .catch(error => {
                console.error(`Error reading ${fileName}:`, error);
            });
    }

    // Function to check patterns within substrings of the password
    function checkPatternsInSubstrings() {
        for (const patternFile of patternFiles) {
            const { fileName, message } = patternFile;
            const patterns = message.split(' ').filter(Boolean);
            for (const pattern of patterns) {
                if (!password){
                    message4.textContent = "";
                }
                else if (typeof password === 'string' && password.includes(pattern.trim())) {
                    keyboard_score = 5;
                    message4.textContent = message;
                    return; // Exit the function if a match is found
                }
            }
        }
    }

    // Check each pattern file
    const patternPromises = patternFiles.map(patternFile => checkPatternFile(patternFile.fileName, patternFile.message));

    // Check for patterns within substrings of the password
    checkPatternsInSubstrings();

    // Wait for all pattern checks to complete before updating the message
    Promise.all(patternPromises)
        .then(() => {
            if (!password){
                message4.textContent = "";
            }
            else if (keyboard_score === 8) {
                message4.textContent = " Good! Password does not contain any keyboard pattern.";
            }
        });


    // Check for Common words in Password dictionary



    //Check for Password reuse
    document.addEventListener("input", function (e) {

        let password = document.querySelector('#password').value;
        let message6 = document.getElementById("passreuse-message");
    
        if (!password) {
            message6.textContent = ""; // Clear the message if the password is empty
            return; // Exit the function if there is no password
        }
    
        // Update checkbox_score based on checkbox status
        if (document.getElementById("checkbox").checked) {
            reuse_score = 5;
            message6.textContent = " Please avoid using the same password for multiple account. Attacker can use it to compromised your other accounts that share the same password.";
        } else {
            reuse_score = 8;
            message6.textContent = " Nice! you are not reusing the same password for multiple account.";
        }
        });


    //Calculate Brute-Force time estimation
    const option = parseInt(document.getElementById("option").value);
    let R;

    if (option === 4) {
        // If option 4 is selected, use the custom R value entered by the user
        const customR = parseInt(document.getElementById("customR").value);
        if (isNaN(customR)) {
            document.getElementById("bruteForceTimeMessage").textContent = "Custom R value is invalid.";
            document.getElementById("estimatedTimeResult").textContent = "";
            return;
        }
        R = customR;
    } else if (option >= 1 && option <= 3) {
        // For options 1, 2, and 3, use the predefined R values
        switch (option) {
            case 1:
                R = 2071500000;
                break;
            case 2:
                R = 1285500000;
                break;
            case 3:
                R = 645000000;
                break;
        }
    } else {
        document.getElementById("bruteForceTimeMessage").textContent = "Invalid option.";
        document.getElementById("estimatedTimeResult").textContent = "";
        return;
    }

    const E = entropy;
    const Est_time = Math.pow(2, E) / R;

    // Round off the estimated time to 2 decimal places
    const roundedEst_time = parseFloat(Est_time.toFixed(2));

    let message;

    // Calculate time in different units
    if (roundedEst_time < 60) {
        message = `${roundedEst_time} seconds`;
    } else if (roundedEst_time < 3600) {
        const time_minute = (roundedEst_time / 60).toFixed(2);
        message = `${time_minute} minutes`;
    } else if (roundedEst_time < 86400) {
        const time_hour = (roundedEst_time / 3600).toFixed(2);
        message = `${time_hour} hours`;
    } else if (roundedEst_time < 604800) {
        const time_day = (roundedEst_time / 86400).toFixed(2);
        message = `${time_day} days`;
    } else if (roundedEst_time < 2629746) {
        const time_week = (roundedEst_time / 604800).toFixed(2);
        message = `${time_week} weeks`;
    } else if (roundedEst_time < 31557600) {
        const time_month = (roundedEst_time / 2629746).toFixed(2);
        message = `${time_month} months`;
    } else {
        const time_year = (roundedEst_time / 31557600).toFixed(2);
        message = `${time_year} years`;
    }

    document.getElementById("bruteForceTimeMessage").textContent = message;

    
    // Show/hide the custom R input field based on the option
    const customRInput = document.getElementById("customRInput");
    customRInput.style.display = option === 4 ? "block" : "none";
    


    //Calculate Total score
    total_score = (length_score + complexity_score + entropy_score + reuse_score + keyboard_score)/5;

    return total_score;
}


let strength_bar = document.querySelector('.container');
document.addEventListener("keyup",function(e){
    let password = document.querySelector('#password').value;
    let strength = Strength(password);

    
    if (!password) {
        strength_bar.classList.remove('veryweak');
        strength_bar.classList.remove('weak');
        strength_bar.classList.remove('moderate');
        strength_bar.classList.remove('strong');
        strength_bar.classList.remove('verystrong');

    } else if (strength < 2) {
        strength_bar.classList.add('veryweak');
        strength_bar.classList.remove('weak');
        strength_bar.classList.remove('moderate');
        strength_bar.classList.remove('strong');
        strength_bar.classList.remove('verystrong');
    }
    else if (strength >= 2 && strength < 4) {
        strength_bar.classList.remove('veryweak');
        strength_bar.classList.add('weak');
        strength_bar.classList.remove('moderate');
        strength_bar.classList.remove('strong');
        strength_bar.classList.remove('verystrong');
    }
    else if (strength >= 4 && strength < 6) {
        strength_bar.classList.remove('veryweak');
        strength_bar.classList.remove('weak');
        strength_bar.classList.add('moderate');
        strength_bar.classList.remove('strong');
        strength_bar.classList.remove('verystrong');
    }
    else if (strength >= 6 && strength < 8) {
        strength_bar.classList.remove('veryweak');
        strength_bar.classList.remove('weak');
        strength_bar.classList.remove('moderate');
        strength_bar.classList.add('strong');
        strength_bar.classList.remove('verystrong');
    }
    else if (strength >= 8 && strength < 10) {
        strength_bar.classList.remove('veryweak');
        strength_bar.classList.remove('weak');
        strength_bar.classList.remove('moderate');
        strength_bar.classList.remove('strong');
        strength_bar.classList.add('verystrong');
    }
    })

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

