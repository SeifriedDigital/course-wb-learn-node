function autocomplete(input, latInput, lngInput) {
  // skip if no input on the page
  if(!input) return;

  const dropdown = new google.maps.places.Autocomplete(input);

  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
    
  })
  // if someone hits enter dont submit form
  input.on('keydown', (e) => {
    if(e.keyCode === 13) e.preventDefault();
  })
}

export default autocomplete;