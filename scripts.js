// Satoshi Ltd. - JavaScript Functions
// Privacy-first development studio website

// Matrix Rain Effect
function initMatrixRain() {
  const canvas = document.getElementById("matrix-rain");
  if (!canvas) return; // Exit if no canvas element found

  const ctx = canvas.getContext("2d");

  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Matrix characters
  const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
  const matrixArray = matrix.split("");

  const fontSize = window.innerWidth < 768 ? 12 : 16; // Smaller font on mobile
  const columns = Math.floor(canvas.width / fontSize);
  const drops = [];

  // Initialize drops
  for (let x = 0; x < columns; x++) {
    drops[x] = Math.floor(Math.random() * -100);
  }

  // Animation function
  function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00FF00";
    ctx.font = fontSize + "px monospace";

    // Draw matrix rain
    for (let i = 0; i < drops.length; i++) {
      const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = Math.floor(Math.random() * -20);
      }
      drops[i]++;
    }
  }

  // Start animation
  let animationId;
  function startMatrix() {
    function animate() {
      draw();
      animationId = requestAnimationFrame(animate);
    }
    animate();
  }

  function stopMatrix() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  return { start: startMatrix, stop: stopMatrix };
}

// Initialize particles with multiple layers
function initParticles() {
  const isMobile = window.innerWidth < 768;

  // Only initialize if particles elements exist
  if (!document.getElementById("particles-js")) return;

  // Main particles layer (foreground) - reduced for mobile
  particlesJS("particles-js", {
    particles: {
      number: {
        value: isMobile ? 30 : 50,
        density: { enable: true, value_area: 1000 },
      },
      color: { value: "#FFC431" },
      shape: { type: "circle" },
      opacity: { value: 0.4, random: true },
      size: { value: isMobile ? 2 : 3, random: true },
      line_linked: {
        enable: true,
        distance: isMobile ? 100 : 150,
        color: "#FFC431",
        opacity: 0.3,
        width: 1.2,
      },
      move: {
        enable: true,
        speed: isMobile ? 1 : 1.5,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: !isMobile, mode: "repulse" }, // Disable hover on mobile
        onclick: { enable: true, mode: "push" },
        resize: true,
      },
      modes: {
        repulse: { distance: 120, duration: 0.4 },
        push: { particles_nb: isMobile ? 2 : 3 },
      },
    },
    retina_detect: true,
  });

  // Mid-layer particles (slower, more subtle) - reduced for mobile
  if (document.getElementById("particles-layer-2")) {
    particlesJS("particles-layer-2", {
      particles: {
        number: {
          value: isMobile ? 15 : 30,
          density: { enable: true, value_area: 1200 },
        },
        color: { value: "#FFC431" },
        shape: { type: "circle" },
        opacity: { value: 0.2, random: true },
        size: { value: isMobile ? 1.5 : 2, random: true },
        line_linked: {
          enable: true,
          distance: isMobile ? 150 : 200,
          color: "#FFC431",
          opacity: 0.15,
          width: 0.8,
        },
        move: {
          enable: true,
          speed: 0.8,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: false },
          onclick: { enable: false },
          resize: true,
        },
      },
      retina_detect: true,
    });
  }

  // Background layer particles (slowest, most subtle) - reduced for mobile
  if (document.getElementById("particles-layer-3")) {
    particlesJS("particles-layer-3", {
      particles: {
        number: {
          value: isMobile ? 10 : 20,
          density: { enable: true, value_area: 1500 },
        },
        color: { value: "#FFC431" },
        shape: { type: "circle" },
        opacity: { value: 0.1, random: true },
        size: { value: isMobile ? 1 : 1.5, random: true },
        line_linked: {
          enable: true,
          distance: isMobile ? 200 : 250,
          color: "#FFC431",
          opacity: 0.08,
          width: 0.5,
        },
        move: {
          enable: true,
          speed: 0.3,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: { detect_on: "canvas", events: { resize: true } },
      retina_detect: true,
    });
  }
}

// Advanced scroll animations
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    }
  );

  // Observe all scroll-triggered elements
  document.querySelectorAll("[data-scroll]").forEach((el) => {
    observer.observe(el);
  });
}

