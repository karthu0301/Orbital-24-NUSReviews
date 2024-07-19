import { Outlet } from 'react-router-dom';
import './AltLayout.css'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CollapsibleSidebar from '../components/CollapsibleSidebar';

const AltLayout = () => {
  return (
    <>
      <Navbar />
      <div className="alt-layout-content">
        <Outlet />
        <CollapsibleSidebar />
      </div>
      <Footer />
    </>
  );
};

export default AltLayout;
