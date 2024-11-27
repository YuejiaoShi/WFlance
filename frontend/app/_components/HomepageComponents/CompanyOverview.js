"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
function CompanyOverview() {
  const router = useRouter();
  useEffect(() => {
    if (router?.asPath && router.asPath.includes("#")) {
      const elementId = router.asPath.split("#")[1];
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [router.asPath]);

  const sections = {
    Product: [
      {
        title: "Features",
        description: "Powerful tools designed to streamline your workflow.",
        content: [
          {
            title: "Advanced project management",
            description:
              "Our project management tool allows teams to track progress, assign tasks, and meet deadlines more efficiently than ever.",
          },
          {
            title: "Real-time collaboration",
            description:
              "Collaborate seamlessly with your team using real-time communication features.",
          },
        ],
      },
      {
        title: "Pricing",
        description: "Free to use",
        content: [
          {
            title: "Business Model",
            description:
              "We dont charge anything for usage, but we deduct an invoice fee of 11kr per invoice",
          },
        ],
      },
      {
        title: "Integrations",
        description:
          "Our new integrations with your favorite tools are in development.",
        content: [],
      },
    ],
    Company: [
      {
        title: "About",
        description: "Our mission to revolutionize workflow solutions.",
        content: [
          {
            title: "Founded in 2024",
            description:
              "WEflance was founded by a group of passionate innovators looking to make work more efficient and collaborative.",
          },
          {
            title: "Global team of innovators",
            description:
              "Our team is multicultural made by nationalities from across the world, ensuring we bring diverse perspectives to our products and solutions.",
          },
          {
            title: "Commitment to cutting-edge technology",
            description:
              "We invest heavily in the latest technology to ensure our platform remains at the forefront of productivity tools.",
          },
          {
            title: "User-centric design philosophy",
            description:
              "Our design approach is centered around the user experience, making sure every feature is intuitive and easy to use.",
          },
        ],
      },
      {
        title: "Careers",
        description: "Join our innovative team.",
        content: [
          {
            title: "Open Positions",
            description:
              "We are constantly looking for talented individuals who are passionate about technology and innovation.",
          },
          {
            title: "Growth Opportunities",
            description:
              "At WEflance, we offer great opportunities for personal development.",
          },

          {
            title: "Inclusive Work Culture",
            description:
              "Our culture promotes diversity and inclusivity, making sure everyone feels welcome and valued.",
          },
        ],
      },
      {
        title: "Press",
        description: "Latest news and media coverage.",
        content: [
          // {
          //   title: "Recent Announcements",
          //   description:
          //     "We’re always excited to share updates about new features, partnerships, and collaborations.",
          // },

          {
            title: "Industry Recognition",
            description:
              "Our platform has earned recognition from leading industry experts st HackYourFuture, for its efficiency and ease of use.",
          },
          {
            title: "Leadership",
            description:
              "We regularly contribute to industry discussions and share insights on the future of work and productivity tools.",
          },
        ],
      },
    ],
    Legal: [
      {
        title: "Terms",
        description: "Service agreement details.",
        content: [
          {
            title: "User Terms",
            description: "The use of this tool is at your own risk or gain.",
          },
          {
            title: "Service Conditions",
            description:
              "This page shouldnt be use for any purpose other than, business relation between developers and their clients. This should be respectfull. Any wrong behaviors will cause a ban from our services.",
          },
          {
            title: "Usage Policies",
            description:
              "Our usage policies define the acceptable ways in which users can interact with the platform to ensure fair and responsible use.",
          },
          {
            title: "Compliance Guidelines",
            description:
              "We adhere to international regulations and industry best practices, ensuring our platform operates in compliance with legal standards.",
          },
        ],
      },
      {
        title: "Privacy",
        description: "Your data, your control.",
        content: [
          {
            title: "Data Protection",
            description:
              "We take the protection of your data seriously, using advanced encryption and security protocols to safeguard your personal and business information.",
          },
          {
            title: "User Privacy",
            description:
              "Our platform respects your privacy, offering full transparency on how your data is used.",
          },
          {
            title: "GDPR Compliance",
            description:
              "WEflance is fully compliant with the General Data Protection Regulation (GDPR), ensuring the highest standards of privacy and data protection for users in the EU.",
          },
        ],
      },
      {
        title: "Cookies",
        description: "Transparency in data usage.",
        content: [
          {
            title: "Cookie Policy",
            description:
              "We only use esencial cookies for our webpage to work.",
          },

          {
            title: "Data Usage Explanation",
            description:
              "Your data is being collected for development purposes only.",
          },
        ],
      },
    ],
  };

  return (
    <div style={{ backgroundColor: "#f4f7fc", padding: "50px 20px" }}>
      <div
        className="container"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "40px",
            color: "#4C6EF5",
          }}
        >
          WEflance Overview
        </h1>

        {Object.entries(sections).map(([sectionName, sectionContent]) => (
          <section
            key={sectionName}
            id={sectionName}
            style={{ marginBottom: "40px" }}
          >
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "600",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              {sectionName}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "30px",
              }}
            >
              {sectionContent.map((item, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    padding: "20px",
                    transition: "transform 0.3s ease",
                  }}
                  className="card"
                >
                  <div id={item.title.toLowerCase()}>
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: "500",
                        marginBottom: "10px",
                        color: "#333",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "16px",
                        color: "#666",
                        marginBottom: "15px",
                      }}
                    >
                      {item.description}
                    </p>
                    <ul>
                      {item.content.map((listItem, listIndex) => (
                        <li
                          key={listIndex}
                          style={{
                            fontSize: "16px",
                            color: "#333",
                            marginBottom: "8px",
                          }}
                        >
                          {listItem.title}
                          <p
                            style={{
                              fontSize: "14px",
                              color: "#666",
                              marginTop: "10px",
                            }}
                          >
                            {listItem.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            style={{
              padding: "12px 30px",
              fontSize: "18px",
              backgroundColor: "white",
              color: "#4C6EF5",
              border: "2px solid #4C6EF5",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => router.push("/")}
          >
            Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompanyOverview;
