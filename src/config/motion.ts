import { Transition } from "framer-motion"

/**
 * MOTION.md v1.3.0 - Single Source of Truth for Motion
 * Hydraulic Response: "Sensitive start, damped stop"
 */

export const MOTION = {
    spring: {
        /** Micro-interactions: Hover, Click, Toggle */
        rapid: {
            type: "spring",
            stiffness: 400,
            damping: 30,
            mass: 0.8
        } as const,

        /** Navigation: Page Transition, Modal Open, Tabs */
        smooth: {
            type: "spring",
            stiffness: 280,
            damping: 30,
            mass: 1.0
        } as const,

        /** Heavy Layout: Hero Reveal, Large Layout Changes */
        heavy: {
            type: "spring",
            stiffness: 180,
            damping: 30,
            mass: 1.2
        } as const,
    },

    /** Physics-free transitions (Simple Fade) */
    fade: {
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1], // cubic-bezier
    } as const,

    limits: {
        /** Max duration for blocking navigation */
        navMax: 0.4,
        /** Max total stagger delay */
        staggerMax: 0.8,
    },

    /** Frosted Hydraulic Wipe (Water-like) */
    frosted: {
        primary: {
            initial: { scaleX: 1, originX: 0 }, // Start Covered (for entrance)
            animate: { scaleX: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 } }, // Reveal
            exit: { scaleX: 1, originX: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }, // Cover
        },
        secondary: {
            initial: { scaleX: 1, originX: 0 },
            animate: { scaleX: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 } },
            exit: { scaleX: 1, originX: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 } },
        }
    } as const,

    /** Page Variants (Scale/Opacity for Hydraulic Feel) */
    page: {
        initial: { opacity: 0, scale: 0.98, filter: 'blur(4px)' },
        animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 } }, // Delay for curtain reveal
        exit: { opacity: 0, scale: 0.99, filter: 'blur(2px)', transition: { duration: 0.4, ease: 'linear' } },
    } as const
} as const

// Helper for consistent transition usage
export const transitions = {
    micro: MOTION.spring.rapid as Transition,
    page: MOTION.spring.smooth as Transition,
    hero: MOTION.spring.heavy as Transition,
    fade: MOTION.fade as Transition,
}
