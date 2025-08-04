import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../page/home/Home';
import LoanTracking from "../page/loan-detail/LoanTracking";
import LoanTrackingDetail from "../page/loan-detail/LoanDetail";

const Routing: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/loan-tracking" element={<LoanTracking/>} />
                <Route path="/loan-tracking/:id" element={<LoanTrackingDetail />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Routing;