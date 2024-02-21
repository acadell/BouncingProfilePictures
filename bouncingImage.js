document.addEventListener('DOMContentLoaded', function() {
    var images = []; // Store image elements and their properties
    const params = new URLSearchParams(window.location.search);
    const profile = params.get("targetUserProfileImageUrlEscaped") || "https://static-cdn.jtvnw.net/jtv_user_pictures/ea2040c6-1602-4441-8976-c2a4906544f9-profile_image-300x300.png";

    // Function to add a new bouncing image
    function createBouncingImage(src) {
        var img = document.createElement('img');
        img.src = src;
        img.style.position = 'absolute';
        img.style.width = '100px'; // Adjust the size of your image
        document.body.appendChild(img);

        var speedMultiplier = 5;
        var imageInfo = {
            img: img,
            speedX: Math.random() * speedMultiplier - 2, // Random speed for more dynamic interactions
            speedY: Math.random() * speedMultiplier - 2,
            posX: Math.random() * (window.innerWidth - 100), // Random starting position
            posY: Math.random() * (window.innerHeight - 100),
            directionX: 1,
            directionY: 1
        };

        images.push(imageInfo); // Add to the images array
    }

    // Check if two images collide
    function checkCollision(img1, img2) {
        return img1.posX < img2.posX + img2.img.offsetWidth &&
               img1.posX + img1.img.offsetWidth > img2.posX &&
               img1.posY < img2.posY + img2.img.offsetHeight &&
               img1.posY + img1.img.offsetHeight > img2.posY;
    }

    // Update position of all images
    function updatePositions() {
        images.forEach(function(info, index) {
            // Update the position based on speed and direction
            info.posX += info.speedX * info.directionX;
            info.posY += info.speedY * info.directionY;

            // Boundary collision detection
            if (info.posX + info.img.offsetWidth > window.innerWidth || info.posX < 0) {
                info.directionX *= -1;
            }
            if (info.posY + info.img.offsetHeight > window.innerHeight || info.posY < 0) {
                info.directionY *= -1;
            }

            // Check for collisions with other images
            for (let j = 0; j < images.length; j++) {
                if (j !== index && checkCollision(info, images[j])) {
                    info.directionX *= -1;
                    info.directionY *= -1;
                    break; // Only handle one collision per update to keep it simple
                }
            }

            // Apply the position
            info.img.style.left = info.posX + 'px';
            info.img.style.top = info.posY + 'px';
        });

        requestAnimationFrame(updatePositions); // Continue the loop
    }

    // Initially, you can add one or more images like this:
    createBouncingImage(profile);
    // Add more images as needed
    // createBouncingImage('path-to-another-image.jpg');

    updatePositions(); // Start the animation



    const client = new StreamerbotClient({
        subscribe: {
          General: ['Custom']
        },
        onData: (data) => {
          if (data.event && data.event.source === 'None' && data.event.type === 'Custom') {
            const payload = data.data.data;
    	    console.log(payload);
            createBouncingImage(payload);
          }
        }
    })

});


// const client = new StreamerbotClient({
//     onConnect: onConnect,
//     onDisconnect: onDisconnect
//   });
  
//   async function onConnect(instance) {
//     // document.getElementById('status').innerHTML = "Connected!";
    
//     // document.getElementById('instance').innerHTML = JSON.stringify(instance);
    
//     const actions = await client.getActions();
//     console.log(JSON.stringify(actions));

//     await client.on('Custom.*', (data) => {
//         console.log('New Twitch Chat Message:', data);
        
//     });

//     await client.on('action.*', (data) => {
//         console.log('New Twitch Chat:', data);
        
//     });

//     await client.on('General.Custom', (data) => {
//         console.log('Custom Event:', data);
//     });

//       await client.on('*', (data) => {
//         console.log('Custom Event:', data);
//     });

//   }
  
//   async function onDisconnect() {
//     // document.getElementById('status').innerHTML = 'Disconnected.';
//   }
  
