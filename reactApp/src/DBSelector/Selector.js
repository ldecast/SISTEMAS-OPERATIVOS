import React from 'react';
import "./Selector.css";

function changeDB(event) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            db: event.target.value
        })
    };
    fetch(process.env.REACT_APP_API_URL_CHANGE_DB, requestOptions);
}

function Selector({ selected }) {
    return (
        <select onChange={(e) => { changeDB(e); }}>
            <option selected={selected === "1"} value="1">MySQL</option>
            <option selected={selected === "2"} value="2">Cosmos DB</option>
        </select>
    );
}

export default Selector;
