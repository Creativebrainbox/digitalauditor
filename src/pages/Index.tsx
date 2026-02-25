import { useRef } from "react";
import HeroSection from "@/components/HeroSection";
import AuditForm from "@/components/AuditForm";

const Index = () => {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <HeroSection onCtaClick={scrollToForm} />
      <AuditForm ref={formRef} />
    </div>
  );
};

export default Index;
