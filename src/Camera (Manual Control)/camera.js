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

//Joystick code
let canvas = document.getElementById('canvas');
canvas.width = video.offsetWidth;
canvas.height = video.offsetHeight;
canvas.style.position = 'absolute';
canvas.style.top = video.offsetTop + 'px';
canvas.style.left = video.offsetLeft + 'px';
document.body.appendChild(canvas);

let ctx = canvas.getContext('2d');

//Create 2 joystick objects
let joystick1 = {x: 50, y: canvas.height - 50, dx: 0, dy: 0};
let joystick2 = {x: canvas.width - 50, y: canvas.height - 50, dx: 0, dy: 0};

//Draw the joysticks
function drawJoysticks() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.arc(joystick1.x, joystick1.y, 40, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(joystick2.x, joystick2.y, 40, 0, 2 * Math.PI);
  ctx.stroke();
}