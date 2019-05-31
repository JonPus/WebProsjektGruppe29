

document.getElementById('btn').addEventListener('click', myFunction);

function myFunction() {

  var selectHours = document.getElementById('scrollHours');
  var vHouers = selectHours[selectHours.selectedIndex].value;

  var selectMinutes = document.getElementById('scrollMinutes');
  var vMinutes = selectMinutes[selectMinutes.selectedIndex].value;
  

  var selectSeconds = document.getElementById('scrollSeconds');
  var vSeconds = selectSeconds[selectSeconds.selectedIndex].value;
 

    var hours = vHouers;
    var minutes = vMinutes;
    var seconds = vSeconds;
    var time = {
        hours: hours * 1,
        minutes: minutes * 1,
        seconds: seconds * 1
  }



    // Save the interval's handle to `timer`
    var timer = setInterval(countdown, 1000);

    function countdown() {
        var container = document.getElementById('count');

        if (time.seconds > 0) {
            time.seconds--;
        }
        else {
            if (time.minutes > 0) {
                time.minutes--;
                time.seconds = 60;
            }
            else {
                time.minutes = 60;
                time.seconds = 60;
                time.hours--;
            }
        }

        

        if (time.hours >= 0) {
            var hoursSpan = document.querySelector('.hours');
            var minutesSpan = document.querySelector('.minutes');
            var secondsSpan = document.querySelector('.seconds');
            
            
              hoursSpan.innerHTML = time.hours
              minutesSpan.innerHTML = time.minutes
              secondsSpan.innerHTML = time.seconds
        }
        else {
            container.innerHTML = 'Time over';
            clearInterval(timer);
        }
        
    }
}

  




