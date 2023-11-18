import Typed from "typed.js";
import confetti from "canvas-confetti";

const typed = new Typed("#typedJs", {
  strings: [
    "Immersive experience.",
    "Beautiful visualization.",
    "Innovative art.",
  ],
  typeSpeed: 65,
  loop: true,
  backDelay: 1000,
});

const logoTyped = new Typed("#logoTyped", {
  strings: ["&#127916;", "&#127759;", "&#127756;", "It's Dhafin"],
  typeSpeed: 65,
  cursorChar: null,
});

const appreciateBtn = document.getElementById("appreciate");
appreciateBtn.addEventListener("click", () => {
  const myCanvas = document.createElement("canvas");
  myCanvas.style.position = "relative";
  myCanvas.style.inset = 0;
  myCanvas.style.width = "100vw";
  myCanvas.style.height = "100vh";
  myCanvas.style.zIndex = -1;
  document.body.appendChild(myCanvas);

  const myConfetti = confetti.create(myCanvas, {
    resize: true,
    useWorker: true,
  });
  myConfetti({
    particleCount: 100,
    spread: 160,
    origin: {
      x: Math.random(),
      y: Math.random() - 0.1,
    },
  });
});