// Advanced parallax with particle layers
function initParallaxEffects() {
  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;
    const scrollPercentage = scrolled / (documentHeight - windowHeight);

    // Multi-layer particle parallax
    const particlesMain = document.getElementById("particles-js");
    const particlesLayer2 = document.getElementById("particles-layer-2");
    const particlesLayer3 = document.getElementById("particles-layer-3");

    if (particlesMain) {
      // Main layer - fastest parallax, changes opacity based on section
      const mainTransform = scrolled * 0.3;
      particlesMain.style.transform = `translateY(${mainTransform}px)`;

      // Adjust opacity based on scroll position
      if (scrolled < windowHeight) {
        // Hero section - full visibility
        particlesMain.style.opacity = 1;
      } else if (scrolled < windowHeight * 2) {
        // About section - reduced opacity
        particlesMain.style.opacity = 0.6;
      } else if (scrolled < windowHeight * 3) {
        // Solutions section - minimal opacity
        particlesMain.style.opacity = 0.3;
      } else {
        // Philosophy and beyond - very subtle
        particlesMain.style.opacity = 0.15;
      }
    }

    if (particlesLayer2) {
      // Second layer - medium parallax
      const layer2Transform = scrolled * 0.15;
      particlesLayer2.style.transform = `translateY(${layer2Transform}px) scale(${
        1 + scrollPercentage * 0.2
      })`;
    }

    if (particlesLayer3) {
      // Background layer - slowest parallax
      const layer3Transform = scrolled * 0.05;
      particlesLayer3.style.transform = `translateY(${layer3Transform}px) scale(${
        1 + scrollPercentage * 0.1
      })`;
    }

    // Header blur effect
    const header = document.querySelector(".header");
    if (header) {
      if (scrolled > 100) {
        header.style.backdropFilter = "blur(30px)";
        header.style.background = "rgba(10, 10, 10, 0.95)";
      } else {
        header.style.backdropFilter = "blur(20px)";
        header.style.background = "rgba(10, 10, 10, 0.9)";
      }
    }

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestTick);
}

// Smooth scrolling for navigation
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerHeight = 80;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Staggered animations for philosophy items
function initStaggeredAnimations() {
  const philosophyItems = document.querySelectorAll(".philosophy-item");
  const solutionItems = document.querySelectorAll(".solution-item");

  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, index * 200);
        }
      });
    },
    { threshold: 0.1 }
  );

  [...philosophyItems, ...solutionItems].forEach((item) => {
    staggerObserver.observe(item);
  });
}

// Philosophy descriptions with decrypt effect
function initPhilosophyDescriptions() {
  const letters = "!<>-_\\/[]{}—=+*^?#________";

  document.querySelectorAll(".philosophy-item").forEach((item) => {
    const description = item.querySelector(".philosophy-description");
    if (!description) return;

    const originalText = description.getAttribute("data-original");
    const altText = description.getAttribute("data-alt");
    if (!originalText || !altText) return;

    let interval = null;

    // Handle both mouse and keyboard events for accessibility
    const handleActivate = () => {
      const words = altText.split(" ");
      let wordIndex = 0;

      clearInterval(interval);

      interval = setInterval(() => {
        const revealedWords = words.slice(0, wordIndex + 1);
        const remainingWords = words.slice(wordIndex + 1);

        const scrambledRemaining = remainingWords.map((word) =>
          word
            .split("")
            .map(() => letters[Math.floor(Math.random() * letters.length)])
            .join("")
        );

        const currentText = [...revealedWords, ...scrambledRemaining].join(" ");
        description.textContent = currentText;

        wordIndex++;

        if (wordIndex >= words.length) {
          clearInterval(interval);
          description.textContent = altText;
        }
      }, 100);
    };

    const handleDeactivate = () => {
      clearInterval(interval);
      description.textContent = originalText;
    };

    // Mouse events
    item.addEventListener("mouseenter", handleActivate);
    item.addEventListener("mouseleave", handleDeactivate);

    // Keyboard events for accessibility
    item.addEventListener("focus", handleActivate);
    item.addEventListener("blur", handleDeactivate);
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (description.textContent === originalText) {
          handleActivate();
        } else {
          handleDeactivate();
        }
      }
    });
  });
}

