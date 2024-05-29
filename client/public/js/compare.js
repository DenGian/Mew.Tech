// Selecteer de knop die het navbarmenu laat zien of verbergen
const button = document.querySelector(
    '[data-collapse-toggle="navbar-default"]'
  );
  // Selecteer het element met id "navbar-default"
  const navbarDefault = document.getElementById("navbar-default");
  
  // Voeg een klikgebeurtenis toe aan de knop
  button.addEventListener("click", function () {
    // Wissel de klasse "hidden" voor het navbarmenu om het te verbergen of te laten zien
    navbarDefault.classList.toggle("hidden");
  });
  
  // Voeg een klikgebeurtenis toe aan de reset-knop met id "reset-btn"
  document.getElementById("reset-btn").addEventListener("click", function () {
    // Verwijs de gebruiker naar de URL "/catcher"
    location.href = "/catcher";
  });
  