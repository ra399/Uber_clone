import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import polyline from 'polyline';

const MapWithRoute = () => {
    useEffect(() => {
        let map; // Declare map outside of useEffect to maintain reference

        // Initialize the map only once
        if (!map) {
            map = L.map('map').setView([17.72168, 83.29067], 10); // Starting point (Visakhapatnam)
        }

        // Add tile layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Decoding the polyline data
        const polylineStr = "ogdkBuuj{NewjA}zt@qoi@_thAsgyAs{aBei~Aa_`AisTcsu@e}fAozWikhButaCqoj@ikMgf]}qe@whjBnud@__lAxdfAqts@Lwg`Ceql@udl@pewAk|[vlPuf~@ewEyyAy}T}aeAc{Zi{}@xrb@e|dAkyGopk@zybBsqu@gjTmemAt|DqklAu_Z"; // Replace with actual encoded polyline
        const decodedPolyline = polyline.decode(polylineStr); // Using the polyline package

        // Create a polyline and add it to the map with a red color
        const route = L.polyline(decodedPolyline, {
            color: 'red',
            weight: 4,
            opacity: 0.7,
        }).addTo(map);

        // Fit map to bounds of the polyline
        map.fitBounds(route.getBounds());

        // Cleanup the map instance when the component unmounts
        return () => {
            if (map) {
                map.remove(); // Removes the map instance to avoid re-initialization error
            }
        };
    }, []); // Empty dependency array ensures this effect runs only once

    return <div id="map" style={{ height: '70%', width: '100%' }}></div>;
};

export default MapWithRoute;
