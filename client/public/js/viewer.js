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
  
  // Wanneer de inhoud van de pagina volledig is geladen
  document.addEventListener("DOMContentLoaded", function () {
    // Selecteer alle elementen met de klasse "pokemon-box"
    const pokemonBoxes = document.querySelectorAll(".pokemon-box");
  
    // Voor elk element in pokemonBoxes
    pokemonBoxes.forEach((box) => {
      // Voeg een klikgebeurtenis toe aan het element
      box.addEventListener("click", function () {
        // Verwijder de highlight van alle pokemon-box elementen
        pokemonBoxes.forEach((b) => b.classList.remove("highlighted"));
        // Voeg de highlight toe aan het aangeklikte pokemon-box element
        box.classList.add("highlighted");
        // Vink de bijbehorende radio knop aan in het aangeklikte pokemon-box element
        box.querySelector("input[type='radio']").checked = true;
      });
    });
  });
  