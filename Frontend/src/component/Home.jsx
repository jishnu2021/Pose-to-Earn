import React from 'react';
import { useNavigate } from 'react-router-dom';
import photo from '../images/image1.jpeg';

const Home = () => {
  const navigate = useNavigate();

  const handleChange = () => {
    navigate('/task');
  };

  return (
    <section
      style={{
        backgroundImage: `url(${photo})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "100vh" // Ensures the section takes the full viewport height
      }}
      className="bg-center bg-no-repeat bg-gray-700 bg-blend-multiply text-white"
    >
      <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
        <h2 className="mb-4 text-4xl font-extrabold tracking-tight leading-none">
          Get Fit, Strike a pose, Earn Rewards - Where every move counts
        </h2>
        <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">
          Transform your fitness into digital currency using our website.
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
          <button
            onClick={handleChange}
            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
          >
            Start Today's Task
          </button>
          <a
            href="#"
            className="inline-flex justify-center hover:text-gray-900 items-center py-3 px-5 sm:ms-4 text-base font-medium text-center text-white rounded-lg border border-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-400"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
};

export default Home;
