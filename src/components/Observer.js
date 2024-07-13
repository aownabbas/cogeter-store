import React, { useRef, useEffect } from "react";

const Observer = () => {
  const observedElementRef = useRef(null);

  useEffect(() => {
    const observerCallback = (mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          // The observed element has been added to the DOM.
          // You can now perform any actions you want on this element.
          const observedElement = mutation.addedNodes[0];

          // Stop observing the element once it's loaded (optional).
          observer.disconnect();
        }
      }
    };

    const observerOptions = {
      childList: true, // Observes the target for the addition of new child nodes.
    };

    const observer = new MutationObserver(observerCallback);

    if (observedElementRef.current) {
      // If the observed element is already present when the component is mounted.
      observer.observe(observedElementRef.current, observerOptions);
    }

    // Don't forget to disconnect the observer when the component is unmounted.
    return () => observer.disconnect();
  }, []);

  // Some code to dynamically add the observed element to the DOM.
  const addObservedElement = () => {
    const element = document.createElement("div");
    element.textContent = "Observed Element";
    document.body.appendChild(element);
  };

  return (
    <div>
      <button onClick={addObservedElement}>Button 1</button>
      <button onClick={addObservedElement}>Button 2</button>
      <div ref={observedElementRef}></div>
    </div>
  );
};

export default Observer;
