// components/HeroSection.tsx
"use client";
import { Button } from "antd";

const HeroSection = () => {
  return (
    <section
      className="relative h-screen flex flex-col justify-center items-center text-white text-center px-8"
      style={{
        backgroundImage: "url('/assets/images/chess.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Lorem ipsum dolor sit amet consectetur.
        </h1>
        <p className="text-lg mb-8">
          Nunc dui pellentesque mollis eget nibh purus. Lectus a pharetra
          aliquam enim dolor auctor dolor vitae consequat. In id velit accumsan
          lacinia massa lobortis id consectetur.
        </p>
        <div className="flex space-x-4">
          <Button type="default" className="flex items-center">
            ▶ Watch Tutorial
          </Button>
          <Button type="primary">Get Started</Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
