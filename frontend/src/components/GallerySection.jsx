import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const galleryImages = [
  "https://cvr.ac.in/p/p97667334684815/IMG_0473.jpg",
  "https://cvr.ac.in/p/p97667334684815/IMG_1005.jpg",
  "https://cvr.ac.in/p/p97667334684815/IMG_1007.jpg",
  "https://cvr.ac.in/p/p97667334684815/IMG_0841.jpg",
  "https://cvr.ac.in/p/p97667334684815/IMG_0888.jpg",
  "https://cvr.ac.in/p/p97667334684817/IMG_1251.jpg",
  "https://cvr.ac.in/p/p97667334684817/IMG_1280.jpg",
  "https://cvr.ac.in/p/p97667334684818/IMG_2512.jpg",
];

gsap.registerPlugin(ScrollTrigger);

const GallerySection = () => {
  const sectionRef = useRef(null);

  // Duplicate images to create smooth infinite scroll
  // We double the array to ensure the marquee has enough content
  const row1 = [...galleryImages, ...galleryImages];
  // Create a reversed copy correctly
  const reversedImages = [...galleryImages].reverse();
  const row2 = [...reversedImages, ...reversedImages];

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-[#030712] overflow-hidden relative border-t-4 border-black border-b-4"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern-dots opacity-50 pointer-events-none"></div>

      {/* Section Title */}
      <div className="container mx-auto px-4 mb-12 text-center relative z-10">
        <h2 className="font-heading text-5xl md:text-7xl text-[#fefce8] drop-shadow-[4px_4px_0_#000] rotate-1 inline-block border-4 border-black bg-[#ec4899] px-4 py-2 transform -skew-x-6">
          CAPTURED MOMENTS
        </h2>
      </div>

      {/* Marquee Row 1 (Left to Right) */}
      <div className="flex mb-8 w-full overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-6 py-4">
          {row1.map((imgUrl, index) => (
            <div
              key={`row1-${index}`}
              className="flex-shrink-0 w-64 h-48 md:w-80 md:h-60 bg-white p-3 border-4 border-black shadow-[8px_8px_0_#000] rotate-2 hover:rotate-0 transition-transform duration-300 transform"
            >
              <div className="w-full h-full overflow-hidden border-2 border-black bg-gray-200">
                <img
                  src={imgUrl}
                  alt={`Gallery ${index}`}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Row 2 (Right to Left) */}
      <div className="flex w-full overflow-hidden">
        <div className="flex animate-marquee-reverse whitespace-nowrap gap-6 py-4">
          {row2.map((imgUrl, index) => (
            <div
              key={`row2-${index}`}
              className="flex-shrink-0 w-64 h-48 md:w-80 md:h-60 bg-white p-3 border-4 border-black shadow-[8px_8px_0_#000] -rotate-2 hover:rotate-0 transition-transform duration-300 transform"
            >
              <div className="w-full h-full overflow-hidden border-2 border-black bg-gray-200">
                <img
                  src={imgUrl}
                  alt={`Gallery Reverse ${index}`}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
