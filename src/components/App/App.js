import React from 'react';
import './App.css';
import PriceTableControl from "../PriceTableControl/PriceTableControl";
import PriceSearch from "../PriceSearch/PriceSearch";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>MediKeeper Technical Assessment</h1>
            </header>
            <main>
                <section>
                    <h2>Most Expensive Price Listings Search</h2>
                    <PriceSearch />

                    <h2>Price Listings</h2>
                    <PriceTableControl />
                </section>
            </main>
        </div>
    );
}

export default App;
