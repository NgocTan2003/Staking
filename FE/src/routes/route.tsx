import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TransactionHistory from '../pages/TransactionHistory';
import UserDashboard from '../pages/UserDashboard';
import Header from "../components/Header";
import NotFound from '../components/NotFound';

function routes() {
        return (
        <Router>
            <Header />

            <Routes>
                <Route path="/" element={<UserDashboard />} />
                <Route path="/history" element={<TransactionHistory />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default routes;
