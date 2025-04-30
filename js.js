//stage 1
const switchButton = document.querySelector(".switch-lights");
const bulbs = document.querySelector(".bulbs");

// stage 2
const playMusicButton = document.querySelector(".play-music");
const music = document.getElementById("background-music");

// stage 3
const decorationBtn = document.querySelector(".decoration");

// stage 4 (banner)
const banner = document.querySelector(".banner");

// stage 5 (let-go balloons)
const letGoBtn = document.querySelector(".let-go");
const letGoImage = document.querySelector(".let-go-balloons");
// stage 6 (cake)
const cakeContainer = document.querySelector(".cake-container");
const cake = document.querySelector(".cake");
const cakeBtn = document.querySelector(".cake-btn");

// stage close eyes
const closeCont = document.querySelector(".close-eyes");

// stage 7 blowing
const blowingCont = document.querySelector(".blowing");

// asking access to microphone
let micAccessGranted = false;

async function requestMicrophoneAccess() {
   try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      micAccessGranted = true;
      console.log("Microphone access granted.");
   } catch (err) {
      micAccessGranted = false;
      console.error("Microphone access denied:", err);
   }
}

// Ask for mic access as soon as the page is ready
document.addEventListener("DOMContentLoaded", () => {
   requestMicrophoneAccess();
});



switchButton.addEventListener("click", () => {
   document.body.classList.remove("loop-animation"); // just in case

   document.body.classList.add("initial-change"); // ADD class, not style.animation

   // stage 1
   setTimeout(() => {
      stage_1();
   }, 1000);

   function stage_1() {
      document.body.classList.remove("initial-change");
      document.body.classList.add("loop-animation");
      stage_2();
   }
   // stage 2 (music)
   function stage_2() {
      setTimeout(() => {
         playMusicButton.classList.remove("hidden");
         playMusicButton.addEventListener(
            "click",
            () => {
               // music.play();
               switchButton.disabled = true;

               playMusicButton.style.display = "none";
               stage_3();
            },
            { once: true }
         );
      }, 1000);
   }
   // stage 3 (decoration banner)
   function stage_3() {
      setTimeout(() => {
         decorationBtn.classList.remove("hidden");
         decorationBtn.addEventListener(
            "click",
            () => {
               banner.classList.remove("hidden");
               banner.classList.add("move-down");
               decorationBtn.style.display = "none";
               stage_4();
            },
            { once: true }
         );
      }, 1000);
   }
   function stage_4() {
      setTimeout(() => {
         letGoBtn.classList.remove("hidden");
         letGoBtn.addEventListener("click", () => {
            letGoImage.classList.remove("hidden");
            letGoImage.classList.add("fly-away");
            letGoBtn.style.display = "none";
            setTimeout(() => {
               stage_5();
            }, 2000);
         });
      }, 1000);
   }
   function stage_5() {
      setTimeout(() => {
         cakeBtn.classList.remove("hidden");
         cakeBtn.addEventListener("click", () => {
            cakeContainer.classList.add("visible");
            cakeBtn.style.display = "none";
            setTimeout(() => {
               closeCont.classList.add("show");
               setTimeout(() => {
                  closeCont.classList.remove("show");

                  //blow text appears
                  setTimeout(() => {
                     blowingCont.classList.add("show");
                  }, 1000);

                  stage_blowing();
               }, 7000);
            }, 1000);
         });
      }, 1000);
   }
   function stage_blowing() {
      const flame = document.querySelector(".flame");
      let audioContext, analyser, mic, dataArray;

      async function startMicDetection() {
         try {
            // Get mic access
            const stream = await navigator.mediaDevices.getUserMedia({
               audio: true,
            });
            audioContext = new (window.AudioContext ||
               window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            mic = audioContext.createMediaStreamSource(stream);
            mic.connect(analyser);
            analyser.fftSize = 512;

            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);

            detectVolume();
         } catch (err) {
            console.error("Microphone access denied or error:", err);
         }
      }

      function detectVolume() {
         requestAnimationFrame(detectVolume);
         analyser.getByteTimeDomainData(dataArray);

         let sum = 0;
         for (let i = 0; i < dataArray.length; i++) {
            const deviation = dataArray[i] - 128;
            sum += deviation * deviation;
         }

         const volume = Math.sqrt(sum / dataArray.length);

         // Trigger when volume exceeds threshold (tune this value)
         if (volume > 15) {
            if (!flame.classList.contains("blow-out")) {
               flame.classList.add("blow-out");
            }
         }
         // Start mic detection on load or button press
      }
      startMicDetection();
   }
   bulbs.classList.remove("hidden");
   switchButton.style.display = "none";
});
