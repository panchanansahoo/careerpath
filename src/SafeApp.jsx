import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';

function SafeApp() {
    return (
        <BrowserRouter>
            <Home />
        </BrowserRouter>
    );
}

export default SafeApp;
