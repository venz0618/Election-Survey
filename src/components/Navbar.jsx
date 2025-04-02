import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Election Survey System</Link>
        
        <div className="hidden md:flex space-x-6">
          <Link to="/dashboard" className="hover:text-gray-300">Home</Link>
          <Link to="/user/survey" className="hover:text-gray-300">Survey</Link>
          <Link to="/user/result" className="hover:text-gray-300">Result</Link>
          <Link to="/login" className="hover:text-gray-300">Admin</Link>
        </div>
        
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-blue-700 p-4 flex flex-col space-y-4">
          <Link to="/dashboard" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/user/survey" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>Survey</Link>
          <Link to="/user/result" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>Result</Link>
          <Link to="/login" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>Admin</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
