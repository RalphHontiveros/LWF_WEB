import React from "react";

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Website</h1>
        <div className="hidden md:flex space-x-6">
          {/* You can add your other header components here if needed */}
        </div>
      </div>
    </header>
  );
};

export default Header;
