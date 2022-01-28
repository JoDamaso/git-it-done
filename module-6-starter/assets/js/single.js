var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function () {
    // grab repo name from url query string
    // grabs repo name from url query string then .splits() the string into 2 strings
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];
    
    if (repoName) { // checks if the repo name acutally exists
        // display repo name on page
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
    }
    else {
        //sends user back to homepage if no repo was given
        document.location.replace("./index.html");
    }
};

var getRepoIssues = function (repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl).then(function (response) {
        // if request was successful
        if (response.ok) {
            response.json().then(function (data) {
                // pass response data to DOM function
                displayIssues(data);

                // check if api has paginated issues
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        }
        else {
            //if not successful, redirect to homepage
            // must have a repo that exists, else you will be returned back to homepage
            document.location.replace("./index.html");
        }
    });
};

var displayIssues = function (issues) {
    // checking if the repo has no open issues
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!"
        return; // returns back out of if statement to then go into the for loop 
    }
    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        //create a span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to the container 
        issueEl.appendChild(titleEl);

        //create a type element
        var typeEl = document.createElement("span");

        //check if the issuse is an actualy issuse or pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull Request)";
        }
        else {
            typeEl.textContent = "Issue";
        }

        //append to container 
        issueEl.appendChild(typeEl);

        //append to HTML
        issueContainerEl.appendChild(issueEl);
    }
};
// creates an a element that links you to more issues if you'd like to visit
var displayWarning = function (repo) {
    //add text to warning container 
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "See more issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank"); // when clicked, will open new tab

    //append created linkEl a to DOM element on the HTML
    // this appears towards the bottom of screen, when the user has more issues than 30
    limitWarningEl.appendChild(linkEl);
};

getRepoName();
