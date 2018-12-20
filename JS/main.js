/* eslint-env browser */
/* eslint "no-console": "off" */
/* global$ */

document.getElementById("alert").style.visibility = "hidden";



//------------------------------ Make .memebers direct source of data------------------------------------------------------------>
var members = data.results[0].members;
//------------------------------ Listeners--------------------------------------------------------------------------------------->

document.getElementById("dem").addEventListener("click", function () {
    filter_party(members);
});
document.getElementById("rep").addEventListener("click", function () {
    filter_party(members);
});
document.getElementById("ind").addEventListener("click", function () {
    filter_party(members);
});
document.getElementById("state_list").addEventListener("change", function () {
    filter_party(members);
});


//------------------------------ Function to create the table ------------------------------------------------------------------->

createtable(members);

function createtable(membersArray) {
    var tbody = document.getElementById("members-data");
    tbody.innerHTML = "";
    if (membersArray.length == 0) {
        document.getElementById("alert").style.visibility = "visible";

    } else {

        document.getElementById("alert").style.visibility = "hidden";

        for (var x = 0; x < membersArray.length; x++) {

            //Create row and cells
            var row = document.createElement("tr")
            var tdName = document.createElement("td")
            var tdParty = document.createElement("td")
            var tdState = document.createElement("td")
            var tdSeniority = document.createElement("td")
            var tdPercentage = document.createElement("td")

            //Add link to name
            var str = membersArray[x].first_name + " " + (membersArray[x].middle_name || "") + " " + membersArray[x].last_name;
            var link = membersArray[x].url;
            var NameLink = str.link(link);

            //Add content to cells
            tdName.innerHTML = NameLink;
            tdParty.textContent = membersArray[x].party;
            tdState.textContent = membersArray[x].state;
            tdSeniority.textContent = membersArray[x].seniority;
            tdPercentage.textContent = membersArray[x].votes_with_party_pct + "%";

            // Push content into table
            row.append(tdName, tdParty, tdState, tdSeniority, tdPercentage);
            tbody.append(row);
        }
    }
}

//------------------------------ Filtering table by party and state ------------------------------------------------------------->


function filter_party(membersArray) {

    var selected_state = document.getElementById("state_list").value;
    var selected_party_members = [];

    for (var x = 0; x < membersArray.length; x++) {
        if (((document.getElementById("dem").checked && membersArray[x].party == "D") || (document.getElementById("rep").checked && membersArray[x].party == "R") || (document.getElementById("ind").checked && membersArray[x].party == "I")) && (selected_state == membersArray[x].state || selected_state == "ALL")) {
            selected_party_members.push(membersArray[x]);
        }
    }
    createtable(selected_party_members);
}

//------------------------------ Function to create dropdown state list --------------------------------------------------------->
dropdown_state(members);

function dropdown_state(membersArray) {
    var stateArray = new Set(membersArray.map(member => member.state).sort()); //removing duplicates and creating new array
    var list = document.getElementById("state_list");
    stateArray.forEach(function (element) {
        var optionState = document.createElement("option");
        optionState.setAttribute("value", element);
        optionState.text = element;
        list.add(optionState);

    });
}


