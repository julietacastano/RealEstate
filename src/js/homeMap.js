(function(){
    const lat = 39.73386300228461;
    const lng = -104.96655449458407;
    const map = L.map('homeMap').setView([lat, lng ], 14);

    let markers = new L.FeatureGroup().addTo(map)
    let properties = []

    //Filters
    const filters = {
        category:'',
        price:''
    }

    const categorySelected = document.querySelector('#categories')
    const priceSelected = document.querySelector('#prices')

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //Get properties from the database
    const getProperties = async () =>{
        try {
            const url = '/api/properties'
            const response = await fetch(url)
            properties = await response.json()

            showProperties(properties)

        } catch (error) {
            console.log(error)
        }
    }

    //Show properties on the map
    const showProperties = (props) =>{
        markers.clearLayers()

        props.forEach(property => {
            const marker = new L.marker([property?.lat, property?.lng],{
                autoPan:true
            })
            .addTo(map)
            .bindPopup(`
                <p class="font-semibold">${property.category.name}</p>
                <h3 class="text-indigo-600 text-lg font-bold uppercase my-2">${property.title}</h3>
                <img src="/uploads/${property.img}" alt="Image of the property ${property.title}">
                <p class=" font-semibold">${property.price.name}</p>
                <a href="/properties/${property.id}" class="text-center uppercase block bg-indigo-300">Details</a>
            `)
            
            markers.addLayer(marker)
        })
    }

    //filtering categories and prices
    const filterProperties = () =>{
        const result = properties
            .filter(prop => filters.category ? prop.categoryId === filters.category : prop )
            .filter(prop => filters.price ? prop.priceId === filters.price : prop)
        
        showProperties(result)
    }
    
    categorySelected.addEventListener('change', e =>{
        filters.category = +e.target.value //The + sign converts the sting into a interger
        filterProperties()
    })
    
    priceSelected.addEventListener('change', e =>{
        filters.price = +e.target.value
        filterProperties()
    })
    

    getProperties()
})()