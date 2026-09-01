export const customScroll = (scrollTarget, callback) => {
    if (typeof window === 'undefined') return;

    if (typeof scrollTarget === 'function') {
        callback = scrollTarget;
        scrollTarget = window;
    }

    const scrollEl = typeof scrollTarget === 'string'
        ? document.querySelector(scrollTarget)
        : scrollTarget || window;

    if (!scrollEl) return;

    const isWindow = scrollEl === window;

    let currentY = getScrollY();
    let targetY = getScrollY();
    let animating = false;
    let wheelStreak = 0;
    let lastWheelTime = 0;
    let animationFrame = null;

    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    function getScrollY() {
        return isWindow ? window.scrollY : scrollEl.scrollTop;
    }

    function setScrollY(value) {
        if (isWindow) {
            window.scrollTo(0, value);
            return;
        }

        scrollEl.scrollTop = value;
    }

    function getMaxScrollY() {
        if (isWindow) {
            return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        }

        return Math.max(0, scrollEl.scrollHeight - scrollEl.clientHeight);
    }

    function normalizeWheelDelta(e) {
        if (e.deltaMode === 1) return e.deltaY * 16;
        if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
        return e.deltaY;
    }

    function animate() {
        targetY = Math.max(0, Math.min(getMaxScrollY(), targetY));

        currentY = lerp(currentY, targetY, 0.22);
        setScrollY(currentY);

        if (typeof callback === 'function') {
            callback({ currentY, targetY });
        }

        if (Math.abs(currentY - targetY) > 0.5) {
            animationFrame = requestAnimationFrame(animate);
        } else {
            currentY = targetY;
            setScrollY(currentY);
            animating = false;
            animationFrame = null;
        }
    }

    function onWheel(e) {
        if (e.ctrlKey || e.defaultPrevented) return;

        e.preventDefault();

        const now = performance.now();
        const isContinuous = now - lastWheelTime < 140;
        wheelStreak = isContinuous ? Math.min(8, wheelStreak + 1) : 1;
        lastWheelTime = now;

        currentY = getScrollY();

        // First wheel ticks are damped, then the gesture ramps back to normal speed.
        const ramp = Math.min(1, 0.25 + (wheelStreak - 1) * 0.11);
        const nextTarget = targetY + normalizeWheelDelta(e) * ramp;
        targetY = Math.max(0, Math.min(getMaxScrollY(), nextTarget));

        if (!animating) {
            animating = true;
            animationFrame = requestAnimationFrame(animate);
        }
    }

    scrollEl.addEventListener('wheel', onWheel, { passive: false });

    const onResize = () => {
        targetY = Math.max(0, Math.min(getMaxScrollY(), targetY));
        currentY = Math.max(0, Math.min(getMaxScrollY(), currentY));
    };

    window.addEventListener('resize', onResize);

    const cleanup = () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        scrollEl.removeEventListener('wheel', onWheel);
        window.removeEventListener('resize', onResize);
    };

    return cleanup;
};
