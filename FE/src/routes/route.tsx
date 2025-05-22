import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TransactionHistory from '../pages/TransactionHistory';
import UserDashboard from '../pages/UserDashboard';

function routes() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<UserDashboard />} />
                <Route path="/history" element={<TransactionHistory />} />
            </Routes>
        </Router>
    );
}

export default routes;
