// Selecteer het modale venster met id "starterModal"
const modal = document.getElementById("starterModal");
// Selecteer de sluitknop van het modale venster
const closeModal = document.getElementsByClassName("close")[0];
// Selecteer het formulier met id "starterForm"
const starterForm = document.getElementById("starterForm");
// Selecteer het inputveld met id "starterPokemon"
const starterInput = document.getElementById("starterPokemon");
// Selecteer alle afbeeldingen met de klasse "starter-img"
const starterImages = document.querySelectorAll(".starter-img");

// Toon het modale venster als de gebruiker nog geen starter Pokémon heeft geselecteerd
if (showStarterModal) {
  modal.style.display = "flex";
}

// Sluit het modale venster wanneer de gebruiker op de sluitknop klikt
closeModal.onclick = function() {
  modal.style.display = "none";
}

// Sluit het modale venster wanneer de gebruiker buiten de inhoud van het modale venster klikt
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Selecteer een starter Pokémon
starterImages.forEach(img => {
  img.onclick = function() {
    // Stel de waarde van het inputveld in op de data-pokemon attributenwaarde van de aangeklikte afbeelding
    starterInput.value = this.getAttribute("data-pokemon");
    // Dien het formulier in
    starterForm.submit();
  }
});
