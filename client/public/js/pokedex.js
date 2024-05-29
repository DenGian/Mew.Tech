// Selecteer de checkbox met id "showAllCheckbox"
const showAllCheckbox = document.getElementById('showAllCheckbox');

// Voeg een veranderingsevent toe aan de checkbox
showAllCheckbox.addEventListener('change', function () {
  // Controleer of de checkbox is aangevinkt
  const isChecked = showAllCheckbox.checked;

  // Verkrijg de huidige zoekparameters van de URL
  const queryParams = new URLSearchParams(window.location.search);

  // Als de checkbox is aangevinkt, voeg de parameter 'showAll=true' toe aan de zoekparameters
  if (isChecked) {
    queryParams.set('showAll', 'true');
  } else {
    // Als de checkbox niet is aangevinkt, verwijder de 'showAll' parameter uit de zoekparameters
    queryParams.delete('showAll');
  }

  // Maak een nieuwe URL met de bijgewerkte zoekparameters
  const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
  
  // Laad de nieuwe URL, zodat de zoekparameters worden toegepast
  window.location.href = newUrl;
});
