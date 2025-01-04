# GSAP ScrollTrigger + Lottie Animation Integration

This project demonstrates how to control **Lottie animations** using **GSAP's ScrollTrigger**. By leveraging both libraries, you can create interactive and smooth scrolling animations that react to the user's scroll behavior.

## 📂 Project Structure
```
.
├── README.md
├── dist
│   ├── assets
│   │   ├── index-D1TzdsbS.css
│   │   └── index-DWnfGipt.js
│   ├── index.html
│   └── vite.svg
├── eslint.config.js
├── index.html
├── output.txt
├── package.json
├── postcss.config.js
├── public
│   └── vite.svg
├── src
│   ├── App.tsx
│   ├── assets
│   │   └── lottie
│   │       └── react-lottie.json
│   ├── hooks
│   │   └── useLottieScrollTrigger.ts
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── yarn.lock
```

## 🛠️ Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/todelusion/lottie-scrolltrigger-demo.git
   cd lottie-scrolltrigger-demo
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Start the development server:
   ```bash
   yarn dev
   ```

## 📋 Usage
### Lottie Animation Control with ScrollTrigger
The core functionality is handled through the custom hook **`useLottieScrollTrigger`**, which synchronizes the Lottie animation frames with the scroll position.

#### **`useLottieScrollTrigger.ts`** (Hook)
```typescript
import { useEffect } from "react";
import Lottie, { CanvasRendererConfig, HTMLRendererConfig, RendererType, SVGRendererConfig } from "lottie-web";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Vars {
  container: React.MutableRefObject<null | HTMLElement>;
  animationData: any;
  trigger: React.MutableRefObject<null | HTMLElement>;
  scrollTrigger: ScrollTrigger.Vars;
  speedFactor?: number;
  renderer?: RendererType;
  rendererSettings?: SVGRendererConfig | CanvasRendererConfig | HTMLRendererConfig;
  pause?: boolean;
}

function useLottieScrollTrigger(vars: Vars, pause?: boolean) {
  useEffect(() => {
    if (typeof window === "undefined" || vars.container.current === null || vars.trigger === null || pause) return;

    const playhead = { frame: 0 };
    const animation = Lottie.loadAnimation({
      container: vars.container.current,
      renderer: vars.renderer || "svg",
      loop: false,
      autoplay: false,
      animationData: vars.animationData,
      rendererSettings: vars.rendererSettings || { preserveAspectRatio: "xMidYMid slice" },
    });

    let lottieCtx: gsap.Context;

    animation.addEventListener("DOMLoaded", () => {
      lottieCtx = gsap.context(() => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.to(playhead, {
          frame: animation.totalFrames - 1,
          ease: "none",
          onUpdate: () => {
            const acceleratedFrame = Math.max(0, Math.min(playhead.frame * (vars?.speedFactor ?? 1), animation.totalFrames - 1));
            animation.goToAndStop(acceleratedFrame, true);
          },
          scrollTrigger: {
            ...vars.scrollTrigger,
            trigger: vars.trigger.current,
          },
        });
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      }, vars.container);
    });

    return () => {
      lottieCtx?.revert();
      animation.destroy();
    };
  }, [vars, pause]);
}

export default useLottieScrollTrigger;
```

### **App Component Example**
```tsx
import { useRef } from "react";
import useLottieScrollTrigger from "./hooks/useLottieScrollTrigger";
import animationData from "./assets/lottie/react-lottie.json";

function App() {
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  useLottieScrollTrigger({
    container: containerRef,
    trigger: triggerRef,
    animationData,
    speedFactor: 0.5,
    scrollTrigger: {
      pin: true,
      start: "top top",
      end: "+=2000",
      scrub: true,
    },
  });

  return (
    <main className="min-h-screen">
      <div ref={triggerRef}>
        <div className="absolute w-full h-screen">
          <div ref={containerRef} className="w-full max-w-2xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
      <div className="min-h-screen" />
    </main>
  );
}

export default App;
```

## 🎨 Styling
The project uses **Tailwind CSS** for styling. Modify the classes in the `App.tsx` file to suit your design needs.

## 🔧 Configuration
### **Vite Configuration**
The project is set up using **Vite** as the build tool. All configurations can be found in `vite.config.ts`.

## 🧪 Testing
You can test the scroll animation by:
1. Running the development server.
2. Opening the browser at the displayed `localhost` address.
3. Scrolling through the page to see the Lottie animation react to your scroll.

## 📦 Build
To create a production build:
```bash
yarn build
```

## 🚀 Deployment
Deploy the `dist` folder to any static hosting service, such as **Netlify**, **Vercel**, or **GitHub Pages**.

---

## 📝 License
This project is licensed under the MIT License. Feel free to use and modify it as needed!

