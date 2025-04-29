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
            }, 5000);
         });
      }, 1000);
   }
   function stage_5() {
      setTimeout(() => {
         cakeBtn.classList.remove("hidden");
         cakeBtn.addEventListener("click", () => {
            cakeContainer.classList.add("visible");
            cakeBtn.style.display = "none";
         });
      }, 1000);
   }
   bulbs.classList.remove("hidden");
   switchButton.style.display = "none";
});
