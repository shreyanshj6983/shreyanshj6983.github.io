/**
* Template Name: iPortfolio
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  // chat bot code
  let chatbotResponses = {}; // Empty object to store responses

  // Load chatbot responses from the text file
  function loadResponses() {
      fetch('responses.txt')
          .then(response => response.text())
          .then(data => {
              chatbotResponses = parseResponses(data);
          })
          .catch(error => console.error("Error loading responses:", error));
  }
  
  // Convert text file content into an object
  function parseResponses(data) {
      let lines = data.split("\n");
      let responses = {};
  
      lines.forEach(line => {
          let parts = line.split("="); // Split key-value pairs
          if (parts.length === 2) {
              let key = parts[0].trim().toLowerCase(); // Normalize keys
              let value = parts[1].trim();
              responses[key] = value;
          }
      });
  
      return responses;
  }
  
  // Call loadResponses() when the page loads
  document.addEventListener("DOMContentLoaded", function () {
      loadResponses();
  
      let chatbot = document.getElementById("chatbot");
      let chatMessages = document.getElementById("chat-messages");
      let chatToggleButton = document.createElement("button");
  
      chatToggleButton.innerText = "AI Chat BOT";
      chatToggleButton.style.position = "fixed";
      chatToggleButton.style.bottom = "20px";
      chatToggleButton.style.right = "20px";
      chatToggleButton.style.zIndex = "1000";
      chatToggleButton.onclick = function () {
          chatbot.style.display = "block";
          chatToggleButton.style.display = "none"; // Hide button when chatbot opens
          showDefaultMessages();
      };
      document.body.appendChild(chatToggleButton);
  
      document.getElementById("chat-input").addEventListener("keypress", function(event) {
          if (event.key === "Enter") {
              sendMessage();
          }
      });
  
      document.querySelector("#chat-body button").addEventListener("click", sendMessage);
  
      // Close chatbot and show toggle button when clicked outside
      document.addEventListener("click", function (event) {
          if (!chatbot.contains(event.target) && event.target !== chatToggleButton) {
              chatbot.style.display = "none";
              chatToggleButton.style.display = "block"; // Show button when chatbot is closed
          }
      });
  });
  
  // Show default messages when chatbot is opened
  function showDefaultMessages() {
      let chatMessages = document.getElementById("chat-messages");
      chatMessages.innerHTML = ""; // Clear chat history
  
      let botMessage1 = document.createElement("p");
      botMessage1.innerHTML = `<strong>Bot:</strong> Hello! I'm an AI Chat Bot of Shreyansh. You can ask me anything about Shreyansh like [Education, Skills, Projects, Experiences, etc.]`;
      chatMessages.appendChild(botMessage1);
  
      let botMessage2 = document.createElement("p");
      botMessage2.innerHTML = `<strong>Bot:</strong> Ask questions like - What is your CGPA, work experience, internships, projects, certifications, or job responsibilities.`;
      chatMessages.appendChild(botMessage2);
  }
  
  function sendMessage() {
      let inputField = document.getElementById("chat-input");
      let chatMessages = document.getElementById("chat-messages");
      let message = inputField.value.trim().toLowerCase();
  
      if (message === "") return;
  
      inputField.value = "";
  
      let userMessage = document.createElement("p");
      userMessage.innerHTML = `<strong>You:</strong> ${message}`;
      chatMessages.appendChild(userMessage);
  
      // Add typing indicator
      let typingIndicator = document.createElement("p");
      typingIndicator.id = "typing-indicator";
      typingIndicator.innerHTML = `<strong>Bot:</strong> Typing...`;
      chatMessages.appendChild(typingIndicator);
  
      setTimeout(() => {
          chatMessages.removeChild(typingIndicator); // Remove typing indicator
          let botResponse = getBotResponse(message);
  
          let botMessage = document.createElement("p");
          botMessage.innerHTML = `<strong>Bot:</strong> ${botResponse}`;
          chatMessages.appendChild(botMessage);
  
          // Auto-scroll to the latest message
          chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1000);
  }
  
  function getBotResponse(userMessage) {
      // Check exact match first
      if (chatbotResponses[userMessage]) {
          return chatbotResponses[userMessage];
      }
  
      // Check for partial or similar match (Improved fuzzy matching)
      for (let key in chatbotResponses) {
          if (userMessage.includes(key) || key.includes(userMessage)) {
              return chatbotResponses[key];
          }
      }
  
      return chatbotResponses["default"] || "I'm not sure how to respond to that.";
  }
   
  
  
})();
