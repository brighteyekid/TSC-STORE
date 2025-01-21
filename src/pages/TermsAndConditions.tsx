import { motion } from "framer-motion";
import { gridPattern } from "../assets/gridPattern";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-primary pt-24 pb-16">
      {/* Background Elements */}
      <div
        className="fixed inset-0 bg-repeat opacity-5 z-0"
        style={{ backgroundImage: `url("${gridPattern}")` }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <motion.div//www.deepseek.com/
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
          
          <p className="text-lg text-white/80">
            Welcome to our store! By using our website, you agree to the following terms and conditions. 
            Please read them carefully before proceeding.
          </p>

          <section className="mb-8">
            <h2>Affiliate Disclosure</h2>
            <p>
              This website is part of the Amazon Associates Program, an affiliate marketing program designed 
              to provide a means for us to earn commissions by linking to Amazon.com or Amazon.in. Every 
              purchase you make through the links provided on our site helps support our community through 
              affiliate commissions.
            </p>
          </section>

          <section className="mb-8">
            <h2>Product Information</h2>
            <p>
              All products listed on this website are directly linked to Amazon's platform. The ratings 
              and product details displayed are accurate as of the time they were added to our site. 
              However, these are subject to change over time. We strongly recommend checking the product's 
              details, ratings, and reviews directly on Amazon before making a purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2>No Product Liability</h2>
            <p>
              We do not sell or stock the products listed on this website. Our role is limited to 
              providing affiliate links that redirect you to Amazon's platform. Therefore, we are not 
              responsible for:
            </p>
            <ul>
              <li>The quality, functionality, or authenticity of the products.</li>
              <li>Any delays, defects, or damages caused by the products.</li>
              <li>Customer support or warranty claims related to the products.</li>
            </ul>
            <p>
              For any product-related inquiries or issues, please contact Amazon or the respective 
              seller directly.
            </p>
          </section>

          <section className="mb-8">
            <h2>Pricing and Availability</h2>
            <p>
              Product prices and availability displayed on our website are subject to change and may 
              vary from what is shown on Amazon. Please verify the final price and availability on 
              Amazon before completing your purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2>Limitation of Liability</h2>
            <p>
              We are not liable for any losses, damages, or inconveniences arising from your use of 
              this website, including but not limited to:
            </p>
            <ul>
              <li>Errors or inaccuracies in product information.</li>
              <li>Issues with transactions or deliveries handled by Amazon.</li>
              <li>Any other matters beyond our control.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>Privacy Policy</h2>
            <p>
              We respect your privacy and do not collect or store any personal information on this 
              website. However, please note that Amazon may collect data based on your interactions 
              on their platform. For more information, refer to Amazon's privacy policy.
            </p>
          </section>

          <section className="mb-8">
            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to update or modify these terms and conditions at any time without 
              prior notice. Your continued use of the website constitutes acceptance of any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2>Contact Us</h2>
            <p>
              For any questions or concerns related to this website or our affiliate program, feel 
              free to contact us through our Discord server.
            </p>
          </section>

          <div className="mt-12 p-4 bg-secondary rounded-xl">
            <p className="text-sm text-white/60">
              By using this website, you acknowledge that you have read, understood, and agreed to 
              these terms and conditions. Thank you for supporting our community!
            </p>
            <p className="text-sm text-white/60 mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions; 