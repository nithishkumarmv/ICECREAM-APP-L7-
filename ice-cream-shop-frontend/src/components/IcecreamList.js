import React, { useEffect, useState } from 'react';
import axios from 'axios';

const IceCreamList = () => {
    const [iceCreams, setIceCreams] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/ice-creams')
            .then(response => setIceCreams(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h2>Available Ice Creams</h2>
            <ul>
                {iceCreams.map(iceCream => (
                    <li key={iceCream[0]}>
                        {iceCream[1]} - ${iceCream[2]}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default IceCreamList;
