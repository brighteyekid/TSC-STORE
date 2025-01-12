import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

const AdminRouteGuard = ({ children }: AdminRouteGuardProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRouteGuard; 