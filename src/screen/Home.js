import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Front from '../components/Front';
import '../css/home.css';
export default function Home() {
  return (
    <div>
      <div className='container'>
      <Navbar />
      </div>
    
      <div>
        <Front />
      </div>
      
      <div>
        <Footer />
      </div>

    </div>
  );
}
