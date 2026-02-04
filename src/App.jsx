import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './Layout.jsx';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Generator from './pages/Generator';
import MyProjects from './pages/MyProjects';
import ProjectDetails from './pages/ProjectDetails';
import Profile from './pages/Profile';
import ResumeBuilder from './pages/ResumeBuilder';
import Assistant from './pages/Assistant';
import SkillGapAnalyzer from './pages/SkillGapAnalyzer';
import Login from './pages/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
    return (
        <>
            <Toaster position="top-right" richColors />
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={
                    <ProtectedRoute>
                        <Layout currentPageName="Home"><Home /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/Home" element={
                    <ProtectedRoute>
                        <Layout currentPageName="Home"><Home /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/Explore" element={
                    <ProtectedRoute>
                        <Layout currentPageName="Explore"><Explore /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/Generator" element={
                    <ProtectedRoute>
                        <Layout currentPageName="Generator"><Generator /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/MyProjects" element={
                    <ProtectedRoute>
                        <Layout currentPageName="MyProjects"><MyProjects /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/ProjectDetails" element={
                    <ProtectedRoute>
                        <Layout currentPageName="ProjectDetails"><ProjectDetails /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/Profile" element={
                    <ProtectedRoute>
                        <Layout currentPageName="Profile"><Profile /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/ResumeBuilder" element={
                    <ProtectedRoute>
                        <Layout currentPageName="ResumeBuilder"><ResumeBuilder /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/Assistant" element={
                    <ProtectedRoute>
                        <Layout currentPageName="Assistant"><Assistant /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/SkillGap" element={
                    <ProtectedRoute>
                        <Layout currentPageName="SkillGap"><SkillGapAnalyzer /></Layout>
                    </ProtectedRoute>
                } />
            </Routes>
        </>
    );
}

export default App;
