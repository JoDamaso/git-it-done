var issueContainerEl = document.querySelector("#issues-container");


var getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl).then(function(response) {
        // if request was successful
        if (response.ok) {
            response.json().then(function(data) {
                // pass response data to DOM function
                displayIssues(data);
            });
        }
        else {
            alert("There was a problem with your request!");
        }
    });
};

var displayIssues = function(issues) {
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


getRepoIssues("jodamaso/taskinator");