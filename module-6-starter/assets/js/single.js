var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
fetch(apiUrl);


var getRepoIssues = function(repo) {
    console.log(repo);
};



getRepoIssues("facebook/react");