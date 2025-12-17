import { motion } from 'framer-motion';
import { useSalon } from '@/contexts/SalonContext';

export function Policies() {
  const { settings } = useSalon();
  
  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl md:text-5xl font-semibold mb-8 text-center">
            Policies
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-4">
                Cancellation Policy
              </h2>
              <p className="text-muted-foreground mb-4">
                We understand that schedules change. We kindly request at least 24 hours notice 
                for any cancellations or rescheduling. This allows us to offer the appointment 
                slot to other clients.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Cancellations made 24+ hours in advance: No charge</li>
                <li>Cancellations made within 24 hours: 50% of service fee may apply</li>
                <li>No-shows: Full service fee may be charged</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                For appointments requiring deposits (extensions, bridal services), different 
                terms may apply. Please refer to your booking confirmation for specific details.
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-4">
                Late Arrivals
              </h2>
              <p className="text-muted-foreground">
                We recommend arriving 5-10 minutes before your scheduled appointment. If you 
                arrive late, we will do our best to accommodate you, but your service may need 
                to be shortened or rescheduled to respect the next client's appointment time.
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-4">
                Privacy Policy
              </h2>
              <p className="text-muted-foreground mb-4">
                At {settings.name}, we are committed to protecting your privacy. This policy 
                outlines how we collect, use, and safeguard your personal information.
              </p>
              <h3 className="font-semibold text-lg mb-2">Information We Collect</h3>
              <p className="text-muted-foreground mb-4">
                We collect information you provide when booking appointments, including your 
                name, contact information, and service preferences. This information helps us 
                deliver personalized service and maintain your booking history.
              </p>
              <h3 className="font-semibold text-lg mb-2">How We Use Your Information</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>To process and manage your appointments</li>
                <li>To send appointment confirmations and reminders</li>
                <li>To personalize your salon experience</li>
                <li>To send occasional promotions (with your consent)</li>
              </ul>
              <h3 className="font-semibold text-lg mb-2">Data Security</h3>
              <p className="text-muted-foreground">
                We implement appropriate security measures to protect your personal information. 
                We do not sell or share your data with third parties for marketing purposes.
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-4">
                Satisfaction Guarantee
              </h2>
              <p className="text-muted-foreground">
                Your satisfaction is our priority. If you're not completely happy with your 
                service, please contact us within 7 days and we'll make it right. Whether it's 
                a minor adjustment or a complete redo, we want you to leave feeling confident 
                and beautiful.
              </p>
            </section>
            
            <section>
              <h2 className="font-display text-2xl font-semibold mb-4">
                Contact Us
              </h2>
              <p className="text-muted-foreground">
                If you have any questions about our policies, please don't hesitate to reach out:
              </p>
              <ul className="text-muted-foreground mt-4">
                <li>Email: {settings.email}</li>
                <li>Phone: {settings.phone}</li>
                <li>WhatsApp: +{settings.whatsappNumber}</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
