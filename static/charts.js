function showstatus(object) {
    object.style.opacity = "1";
}

function out(object) {
    object.style.opacity = "1";
}

updateClock();

$(document).ready(function () {

    function keyboardCursor() {
        const containers = $('.frame-wrapper-new');
        let currentIndex = 0;
        let isHandlingBackKey = false; // Flag to prevent recursion


        containers.css('cursor', 'none');

        function updateAnimationClasses(index) {
            containers.removeClass('hovered active');
            containers.eq(index).addClass('hovered');
        }

        function handleBackKey(index) {
            if (!isHandlingBackKey) {
                isHandlingBackKey = true;
                containers.eq(index).addClass('active');
                // Change the window location to the charts page with the selected index as a parameter
                window.location.href = 'http://127.0.0.1:5000/home?selectedContainer=' + index;
                isHandlingBackKey = false;
            }
        }

        containers.on('selectstart', false);

        containers.on('click', function () {
            let index = containers.index(this);
            console.log('Container clicked:', index);
        });

        // Get the selectedContainer parameter from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const selectedContainerIndex = urlParams.get('selectedContainer');

        // Apply the animation to the container with the selected index
        if (selectedContainerIndex !== null) {
            currentIndex = parseInt(selectedContainerIndex);
            updateAnimationClasses(currentIndex);
        }

        $(document).on('keydown', e => {
            console.log('Key pressed:', e.key);

            if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + containers.length) % containers.length;
                updateAnimationClasses(currentIndex);
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % containers.length;
                updateAnimationClasses(currentIndex);
            } else if (e.key === 'Enter') {
                containers.eq(currentIndex).removeClass('hovered');
                containers.eq(currentIndex).addClass('active');
                e.stopPropagation(); // Stop the event from propagating
                let enterFunction = containers.eq(currentIndex).data('enter-function');
                if (enterFunction && typeof window[enterFunction] === 'function') {
                    window[enterFunction]();
                }
            }
            else if(e.key === 'q')
            {
                containers.eq(currentIndex).removeClass('hovered');
                containers.eq(currentIndex).addClass('active');
                handleBackKey(currentIndex);
            }
        });
    }

    keyboardCursor();

});


function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
  
    const clockElement = document.getElementById('clock');
    if (clockElement) {
      clockElement.textContent = `${hours}:${minutes}`;
    }
  }
  
  // Update the clock every second
  setInterval(updateClock, 1000);

  function updateDateTime() {
    const now = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
    const dayOfWeek = daysOfWeek[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
  
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
  
    const datetimeElement = document.getElementById('DDMY');
    if (datetimeElement) {
      datetimeElement.textContent = `${dayOfWeek}, ${day} ${month} ${year}`;
    }
  }

  setInterval(updateDateTime, 1000);

  updateDateTime();

  async function fetchTemperature() {
    const apiKey = "34c6206d81dda8f8e6e69d02e37897ae"; // Replace with your OpenWeatherMap API key
    const lat = "29.9384";
    const long = "76.9002";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat={${lat}}&lon={${long}}&appid={${apiKey}}&units=metric`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      if (response.ok) {
        const temperature = data.main.temp;
        return temperature;
      } else {
        console.error(`Failed to fetch temperature. ${data.message}`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching temperature:", error.message);
      return null;
    }
  }
  
  function updateTemperature() {
    const temperatureElement = document.getElementById('temperature');
    if (temperatureElement) {
      fetchTemperature().then(temperature => {
        if (temperature !== null) {
          temperatureElement.textContent = `${temperature}°C`;
        } else {
          temperatureElement.textContent = "--°C";
        }
      });
    }
  }
  
  // Update the temperature every 5 seconds (you can adjust the interval as needed)
  setInterval(updateTemperature, 1000);
  
  // Initial update
  updateTemperature();

  