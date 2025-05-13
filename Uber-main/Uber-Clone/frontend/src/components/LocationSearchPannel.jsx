import React from 'react'

const LocationSearchPanel = ({ suggestions, setVehiclePanel, setPanelOpen, setPickup, setDestination, activeField ,setlat1 , setlat2 , setlng1 , setlng2}) => {
    
    const handleSuggestionClick = (suggestion,lattitude,longitude) => {
        if (activeField === 'pickup') {
            setlat1(lattitude);
            setlng1(longitude);
            setPickup(suggestion)
        } else if (activeField === 'destination') {
            setlat2(lattitude);
            setlng2(longitude);
            setDestination(suggestion)
        }
        // setVehiclePanel(true)
        // setPanelOpen(false)
    }

    // console.log(suggestions);

    return (
        <div>
            {/* Display fetched suggestions */}
            {   

                suggestions.map((elem, idx) => {return (
                    <div key={idx} onClick={() => handleSuggestionClick(elem.display_name,elem.lattitude,elem.longitude)} className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start'>
                        <h2 className='bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full'><i className="ri-map-pin-fill"></i></h2>
                        <h4 className='font-medium'>{elem.display_name}</h4>
                    </div>
                )})
            }
        </div>
    )
}

export default LocationSearchPanel