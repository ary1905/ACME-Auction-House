import React from 'react';
import '../assets/css/loader.css';

const Loader = () => {
    return (
        <div className="loader-container">
            <div className="wrapper">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
            </div>
        </div>
    );
};

export default Loader;
