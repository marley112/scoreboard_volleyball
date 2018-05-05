/*tooltips (jquery)*/
$(function () {
    $('.team-edit[data-toggle="tooltip"], .time__control[data-toggle="tooltip"], .point[data-toggle="tooltip"]').tooltip();
})

/*teams names*/
var teamEdit = document.getElementsByClassName("team-edit");
for (let i = 0; i < teamEdit.length; i++) {
    teamEdit[i].addEventListener("click", setNameTeam, false);
}

/*timer*/
var hours = 0;
var minutes = 0;
var seconds = 0;
var timeInterval;
var playButton = document.getElementsByClassName("time__play");
playButton[0].addEventListener('click', timer, false);
var stopButton = document.getElementsByClassName("time__stop");
stopButton[0].addEventListener('click', stopTimer, false);

class Team {
    constructor(name, points, sets) {
        this.name = name;
        this.points = points;
        this.sets = sets;
    }
}

var teamHome = new Team("", 0, 0);
var teamAway = new Team("", 0, 0);

/*points*/
var pointHome = document.getElementsByClassName("point-home");
pointHome[0].addEventListener('click', setPoint, false);
var pointAway = document.getElementsByClassName("point-away");
pointAway[0].addEventListener('click', setPoint, false);
var pointToSet = 25;
var setToWin = 3;
var currSet = 1;

function setNameTeam(el) {

    var teamName = prompt("Nazwa drużyny");
    if (teamName != "") {
        if (el.target.getAttribute("data-team-type") == "home") {
            let homeTeam = document.getElementsByClassName("team-home");
            homeTeam[0].textContent = teamName;
            teamHome.name = teamName;
        } else {
            let awayTeam = document.getElementsByClassName("team-away");
            awayTeam[0].textContent = teamName;
            teamAway.name = teamName;
        }
    }

}

function gameTime() {

    var h = document.getElementsByClassName("time__hour");
    var m = document.getElementsByClassName("time__minutes");
    var s = document.getElementsByClassName("time__seconds");

    timeInterval = setInterval(function () {
        seconds++;
        if (seconds < 10) {
            s[0].textContent = "0" + seconds;
        } else {
            s[0].textContent = seconds;
        }
        if (seconds == 60) {
            minutes++;
            if (minutes < 10) {
                m[0].textContent = "0" + minutes;
            } else {
                m[0].textContent = minutes;
            }
            seconds = 0;
            s[0].textContent = "0" + seconds;
            if (minutes == 60) {
                hours++;
                if (hours < 10) {
                    h[0].textContent = "0" + hours;
                } else {
                    h[0].textContent = hours;
                }
                minutes = 0;
                m[0].textContent = "0" + minutes;
            }
        }
    }, 1000);
}

function timer() {

    if (!playButton[0].classList.contains("pause")) {
        gameTime();
        playButton[0].classList.add("pause");
        playButton[0].children[0].classList.remove("fa-play-circle");
        playButton[0].children[0].classList.add("fa-pause-circle");
        pointHome[0].textContent = pointsDisplay(teamHome.points);
        pointAway[0].textContent = pointsDisplay(teamAway.points);
        let setHome = document.getElementsByClassName("set-home");
        setHome[0].textContent = teamHome.sets;
        let setAway = document.getElementsByClassName("set-away");
        setAway[0].textContent = teamAway.sets;
    } else {
        clearInterval(timeInterval);
        playButton[0].classList.remove("pause");
        playButton[0].children[0].classList.remove("fa-pause-circle");
        playButton[0].children[0].classList.add("fa-play-circle");
    }

}

function stopTimer() {

    clearInterval(timeInterval);
    if (playButton[0].classList.contains("pause")) {
        playButton[0].classList.remove("pause");
        playButton[0].children[0].classList.remove("fa-pause-circle");
        playButton[0].children[0].classList.add("fa-play-circle");
    }
    hour = 0;
    minutes = 0;
    seconds = 0;
    teamHome.points = 0;
    teamAway.points = 0;
    teamHome.sets = 0;
    teamAway.sets = 0;

}

function setPoint(el) {
    if (playButton[0].classList.contains("pause")) {
        if (el.target.classList.contains("point-home")) {
            teamHome.points++;
            //el.target.textContent = pointsDisplay(teamHome.points); //wynik się niezeruje, przechodzi do 1
            if (winSet(teamHome.points, teamAway.points)) {
                teamHome.sets++;
                let setHome = document.getElementsByClassName("set-home");
                setHome[0].textContent = teamHome.sets;
                let setScore = document.getElementsByClassName("set-score");
                let scoreHome = setScore[currSet - 1].getElementsByClassName("score__home");
                scoreHome[0].textContent = pointsDisplay(teamHome.points);
                let scoreAway = setScore[currSet - 1].getElementsByClassName("score__away");
                scoreAway[0].textContent = pointsDisplay(teamAway.points);
                teamHome.points = 0;
                teamAway.points = 0;
                if(winGame(teamHome.sets, teamAway.sets)) {
                    stopTimer();
                }
                currSet++;
            }
            el.target.textContent = pointsDisplay(teamHome.points); //wynik się zeruje, nie pokazuje pełnego wyniku
            pointAway[0].textContent = pointsDisplay(teamAway.points);
            var serviceArrow = document.getElementsByClassName("service__arrow");
            for(let i = 0; i < serviceArrow.length; i++) {
                serviceArrow[i].classList.remove("active");
            }
            serviceArrow[0].classList.add("active");
        } else {
            teamAway.points++;
            //el.target.textContent = pointsDisplay(teamAway.points); //wynik się niezeruje, przechodzi do 1
            if (winSet(teamHome.points, teamAway.points)) {
                teamAway.sets++;
                let setAway = document.getElementsByClassName("set-away");
                setAway[0].textContent = teamAway.sets;
                let setScore = document.getElementsByClassName("set-score");
                let scoreHome = setScore[currSet - 1].getElementsByClassName("score__home");
                scoreHome[0].textContent = pointsDisplay(teamHome.points);
                let scoreAway = setScore[currSet - 1].getElementsByClassName("score__away");
                scoreAway[0].textContent = pointsDisplay(teamAway.points);
                teamAway.points = 0;
                teamHome.points = 0;
                if(winGame(teamHome.sets, teamAway.sets)) {
                    stopTimer();
                }
                currSet++;
            }
            el.target.textContent = pointsDisplay(teamAway.points); //wynik się zeruje, nie pokazuje pełnego wyniku
            pointHome[0].textContent = pointsDisplay(teamHome.points);
            var serviceArrow = document.getElementsByClassName("service__arrow");
            for(let i = 0; i < serviceArrow.length; i++) {
                serviceArrow[i].classList.remove("active");
            }
            serviceArrow[1].classList.add("active");
        }
    }
}

function pointsDisplay(points) {
    if (points < 10) {
        return "0" + points;
    } else {
        return points;
    }
}

function winSet(hPoints, aPoints) {
    if (hPoints > pointToSet - 1) {
        if ((hPoints - aPoints) > 1) {
            return true;
        }
    }
    if (aPoints > pointToSet - 1) {
        if ((aPoints - hPoints) > 1) {
            return true;
        }
    }
    return false;
}

function winGame(hSets, aSets) {
    if (hSets > setToWin - 1) {
        return true;
    }
    if (aSets > setToWin - 1) {
        return true;
    }
    return false;
}
