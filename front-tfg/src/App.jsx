import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './contexts/UserContext';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes';
import Header from './components/Header';
import './index.css'; // Ensure global styles are imported here

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <UserProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <div className="flex-1 pt-[160px] w-[800px] mx-auto">
                <main>
                  <AppRoutes />
                </main>
              </div>
            </div>
          </UserProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
