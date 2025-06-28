// ============================================
// NAVIGATION & MENU FUNCTIONALITY
// ============================================

// Navigation Toggle
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
  });
}

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    if (navMenu) navMenu.classList.remove("active");
    if (navToggle) navToggle.classList.remove("active");
  });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Navbar background on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(10, 10, 15, 0.98)";
    } else {
      navbar.style.background = "rgba(10, 10, 15, 0.95)";
    }
  }
});

// ============================================
// MODAL FUNCTIONALITY
// ============================================

// Awards Modal
const modal = document.getElementById("awards-modal");
const closeBtn = document.querySelector(".close");

// Show modal on page load
window.addEventListener("load", () => {
  if (modal) {
    setTimeout(() => {
      modal.style.display = "block";
    }, 1000);
  }
});

// Close modal
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    if (modal) modal.style.display = "none";
  });
}

window.addEventListener("click", (e) => {
  if (e.target === modal && modal) {
    modal.style.display = "none";
  }
});

// ============================================
// HERO SECTION FUNCTIONALITY
// ============================================

// Hero buttons functionality
const joinBtn = document.getElementById("join-btn");
const watchBtn = document.getElementById("watch-btn");

if (joinBtn) {
  joinBtn.addEventListener("click", () => {
    const communitySection = document.querySelector("#community");
    if (communitySection) {
      communitySection.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
}

if (watchBtn) {
  watchBtn.addEventListener("click", () => {
    const streamSection = document.querySelector("#stream");
    if (streamSection) {
      streamSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
}

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = "";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Initialize typing effect on load
window.addEventListener("load", () => {
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    setTimeout(() => {
      typeWriter(heroTitle, originalText, 50);
    }, 500);
  }
});

// ============================================
// FAQ ACCORDION FUNCTIONALITY
// ============================================

document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", () => {
    const faqItem = question.parentElement;
    const isActive = faqItem.classList.contains("active");

    // Close all FAQ items
    document.querySelectorAll(".faq-item").forEach((item) => {
      item.classList.remove("active");
    });

    // Open clicked item if it wasn't active
    if (!isActive) {
      faqItem.classList.add("active");
    }
  });
});

// ============================================
// ANIMATION & VISUAL EFFECTS
// ============================================

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("aos-animate");
    }
  });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll("[data-aos]").forEach((el) => {
  observer.observe(el);
});