// Auto-rotating words with decrypt effect
function initAutoRotatingWords() {
  const actionWords = ["build", "imagine", "craft", "develop", "create"];
  const productWords = [
    "applications",
    "solutions",
    "tools",
    "software",
    "products",
  ];
  const letters = "!<>-_\\/[]{}—=+*^?#________";

  let actionIndex = 0;
  let productIndex = 0;

  function decryptAndChange(element, newWord, callback) {
    let iteration = 0;

    const interval = setInterval(() => {
      element.textContent = newWord
        .split("")
        .map((letter, index) => {
          if (index < iteration) {
            return newWord[index];
          }
          return letters[Math.floor(Math.random() * letters.length)];
        })
        .join("");

      if (iteration >= newWord.length) {
        clearInterval(interval);
        if (callback) callback();
      }

      iteration += 1 / 3;
    }, 30);
  }

  function rotateWords() {
    const actionElement = document.getElementById("action-word");
    const productElement = document.getElementById("product-word");

    if (actionElement && productElement) {
      // Rotate action word
      actionIndex = (actionIndex + 1) % actionWords.length;
      decryptAndChange(actionElement, actionWords[actionIndex]);

      // Rotate product word (with delay)
      setTimeout(() => {
        productIndex = (productIndex + 1) % productWords.length;
        decryptAndChange(productElement, productWords[productIndex]);
      }, 2000);
    }
  }

  // Start rotation every 6 seconds
  setInterval(rotateWords, 6000);
}

// Hero text decrypt effect (initial animation + hover) - Word by word
function initHeroDecryptEffect() {
  const letters = "!<>-_\\/[]{}—=+*^?#________";

  const heroTitle = document.querySelector(".hero-title");
  const heroSubtitle = document.querySelector(".hero-subtitle");

  // Store original texts immediately (using innerHTML to preserve <br> tags)
  const originalTitleText = heroTitle?.innerHTML || "";
  const originalSubtitleText = heroSubtitle?.textContent || "";

  function scrambleText(text) {
    // For HTML content with <br> tags, split by <br /> or <br>
    const isHTMLContent = text.includes("<br");

    let allWords = [];
    let lineBreaks = [];

    if (isHTMLContent) {
      const parts = text.split(/<br\s*\/?>/i);
      parts.forEach((part, partIndex) => {
        const wordsInPart = part
          .trim()
          .split(" ")
          .filter((word) => word.length > 0);
        wordsInPart.forEach((word) => {
          allWords.push(word);
          lineBreaks.push(partIndex);
        });
      });
    } else {
      const lines = text.split("\n");
      lines.forEach((line, lineIndex) => {
        const wordsInLine = line
          .trim()
          .split(" ")
          .filter((word) => word.length > 0);
        wordsInLine.forEach((word) => {
          allWords.push(word);
          lineBreaks.push(lineIndex);
        });
      });
    }

    const scrambledWords = allWords.map((word) =>
      word
        .split("")
        .map((char) => {
          // Keep punctuation
          if (".,!?/".includes(char)) return char;
          return letters[Math.floor(Math.random() * letters.length)];
        })
        .join("")
    );

    // Reconstruct text with appropriate line breaks
    let result = "";
    let currentLine = 0;
    scrambledWords.forEach((word, index) => {
      if (lineBreaks[index] > currentLine) {
        result += isHTMLContent ? "<br />" : "\n";
        currentLine = lineBreaks[index];
      }
      if (index > 0 && lineBreaks[index] === lineBreaks[index - 1]) {
        result += " ";
      }
      result += word;
    });

    return result;
  }

  function decryptTextByWords(element, originalText, delay = 0) {
    if (!element) return;

    // Handle HTML content with <br> tags
    const isHTMLContent = originalText.includes("<br");

    let allWords = [];
    let lineBreaks = [];

    if (isHTMLContent) {
      // Split by <br> tags for HTML content
      const parts = originalText.split(/<br\s*\/?>/i);
      parts.forEach((part, partIndex) => {
        const wordsInPart = part
          .trim()
          .split(" ")
          .filter((word) => word.length > 0);
        wordsInPart.forEach((word) => {
          allWords.push(word);
          lineBreaks.push(partIndex);
        });
      });
    } else {
      // Split by \n for plain text content
      const lines = originalText.split("\n");
      lines.forEach((line, lineIndex) => {
        const wordsInLine = line
          .trim()
          .split(" ")
          .filter((word) => word.length > 0);
        wordsInLine.forEach((word) => {
          allWords.push(word);
          lineBreaks.push(lineIndex);
        });
      });
    }

    let wordIndex = 0;

    setTimeout(() => {
      const interval = setInterval(() => {
        // Reveal words progressively
        const revealedWords = allWords.slice(0, wordIndex);
        const remainingWords = allWords.slice(wordIndex);

        const scrambledRemaining = remainingWords.map((word) =>
          word
            .split("")
            .map((char) => {
              // Keep punctuation
              if (".,!?/".includes(char)) return char;
              return letters[Math.floor(Math.random() * letters.length)];
            })
            .join("")
        );

        const currentWords = [...revealedWords, ...scrambledRemaining];

        // Reconstruct text with appropriate line breaks
        let result = "";
        let currentLine = 0;
        currentWords.forEach((word, index) => {
          if (lineBreaks[index] > currentLine) {
            result += isHTMLContent ? "<br />" : "\n";
            currentLine = lineBreaks[index];
          }
          if (index > 0 && lineBreaks[index] === lineBreaks[index - 1]) {
            result += " ";
          }
          result += word;
        });

        // Use innerHTML for HTML content, textContent for plain text
        if (isHTMLContent) {
          element.innerHTML = result;
        } else {
          element.textContent = result;
        }

        wordIndex++;

        if (wordIndex > allWords.length) {
          clearInterval(interval);
          // Ensure final text is correct
          if (isHTMLContent) {
            element.innerHTML = originalText;
          } else {
            element.textContent = originalText;
          }
        }
      }, 150); // Slower timing for word-by-word effect
    }, delay);
  }

  // Immediately scramble the text on page load (before slide-up animation)
  if (heroTitle) {
    heroTitle.innerHTML = scrambleText(originalTitleText);
  }
  if (heroSubtitle) {
    heroSubtitle.textContent = scrambleText(originalSubtitleText);
  }

  // Apply initial decrypt effect with delays
  // Wait for the slide-up animation to complete first
  setTimeout(() => {
    decryptTextByWords(heroTitle, originalTitleText, 0); // Start immediately
    decryptTextByWords(heroSubtitle, originalSubtitleText, 0); // Start at same time
  }, 500); // Wait 0.5 seconds for faster slide-up animation

  // No hover effects for hero texts - they should remain static after initial decrypt
}

