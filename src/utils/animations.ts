import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const fadeInUp = (element: string | Element, delay = 0) => {
  return gsap.fromTo(element, 
    { 
      opacity: 0, 
      y: 50 
    },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      delay,
      ease: 'power2.out' 
    }
  );
};

export const fadeInLeft = (element: string | Element, delay = 0) => {
  return gsap.fromTo(element,
    {
      opacity: 0,
      x: -50
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      delay,
      ease: 'power2.out'
    }
  );
};

export const fadeInRight = (element: string | Element, delay = 0) => {
  return gsap.fromTo(element,
    {
      opacity: 0,
      x: 50
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      delay,
      ease: 'power2.out'
    }
  );
};

export const scaleIn = (element: string | Element, delay = 0) => {
  return gsap.fromTo(element,
    {
      opacity: 0,
      scale: 0.8
    },
    {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      delay,
      ease: 'back.out(1.7)'
    }
  );
};

export const staggerAnimation = (elements: string, delay = 0.1) => {
  return gsap.fromTo(elements,
    {
      opacity: 0,
      y: 30
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: delay,
      ease: 'power2.out'
    }
  );
};

export const parallaxEffect = (element: string | Element, speed = 0.5) => {
  return gsap.to(element, {
    yPercent: -50 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
};

export const countUp = (element: string | Element, endValue: number, duration = 2) => {
  const obj = { value: 0 };
  return gsap.to(obj, {
    value: endValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      if (typeof element === 'string') {
        const el = document.querySelector(element);
        if (el) el.textContent = Math.round(obj.value).toString();
      } else {
        element.textContent = Math.round(obj.value).toString();
      }
    }
  });
};

export const morphingButton = (element: string | Element) => {
  const tl = gsap.timeline({ paused: true });
  
  tl.to(element, {
    scale: 0.95,
    duration: 0.1,
    ease: 'power2.out'
  })
  .to(element, {
    scale: 1.05,
    duration: 0.2,
    ease: 'back.out(1.7)'
  })
  .to(element, {
    scale: 1,
    duration: 0.1,
    ease: 'power2.out'
  });

  return tl;
};

export const slideInFromSides = (leftElements: string, rightElements: string) => {
  const tl = gsap.timeline();
  
  tl.fromTo(leftElements, 
    { x: -100, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
  )
  .fromTo(rightElements,
    { x: 100, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
    '-=0.4'
  );

  return tl;
};

export const floatingAnimation = (element: string | Element) => {
  return gsap.to(element, {
    y: -10,
    duration: 2,
    ease: 'power1.inOut',
    yoyo: true,
    repeat: -1
  });
};

export const pulseAnimation = (element: string | Element) => {
  return gsap.to(element, {
    scale: 1.1,
    duration: 1,
    ease: 'power1.inOut',
    yoyo: true,
    repeat: -1
  });
};

export const typewriterEffect = (element: string | Element, text: string, speed = 0.05) => {
  const chars = text.split('');
  const tl = gsap.timeline();
  
  chars.forEach((char, index) => {
    tl.to(element, {
      duration: speed,
      onComplete: () => {
        if (typeof element === 'string') {
          const el = document.querySelector(element);
          if (el) el.textContent += char;
        } else {
          element.textContent += char;
        }
      }
    });
  });

  return tl;
};