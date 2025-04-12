import React from "react";
import { Link } from "react-router-dom";
import heroBg from "../assets/helpHero.png";
import { useState } from "react";
import { useEffect, useRef } from "react";
import TicketModal from "../components/TicketModal";
import { useLocation } from "react-router-dom";


const highlightMatch = (text, query) => {
  if (!query) return text;

  const allowedWords = ["vin", "vehicle", "guide", "reset", "password", "garage", "add", "history", "account", "mobile"];
  const queryWords = query
    .toLowerCase()
    .split(" ")
    .map(word => word.trim())
    .filter(word => word && allowedWords.includes(word));

  if (queryWords.length === 0) return text;

  const regex = new RegExp(`(${queryWords.join("|")})`, "gi");

  return text.replace(regex, (match) => `<mark>${match}</mark>`);
};

const Help = () => {
  const faqs = [
    {
      question: "How do I add a vehicle?",
      answer: "Go to 'My Garage' and click 'Add a New Vehicle' to enter your car’s details."
    },
    {
      question: "Where can I find repair guides?",
      answer: "Use the top navigation to access Guides or search by task from the home page."
    },
    {
      question: "Can I use this without a VIN?",
      answer: "Absolutely. Just select make, model, and year to get started."
    },
    {
      question: "What is a gesture-controlled guide?",
      answer: "Gesture-controlled guides let you move through steps hands-free using your camera—perfect for keeping clean while working."
    },
    {
      question: "How do I update or delete a vehicle from my garage?",
      answer: "In 'My Garage', select the vehicle and look for options to edit or remove it."
    },
    {
      question: "Can I track maintenance history for my vehicles?",
      answer: "Yes! Add service records like oil changes and tire rotations right from the vehicle view."
    },
    {
      question: "Is my data saved if I leave the site?",
      answer: "Some data is stored locally, but creating an account ensures it’s saved across devices."
    },
    {
      question: "I forgot my password—how can I reset it?",
      answer: "Go to the login screen and click 'Forgot Password' to receive a reset link."
    },
    {
      question: "Can I use GestureGarage on my phone?",
      answer: "Yes, GestureGarage is fully optimized for mobile and tablet use."
    }
  ];

  const [hasSearched, setHasSearched] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const firstMatchRef = useRef(null);
  const noResultsRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.reset) {
      setInputValue("");
      setSearchQuery("");
      setHasSearched(false);
      firstMatchRef.current = null;

      window.history.replaceState({}, document.title);
    }
  }, [location]);


  useEffect(() => {
    const hasMatches = faqs.some((faq) => matchesQuery(faq, searchQuery));
    if (searchQuery) {
      if (hasMatches && firstMatchRef.current) {
        firstMatchRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (!hasMatches && noResultsRef.current) {
        noResultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [searchQuery]);


  const matchesQuery = (faq, query) => {
    const q = query.toLowerCase();
    const question = faq.question.toLowerCase();
    const answer = faq.answer.toLowerCase();

    const clean = (text) => text.replace(/[^\w\s]/gi, "");

    return clean(question).includes(q) || clean(answer).includes(q) || q.split(" ").some(word =>
      clean(question).includes(word) || clean(answer).includes(word)
    );
  };

  return (
    <div className="bg-[#F8F8F8] text-black min-h-screen">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroBg}
          alt="Help background"
          className="absolute inset-0 -z-10 w-full h-full object-cover opacity-30"
        />

        <div className="max-w-4xl mx-auto py-20 px-6 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-[#1A3D61]">
            How can we help?
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearchQuery(inputValue); 
              setHasSearched(true);       
            }}

            className="flex flex-row flex-wrap justify-center items-center gap-2 sm:gap-4"
          >
            <input
              type="text"
              placeholder="Search guides, troubleshooting, etc."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full max-w-md px-4 py-2 rounded shadow bg-white border border-gray-300"
            />

            <button
              type="submit"
              className="px-6 py-3 bg-[#1A3D61] text-white rounded-lg hover:bg-[#17405f] transition cursor-pointer"

            >
              Search
            </button>
          </form>

        </div>
      </section>

      {/* Help Topics */}
      <section className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
        <h2 className="text-2xl font-bold text-[#1A3D61] mb-8">Browse Topics</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {/* Top 3 cards */}
          <Link to="/" className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow hover:shadow-md transition w-full max-w-xs">
            <h3 className="text-xl font-semibold text-[#1A3D61] mb-2">Getting Started</h3>
            <p className="text-gray-600 text-sm">Learn how to add vehicles and navigate GestureGarage.</p>
          </Link>


          <Link to="/garage" className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow hover:shadow-md transition w-full max-w-xs">
            <h3 className="text-xl font-semibold text-[#1A3D61] mb-2">Vehicle Management</h3>
            <p className="text-gray-600 text-sm">Tips on adding, viewing, and organizing your garage.</p>
          </Link>

          <Link to="/guides" className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow hover:shadow-md transition w-full max-w-xs">
            <h3 className="text-xl font-semibold text-[#1A3D61] mb-2">Using Repair Guides</h3>
            <p className="text-gray-600 text-sm">Step-by-step repair guides and how gesture controls work.</p>
          </Link>
        </div>

        {/* Centered bottom 2 cards */}
        <div className="flex justify-center flex-wrap gap-8 mt-8">
          <Link to="/auth" className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow hover:shadow-md transition w-full max-w-xs">
            <h3 className="text-xl font-semibold text-[#1A3D61] mb-2">Account & Access Help</h3>
            <p className="text-gray-600 text-sm">Login issues, password resets, and account troubleshooting.</p>
          </Link>

          <button
            onClick={() => setShowTicketModal(true)}
            className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow hover:shadow-md transition w-full max-w-xs cursor-pointer focus:outline-none"
          >
            <h3 className="text-xl font-semibold text-[#1A3D61] mb-2">Contact Us</h3>
            <p className="text-gray-600 text-sm">Reach out to our support team directly through a help ticket.</p>
          </button>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1A3D61] mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {(hasSearched ? faqs.filter((faq) => matchesQuery(faq, searchQuery)) : faqs).map((faq, index) => (
              <div key={index} ref={hasSearched && index === 0 ? firstMatchRef : null}>
                <h4
                  className="font-semibold text-lg text-[#1A3D61] mb-2"
                  dangerouslySetInnerHTML={{
                    __html: highlightMatch(faq.question, hasSearched ? searchQuery : ""),
                  }}
                ></h4>
                <p
                  className="text-gray-700 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: highlightMatch(faq.answer, hasSearched ? searchQuery : ""),
                  }}
                ></p>
              </div>
            ))}

            {hasSearched && faqs.filter((faq) => matchesQuery(faq, searchQuery)).length === 0 && (
              <div ref={noResultsRef} className="text-center text-gray-500 mt-8">
                No results found.{" "}
                <button
                  onClick={() => setShowTicketModal(true)}
                  className="text-[#1A3D61] underline cursor-pointer"
                >
                  Contact Support
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      <TicketModal isOpen={showTicketModal} onClose={() => setShowTicketModal(false)} />
    </div>
  );
};

export default Help;
