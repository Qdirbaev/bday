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

// stage blowing text
const blowingCont = document.querySelector(".blowing");

//confetti effect

window.onload = function () {
   // Globals
   var random = Math.random,
      cos = Math.cos,
      sin = Math.sin,
      PI = Math.PI,
      PI2 = PI * 2,
      timer = undefined,
      frame = undefined,
      confetti = [];

   var particles = 10,
      spread = 40,
      sizeMin = 3,
      sizeMax = 12 - sizeMin,
      eccentricity = 10,
      deviation = 100,
      dxThetaMin = -0.1,
      dxThetaMax = -dxThetaMin - dxThetaMin,
      dyMin = 0.13,
      dyMax = 0.18,
      dThetaMin = 0.4,
      dThetaMax = 0.7 - dThetaMin;

   var colorThemes = [
      function () {
         return color(
            (200 * random()) | 0,
            (200 * random()) | 0,
            (200 * random()) | 0
         );
      },
      function () {
         var black = (200 * random()) | 0;
         return color(200, black, black);
      },
      function () {
         var black = (200 * random()) | 0;
         return color(black, 200, black);
      },
      function () {
         var black = (200 * random()) | 0;
         return color(black, black, 200);
      },
      function () {
         return color(200, 100, (200 * random()) | 0);
      },
      function () {
         return color((200 * random()) | 0, 200, 200);
      },
      function () {
         var black = (256 * random()) | 0;
         return color(black, black, black);
      },
      function () {
         return colorThemes[random() < 0.5 ? 1 : 2]();
      },
      function () {
         return colorThemes[random() < 0.5 ? 3 : 5]();
      },
      function () {
         return colorThemes[random() < 0.5 ? 2 : 4]();
      },
   ];
   function color(r, g, b) {
      return "rgb(" + r + "," + g + "," + b + ")";
   }

   // Cosine interpolation
   function interpolation(a, b, t) {
      return ((1 - cos(PI * t)) / 2) * (b - a) + a;
   }

   // Create a 1D Maximal Poisson Disc over [0, 1]
   var radius = 1 / eccentricity,
      radius2 = radius + radius;
   function createPoisson() {
      // domain is the set of points which are still available to pick from
      // D = union{ [d_i, d_i+1] | i is even }
      var domain = [radius, 1 - radius],
         measure = 1 - radius2,
         spline = [0, 1];
      while (measure) {
         var dart = measure * random(),
            i,
            l,
            interval,
            a,
            b,
            c,
            d;

         // Find where dart lies
         for (i = 0, l = domain.length, measure = 0; i < l; i += 2) {
            (a = domain[i]), (b = domain[i + 1]), (interval = b - a);
            if (dart < measure + interval) {
               spline.push((dart += a - measure));
               break;
            }
            measure += interval;
         }
         (c = dart - radius), (d = dart + radius);

         // Update the domain
         for (i = domain.length - 1; i > 0; i -= 2) {
            (l = i - 1), (a = domain[l]), (b = domain[i]);
            // c---d          c---d  Do nothing
            //   c-----d  c-----d    Move interior
            //   c--------------d    Delete interval
            //         c--d          Split interval
            //       a------b
            if (a >= c && a < d)
               if (b > d) domain[l] = d; // Move interior (Left case)
               else domain.splice(l, 2);
            // Delete interval
            else if (a < c && b > c)
               if (b <= d) domain[i] = c; // Move interior (Right case)
               else domain.splice(i, 0, c, d); // Split interval
         }

         // Re-measure the domain
         for (i = 0, l = domain.length, measure = 0; i < l; i += 2)
            measure += domain[i + 1] - domain[i];
      }

      return spline.sort();
   }

   // Create the overarching container
   var container = document.createElement("div");
   container.style.position = "fixed";
   container.style.top = "0";
   container.style.left = "0";
   container.style.width = "100%";
   container.style.height = "0";
   container.style.overflow = "visible";
   container.style.zIndex = "9999";

   // Confetto constructor
   function Confetto(theme) {
      this.frame = 0;
      this.outer = document.createElement("div");
      this.inner = document.createElement("div");
      this.outer.appendChild(this.inner);

      var outerStyle = this.outer.style,
         innerStyle = this.inner.style;
      outerStyle.position = "absolute";
      outerStyle.width = sizeMin + sizeMax * random() + "px";
      outerStyle.height = sizeMin + sizeMax * random() + "px";
      innerStyle.width = "100%";
      innerStyle.height = "100%";
      innerStyle.backgroundColor = theme();

      outerStyle.perspective = "50px";
      outerStyle.transform = "rotate(" + 360 * random() + "deg)";
      this.axis =
         "rotate3D(" + cos(360 * random()) + "," + cos(360 * random()) + ",0,";
      this.theta = 360 * random();
      this.dTheta = dThetaMin + dThetaMax * random();
      innerStyle.transform = this.axis + this.theta + "deg)";

      this.x = window.innerWidth * random();
      this.y = -deviation;
      this.dx = sin(dxThetaMin + dxThetaMax * random());
      this.dy = dyMin + dyMax * random();
      outerStyle.left = this.x + "px";
      outerStyle.top = this.y + "px";

      // Create the periodic spline
      this.splineX = createPoisson();
      this.splineY = [];
      for (var i = 1, l = this.splineX.length - 1; i < l; ++i)
         this.splineY[i] = deviation * random();
      this.splineY[0] = this.splineY[l] = deviation * random();

      this.update = function (height, delta) {
         this.frame += delta;
         this.x += this.dx * delta;
         this.y += this.dy * delta;
         this.theta += this.dTheta * delta;

         // Compute spline and convert to polar
         var phi = (this.frame % 7777) / 7777,
            i = 0,
            j = 1;
         while (phi >= this.splineX[j]) i = j++;
         var rho = interpolation(
            this.splineY[i],
            this.splineY[j],
            (phi - this.splineX[i]) / (this.splineX[j] - this.splineX[i])
         );
         phi *= PI2;

         outerStyle.left = this.x + rho * cos(phi) + "px";
         outerStyle.top = this.y + rho * sin(phi) + "px";
         innerStyle.transform = this.axis + this.theta + "deg)";
         return this.y > height + deviation;
      };
   }

   function poof() {
      if (!frame) {
         // Append the container
         document.body.appendChild(container);

         // Add confetti
         var theme = colorThemes[0],
            count = 0;
         (function addConfetto() {
            var confetto = new Confetto(theme);
            confetti.push(confetto);
            container.appendChild(confetto.outer);
            timer = setTimeout(addConfetto, spread * random());
         })(0);

         // Start the loop
         var prev = undefined;
         requestAnimationFrame(function loop(timestamp) {
            var delta = prev ? timestamp - prev : 0;
            prev = timestamp;
            var height = window.innerHeight;

            for (var i = confetti.length - 1; i >= 0; --i) {
               if (confetti[i].update(height, delta)) {
                  container.removeChild(confetti[i].outer);
                  confetti.splice(i, 1);
               }
            }

            if (timer || confetti.length)
               return (frame = requestAnimationFrame(loop));

            // Cleanup
            document.body.removeChild(container);
            frame = undefined;
         });
      }
   }
};

// confetti effect end

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
                     stage_blowing();
                  }, 1000);
               }, 2000);
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
            setTimeout(() => {
               if (!flame.classList.contains("blow-out")) {
                  flame.classList.add("blow-out");
               }
               poof();
            }, 1000);
         }
         // Start mic detection on load or button press
      }
      startMicDetection();
   }
   bulbs.classList.remove("hidden");
   switchButton.style.display = "none";
});
