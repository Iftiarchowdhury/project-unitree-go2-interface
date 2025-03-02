import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header, Sidebar, Footer } from './components/Layout';
import { AuthProvider } from './components/Auth/AuthProvider';

function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        {!isAuthPage && <Header />}
        <div className="flex">
          {!isAuthPage && <Sidebar />}
          <main className={`${isAuthPage ? 'w-full' : 'flex-1'}`}>
            <Outlet />
          </main>
        </div>
        {!isAuthPage && <Footer />}
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'bg-gray-800 text-white',
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;