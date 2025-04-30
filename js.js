//stage 1
const switchButton = document.querySelector(".switch-lights");
const bulbs = document.querySelector(".bulbs");

// stage 2
const playMusicButton = document.querySelector(".play-music");
const music = document.getElementById("background-music");
const confettiMusic = document.querySelector("#confetti");

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

// my congrats
const congrats = document.querySelector(".congrats");

// stage blowing text
const blowingCont = document.querySelector(".blowing");

const end = Date.now() + 15 * 100;

// go Buckeyes!
const colors = ["#bb0000", "#ffffff"];
let animationFrameId; // To store the ID of the animation frame

function startConfetti() {
   const end = Date.now() + 1 * 1000; // Keep it going for 1 second

   (function frame() {
      confetti({
         particleCount: 2,
         angle: 60,
         spread: 55,
         origin: { x: 0 },
         colors: colors,
      });

      confetti({
         particleCount: 2,
         angle: 120,
         spread: 55,
         origin: { x: 1 },
         colors: colors,
      });

      if (Date.now() < end) {
         animationFrameId = requestAnimationFrame(frame);
      }
   })();
}

function fadeOutMusic(audioElement, fadeDuration = 1000) {
   let fadeIntervalId = null;
   const startVolume = audioElement.volume;
   const fadeInterval = 50;
   let currentTime = 0;

   fadeIntervalId = setInterval(() => {
      currentTime += fadeInterval;
      const newVolume = startVolume * (1 - currentTime / fadeDuration);

      if (newVolume <= 0) {
         audioElement.volume = 0;
         audioElement.pause();
         clearInterval(fadeIntervalId);
      } else {
         audioElement.volume = Math.max(0, newVolume);
      }
   }, fadeInterval);
}

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
               music.play();
               switchButton.disabled = true;

               playMusicButton.style.display = "none";
               stage_3();
            },
            { once: true }
         );
      }, 1500);
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
      }, 4000);
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
            }, 4000);
         });
      }, 4000);
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
                  setTimeout(() => {
                     congrats.classList.add("show");

                     setTimeout(() => {
                        congrats.classList.remove("show");
                        blowingCont.classList.add("show");
                        stage_blowing();
                     }, 7000);
                  }, 2000);
                  //blow text appears
               }, 7000);
            }, 2000);
         });
      }, 1000);
   }
   function stage_blowing() {
      fadeOutMusic(music, 3000);
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

         //Trigger when volume exceeds threshold (tune this value)
         if (volume > 40) {
            setTimeout(() => {
               const flame = document.querySelector(".flame");
               if (!flame.classList.contains("blow-out")) {
                  flame.classList.add("blow-out");
                  setTimeout(() => {
                     startConfetti();
                     confettiMusic.play();
                     setTimeout(() => {
                        blowingCont.classList.remove("show");
                        setTimeout(() => {
                           music.play();
                           const againBtn = document.querySelector(".again");
                           againBtn.classList.remove("hidden");
                           againBtn.addEventListener("click", () => {
                              window.location.reload();
                           });
                        }, 2000);
                     }, 2000);
                  }, 1000);
               }
            }, 1000);
         }

         // Start mic detection on load or button press
      }
      startMicDetection();
   }
   bulbs.classList.remove("hidden");
   switchButton.style.display = "none";
});
