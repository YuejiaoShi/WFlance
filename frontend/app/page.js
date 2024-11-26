"use client";
import React, { useState } from "react";

import HomePage from "./_components/HomepageComponents/Homepage";
import ProjectsList from "./_components/HomepageComponents/ProjectsList";
import Footer from "./_components/HomepageComponents/Footer.js";
const Home = () => {
  return (
    <>
      <HomePage />
      <ProjectsList />
      <Footer />
    </>
  );
};

export default Home;