// Add CSS for floatUp animation
const style = document.createElement("style");
style.textContent = `
    @keyframes floatUp {
        to {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Dynamic particle generation
function createParticle() {
  const particle = document.createElement("div");
  particle.style.position = "absolute";
  particle.style.width = Math.random() * 4 + 2 + "px";
  particle.style.height = particle.style.width;
  particle.style.background = "#00f5ff";
  particle.style.borderRadius = "50%";
  particle.style.left = Math.random() * 100 + "%";
  particle.style.top = "100%";
  particle.style.opacity = Math.random() * 0.5 + 0.3;
  particle.style.pointerEvents = "none";
  particle.style.animation = `floatUp ${Math.random() * 3 + 2}s linear forwards`;

  const floatingParticles = document.querySelector(".floating-particles");
  if (floatingParticles) {
    floatingParticles.appendChild(particle);
  }

  setTimeout(() => {
    if (particle.parentNode) {
      particle.remove();
    }
  }, 5000);
}

// Create particles periodically
setInterval(createParticle, 2000);

// ============================================
// STATS ANIMATION
// ============================================

// Add scroll reveal animation for stats
const animateStats = () => {
  const stats = document.querySelectorAll(".stat-number");
  stats.forEach((stat) => {
    const target = Number.parseInt(stat.textContent.replace(/\D/g, ""));
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      if (stat.textContent.includes("K")) {
        stat.textContent = Math.floor(current / 1000) + "K+";
      } else if (stat.textContent.includes("/")) {
        stat.textContent = "24/7";
      } else {
        stat.textContent = Math.floor(current) + "+";
      }
    }, 50);
  });
};

// Trigger stats animation when hero is visible
const heroObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(animateStats, 1000);
        heroObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const heroSection = document.querySelector(".hero");
if (heroSection) {
  heroObserver.observe(heroSection);
}

// ============================================
// STREAM FUNCTIONALITY
// ============================================

// Stream card interaction
const streamCard = document.querySelector(".stream-card-large");
if (streamCard) {
  streamCard.addEventListener("click", () => {
    window.open("https://kick.com/justmrpaper", "_blank");
  });
}

// ============================================
// CONTACT FORM FUNCTIONALITY
// ============================================

// Form validation function
function validateContactForm(data) {
  let isValid = true;
  
  // Validate name
  if (!data.name || data.name.length < 2) {
    showFieldError("name", "Please enter a valid name (at least 2 characters)");
    isValid = false;
  }
  
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    showFieldError("email", "Please enter a valid email address");
    isValid = false;
  }
  
  // Validate subject
  if (!data.subject) {
    showFieldError("subject", "Please select a subject");
    isValid = false;
  }
  
  // Validate message
  if (!data.message || data.message.length < 10) {
    showFieldError("message", "Please enter a message (at least 10 characters)");
    isValid = false;
  }
  
  return isValid;
}

// Show field error function
function showFieldError(fieldName, message) {
  if (fieldName === "form") {
    // For form-level errors
    const formContainer = document.querySelector(".contact-form-container");
    if (!formContainer) return;
    
    const existingError = formContainer.querySelector(".form-error-message");
    if (existingError) {
      existingError.remove();
    }
    
    const errorDiv = document.createElement("div");
    errorDiv.className = "form-error-message";
    errorDiv.textContent = message;
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      formContainer.insertBefore(errorDiv, contactForm);
    }
    return;
  }
  
  // For field-level errors
  const field = document.getElementById(fieldName);
  if (!field) return;
  
  const formGroup = field.parentElement;
  
  field.classList.add("error");
  
  // Remove existing error message
  const existingError = formGroup.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }
  
  // Add new error message
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  formGroup.appendChild(errorDiv);
}

// Clear form errors function
function clearFormErrors() {
  // Clear field errors
  const errorFields = document.querySelectorAll(
    ".form-group input.error, .form-group select.error, .form-group textarea.error"
  );
  errorFields.forEach((field) => {
    field.classList.remove("error");
  });
  
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((msg) => msg.remove());
  
  // Clear form-level errors
  const formErrors = document.querySelectorAll(".form-error-message");
  formErrors.forEach((msg) => msg.remove());
  
  const successMessage = document.querySelector(".form-success");
  if (successMessage) {
    successMessage.remove();
  }
}

// Show success message function
function showSuccessMessage() {
  const formContainer = document.querySelector(".contact-form-container");
  if (!formContainer) return;
  
  const successDiv = document.createElement("div");
  successDiv.className = "form-success";
  successDiv.innerHTML = "🎉 Thank you! Your message has been sent successfully. We'll get back to you within 24 hours!";

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    formContainer.insertBefore(successDiv, contactForm);
  }

  // Remove success message after 5 seconds
  setTimeout(() => {
    successDiv.remove();
  }, 5000);
}

// Contact Form Handling with EmailJS
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector(".form-submit");
    const btnText = submitBtn?.querySelector(".btn-text");
    const btnLoading = submitBtn?.querySelector(".btn-loading");
    
    // Clear previous errors
    clearFormErrors();
    const currentDate= new Date();
    // Get form data
    const formData = new FormData(contactForm);
    const data = {
      name: formData.get("name")?.trim() || "",
      email: formData.get("email")?.trim() || "",
      subject: formData.get("subject") || "",
      message: formData.get("message")?.trim() || "",
      date: currentDate,
    };
    
    // Validate form
    if (!validateContactForm(data)) {
      return;
    }
    
    // Show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      if (btnText) btnText.style.display = "none";
      if (btnLoading) btnLoading.style.display = "inline";
    }
    
    try {
      // Check if EmailJS is available
      if (typeof emailjs === 'undefined') {
        throw new Error('EmailJS is not loaded');
      }
      
      // Send email using EmailJS
      const response = await emailjs.send(
        'service_03qevvs', // Replace with your EmailJS service ID
        'template_n7r9zyo', // Replace with your EmailJS template ID
        {
          from_name: data.name,
          from_email: data.email,
          subject: data.subject,
          message: data.message,
          date: currentDate
        }
      );
      
      // Check if email was sent successfully
      if (response.status === 200) {
        // Show success message
        showSuccessMessage();
        contactForm.reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error("Error sending message:", error);
      showFieldError("form", "There was an error sending your message. Please try again.");
    } finally {
      // Reset button state
      if (submitBtn) {
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = "inline";
        if (btnLoading) btnLoading.style.display = "none";
      }
    }
  });
}

// Real-time validation
document.querySelectorAll(".contact-form input, .contact-form select, .contact-form textarea").forEach((field) => {
  field.addEventListener("blur", () => {
    if (!contactForm) return;
    
    const formData = new FormData(contactForm);
    const data = {
      name: formData.get("name")?.trim() || "",
      email: formData.get("email")?.trim() || "",
      subject: formData.get("subject") || "",
      message: formData.get("message")?.trim() || "",
    };

    // Clear error for this field
    field.classList.remove("error");
    const errorMessage = field.parentElement?.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }

    // Validate individual field
    switch (field.name) {
      case "name":
        if (!data.name || data.name.length < 2) {
          showFieldError("name", "Please enter a valid name (at least 2 characters)");
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
          showFieldError("email", "Please enter a valid email address");
        }
        break;
      case "subject":
        if (!data.subject) {
          showFieldError("subject", "Please select a subject");
        }
        break;
      case "message":
        if (!data.message || data.message.length < 10) {
          showFieldError("message", "Please enter a message (at least 10 characters)");
        }
        break;
    }
  });
});

// ============================================
// INITIALIZATION
// ============================================

// Console log for debugging
console.log("JustMrPaper website JavaScript loaded successfully!");

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}