const video = document.getElementById('camera-feed');
// Get the camera selection menu
const select = document.getElementById('camera-select');

const joystick = createJoystick(docutment.getElementById('left-joystick-border'))

function createJoystick(parent){
  const maxDiff = 100;
  const stick = document.createElement('div');
  //stick.classList.add('joystick')
  
  stick.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup',handleMouseUp);
  stick.addEventListener('touchstart', handleMouseDown);
  document.addEventListener('touchstart', handleMouseDown);
  document.addEventListener('touchened', handleMouseUp);

  let dragStart = null;
  let currentPost = { x: 0, y: 0};

  function handleMouseDown(event){
    stick.style.transition = '0s';
    if (event.changedTouches){
      dragStart = {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY,
      };
     return;
    }
    dragStart = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  function handleMouseMove(event){
    if (dragStart == null) return;
    event.preventDefault();
    if (event.changedTouches){
      event.clientX = event.changedTouches[0].clientX;
      event.clientY = event.changedTouches[0].clientY;
    }
    const xDiff = event.clientX - dragStart.x;
    const yDiff = event.clientY - dragStart.y;
    const angle = Math.atan2(yDiff, xDiff);
    const distance = Math.min(maxDiff, Math.hypot(xDiff, yDiff));
    const xNew = distance * Math.cos(angle);
    const yNew = distance * Math.sin(angle);
    stick.style.transform = `translate3d(${xNew}px, ${yNew}px, 0px)`;
    currentPos = { x:xNew , y:yNew};
  }

  function handleMouseMove(event){
    if(dragStart == null) return;
    stick.style.transition = '.2s';
    stick.style.transform = 'translate3d(0px, 0px, 0px)';
    dragStart = null;
    currentPos = {x:0, y:0};
  }

  parent.appendChild(stick);
  return{
    getPosition: ()=> currentPos,
  };
}



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
      window.location.href = 'index.html';
    });

