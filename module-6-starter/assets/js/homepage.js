var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");

var formSubmitHandler = function(event) {
    // prevent page from refreshing because submit
    event.preventDefault();
    // get value from input element
    var username = nameInputEl.value.trim();

    // clear old content after inputting name
    if (username) {
        getUserRepos(username);
        repoContainerEl.textContent = "";
        nameInputEl.value = "";
    }
    else {
        alert("Please enter a Github username");
    }
};

var displayRepos = function(repos, searchTerm) {
    // check if api returned any repos - has no repos but does have an account on github
    if (repos.length === 0) {
        repoContainerEl.textContent = "No Repositories found!";
        return; // returns back to function after checking this conditonal 
    }

    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //create a container for each repo
        var repoEl = document.createElement("a"); // creates an a tag
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName); // has id and sends us to the HTML issue page

        //create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //append to created span element to created div element
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center"; 

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        //append created div element to DOM, selected at the top of js
        repoContainerEl.appendChild(repoEl);
    }
};

var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl).then(function(response) {
    // request was successful
    if (response.ok) {
        response.json().then(function(data) {
        displayRepos(data, user);
        });
    } 
    else {
        alert('Error: ' + response.statusText);
    }
    })
    .catch(function(error) {
        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        alert("Unable to connect to GitHub");
    });
};

var buttonClickHandler = function(event) {
    // get the language attribute from the clicked element
    var language = event.target.getAttribute("data-language");
    console.log(language);
    if (language) {
        getFeaturedRepos(language);

        // clear old content
        repoContainerEl.textContent = "";
    }
};

var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            });
            // console.log(response);
        }
        else {
            alert('Error: Github User Not Found');
        }
    });
};



// add event listener to the form - listening for the input on the submit button
userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);




// console.log("outisde") // asynchronus 
// fetch("https://api.github.com/users/octocat/repos").then(function(response) {
//     response.json().then(function(data) {
//         console.log(data);
//     });
// });