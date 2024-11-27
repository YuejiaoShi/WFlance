import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiLinkedin, SiInstagram } from "react-icons/si";
import { useRouter } from "next/navigation";
import Link from "next/link";

const socialLinks = [
  {
    icon: SiLinkedin,
    href: "https://www.linkedin.com/company/yarsolutions/?viewAsMember=true",
    color: "text-blue-600 hover:text-blue-700",
  },
  {
    icon: SiInstagram,
    href: "https://instagram.com/yarsolutions",
    color: "text-pink-500 hover:text-pink-600",
  },
];

const footerLinks = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Integrations"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Press"],
  },
  {
    title: "Resources",
    links: ["Blog", "Documentation", "Support"],
  },
  {
    title: "Legal",
    links: ["Terms", "Privacy", "Cookies"],
  },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState(null);
  const router = useRouter();

  const handleSubscribe = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const sanitizedEmail = email.trim();

    if (!sanitizedEmail) {
      setEmailStatus("Please enter your email address.");
      return;
    }

    if (!emailRegex.test(sanitizedEmail)) {
      setEmailStatus("Please enter a valid email address.");
      return;
    }
    try {
      setEmailStatus("Subscribing...");

      const response = await fetch("/api/subscribeEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: sanitizedEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setEmailStatus(
          errorData.message || "Subscription failed. Please try again."
        );
        return;
      }

      const data = await response.json();
      setEmailStatus(data.message || "Subscription successful!");
    } catch (err) {
      setEmailStatus("Subscription failed. Please try again.");
    }
  };

  const navigateToSection = (section) => {
    router.push(`/overview#${section.toLowerCase()}`);
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background border-t py-16 px-4 md:px-8 lg:px-16"
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand & Newsletter Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Rocket className="w-10 h-10 text-primary" />
            <h2 className="text-2xl font-bold">YAR solutions</h2>
          </div>
          <p className="text-muted-foreground">
            Revolutionizing the way you work with cutting-edge web-apps and
            innovative solutions.
          </p>
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`${social.color} transition-all`}
              >
                <social.icon className="w-6 h-6" />
              </motion.a>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-grow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              variant="default"
              className="px-4"
              onClick={handleSubscribe}
            >
              <Send className="w-4 h-4 mr-2" /> Subscribe
            </Button>
          </div>
          {emailStatus && <p className="mt-2 text-sm">{emailStatus}</p>}
        </div>

        {/* Quick Links Section */}
        <div className="grid grid-cols-2 gap-8">
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={linkIndex}
                    whileHover={{ translateX: 5 }}
                    className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <Link href={`/overview#${link.toLowerCase()}`}>{link}</Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Call-to-Action Section */}
        <div className="space-y-6 bg-accent/10 p-6 rounded-lg">
          <h3 className="text-xl font-bold">Ready to get started?</h3>
          <p className="text-muted-foreground">
            Join the teams transforming their workflow.
          </p>
          <div className="flex space-x-4">
            <Button
              variant="default"
              className="w-half"
              onClick={() => router.push("/signup")}
            >
              Start for Free
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Legal Section */}
      <div className="container mx-auto mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} YAR solutions. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
