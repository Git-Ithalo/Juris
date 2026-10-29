import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import PublicSitePage from './pages/PublicSitePage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import DashboardOverview from './pages/dashboard/DashboardOverview.jsx'
import CompanyInfoPage from './pages/dashboard/CompanyInfoPage.jsx'
import LawyersPage from './pages/dashboard/LawyersPage.jsx'
import PracticeAreasPage from './pages/dashboard/PracticeAreasPage.jsx'
import ContactsPage from './pages/dashboard/ContactsPage.jsx'
import CustomizationPage from './pages/dashboard/CustomizationPage.jsx'
import DomainPage from './pages/dashboard/DomainPage.jsx'
import SubscriptionPage from './pages/dashboard/SubscriptionPage.jsx'
import SettingsPage from './pages/dashboard/SettingsPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registrar" element={<RegisterPage />} />
      <Route path="/site/:slug" element={<PublicSitePage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="personalizacao" element={<CustomizationPage />} />
        <Route path="escritorio" element={<CompanyInfoPage />} />
        <Route path="advogados" element={<LawyersPage />} />
        <Route path="areas-de-atuacao" element={<PracticeAreasPage />} />
        <Route path="contatos" element={<ContactsPage />} />
        <Route path="dominio" element={<DomainPage />} />
        <Route path="assinatura" element={<SubscriptionPage />} />
        <Route path="configuracoes" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}

export default App
