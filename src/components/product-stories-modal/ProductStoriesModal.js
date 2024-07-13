import React, { useState, useEffect, useRef } from "react";
import Swipeable, { useSwipeable } from "react-swipeable";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import ReactPlayer from "react-player";
import LinearProgress from "@mui/material/LinearProgress";
import { CircularProgress, Slider } from "@mui/material";
import "../../../src/components/product-stories-modal/style.css";

const style = {
  position: "relative",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "100vh",
  bgcolor: "rgba(0, 0, 0, 0.7)",
  boxShadow: 24,
};

const playerStyle = {
  minHeight: "100%",
  overflow: "hidden !important",
  position: "relative",
  objectFit: "contain",
  maxHeight: "100%",
  maxWidth: "100%",
};

function debounce(fn, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}

export default function ProductStoriesModal({
  openStoriesModal,
  handleModalClose,
  productStories,
}) {
  const handleClose = () => {
    handleModalClose();
  };
  const [muteVideo, setMuteVideo] = useState(false);
  const [state, setState] = useState({
    // playing: playMedia,
    muted: false,
    played: 0,
    seeking: false,
    duration: 0,
    loaded: 0,
  });
  const playerRef = useRef(null);
  const currentTime = playerRef.current
    ? playerRef.current.getCurrentTime()
    : "00:00";
  const [playing, setPlaying] = useState(true);
  const { muted } = state;
  const [startBuffering, setStartbuffering] = useState(false);
  const handleProgress = (changeState) => {
    const { loaded, played } = changeState;
    // const loadedPercentage = (loadedSeconds / duration) * 100;
    if (!state.seeking) {
      setState({
        ...state,
        played: parseFloat(played),
        loaded: parseFloat(loaded),
      });
    }
  };

  const handleSeekChange = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const totalWidth = rect.width;
    const clickX = event.clientX - rect.left;
    const newProgress = clickX / totalWidth;

    if (Math.random(newProgress) == 1) {
      handlePlayPause();
      return;
    }
    setState({ ...state, played: parseFloat(newProgress) });
  };
  const [time, setTime] = useState("0.00");
  const duration = playerRef.current
    ? // state.duration for youtube vidoes and durations came form database duration
      time
      ? time
      : state.duration
    : "00:00";

  function pad(string) {
    return ("0" + string).slice(-2);
  }

  function format(seconds) {
    if (isNaN(seconds)) {
      return "00:00";
    }
    seconds = Math.round(seconds);
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
    if (hh) {
      return `${hh}:${pad(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
  }

  const buffering = () => {
    setStartbuffering(true);
  };

  const handlePlaying = () => {
    setStartbuffering(false);
  };

  const handleDuration = (duration) => {
    setState({ duration });
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
    // setPlaying({ playing: false });
  };

  const handlePlay = () => {
    // setState({ ...state, playing: true });
    setPlaying(true);
  };

  // format the currentTime
  const elapsedTime = format(currentTime);
  // format the total time
  const totalDuration = format(duration);

  function valuetext(value) {
    return `${value}°C`;
  }

  const handleSeekMouseDown = (e) => {
    setState({ ...state, seeking: true });
  };

  const handleSeekMouseUp = (event) => {
    setState({ ...state, seeking: false });
    const rect = event.currentTarget.getBoundingClientRect();
    const totalWidth = rect.width;
    const clickX = event.clientX - rect.left;
    const newProgress = (clickX / totalWidth) * 100;
    playerRef.current.seekTo(newProgress / 100);
  };

  const handleMute = () => {
    // setState({ ...state, muted: !state.muted });
    setMuteVideo(!muteVideo);
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < productStories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // code to detect while user on mobile or not
  useEffect(() => {
    // Ensure that the currentIndex does not go out of bounds
    if (currentIndex < 0) {
      setCurrentIndex(0);
    }
    if (currentIndex >= productStories.length) {
      setCurrentIndex(productStories.length - 1);
    }
  }, [currentIndex, productStories]);

  // const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // const handleWindowSizeChange = () => {
  //   setIsMobile(window.innerWidth <= 768);
  // };

  // useEffect(() => {
  //   const debouncedHandleWindowSizeChange = debounce(
  //     handleWindowSizeChange,
  //     200
  //   );
  //   window.addEventListener("resize", debouncedHandleWindowSizeChange);
  //   // Clean up the event listener when the component unmounts.
  //   return () => {
  //     window.removeEventListener("resize", debouncedHandleWindowSizeChange);
  //   };
  // }, []);

  // code to swipe up screen for mobile view
  // const handlers = useSwipeable({
  //   onSwipedDown: () => {
  //     if (isMobile) {
  //       handlePrevious();
  //     }
  //   },
  //   onSwipedUp: () => {
  //     if (isMobile) {
  //       handleNext();
  //     }
  //   },
  //   swipeDuration: 1000,
  //   preventScrollOnSwipe: true,
  //   trackMouse: true,
  //   rotationAngle: 0,
  // });

  // const [showPauseIcons, setShowPauseIcons] = useState(false);
  // const showVideoPauseIcons = () => {
  //   setShowPauseIcons(true);
  // };
  // const hideVideoPauseIcons = () => {
  //   setShowPauseIcons(false);
  // };

  return (
    <div>
      <Modal
        open={openStoriesModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div
            // className={`${isMobile ? "row container_height" : "row modal_container"
            //   }`}
            // {...handlers}
            className="row modal_container"
          >
            <div
              // className={`${isMobile
              //   ? "col-12 container_height"
              //   : "col-8 offset-2 container_height"
              //   }`}
              className="col-8 offset-2 container_height"
            >
              <div
                // className={`${isMobile ? 'mob_player_style' : 'player_style'}`}
                // onMouseOver={showVideoPauseIcons}
                // onMouseLeave={hideVideoPauseIcons}
                className="player_style"
              >
                <ReactPlayer
                  url={productStories[currentIndex]?.file}
                  playing={playing}
                  // muted={muted}
                  muted={muteVideo}
                  onProgress={handleProgress}
                  ref={playerRef}
                  progressInterval={500}
                  pip={true}
                  // loop={true}
                  playsinline={true}
                  autoPlay={true}
                  controls={false}
                  height={"100%"}
                  onBuffer={buffering}
                  onBufferEnd={handlePlaying}
                  width={"100%"}
                  style={playerStyle}
                  duration={duration}
                  onDuration={handleDuration}
                  onEnded={() => setPlaying(false)}
                  // Quality change control
                />
                {/* <div
                  className={`${isMobile ? "mobile_icons_container" : "hide_on_desktop"
                    }`}
                >
                  <div className="">
                    <img
                      className="pointer"
                      onClick={handleClose}
                      src="/imgs/icons/closeIcon.svg"
                      width="50px"
                      height="50px"
                      alt="closeModal"
                    />
                  </div>
                  <div className="mt-2">
                    <img
                      onClick={() => handleMute()}
                      src={
                        muteVideo
                          ? "/imgs/icons/mob-mute.png"
                          : "/imgs/icons/mob-unmute.png"
                      }
                      width="50px"
                      height="50px"
                      alt="play"
                    />
                  </div>

                </div> */}
                {playing !== true && (
                  <div className="mute_icons_position">
                    {playing != false &&
                    elapsedTime != totalDuration &&
                    currentTime != 0.0 ? (
                      <img
                        onClick={() => handlePlayPause()}
                        src="/imgs/icons/pause_story.png"
                        width="50px"
                        height="50px"
                        alt="pause"
                      />
                    ) : (
                      <img
                        onClick={() => handlePlay()}
                        src="/imgs/icons/play_story.png"
                        width="50px"
                        height="50px"
                        alt="play"
                      />
                    )}
                  </div>
                )}
              </div>
              <div
                // className={`${isMobile ? "hide_on_desktop" : "d-flex slider_container mt-1"
                //   }`}
                className="d-flex slider_container mt-1"
              >
                <div className="slider_style">
                  <Slider
                    getAriaValueText={valuetext}
                    min={0}
                    step={1}
                    max={1000}
                    aria-label="Default"
                    onMouseDown={handleSeekMouseDown}
                    onMouseUp={handleSeekMouseUp}
                    className="text-white"
                    value={state.played * 1000}
                    size="small"
                  />
                </div>
                <div className="mute-link-icons-parent">
                  <div className="muteIcon_container">
                    <img
                      onClick={() => handleMute()}
                      src={
                        muteVideo
                          ? "/imgs/icons/mute.png"
                          : "/imgs/icons/unmute.png"
                      }
                      width="30px"
                      height="30px"
                      alt="play"
                    />
                  </div>
                  {productStories[currentIndex]?.story_link !== null && (
                    <div className="link_icon_container">
                      <img
                        onClick={() => {
                          window.open(
                            productStories[currentIndex]?.story_link,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }}
                        src={"/imgs/icons/link.png"}
                        width="25px"
                        height="25px"
                        alt="play"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              // className={`${isMobile ? "hide_on_desktop" : "col-2 container_height mt-2"
              //   }`}
              className="col-2 container_height mt-2"
            >
              <div className="close_icon">
                <img
                  className="pointer"
                  onClick={handleClose}
                  src="/imgs/icons/close_icon.png"
                  width="50px"
                  height="50px"
                  alt="closeModal"
                />
              </div>
              <div className="centered_items">
                <div>
                  <div className="previous_icon">
                    <img
                      className={`pointer ${
                        currentIndex === 0 ? "disabled" : ""
                      }`}
                      onClick={handlePrevious}
                      src="/imgs/icons/previous.png"
                      width="50px"
                      height="50px"
                      alt="closeModal"
                    />
                  </div>
                  <div className="next_icon">
                    <img
                      className={`pointer ${
                        currentIndex === productStories.length - 1
                          ? "disabled"
                          : ""
                      }`}
                      onClick={handleNext}
                      src="/imgs/icons/next.png"
                      width="50px"
                      height="50px"
                      alt="closeModal"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
