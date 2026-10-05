import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Shield } from 'lucide-react';

export const PrivacyPolicyView: React.FC = () => {
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
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs font-sans text-[#A99684] uppercase tracking-wider">
            Last Updated: October 2026
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white border border-[#EEE8DF] p-8 md:p-12 shadow-sm font-sans text-xs md:text-sm text-[#2C2925] leading-relaxed space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#F5F1EB]">
            <Shield className="text-[#A99684]" size={20} />
            <h2 className="font-serif text-lg tracking-[0.1em] text-[#11100E] uppercase">
              Privacy Policy
            </h2>
          </div>

          <p className="border-l-2 border-[#A99684]/40 pl-4 py-1">
            Your privacy is very important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you shop with us.
          </p>

          <div className="space-y-4">
            <h3 className="font-serif text-sm tracking-wider uppercase text-[#11100E]">
              1. Information We Collect
            </h3>
            <p>
              When you place an order or interact with our website, we may collect the following information:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#4D4742]">
              <li>Your name</li>
              <li>Phone number</li>
              <li>Email address</li>
              <li>Shipping and billing address</li>
              <li>Payment details (processed securely via third-party gateways)</li>
              <li>Order history and preferences</li>
              <li>Communication or feedback</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-sm tracking-wider uppercase text-[#11100E]">
              2. How We Use Your Information
            </h3>
            <p>
              We use your information to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#4D4742]">
              <li>Process and deliver your orders</li>
              <li>Provide customer support</li>
              <li>Send order updates and promotional offers (only with your consent)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-sm tracking-wider uppercase text-[#11100E]">
              3. Sharing Your Information
            </h3>
            <p>
              We do not sell or rent your personal information to third parties. We may share it only with:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#4D4742]">
              <li>Trusted service providers (e.g. delivery partners, payment processors) to fulfill your order</li>
              <li>Government authorities if required by law</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-sm tracking-wider uppercase text-[#11100E]">
              4. Data Security
            </h3>
            <p>
              We take reasonable steps to protect your personal data from unauthorized access, misuse, or loss. Payments are securely handled by trusted payment gateways and not stored on our servers.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-sm tracking-wider uppercase text-[#11100E]">
              5. Cookies
            </h3>
            <p>
              Our website uses cookies to improve your browsing experience. Cookies help us remember your preferences and track website performance. You can manage or disable cookies in your browser settings.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-sm tracking-wider uppercase text-[#11100E]">
              6. Your Rights
            </h3>
            <p>
              You have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#4D4742]">
              <li>Access or update your personal information</li>
              <li>Request deletion of your data (subject to order history and legal requirements)</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </div>

          <div className="space-y-2 pt-4 border-t border-[#F5F1EB]">
            <h3 className="font-serif text-sm tracking-wider uppercase text-[#11100E] mb-2">
              7. Contact Us
            </h3>
            <p className="text-[#4D4742]">
              If you have any questions or concerns about this Privacy Policy, please contact us at:
            </p>
            <p className="font-semibold text-[#11100E]">
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
