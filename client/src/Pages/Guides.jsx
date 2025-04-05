import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "motion/react";
import guidesBackground from "../assets/heroBackground.png"; // Reusing the same background image
import { Link } from "react-router-dom";
import axios from 'axios';

// Reusing the FadeInOnView component from Home.jsx
const FadeInOnView = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

const Guides = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMake, setSelectedMake] = useState(0);
  const [makes, setMakes] = useState([]);
  const [guides, setGuides] = useState([]);
  const bgRef = useRef(null);

  useEffect(() => {

    getGuides();

    axios.get(API_ENDPOINT + "/vehicles/makes")
    .then(resp => {
      let data = resp.data.sort((a, b) => a.name > b.name)

      // Move the "All Makes" make to the front of the list
      let allMakes = data.find(make => make.id == 0);
      data.splice(data.indexOf(allMakes), 1);
      data.unshift(allMakes);
      
      setMakes(data);
    })
    .catch(err => {
      console.error(err);
    })

  }, []);

  // Similar parallax effect as in Home.jsx
  useEffect(() => {
    let targetY = 0;
    let currentY = 0;
    let animationFrame;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const updateParallax = () => {
      targetY = window.scrollY;
      currentY = lerp(currentY, targetY, 0.21);

      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${currentY * 0.3}px) scale(1.1)`;
      }

      animationFrame = requestAnimationFrame(updateParallax);
    };

    animationFrame = requestAnimationFrame(updateParallax);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  function getGuides() {
    axios.get(API_ENDPOINT + "/guides", {
      params: {
        make: selectedMake > 0 ? selectedMake : null
      }
    })
    .then(resp => {
       setGuides(resp.data);
    })
    .catch(err => {
      if (err.status === 404) {
        setGuides([]);
      }
      else console.error(err);
    })
  }

  // update guides whenever make filter is changed
  useEffect(() => {
    getGuides();
  }, [selectedMake]);

  // Get all guides or filtered guides
  const getFilteredGuides = () => {
    let filteredGuides = guides;

    // Then filter by search term
    if (searchTerm) {
      filteredGuides = guides.filter(guide =>
        guide.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredGuides;
  };

  const filteredGuides = getFilteredGuides();

  // Function to determine badge color based on difficulty
  const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-[#F8F8F8] text-black w-full overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative min-h-[50vh] isolate overflow-hidden">
        <img
          ref={bgRef}
          src={guidesBackground}
          alt="Vehicle repair background"
          className="absolute inset-0 -z-10 w-full h-[120%] object-cover object-[center_70%] brightness-50 will-change-transform scale-120"
        />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-sm bg-white/70 border border-gray-200 rounded-xl p-8 shadow-lg max-w-3xl"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-extrabold leading-tight text-[#1A3D61] mb-3"
            >
              Vehicle Repair Guides
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-700 mb-6"
            >
              Find step-by-step instructions for maintaining and repairing your vehicle
            </motion.p>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="max-w-xl mx-auto"
            >
              <div className="flex flex-wrap gap-3 justify-center mb-2">
                <div className="relative flex-grow max-w-md">
                  <input
                    type="text"
                    placeholder="Search guides..."
                    className="w-full py-3 px-4 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1A3D61] focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <select
                  className="py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1A3D61] focus:border-transparent bg-white"
                  value={selectedMake}
                  onChange={(e) => setSelectedMake(e.target.value)}
                >
                  {makes.map((makeObj) => (
                    <option key={makeObj.id} value={makeObj.id}>
                      {makeObj.name}
                    </option>
                  ))}

                </select>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full py-12 px-6 sm:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Guides Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.length > 0 ? (
              filteredGuides.map((guide, index) => (
                <FadeInOnView key={guide.guide_id} delay={0.1 * (index % 3)}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
                    <div className="h-40 bg-gray-200 flex items-center justify-center">
                      <div className="text-[#1A3D61] text-5xl opacity-50">
                        {/* Placeholder for guide image */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-[#1A3D61] mb-2">{guide.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {/*
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getDifficultyBadgeColor(guide.difficulty)}`}>
                          {guide.difficulty}
                          </span>
                          <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          {guide.time}
                          </span>
                          */}
                      </div>
                      {/* TODO: quick placeholder style. this should be improved. */}
                      <span className={"px-2 py-1 text-s font-small text-gray-800"}>
                        {guide.description}
                      </span>
                      <Link to={`/guides/${guide.guide_id}`}>
                        <button className="w-full px-4 py-2 bg-[#1A3D61] text-white hover:bg-[#17405f] rounded-lg transition font-medium mt-2">
                          View Guide
                        </button>
                      </Link>
                    </div>
                  </div>
                </FadeInOnView>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-700">No guides found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Guides */}
      <section className="w-full py-16 px-6 sm:px-12 bg-[#F8F8F8]">
        <div className="max-w-6xl mx-auto">
          <FadeInOnView>
            <h2 className="text-2xl font-bold mb-8 text-[#1A3D61] text-center">Popular Guides</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <span className="inline-block mb-3 text-[#1A3D61]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
                <h3 className="font-bold text-lg mb-2">Beginner's Guide</h3>
                <p className="text-gray-600 mb-4">Essential maintenance every car owner should know. Perfect for first-time DIYers.</p>
                <button className="text-[#1A3D61] font-medium hover:underline flex items-center">
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <span className="inline-block mb-3 text-[#1A3D61]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <h3 className="font-bold text-lg mb-2">Emergency Fixes</h3>
                <p className="text-gray-600 mb-4">Quick temporary repairs to get you safely to a mechanic when things go wrong.</p>
                <button className="text-[#1A3D61] font-medium hover:underline flex items-center">
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <span className="inline-block mb-3 text-[#1A3D61]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
                <h3 className="font-bold text-lg mb-2">Safety Checks</h3>
                <p className="text-gray-600 mb-4">Regular inspections to ensure your vehicle remains safe for you and your passengers.</p>
                <button className="text-[#1A3D61] font-medium hover:underline flex items-center">
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </FadeInOnView>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-16 px-6 sm:px-12 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInOnView>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#1A3D61]">Can't find what you're looking for?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our community is growing daily. Request a guide or contribute your expertise.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-6 py-3 bg-[#1A3D61] text-white hover:bg-[#17405f] rounded-lg transition text-lg font-semibold">
                Request a Guide
              </button>
              <button className="px-6 py-3 bg-white text-[#1A3D61] hover:bg-gray-200 border border-[#1A3D61] rounded-lg transition text-lg font-semibold">
                Contribute
              </button>
            </div>
          </FadeInOnView>
        </div>
      </section>
    </div>
  );
};

export default Guides;
