import { useEffect, useRef, useState } from "react";

function Image({ src }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isInView, setIsInView] = useState(false);
    const root = useRef(); // the container

    useEffect(() => {
        // sets `isInView` to true until root is visible on users browser

        const observer = new IntersectionObserver(onIntersection, { threshold: 0 });
        observer.observe(root.current);

        function onIntersection(entries) {
            const { isIntersecting } = entries[0];

            if (isIntersecting) { // is in view
                observer.disconnect();
            }

            setIsInView(isIntersecting);
        }
    }, []);

    function onLoad() {
        setIsLoading((prev) => !prev);
    }

    return (
        <>
            <div ref={root} className={`_item ` + (isLoading ? " imgWrapper--isLoading" : "")}>
                {/* <div className="imgLoader" /> */}
                <img className="img" src={isInView ? src : null} alt="" onLoad={onLoad} />
            </div>
        </>
    );
}
export default Image;

