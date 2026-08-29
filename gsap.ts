import gsap from "gsap";

export const animateHeroHeadLine = (className: string, opacityValue: number, yValue: number, durationValue: number) => {
    gsap.from(className, {opacity: opacityValue, y: yValue, duration: durationValue})
}

export const animateHeroParagraph = (className: string, opacityValue: number, yValue: number, durationValue: number, delay:number) => {
    gsap.from(className, {opacity: opacityValue, y:yValue, duration:durationValue, delay})
}

export const animateCTABtns = (className: string, opacity: number, y: number, duration: number, delay: number) => {
    gsap.from(className, {opacity, y, duration, delay})
}

export const animateFoodImg = (className: string, opacity:number,  x: number, duration: number, delay: number) => {
    gsap.from(className, {opacity, x, duration, delay})
}

export const animateFirstDrink = (className: string, opacity: number, y: number, duration: number, delay: number) => {
    gsap.from(className, {opacity, y, duration, delay})
}

export const animateSecondDrink = (className: string, opacity: number, y: number, duration: number, delay: number) => {
    gsap.from(className, {opacity, y, duration, delay})
}