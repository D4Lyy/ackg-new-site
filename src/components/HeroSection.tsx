interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const HeroSection = ({ title, subtitle, backgroundImage }: HeroSectionProps) => {
  return (
    <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-muted">
        {backgroundImage && (
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-overlay/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
