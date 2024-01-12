document.addEventListener("DOMContentLoaded", () => {
    const inputElement = document.querySelector("input[type='text']");
    const maleRadioButton = document.getElementById("check-male");
    const femaleRadioButton = document.getElementById("check-female");
    const submitButton = document.querySelector(".button-box button[type='button']");
    const saveButton = document.querySelectorAll(".button-box button")[1];
    const predictionBox = document.querySelector(".prediction-box .results-content");
    const savedAnswerBox = document.querySelector(".saveAnswer-box .results-content");
    const clearButton = document.querySelector("#clear")
  
    // Function to update prediction box
    function updatePrediction(name, gender, percentage) {
      predictionBox.innerHTML = `<p>Gender: ${gender}</p><p>Percentage: ${percentage}%</p>`;
    }
  
    // Function to save user's suggestion and display in the "Saved Answer" box
    function saveAndDisplaySuggestion(name, gender) {
      if (name && gender) {
        const savedSuggestion = { name: name, gender: gender };
        savedAnswerBox.innerHTML = `<p>Name: ${savedSuggestion.name}</p><p>Gender: ${savedSuggestion.gender}</p>`;
        localStorage.setItem('savedSuggestion', JSON.stringify(savedSuggestion));
        alert('Suggestion saved successfully!');
      } else {
        alert('Please enter a name and select a gender before saving.');
      }
    }

    //submit button action
    submitButton.addEventListener("click", () => {
      const name = inputElement.value.trim();
      if (name) {
        fetch(`https://api.genderize.io/?name=${encodeURI(name)}`, {
          method: "GET",
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok.');
            }
            return response.json();
          })
          .then(data => {
            const gender = data.gender;
            const percentage = data.probability * 100;
            updatePrediction(name, gender, percentage);
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
      } else {
        alert("Please enter a name");
      }
    });
  
    //save button action
    saveButton.addEventListener("click", () => {
      const name = inputElement.value.trim();
      let gender = '';
      if (maleRadioButton.checked) {
        gender = 'male';
      } else if (femaleRadioButton.checked) {
        gender = 'female';
      }
      saveAndDisplaySuggestion(name, gender);
    });
  
    //clear button action
    clearButton.addEventListener("click", () => {
      savedAnswerBox.innerHTML = ""; // Clear saved answer box
      localStorage.removeItem('savedSuggestion'); // Remove saved suggestion from localStorage
      alert("Content cleared!");
    })
  
    // Retrieve and display the saved suggestion when the page loads
    const storedSuggestion = localStorage.getItem('savedSuggestion');
    if (storedSuggestion) {
      const parsedSuggestion = JSON.parse(storedSuggestion);
      savedAnswerBox.innerHTML = `<p>Name: ${parsedSuggestion.name}</p><p>Gender: ${parsedSuggestion.gender}</p>`;
    }
  });