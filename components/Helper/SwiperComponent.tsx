"use client";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import type { Swiper as SwiperType } from "swiper";

interface SliderData {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  data: SliderData[];
  status: string;
}

const SwiperComponent = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderData, setSliderData] = useState<SliderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Refs for GSAP animations and Swiper control
  const titleRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch slider data from API on component mount
  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/slider/`
        );
        const result: ApiResponse = await response.json();
        if (result.status === "success") {
          setSliderData(result.data);
        }
      } catch (error) {
        console.error("Error fetching slider data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSliderData();
  }, []);

  // GSAP: Initialize hidden states and trigger entry animations
  useEffect(() => {
    if (!isLoading && sliderData.length > 0) {
      const ctx = gsap.context(() => {
        // Set initial hidden positions for content elements
        sliderData.forEach((_, index) => {
          if (titleRefs.current[index]) gsap.set(titleRefs.current[index], { y: 60, opacity: 0 });
          if (lineRefs.current[index]) gsap.set(lineRefs.current[index], { width: 0, opacity: 0 });
          if (buttonRefs.current[index]) gsap.set(buttonRefs.current[index], { y: 30, opacity: 0 });
        });

        // Animate the Statistics Section (Floating box)
        gsap.fromTo(
          statsRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.3,
          }
        );

        // Animate the first slide immediately after loading
        animateSlideContent(0);
      }, containerRef);

      return () => ctx.revert();
    }
  }, [isLoading, sliderData]);

  // Logic to animate title, line, and button for each slide
  const animateSlideContent = (slideIndex: number) => {
    const title = titleRefs.current[slideIndex];
    const line = lineRefs.current[slideIndex];
    const button = buttonRefs.current[slideIndex];

    if (title && line && button) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();
        
        // Reset element states before starting new animation
        tl.set([title, line, button], { opacity: 0 });
        tl.set(title, { y: 60 });
        tl.set(line, { width: 0 });
        tl.set(button, { y: 30 });

        // Sequence: Title -> Underline -> Button
        tl.to(title, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
          .to(line, { width: "50%", opacity: 1, duration: 1, ease: "power2.out" }, "-=0.4")
          .to(button, { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.5)" }, "-=0.6");
      });
      return ctx;
    }
  };

  // Re-run animation whenever the active slide changes
  useEffect(() => {
    if (!isLoading && sliderData.length > 0) {
      animateSlideContent(activeIndex);
    }
  }, [activeIndex, isLoading, sliderData]);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };

  // Loading Screen: Displayed while fetching API data
  if (isLoading) {
    return (
      <div className="relative w-full h-[80vh] flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-green-900 font-medium animate-pulse text-lg">Loading Experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-white">
      {/* Hero Slider Section */}
      <div className="relative h-[90vh] md:h-[70vh] lg:h-[100vh]">
        <Swiper
          onSlideChange={handleSlideChange}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1000} 
          autoplay={{ 
            delay: 5000, 
            disableOnInteraction: false, 
            pauseOnMouseEnter: true 
          }}
          modules={[EffectFade, Navigation, Pagination, Autoplay]}
          className="w-full h-full bg-[#F8F9FA]"
        >
          {sliderData.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full">
                <Image
                  src={slide.image_url || "/placeholder.svg"}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  quality={90}
                  priority={index === 0} // Load first slide image immediately
                  sizes="100vw"
                />

                {/* Slide Content Overlay */}
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4 pb-20">
                  <p
                    ref={(el) => { titleRefs.current[index] = el; }}
                    className="text-white text-2xl md:text-4xl lg:text-5xl font-bold mb-6 max-w-4xl leading-tight"
                  >
                    {slide.title}
                  </p>

                  <div
                    ref={(el) => { lineRefs.current[index] = el; }}
                    className="h-1 bg-white mb-8 opacity-0"
                  />

                  <div ref={(el) => { buttonRefs.current[index] = el; }} className="opacity-0">
                    <Link
                      href="/project"
                      className="relative inline-flex items-center justify-center px-8 py-4 bg-green-300 text-green-800 font-bold text-lg rounded-md overflow-hidden group transition-all duration-300 hover:scale-105 shadow-lg"
>
                       <span className="relative z-10 group-hover:text-white transition-colors duration-300">

                        Discover Now

                      </span>
                      <div className="absolute inset-0 bg-green-800 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Floating Statistics Section */}
      <div
        ref={statsRef}
        className="relative mt-[-40px] md:mt-[-60px] lg:mt-[-80px] z-20 px-4 md:px-8 lg:px-20"
      >
        <div className="bg-[#F6F4EC] rounded-lg shadow-lg overflow-hidden lg:max-w-[1450px] lg:h-40 mx-auto border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-full">
            <StatItem label="Cattle Farmers" value="11,000+" isLast={false} />
            <StatItem label="Cattle" value="24,500+" isLast={false} />
            <StatItem label="Fraudulent Claims" value="0" isLast={false} />
            <StatItem label="Capacity Building" value="2,000+" isLast={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for Statistics Items to keep the main code clean
const StatItem = ({ label, value, isLast }: { label: string; value: string; isLast: boolean }) => (
  <div className={`p-6 text-center flex flex-col items-center justify-center ${!isLast ? 'border-b md:border-b-0 md:border-r border-gray-200' : ''}`}>
    <h3 className="font-normal text-lg lg:text-xl text-green-700/70 mb-2">{label}</h3>
    <p className="text-2xl lg:text-4xl text-green-950/70 font-semibold">{value}</p>
  </div>
);

export default SwiperComponent;