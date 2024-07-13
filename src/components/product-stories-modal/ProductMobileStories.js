import React, { useEffect, useState, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import "./productMobileSlider.css";

const ProductMobileStories = ({
  open,
  productStories,
  handleModalClose,
  clickedStoryIndex,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muteVideo, setMuteVideo] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [videoLoadingStates, setVideoLoadingStates] = useState(
    productStories.map(() => true)
  );

  const videoRefs = useRef(productStories.map(() => React.createRef()));

  useEffect(() => {
    if (open) {
      if (window.innerWidth <= 767) {
        document.body.classList.add("disable-scroll");
        document.documentElement.classList.add("disable-scroll");
      }
    } else {
      document.body.classList.remove("disable-scroll");
      document.documentElement.classList.remove("disable-scroll");
    }

    return () => {
      document.body.classList.remove("disable-scroll");
      document.documentElement.classList.remove("disable-scroll");
    };
  }, [open]);

  const handleNext = () => {
    if (currentIndex < productStories.length - 1) {
      setPlaying(false);
      setCurrentIndex(currentIndex + 1);
      handlePlay();
    }
  };
  useEffect(() => {
    // Play the first video when the component mounts
    if (open) {
      handlePlay();
    }
  }, [open]);

  useEffect(() => {
    handlePlay();
  }, [currentIndex]);

  const handlePlay = () => {
    // Pause and reset all videos except the current one
    videoRefs.current.forEach((ref, index) => {
      if (index !== currentIndex && ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });

    // Play the current video
    const currentVideo = videoRefs.current[currentIndex]?.current;
    if (currentVideo) {
      currentVideo
        .play()
        .then(() => {
          currentVideo.muted = muteVideo; // Unmute after successful play
        })
        .catch((error) => {
          console.error("Video play failed: ", error);
          // Handle error, such as showing a play button
        });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setPlaying(false);
      setCurrentIndex(currentIndex - 1);
      handlePlay();
    }
  };

  const handlers = useSwipeable({
    onSwipedDown: () => {
      handlePrevious();
    },
    onSwipedUp: () => {
      handleNext();
    },
    swipeDuration: 1000,
    preventScrollOnSwipe: true,
    trackMouse: true,
    rotationAngle: 0,
  });
  const handleMute = () => {
    setMuteVideo(!muteVideo);
    videoRefs.current.forEach((ref) => {
      if (ref.current) {
        ref.current.muted = !muteVideo;
      }
    });
  };
  const handleClose = () => {
    setCurrentIndex(0);
    setVideoLoadingStates(productStories.map(() => true));
    handleModalClose();
  };

  const handleVideoLoaded = (index) => {
    setVideoLoadingStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = false; // Mark the video as loaded
      return newStates;
    });
  };

  const userAgent = window.navigator.userAgent.toLowerCase();

  const slideStyle = {
    position: "absolute",
    transition: "transform 0.5s ease",
  };

  return (
    <div
      className="modal-overlay"
      style={{ display: !open ? "none" : "block" }}
    >
      <div className="modal-content" {...handlers}>
        <div className="modal-content_closed">
          <div>
            <img
              className="pointer"
              onClick={handleClose}
              src="/imgs/icons/mob-crossIcon.png"
              width="40px"
              height="40px"
              alt="closeModal"
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <img
              onClick={() => handleMute()}
              src={
                muteVideo
                  ? "/imgs/icons/mob-mute.png"
                  : "/imgs/icons/mob-unmute.png"
              }
              width="40px"
              height="40px"
              alt="play"
            />
          </div>
          {productStories[currentIndex]?.story_link !== null && (
            <div style={{ marginTop: 10 }}>
              <img
                onClick={() => {
                  window.open(
                    productStories[currentIndex]?.story_link,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
                src={"/imgs/icons/link.png"}
                width="40px"
                height="40px"
                alt="play"
              />
            </div>
          )}
        </div>

        {productStories.map((item, index) => (
          <div key={index}>
            {/* Conditional rendering of loader and image */}
            {videoLoadingStates[index] && (
              <div className="loader-container">
                <div className="vw-cmp__player--is-loading">
                  <span className="vw-cmp__player--is-loading-icon">
                    <svg
                      width="60"
                      height="60"
                      viewBox="0 0 60 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        className="spinner_Pcrv"
                        d="M5.00006 30C5.11117 23.152 7.78754 16.5949 12.5001 11.625C11.9751 11.15 11.4501 10.725 10.9501 10.25C7.02254 14.0554 4.31877 18.9453 3.18424 24.295C2.04972 29.6447 2.53597 35.2112 4.58085 40.2831C6.62574 45.3551 10.1364 49.7022 14.6642 52.769C19.192 55.8358 24.5314 57.4829 30.0001 57.5C30.8501 57.5 31.6751 57.5 32.5001 57.375C15.0001 57.5 5.00006 44.35 5.00006 30Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                </div>
                <img
                  className="loading-image"
                  src={item?.mobile_placeholder_image}
                  //"https://image.mux.com/VhXPP1CVm218d9vieSnKecRewEOy8rFz7nh9ssPzgpI/thumbnail.jpg?time=0&height=640"
                  alt="loading-image"
                />
              </div>
            )}
            <video
              key={item.id}
              ref={videoRefs.current[index]}
              muted={muteVideo} // Assuming all videos are unmuted
              loop
              playsInline
              preload="metadata"
              onLoadedData={() => handleVideoLoaded(index)}
              style={{
                ...slideStyle,
                objectFit: "contain",
                width: "99.9vw", // Occupy the full width of the viewport
                height: window.innerHeight,
                transform: `translateY(${100 * (index - currentIndex)}%)`,
              }} // Adjust as necessary
            >
              <source src={item.file} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductMobileStories;
