/* eslint-env browser */
/* eslint "no-console": "off" */
/* global$ */
var members = data.results[0].members;
console.log(members)
if (window.location.href.includes("attendance")) {

    members_counter(members);
    least_engaged(members);
    most_engaged(members);
} else if (window.location.href.includes("loyalty")) {
    members_counter(members);
    least_loyal(members);
    most_loyal(members);

}


//------------------------------ Statistics variables --------------------------------------------------------------------------->
var statistics_attendance = {
    "num_democrats": 0,
    "num_republican": 0,
    "num_independent": 0,
    "pct_votes_democrats": 0,
    "pct_votes_republican": 0,
    "pct_votes_independent": 0,
    "least_engaged": 0,
    "most_engaged": 0,
}

var statistics_loyalty = {
    "num_democrats": 0,
    "num_republican": 0,
    "num_independent": 0,
    "pct_votes_democrats": 0,
    "pct_votes_republican": 0,
    "pct_votes_independent": 0,
    "least_loyal": 0,
    "most_loyal": 0,
}

//------------------------------ Members counter and table set up------------------------------------------------------------>


function members_counter(membersArray) {
    var trRep = document.getElementById("rep_members");
    var trDem = document.getElementById("dem_members");
    var trInd = document.getElementById("ind_members");
    var trMembers = document.getElementById("tot_members");
    var counterRep = 0;
    var counterDem = 0;
    var counterInd = 0;
    var counterRepVotes = 0;
    var counterDemVotes = 0;
    var counterIndVotes = 0;
    for (var x = 0; x < membersArray.length; x++) {
        if (membersArray[x].party == "R") {
            counterRep += 1;

            counterRepVotes += membersArray[x].votes_with_party_pct;
        } else if (membersArray[x].party == "D") {
            counterDem += 1;
            counterDemVotes += membersArray[x].votes_with_party_pct;

        } else if (membersArray[x].party == "I") {
            counterInd += 1;
            counterIndVotes += membersArray[x].votes_with_party_pct;

        }
    }

    var tdRep = document.createElement("td");
    var tdDem = document.createElement("td");
    var tdInd = document.createElement("td");
    var tdRepVotes = document.createElement("td");
    var tdDemVotes = document.createElement("td");
    var tdIndVotes = document.createElement("td");
    var tdMembers = document.createElement("td");
    tdRep.textContent = counterRep;
    tdDem.textContent = counterDem;
    tdInd.textContent = counterInd;
    tdMembers.textContent = counterRep + counterDem + counterInd;
    console.log(tdMembers);

    if (counterRep == 0) {
        tdRepVotes.textContent = 0 + "%";
    } else {
        tdRepVotes.textContent = Math.round(counterRepVotes / counterRep) + "%";
    }
    if (counterDem == 0) {
        tdDemVotes.textContent = 0 + "%";
    } else {
        tdDemVotes.textContent = Math.round(counterDemVotes / counterDem) + "%";
    }
    if (counterInd == 0) {
        tdIndVotes.textContent = 0 + "%";
    } else {
        tdIndVotes.textContent = Math.round(counterIndVotes / counterInd) + "%";
    }

    trRep.append(tdRep, tdRepVotes);
    trDem.append(tdDem, tdDemVotes);
    trInd.append(tdInd, tdIndVotes);
    trMembers.append(tdMembers);
}


//------------------------------ Least engaged 10%----------------------------------------------------------------->


