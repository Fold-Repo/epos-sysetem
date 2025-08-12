"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib";
import { PlayIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Container from "./Container";

type AnimationStyle =
    | "from-bottom"
    | "from-center"
    | "from-top"
    | "from-left"
    | "from-right"
    | "fade"
    | "top-in-bottom-out"
    | "left-in-right-out";

interface HeroVideoProps {
    animationStyle?: AnimationStyle;
    videoSrc: string;
    thumbnailAlt?: string;
    className?: string;
    showPreviewButton?: boolean;
    isVideoOpen?: boolean;
    setIsVideoOpen?: (open: boolean) => void;
}

const animationVariants = {
    "from-bottom": {
        initial: { y: "100%", opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: "100%", opacity: 0 },
    },
    "from-center": {
        initial: { scale: 0.5, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.5, opacity: 0 },
    },
    "from-top": {
        initial: { y: "-100%", opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: "-100%", opacity: 0 },
    },
    "from-left": {
        initial: { x: "-100%", opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: "-100%", opacity: 0 },
    },
    "from-right": {
        initial: { x: "100%", opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: "100%", opacity: 0 },
    },
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
    "top-in-bottom-out": {
        initial: { y: "-100%", opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: "100%", opacity: 0 },
    },
    "left-in-right-out": {
        initial: { x: "-100%", opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: "100%", opacity: 0 },
    },
};

export function HeroVideoDialog({
    animationStyle = "from-center",
    videoSrc,
    className,
    showPreviewButton,
    isVideoOpen,
    setIsVideoOpen
}: HeroVideoProps) {

    const [internalIsOpen, internalSetIsOpen] = useState(false);
    const open = isVideoOpen ?? internalIsOpen;
    const setOpen = setIsVideoOpen ?? internalSetIsOpen;
    const selectedAnimation = animationVariants[animationStyle];

    return (
        <Container>
            <div className={cn("relative pt-12", className)}>

                {showPreviewButton !== false && (
                    <div className="group relative cursor-pointer" onClick={() => setOpen(true)}>

                        <video src={videoSrc} muted autoPlay loop playsInline
                            className="w-full rounded-xl bg-black/90 transition-all duration-200 ease-out brightness-[0.8]
                    sm:min-h-[70vh] sm:h-auto h-[45vh] object-cover"/>

                        <div className="absolute inset-0 bg-black/50 rounded-xl"></div>

                        <div className="absolute inset-0 flex scale-[0.9] items-center justify-center rounded-3xl transition-all duration-200 ease-out group-hover:scale-100">

                            <div className="flex size-20 items-center justify-center rounded-full bg-[#ffffff4d] backdrop-blur-lg">

                                <div className={`relative flex size-14 scale-100 items-center justify-center rounded-full bg-[#FFFFFF4D] shadow-md transition-all duration-200 ease-out group-hover:scale-[1.2]`}>

                                    <PlayIcon className="size-8 scale-100 fill-white text-white transition-transform duration-200 ease-out group-hover:scale-105" style={{
                                        filter: "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))",
                                    }} />

                                </div>

                            </div>

                        </div>

                    </div>
                )}

                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setOpen(false)}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 !z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">

                            <motion.div
                                {...selectedAnimation}
                                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                className="relative mx-4 aspect-video w-full max-w-4xl 2xl:max-w-6xl md:mx-0">

                                <motion.button className="absolute -top-11 right-0 rounded-full bg-neutral-900/50 p-2 text-xl text-white ring-1 backdrop-blur-md dark:bg-neutral-100/50 dark:text-black">
                                    <XMarkIcon className="size-5" />
                                </motion.button>

                                <div className="relative isolate z-[1] size-full overflow-hidden rounded-2xl border-2 border-white">

                                    <video
                                        src={videoSrc}
                                        controls
                                        autoPlay
                                        className="w-full rounded-2xl"
                                        style={{ aspectRatio: "16 / 9" }} />

                                </div>

                            </motion.div>

                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </Container>
    );
}
