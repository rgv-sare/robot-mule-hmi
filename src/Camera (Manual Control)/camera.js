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
  }
);

//Joystick code
let canvas = document.getElementById('joystick-canvas');
canvas.width = video.offsetWidth;
canvas.height = video.offsetHeight;
canvas.style.position = 'absolute';
canvas.style.top = (video.offsetTop + 25) + 'px';
canvas.style.left = video.offsetLeft + 'px';
document.body.appendChild(canvas);

let ctx = canvas.getContext('2d');

//Create 2 joystick objects
let joystick1 = {x: 150, y: canvas.height - 100, dx: 0, dy: 0, touchId: null};
let joystick2 = {x: canvas.width - 150, y: canvas.height - 100, dx: 0, dy: 0, touchId: null};

//Draw the joysticks
function drawJoysticks(joystick) {
  ctx.beginPath();
  ctx.arc(joystick.x, joystick.y, 100, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(joystick.x + joystick.dx, joystick.y + joystick.dy, 40, 0, 2 * Math.PI);
  ctx.fillStyle = 'gray';
  ctx.fill();
}

function distance(touch, joystick) {
  let dx = touch.clientX - joystick.x;
  let dy = touch.clientY - joystick.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function updateJoysticks(joystick, touch) {
  let dx = touch.clientX - joystick.x;
  let dy = touch.clientY - joystick.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 100) {
    joystick.dx = dx;
    joystick.dy = dy;
  } else {
    joystick.dx = dx / dist * 100;
    joystick.dy = dy / dist * 100;
  }
}

function handleStart(event) {
  let touches = event.changedTouches || [event];
  for(let touch of touches) {
    if (distance(touch, joystick1) < 100) {
      joystick1.touchId = touch.identifier || 'mouse';
    } else if (distance(touch, joystick2) < 100) {
      joystick2.touchId = touch.identifier || 'mouse';
    }
  }
  event.preventDefault();
}

function handleMove(event) {
  let touches = event.changedTouches || [event];
  for(let touch of touches) {
    if(touch.identifier === joystick1.touchId || joystick1.touchId === 'mouse') {
      updateJoysticks(joystick1, touch);
    } else if(touch.identifier === joystick2.touchId || joystick2.touchId === 'mouse') {
      updateJoysticks(joystick2, touch);
    }
  }
}

function handleEnd(event) {
  let touches = event.changedTouches || [event];
  for(let touch of touches) {
    if(touch.identifier === joystick1.touchId || joystick1.touchId === 'mouse') {
      joystick1.dx = 0;
      joystick1.dy = 0;
      joystick1.touchId = null;
    } else if(touch.identifier === joystick2.touchId || joystick2.touchId === 'mouse') {
      joystick2.dx = 0;
      joystick2.dy = 0;
      joystick2.touchId = null;
    }
  }
}
//Listen for controller input events
canvas.addEventListener('touchstart', function(event) {
  for(let touch of event.changedTouches) {
    if (distance(touch, joystick1) < 100) {
      joystick1.touchId = touch.identifier;
    } else if (distance(touch, joystick2) < 100) {
      joystick2.touchId = touch.identifier;
    }
  }
  event.preventDefault();
});

canvas.addEventListener('touchstart', handleStart);
canvas.addEventListener('mousedown', handleStart);
canvas.addEventListener('touchmove', handleMove);
canvas.addEventListener('mousemove', handleMove);
canvas.addEventListener('touchend', handleEnd);
canvas.addEventListener('mouseup', handleEnd);
//Update the position of the joysticks

//Redraw the canvas every frame
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawJoysticks(joystick1);
  drawJoysticks(joystick2);
  requestAnimationFrame(update);
}

update();