// Decrypt effect for navigation and buttons
function initDecryptEffect() {
  const letters = "!<>-_\\/[]{}—=+*^?#________";

  // Apply to navigation links, buttons, logo, and solution names - but NOT showcase-title by default
  const elements = document.querySelectorAll(
    ".nav a, .hero-cta, .cta-button, .logo, .solution-name, button, .btn"
  );

  elements.forEach((element) => {
    const originalText = element.textContent;
    let interval = null;

    element.addEventListener("mouseenter", () => {
      let iteration = 0;
      let targetText = originalText;

      clearInterval(interval);

      interval = setInterval(() => {
        element.textContent = targetText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return targetText[index];
            }
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("");

        if (iteration >= targetText.length) {
          clearInterval(interval);
        }

        iteration += 1 / 3;
      }, 30);
    });

    element.addEventListener("mouseleave", () => {
      clearInterval(interval);
      element.textContent = originalText;
    });
  });

  // Special handler for showcase-title (only in matrix mode)
  const showcaseTitle = document.querySelector(".showcase-title");
  if (showcaseTitle) {
    const originalText = showcaseTitle.textContent;
    let interval = null;

    showcaseTitle.addEventListener("mouseenter", () => {
      const isMatrixMode = document.body.classList.contains("matrix-mode");

      if (!isMatrixMode) return; // Only work in matrix mode

      let iteration = 0;
      let targetText = "BUY BITCOIN";

      console.log("[*] Satoshi's hidden message revealed in the solutions...");

      clearInterval(interval);

      interval = setInterval(() => {
        showcaseTitle.textContent = targetText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return targetText[index];
            }
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("");

        if (iteration >= targetText.length) {
          clearInterval(interval);
        }

        iteration += 1 / 3;
      }, 30);
    });

    showcaseTitle.addEventListener("mouseleave", () => {
      clearInterval(interval);
      showcaseTitle.textContent = originalText;
    });
  }
}

