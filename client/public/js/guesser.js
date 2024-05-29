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
  
  // Toon tijdelijk het bericht voor stat-verhoging
  const statIncreaseMessage = document.querySelector(".stat-increase");
  if (statIncreaseMessage) {
    // Maak het bericht zichtbaar
    statIncreaseMessage.style.display = "block";
    // Verberg het bericht na 3 seconden
    setTimeout(() => {
      statIncreaseMessage.style.display = "none";
    }, 3000); // Verberg na 3 seconden
  }
  