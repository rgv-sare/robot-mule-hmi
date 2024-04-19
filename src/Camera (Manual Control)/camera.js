const video = document.getElementById('camera-feed');
// Get the camera selection menu
const select = document.getElementById('camera-select');

select.addEventListener('click', event => {
  const deviceId = select.value;
  const constraints = {
    video: {
      deviceId: {
        exact: deviceId
      },
    },
  };
  navigator.mediaDevices
  .getUserMedia(constraints)
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(error => {
    console.error('Error accessing media devices.', error);
  });
});

// Ask for permission to use the camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
      // Set the video element's source to the camera stream
        video.srcObject = stream;

        // Get a list of available cameras
        navigator.mediaDevices.enumerateDevices()
          .then(devices => {
            // Filter the list to only include video input devices
            const videoDevices = devices.filter(device => device.kind === 'videoinput');

            // Create a list of options for the camera selection menu
            const options = videoDevices.map(device => {
              return `<option value="${device.deviceId}">${device.label}</option>`;
            });

            // Add the options to the camera selection menu
            select.innerHTML = options.join('');
          })
          .catch(error => {
            console.error('Error fetching video devices:', error);
          });
      })
      .catch(error => {
        console.error('Error accessing camera:', error);
      });

    // Add event listener to back button
    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', () => {
      window.location.href = '../Index/index.html';
    });