// Easter Egg System
function initEasterEgg() {
  let clickCount = 0;
  let matrixRain = null;
  let isMatrixMode = false;
  let clickTimer = null;

  // Initialize matrix rain
  matrixRain = initMatrixRain();

  // Logo click counter - usando getElementById para evitar problemas de selector
  const logo = document.getElementById("logo");
  if (logo) {
    logo.addEventListener("click", (e) => {
      e.preventDefault();
      clickCount++;

      console.log(`Logo clicked: ${clickCount}/7`);

      if (clickCount === 7) {
        activateMatrixMode();
        clickCount = 0;
      }

      // Reset counter after 4 seconds
      if (clickTimer) {
        clearTimeout(clickTimer);
      }
      clickTimer = setTimeout(() => {
        clickCount = 0;
        console.log("Click counter reset");
      }, 4000);
    });
  }

  // Matrix mode activation
  function activateMatrixMode() {
    if (isMatrixMode) return;

    console.log("Activating Matrix Mode...");
    isMatrixMode = true;
    document.body.classList.add("matrix-mode");

    // Hide particles
    const particles1 = document.getElementById("particles-js");
    const particles2 = document.getElementById("particles-layer-2");
    const particles3 = document.getElementById("particles-layer-3");

    if (particles1) particles1.style.opacity = "0";
    if (particles2) particles2.style.opacity = "0";
    if (particles3) particles3.style.opacity = "0";

    // Start matrix rain
    matrixRain.start();

    // Show message
    const message = document.getElementById("matrix-message");
    if (message) {
      message.classList.add("show");
      message.setAttribute("aria-hidden", "false");
      // Hide message after 6 seconds
      setTimeout(() => {
        message.classList.remove("show");
        message.setAttribute("aria-hidden", "true");
      }, 6000);
    }

    console.log(`
██╗  ██╗ █████╗  ██████╗██╗  ██╗
██║  ██║██╔══██╗██╔════╝██║ ██╔╝
███████║███████║██║     █████╔╝ 
██╔══██║██╔══██║██║     ██╔═██╗ 
██║  ██║██║  ██║╚██████╗██║  ██╗
╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝

MATRIX MODE ACTIVATED
[>] Try hovering over section titles...
[*] Satoshi has left you a message...
Type normal() to return to reality...
        `);
  }

  // Deactivate matrix mode
  function deactivateMatrixMode() {
    if (!isMatrixMode) return;

    console.log("Deactivating Matrix Mode...");
    isMatrixMode = false;
    document.body.classList.remove("matrix-mode");

    // Show particles again
    const particles1 = document.getElementById("particles-js");
    const particles2 = document.getElementById("particles-layer-2");
    const particles3 = document.getElementById("particles-layer-3");

    if (particles1) particles1.style.opacity = "";
    if (particles2) particles2.style.opacity = "";
    if (particles3) particles3.style.opacity = "";

    // Stop matrix rain
    matrixRain.stop();

    const message = document.getElementById("matrix-message");
    if (message) {
      message.classList.remove("show");
      message.setAttribute("aria-hidden", "true");
    }

    console.log("Welcome back to reality.");
  }

  // Global functions for console
  window.hack = function () {
    console.log("[>] Initiating hack sequence...");
    console.log("[+] Access granted. Activating matrix mode...");
    activateMatrixMode();
  };

  window.normal = function () {
    console.log("[<] Exiting matrix mode...");
    deactivateMatrixMode();
  };

  // Console welcome message
  console.log(`
    ███████╗ █████╗ ████████╗ ██████╗ ███████╗██╗  ██╗██╗
    ██╔════╝██╔══██╗╚══██╔══╝██╔═══██╗██╔════╝██║  ██║██║
    ███████╗███████║   ██║   ██║   ██║███████╗███████║██║
    ╚════██║██╔══██║   ██║   ██║   ██║╚════██║██╔══██║██║
    ███████║██║  ██║   ██║   ╚██████╔╝███████║██║  ██║██║
    ╚══════╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝
    
    [*] Welcome to Satoshi Ltd. - Privacy-First Development Studio
    
    [!] Easter Egg Commands:
    - Type hack() to enter the matrix
    - Click "Satoshi" logo 7 times for alternative activation
    - Type normal() to return to reality
    - [>] In matrix mode, try hovering over section titles...
    
    [i] Accessibility: Tab navigation supported, screen reader friendly
    [i] Performance: Respects prefers-reduced-motion setting
    `);
}

// Initialize everything
document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initScrollAnimations();
  initParallaxEffects();
  initSmoothScrolling();
  initStaggeredAnimations();
  initDecryptEffect();
  initAutoRotatingWords();
  initPhilosophyDescriptions();
  initEasterEgg();
  initHeroDecryptEffect();
});

// Export functions for potential external use
window.SatoshiLtd = {
  initParticles,
  initMatrixRain,
  initScrollAnimations,
  initParallaxEffects,
  initSmoothScrolling,
  initStaggeredAnimations,
  initDecryptEffect,
  initAutoRotatingWords,
  initPhilosophyDescriptions,
  initEasterEgg,
};
