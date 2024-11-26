import React from "react";
import { motion } from "framer-motion";
import { Rocket, Check, Globe, Code, Book, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CompanyOverview = () => {
  const sections = {
    Product: [
      {
        title: "Features",
        description: "Powerful tools designed to streamline your workflow",
        icon: Code,
        content: [
          "Advanced project management",
          "Real-time collaboration",
          "Customizable dashboards",
          "Integration capabilities",
        ],
      },
      {
        title: "Pricing",
        description: "Flexible plans for every team size",
        icon: Globe,
        content: [
          "Startup Plan",
          "Enterprise Solutions",
          "Custom Pricing",
          "Free Trial Available",
        ],
      },
      {
        title: "Integrations",
        description: "Connect with your favorite tools",
        icon: Globe,
        content: [
          "Project Management",
          "Communication Platforms",
          "Analytics Tools",
          "Development Environments",
        ],
      },
    ],
    Company: [
      {
        title: "About",
        description: "Our mission to revolutionize workflow solutions",
        icon: Rocket,
        content: [
          "Founded in 2023",
          "Global team of innovators",
          "Commitment to cutting-edge technology",
          "User-centric design philosophy",
        ],
      },
      {
        title: "Careers",
        description: "Join our innovative team",
        icon: Book,
        content: [
          "Open Positions",
          "Growth Opportunities",
          "Competitive Compensation",
          "Inclusive Work Culture",
        ],
      },
      {
        title: "Press",
        description: "Latest news and media coverage",
        icon: Globe,
        content: [
          "Recent Announcements",
          "Media Mentions",
          "Industry Recognition",
          "Thought Leadership",
        ],
      },
    ],
    Resources: [
      {
        title: "Blog",
        description: "Insights and industry trends",
        icon: Book,
        content: [
          "Technology Insights",
          "Product Updates",
          "User Success Stories",
          "Expert Perspectives",
        ],
      },
      {
        title: "Documentation",
        description: "Comprehensive guides and references",
        icon: Book,
        content: [
          "API Documentation",
          "User Guides",
          "Technical Specifications",
          "Integration Tutorials",
        ],
      },
      {
        title: "Support",
        description: "We're here to help",
        icon: Shield,
        content: [
          "24/7 Customer Support",
          "Knowledge Base",
          "Community Forums",
          "Professional Services",
        ],
      },
    ],
    Legal: [
      {
        title: "Terms",
        description: "Service agreement details",
        icon: Shield,
        content: [
          "User Terms",
          "Service Conditions",
          "Usage Policies",
          "Compliance Guidelines",
        ],
      },
      {
        title: "Privacy",
        description: "Your data, your control",
        icon: Shield,
        content: [
          "Data Protection",
          "User Privacy",
          "GDPR Compliance",
          "Transparent Practices",
        ],
      },
      {
        title: "Cookies",
        description: "Transparency in data usage",
        icon: Shield,
        content: [
          "Cookie Policy",
          "Consent Management",
          "Tracking Preferences",
          "Data Usage Explanation",
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 md:px-8 lg:px-16">
      <div className="container mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12 flex items-center justify-center"
        >
          <Rocket className="mr-4 text-primary" /> YAR Solutions Overview
        </motion.h1>

        {Object.entries(sections).map(([sectionName, sectionContent]) => (
          <motion.section
            key={sectionName}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-semibold mb-8 text-center">
              {sectionName}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {sectionContent.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <item.icon className="mr-4 text-primary" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    <ul className="space-y-2">
                      {item.content.map((listItem, listIndex) => (
                        <li key={listIndex} className="flex items-center">
                          <Check className="mr-2 text-primary w-4 h-4" />
                          {listItem}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <Button size="lg" className="mr-4">
            Start Free Trial
          </Button>
          <Button variant="outline" size="lg">
            Contact Sales
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyOverview;
