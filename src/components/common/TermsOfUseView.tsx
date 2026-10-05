import React from 'react';
import { useStore } from '../../context/StoreContext';
import { FileText } from 'lucide-react';

export const TermsOfUseView: React.FC = () => {
  const { setActiveView } = useStore();

  return (
    <main className="min-h-[70vh] bg-[#F5F1EB] px-6 py-12 text-[#252329] md:py-20">
      <div className="mx-auto max-w-[800px]">
        {/* Breadcrumb / Category info */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-[#A99684]">
            Legal & Compliance
          </span>
          <h1 className="mt-3 font-serif text-3xl font-light uppercase tracking-[0.15em] text-[#11100E] md:text-4xl">
            Terms of Use
          </h1>
          <p className="mt-2 text-xs font-sans text-[#A99684] uppercase tracking-wider">
            Effective Date: October 2026
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white border border-[#EEE8DF] p-8 md:p-12 shadow-sm font-sans text-xs md:text-sm text-[#2C2925] leading-relaxed space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#F5F1EB]">
            <FileText className="text-[#A99684]" size={20} />
            <h2 className="font-serif text-lg tracking-[0.1em] text-[#11100E] uppercase">
              Service Agreement
            </h2>
          </div>

          <p className="border-l-2 border-[#A99684]/40 pl-4 py-1 italic">
            Welcome to the digital atelier of KAYTLYN LEONOR. By accessing or using this website, you agree to be bound by the following Terms of Use and Service Agreement.
          </p>

          <div className="space-y-4">
            <h3 className="font-serif text-sm tracking-wider uppercase text-[#11100E]">
              1. General Use
            </h3>
            <p>
              By utilizing this website, you represent that you are of legal age and agree to use our services lawfully. You agree to provide current, complete, and accurate purchase and account information for all orders placed through our digital boutique.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-sm tracking-wider uppercase text-[#11100E]">
              2. Products and Availability
            </h3>
            <p>
              We strive to display our couture pieces with absolute fidelity. However, product imagery is representative; slight variations in color or texture may occur between physical items and your display.
            </p>
            <p>
              Prices, product availability, and logistics estimates are subject to change without prior notice. An order is only deemed confirmed once checkout is successfully completed and payment authorization is received.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-sm tracking-wider uppercase text-[#11100E]">
              3. Intellectual Property
            </h3>
            <p>
              All website content, including design layouts, branding assets, campaign photography, product nomenclature, and text descriptions, are the exclusive property of KAYTLYN LEONOR. Use of these materials for commercial purposes without explicit written consent is strictly prohibited and protected by international copyright and trademark laws.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-sm tracking-wider uppercase text-[#11100E]">
              4. Shipping and Logistics
            </h3>
            <p>
              KAYTLYN LEONOR provides complimentary white-glove shipping on qualifying orders. While we partner with premium global logistics services to ensure punctual delivery, we are not liable for delays caused by custom clearance processes or extreme meteorological events.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-sm tracking-wider uppercase text-[#11100E]">
              5. Returns & Couture Standards
            </h3>
            <p>
              To maintain our quality heritage, all returns must adhere to our White-Glove Return Policy. Items must be unworn, unaltered, and returned with original security tags, garment bags, and archival packaging.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-sm tracking-wider uppercase text-[#11100E]">
              6. Limitation of Liability
            </h3>
            <p>
              KAYTLYN LEONOR shall not be liable for any indirect, incidental, or consequential damages resulting from the use of this website or the purchase of items through this service.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-[#F5F1EB]">
            <p className="text-center text-[#A99684]">
              For clarifications regarding these Terms of Use, please contact:
            </p>
            <p className="text-center font-semibold text-[#11100E]">
              concierge@kaytlynleonor.com
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => {
              setActiveView('home');
              window.scrollTo(0, 0);
            }}
            className="bg-[#11100E] text-[#F5F1EB] text-xs uppercase tracking-[0.25em] px-8 py-3.5 hover:bg-[#A99684] transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    </main>
  );
};
