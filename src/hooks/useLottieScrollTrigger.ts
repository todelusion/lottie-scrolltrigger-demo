import { useEffect } from "react";
import Lottie, {
  CanvasRendererConfig,
  HTMLRendererConfig,
  RendererType,
  SVGRendererConfig,
} from "lottie-web";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Vars {
  container: React.MutableRefObject<null | HTMLElement>;
  animationData: any;
  trigger: React.MutableRefObject<null | HTMLElement>;
  scrollTrigger: ScrollTrigger.Vars;
  speedFactor?: number;
  renderer?: RendererType;
  rendererSettings?:
    | SVGRendererConfig
    | CanvasRendererConfig
    | HTMLRendererConfig;

  pause?: boolean;
}

function useLottieScrollTrigger(vars: Vars, pause?: boolean) {
  useEffect(() => {
    // console.log(vars.scrollTrigger.trigger);
    if (typeof window === "undefined") return;
    if (vars.container.current == null) return;
    if (vars.trigger === null) return;
    if (pause) return;

    const playhead = { frame: 0 };

    const animation = Lottie.loadAnimation({
      container: vars.container.current,
      renderer: vars.renderer || "svg",
      loop: false,
      autoplay: false,
      animationData: vars.animationData,
      rendererSettings: vars.rendererSettings || {
        preserveAspectRatio: "xMidYMid slice",
      },
    });

    let lottieCtx: gsap.Context;

    animation.addEventListener("DOMLoaded", function () {
      lottieCtx = gsap.context(() => {
        gsap.registerPlugin(ScrollTrigger);
        const createTween = function () {
          (animation as any).frameTween = gsap.to(playhead, {
            frame: animation.totalFrames - 1,
            ease: "none",
            onUpdate: () => {
              let acceleratedFrame = playhead.frame * (vars?.speedFactor ?? 1);

              acceleratedFrame = Math.max(
                0,
                Math.min(acceleratedFrame, animation.totalFrames - 1)
              );

              animation.goToAndStop(acceleratedFrame, true);
            },
            scrollTrigger: {
              ...vars.scrollTrigger,
              trigger: vars.trigger.current,
            },
          });
        };

        createTween();
        // In case there are any other ScrollTriggers on the page and the loading of this Lottie asset caused layout changes
        // ScrollTrigger.sort();
        // ScrollTrigger.refresh();
      }, vars.container);
    });

    return () => {
      lottieCtx && lottieCtx.revert();
      animation.destroy && animation.destroy();
    };
  }, [vars, pause]);
}

export default useLottieScrollTrigger;
