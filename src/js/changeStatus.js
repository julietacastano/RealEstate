(function(){
    const changeStatusButtons = document.querySelectorAll('.changeStatus')
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')


    changeStatusButtons.forEach(button => {
        button.addEventListener('click', changeStatusProperty)
    });

    async function changeStatusProperty(e){
        const {propertyId} = e.target.dataset
        try {
            const url = `/properties/${propertyId}`
            const response = await fetch(url,{
                method:'PUT',
                headers:{
                    'CSRF-Token': token
                },
            })

            const {result} = await response.json()

            if(result){
                if(e.target.classList.contains('bg-yellow-100')){
                    e.target.classList.add('bg-green-100', 'text-green-800')
                    e.target.classList.remove('bg-yellow-100', 'text-yellow-800')
                    e.target.textContent = 'Posted'
                }
                else{
                    e.target.classList.remove('bg-green-100', 'text-green-800')
                    e.target.classList.add('bg-yellow-100', 'text-yellow-800')
                    e.target.textContent = 'Not posted'

                }
            }

        } catch (error) {
            console.log(error)
        }
    }
})()