import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { faqs } from "../constants/eventsData";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-pattern-dots-alt overflow-hidden border-t-4 border-black">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="font-heading text-5xl md:text-6xl text-center text-white mb-16 drop-shadow-[4px_4px_0_#000]">
          FREQUENTLY ASKED <span className="text-[#22d3ee]">QUESTIONS</span>
        </h2>

        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white border-4 border-black shadow-[8px_8px_0_#000] transition-all duration-300 ${
                openIndex === index ? "transform -translate-y-1" : ""
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-heading text-lg md:text-xl text-black uppercase">
                  {faq.question}
                </span>
                <div className="flex-shrink-0 ml-4">
                  {openIndex === index ? (
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center border-2 border-black">
                      <Minus size={20} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-[#22d3ee] text-black flex items-center justify-center border-2 border-black shadow-[2px_2px_0_#000]">
                      <Plus size={20} />
                    </div>
                  )}
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index
                    ? "max-h-96 border-t-4 border-black"
                    : "max-h-0"
                }`}
              >
                <div className="p-6 bg-[#fefce8] text-lg text-slate-800 font-medium leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