function least_engaged(membersArray) {

    // sort array by votes
    membersArray.sort(function (a, b) {
        return b.missed_votes_pct - a.missed_votes_pct
    });


    var ten_percent = Math.round(membersArray.length * .10);
    var tBody = document.getElementById("least_engaged_voters");

    for (var x = 0; x < ten_percent; x++) {
        // creating cells
        var row = document.createElement("tr")
        var tdName = document.createElement("td")
        var tdMissedVotes = document.createElement("td")
        var tdMissedVotesPct = document.createElement("td")
        //Add link to name
        var str = membersArray[x].first_name + " " + (membersArray[x].middle_name || "") + " " + membersArray[x].last_name;
        var link = membersArray[x].url;
        var NameLink = str.link(link);
        // adding text
        tdName.innerHTML = NameLink;
        tdMissedVotes.textContent = membersArray[x].missed_votes;
        tdMissedVotesPct.textContent = membersArray[x].missed_votes_pct + "%";
        row.append(tdName, tdMissedVotes, tdMissedVotesPct);
        tBody.append(row);
    }
}

//------------------------------ Most engaged 10%----------------------------------------------------------------->


function most_engaged(membersArray) {

    // sort array by votes
    membersArray.sort(function (a, b) {
        return a.missed_votes_pct - b.missed_votes_pct
    });

    var ten_percent = Math.round(membersArray.length * .10);
    var tBody = document.getElementById("most_engaged_voters");

    for (var x = 0; x < ten_percent; x++) {
        // creating cells
        var row = document.createElement("tr")
        var tdName = document.createElement("td")
        var tdMissedVotes = document.createElement("td")
        var tdMissedVotesPct = document.createElement("td")
        //Add link to name
        var str = membersArray[x].first_name + " " + (membersArray[x].middle_name || "") + " " + membersArray[x].last_name;
        var link = membersArray[x].url;
        var NameLink = str.link(link);
        // adding text
        tdName.innerHTML = NameLink;
        tdMissedVotes.textContent = membersArray[x].missed_votes;
        tdMissedVotesPct.textContent = membersArray[x].missed_votes_pct + "%";
        row.append(tdName, tdMissedVotes, tdMissedVotesPct);
        tBody.append(row);
    }
}
//------------------------------ Least loyal 10%----------------------------------------------------------------->


function least_loyal(membersArray) {

    // sort array by votes
    membersArray.sort(function (a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct
    });


    var ten_percent = Math.round(membersArray.length * .10);
    var tBody = document.getElementById("least_loyal");

    for (var x = 0; x < ten_percent; x++) {
        // creating cells
        var row = document.createElement("tr")
        var tdName = document.createElement("td")
        var tdVotesPct = document.createElement("td")
        var tdVotesParty = document.createElement("td")
        //Add link to name
        var str = membersArray[x].first_name + " " + (membersArray[x].middle_name || "") + " " + membersArray[x].last_name;
        var link = membersArray[x].url;
        var NameLink = str.link(link);
        // adding text
        tdName.innerHTML = NameLink;
        tdVotesPct.textContent = membersArray[x].total_votes;
        tdVotesParty.textContent = membersArray[x].votes_with_party_pct + "%";
        row.append(tdName, tdVotesPct, tdVotesParty);
        tBody.append(row);
    }
}

//------------------------------ Most loyal 10%----------------------------------------------------------------->

function most_loyal(membersArray) {

    // sort array by votes
    membersArray.sort(function (a, b) {
        return b.votes_with_party_pct - a.votes_with_party_pct
    });


    var ten_percent = Math.round(membersArray.length * .10);
    var tBody = document.getElementById("most_loyal");

    for (var x = 0; x < ten_percent; x++) {
        // creating cells
        var row = document.createElement("tr")
        var tdName = document.createElement("td")
        var tdVotesPct = document.createElement("td")
        var tdVotesParty = document.createElement("td")
        //Add link to name
        var str = membersArray[x].first_name + " " + (membersArray[x].middle_name || "") + " " + membersArray[x].last_name;
        var link = membersArray[x].url;
        var NameLink = str.link(link);
        // adding text
        tdName.innerHTML = NameLink;
        tdVotesPct.textContent = membersArray[x].total_votes;
        tdVotesParty.textContent = membersArray[x].votes_with_party_pct + "%";
        row.append(tdName, tdVotesPct, tdVotesParty);
        tBody.append(row);
    }
}
