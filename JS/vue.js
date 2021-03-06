/* eslint-env browser */
/* eslint "no-console": "off" */
/* global$ */

var data = {};
var site = {};

var app = new Vue({
  el: "#app",
  data: {
    //Read more/less
    read_more_about_trigger: true,
    more_txt_about: false,
    more_txt_about_validity: true,
    read_more_background_trigger: true,
    more_txt_background: false,
    more_txt_background_validity: true,
    //Filters and search
    search: "",
    sort_pick: "",
    sort_pick_validity: true,
    selected_state: "all",
    //fetching + alert and loader
    selection_error: true,
    loading: true,
    fetching_time_controller: "",
    fetching_time: "",
    //Var Num
    counterRep: 0,
    counterDem: 0,
    counterInd: 0,
    RepVotes: 0,
    DemVotes: 0,
    IndVotes: 0,
    tot_members: 0,
    votes_average: 0,
    //array
    fetched_data: [],
    sessionStorage_data: [],
    members: [],
    newMembers: [],
    least_attendance: [],
    most_attendance: [],
    least_loyal: [],
    most_loyal: [],
    filtered_list: [],
    selected_party: [],
    state_dropdown: [],
    politic_title: [],
    //State array
    FullNameStatesD: {
      AL: "Alabama",
      AK: "Alaska",
      AS: "American Samoa",
      AZ: "Arizona",
      AR: "Arkansas",
      CA: "California",
      CO: "Colorado",
      CT: "Connecticut",
      DE: "Delaware",
      DC: "District Of Columbia",
      FM: "Federated States Of Micronesia",
      FL: "Florida",
      GA: "Georgia",
      GU: "Guam",
      HI: "Hawaii",
      ID: "Idaho",
      IL: "Illinois",
      IN: "Indiana",
      IA: "Iowa",
      KS: "Kansas",
      KY: "Kentucky",
      LA: "Louisiana",
      ME: "Maine",
      MH: "Marshall Islands",
      MD: "Maryland",
      MA: "Massachusetts",
      MI: "Michigan",
      MN: "Minnesota",
      MS: "Mississippi",
      MO: "Missouri",
      MT: "Montana",
      NE: "Nebraska",
      NV: "Nevada",
      NH: "New Hampshire",
      NJ: "New Jersey",
      NM: "New Mexico",
      NY: "New York",
      NC: "North Carolina",
      ND: "North Dakota",
      MP: "Northern Mariana Islands",
      OH: "Ohio",
      OK: "Oklahoma",
      OR: "Oregon",
      PW: "Palau",
      PA: "Pennsylvania",
      PR: "Puerto Rico",
      RI: "Rhode Island",
      SC: "South Carolina",
      SD: "South Dakota",
      TN: "Tennessee",
      TX: "Texas",
      UT: "Utah",
      VT: "Vermont",
      VI: "Virgin Islands",
      VA: "Virginia",
      WA: "Washington",
      WV: "West Virginia",
      WI: "Wisconsin",
      WY: "Wyoming"
    }
  },
  created: function() {
    // function fetches just one data set -> fix
    //refactor after git commit

    if (!sessionStorage.getItem("membersJSON")) {
      console.log(
        "empty local storage -> set fetch time and controller -> fetch data"
      );
      //Fetching time
      this.fetching_time = new Date();
      this.fetching_time_controller = new Date();
      this.fetching_time_controller.setMinutes(
        this.fetching_time.getMinutes() + 1
      );
      sessionStorage.setItem(
        "fetch_time_controller",
        this.fetching_time_controller
      );
      console.log(this.fetching_time_controller);

      this.getData();
    } else if (
      (sessionStorage.getItem("membersJSON") &&
        new Date(sessionStorage.getItem("fetch_time_controller")) <
          new Date()) ||
      ((sessionStorage.getItem("party") == "senate" &&
        !window.location.href.includes("senate")) ||
        (sessionStorage.getItem("party") == "house" &&
          !window.location.href.includes("house")))
    ) {
      this.fetching_time = new Date();
      this.fetching_time_controller = new Date();
      this.fetching_time_controller.setMinutes(
        this.fetching_time.getMinutes() + 5
      );
      sessionStorage.setItem(
        "fetch_time_controller",
        this.fetching_time_controller
      );
      console.log("local storage full -> timer is done -> fetching data again");
      console.log(this.fetching_time_controller);

      this.getData();
    } else if (
      sessionStorage.getItem("membersJSON") &&
      new Date(sessionStorage.getItem("fetch_time_controller")) > new Date() &&
      ((this.politic_title == "Senator, 2nd Class" &&
        window.location - href.includes("senate")) ||
        (this.politic_title == "Representative" &&
          window.location - href.includes("house")))
    ) {
      console.log("using local storage array");
      console.log(this.fetching_time_controller);

      this.members = Array.from(
        JSON.parse(sessionStorage.getItem("membersJSON"))
      );
      this.loading = false;
      this.members_counter();
      this.least_engaged();
      this.most_engaged();
      this.bottom_loyal();
      this.top_loyal();
      this.dropdown_state();
    } else {
      this.getData();
    }
  },

  methods: {
    //------------------------------Fetch data -------------------------------------------------------------->

    getData() {
      if (window.location.href.includes("senate")) {
        site = "https://api.propublica.org/congress/v1/113/senate/members.json";
        sessionStorage.setItem("party", "senate");
      } else if (window.location.href.includes("house")) {
        site = "https://api.propublica.org/congress/v1/113/house/members.json";
        sessionStorage.setItem("party", "house");
      }
      var that = this;
      fetch(site, {
        headers: {
          "X-API-Key": "j0y5OLNGItnGNlvjQDw8TCTWTmtXmkTbBBYFj1oN"
        }
      })
        .then(function(response) {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Unable to retrieve data");
          }
        })
        .then(function(jsonData) {
          app.members = jsonData.results[0].members;
          app.politic_title = app.members[0].title;

          //push data into local  storage
          var myJSON = JSON.stringify(app.members);
          sessionStorage.setItem("membersJSON", myJSON);
          app.sessionStorage_data = JSON.parse(
            sessionStorage.getItem("membersJSON")
          );
          //calling functions + hide loader
          app.loading = false;
          app.members_counter();
          app.least_engaged();
          app.most_engaged();
          app.bottom_loyal();
          app.top_loyal();
          app.dropdown_state();
        });
    },
    //------------------------------ Members counter ----------------------------------------------------------------------->

    members_counter() {
      var counterRepVotes = 0;
      var counterDemVotes = 0;
      var counterIndVotes = 0;
      for (var x = 0; x < this.members.length; x++) {
        if (this.members[x].party == "R") {
          this.counterRep += 1;
          counterRepVotes += this.members[x].votes_with_party_pct;
        } else if (this.members[x].party == "D") {
          this.counterDem += 1;
          counterDemVotes += this.members[x].votes_with_party_pct;
        } else if (this.members[x].party == "I") {
          this.counterInd += 1;
          counterIndVotes += this.members[x].votes_with_party_pct;
        }
      }
      if (this.counterRep == 0) {
        this.RepVotes = 0 + "%";
      } else {
        this.RepVotes = Math.round(counterRepVotes / this.counterRep) + "%";
      }
      if (this.counterDem == 0) {
        this.DemVotes = 0 + "%";
      } else {
        this.DemVotes = Math.round(counterDemVotes / this.counterDem) + "%";
      }
      if (this.counterInd == 0) {
        this.IndVotes = 0 + "%";
      } else {
        this.IndVotes = Math.round(counterIndVotes / this.counterInd) + "%";
      }

      this.tot_members = this.counterRep + this.counterDem + this.counterInd;
      this.votes_average =
        Math.round(
          (counterRepVotes + counterDemVotes + counterIndVotes) /
            this.tot_members
        ) + "%";
    },
    //------------------------------ Least engaged 10%----------------------------------------------------------------->

    least_engaged() {
      // sort array by votes
      var least = Array.from(this.members);
      least.sort(function(a, b) {
        return b.missed_votes_pct - a.missed_votes_pct;
      });

      var ten_percent = Math.round(least.length * 0.1);

      for (var x = 0; x < ten_percent; x++) {
        this.least_attendance.push(least[x]);
      }
      for (var i = ten_percent; i < least.length; i++) {
        if (
          this.least_attendance[this.least_attendance.length - 1]
            .missed_votes_pct == least[i].missed_votes_pct
        ) {
          this.least_attendance.push(least[i]);
        }
      }
    },
    //------------------------------ Most engaged 10%----------------------------------------------------------------->

    most_engaged() {
      // sort array by votes
      var most = Array.from(this.members);
      most.sort(function(a, b) {
        return a.missed_votes_pct - b.missed_votes_pct;
      });

      var ten_percent = Math.round(most.length * 0.1);
      var tester = ten_percent - 1;

      for (var x = 0; x < ten_percent; x++) {
        this.most_attendance.push(most[x]);
      }

      for (var i = ten_percent; i < most.length; i++) {
        if (
          this.most_attendance[tester].missed_votes_pct ==
          most[i].missed_votes_pct
        ) {
          this.most_attendance.push(most[i]);
        }
      }
    },

    //------------------------------ Least loyal 10%----------------------------------------------------------------->

    bottom_loyal() {
      // sort array by votes
      var least = Array.from(this.members);
      least.sort(function(a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct;
      });

      var ten_percent = Math.round(least.length * 0.1);
      var tester = ten_percent - 1;

      for (var x = 0; x < ten_percent; x++) {
        this.least_loyal.push(least[x]);
      }
      for (var i = ten_percent; i < least.length; i++) {
        if (
          this.least_loyal[tester].missed_votes_pct == least[i].missed_votes_pct
        ) {
          this.least_loyal.push(least[i]);
        }
      }
    },
    //------------------------------ Most loyal 10%----------------------------------------------------------------->

    top_loyal() {
      // sort array by votes
      var most = Array.from(this.members);
      most.sort(function(a, b) {
        return b.votes_with_party_pct - a.votes_with_party_pct;
      });

      var ten_percent = Math.round(most.length * 0.1);
      var tester = ten_percent - 1;
      for (var x = 0; x < ten_percent; x++) {
        this.most_loyal.push(most[x]);
      }
      for (var i = ten_percent; i < most.length; i++) {
        if (
          this.most_loyal[tester].missed_votes_pct == most[i].missed_votes_pct
        ) {
          this.most_loyal.push(most[i]);
        }
      }
    },
    //------------------------------ Sort identifier----------------------------------------------------------------->

    sort_value_identifier(value) {
      if (this.sort_pick_validity == true) {
        this.sort_pick_validity = false;
        this.sort_pick = value;
      } else {
        this.sort_pick_validity = true;
        this.sort_pick = value;
      }
    },

    read_more_less_about() {
      if (this.more_txt_about_validity == true) {
        this.more_txt_about_validity = false;
        this.more_txt_about = true;
        this.read_more_about_trigger = false;
      } else {
        this.more_txt_about_validity = true;
        this.more_txt_about = false;
        this.read_more_about_trigger = true;
      }
    },
    read_more_less_background() {
      if (this.more_txt_background_validity == true) {
        this.more_txt_background_validity = false;
        this.more_txt_background = true;
        this.read_more_background_trigger = false;
      } else {
        this.more_txt_background_validity = true;
        this.more_txt_background = false;
        this.read_more_background_trigger = true;
      }
    },
    //------------------------------ State Dropdown menu-------------------------------------------------------->

    dropdown_state() {
      var banana = new Set(this.members.map(member => member.state).sort());

      this.state_dropdown = Array.from(banana);
    }
  },
  //------------------------------ Filters----------------------------------------------------------------->

  computed: {
    update_table: function() {
      this.filtered_list = [];

      if (this.selected_party.length == 0 && this.selected_state == "all") {
        for (x = 0; x < this.members.length; x++) {
          this.filtered_list.push(this.members[x]);
        }
      } else {
        for (x = 0; x < this.members.length; x++) {
          if (
            (this.selected_party.includes(this.members[x].party) &&
              (this.selected_state.includes(this.members[x].state) ||
                this.selected_state == "all")) ||
            (this.selected_party.length == 0 &&
              this.selected_state.includes(this.members[x].state))
          ) {
            this.filtered_list.push(this.members[x]);
          }
        }
      }
      if (this.sort_pick_validity == true) {
        this.filtered_list.sort((a, b) =>
          a[this.sort_pick] > b[this.sort_pick]
            ? 1
            : b[this.sort_pick] > a[this.sort_pick]
            ? -1
            : 0
        );
      } else if (this.sort_pick_validity == false) {
        this.filtered_list.sort((a, b) =>
          b[this.sort_pick] > a[this.sort_pick]
            ? 1
            : a[this.sort_pick] > b[this.sort_pick]
            ? -1
            : 0
        );
      }

      var searching = Array.from(this.filtered_list);
      var searched_list = [];
      for (var i = 0; i < searching.length; i++) {
        if (
          (
            searching[i].first_name +
            " " +
            searching[i].middle_name +
            " " +
            searching[i].last_name
          )
            .toLowerCase()
            .includes(this.search.toLowerCase())
        ) {
          searched_list.push(searching[i]);
        }
      }

      if (this.filtered_list.length == 0 && !this.loading) {
        this.selection_error = true;
      } else {
        this.selection_error = false;
      }

      if (this.search) {
        return searched_list;
      } else {
        return this.filtered_list;
      }
    }
  }
});
