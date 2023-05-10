(function() {
    const lat = document.querySelector('#lat').value || 39.73386300228461;
    const lng = document.querySelector('#lng').value || -104.96655449458407;
    const map = L.map('map').setView([lat, lng ], 14);
    let marker;

    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    marker = new L.marker([lat,lng],{
        draggable:true,
        autoPan:true
    }).addTo(map)

    //Detect movement of pin
    marker.on('moveend', function(e){
        marker = e.target
        const position = marker.getLatLng()

        map.panTo(new L.LatLng(position.lat, position.lng))

        //Get direcction on the pin
        geocodeService.reverse().latlng(position, 13).run(function(error,result){
            console.log(result)
            marker.bindPopup(result.address.LongLabel)

        //Fill informatiom
        document.querySelector('.address').textContent = result?.address?.Address ?? '';
        document.querySelector('#address').value = result?.address?.Address ?? '';
        document.querySelector('#lat').value = result?.latlng?.lat ?? '',
        document.querySelector('#lng').value = result?.latlng?.lng ?? '';

        })

    })

})()