import useLanguageStore from "@/api/store/language-store";
import AnimatedGradientText from "@/common/components/ui/animated-gradient-text";
import { cn } from "@/lib/utils";

const GradientText = () => {
    const { currentLanguage } = useLanguageStore();
  return (
      <AnimatedGradientText>
        <span
          className={cn(
            `inline animate-gradient bg-gradient-to-r from-[#317EF4] via-[#7f52cc] to-[#8E2BFF] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent text-xs`
          )}
        >
          {currentLanguage === "en" ? "Coming soon!" : "¡Próximamente!"}
        </span>
      </AnimatedGradientText>
  );
};

export default GradientText;
