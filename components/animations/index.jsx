'use client';

import { useEffect } from "react";
import { customScroll } from "./scroll";


export default function Animations() {


    useEffect(() => {
        const cleanup = customScroll('[data-scroll-container]');
        return cleanup;
    }, []);

    return null;
}
