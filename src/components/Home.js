import { Box } from "@mui/material";
import React from "react";
import "../styles/landing.css"
import "../styles/background.css"
import TrackVisibility from 'react-on-screen';
import { ArrowRightCircle } from 'react-bootstrap-icons';
import { Row, Col } from "react-bootstrap";
import {
  Button,
  Container,
  Hidden,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LaunchButton from "../components/Buttons/LaunchButton";
import { section1Content } from "../utils/content";
import useMeasure from "react-use-measure";
import Title from "../components/Title";
import logo from "../assets/logo.png";
import bg from "../assets/banner_img.png";
import { useState, useEffect } from "react";
const {
  MainBG,
  TreesImage,
  CliffImage,
  HorseImage,
  ShootingStarImage,
  title,
  subtitle,
} = section1Content;

const CustomButton = ({ children, ...props }) => (
  <Button
    variant="outlined"
    sx={{
      borderRadius: 4,
      color: "text.secondary",
      borderColor: "text.primary",
      height: 32,
      px: 2,
    }}
    {...props}
  >
    {children}
  </Button>
);

const Home = () => {
  document.title = "Space Odyssey | Panorama"
  const theme = useTheme();
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  // eslint-disable-next-line
  const [index, setIndex] = useState(1);
  const toRotate = ["Push Limits", "Gain Productivity", "Win Prizes"];
  const period = 2000;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => { clearInterval(ticker) };
    // eslint-disable-next-line
  }, [text])

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(prevDelta => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex(prevIndex => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(500);
    } else {
      setIndex(prevIndex => prevIndex + 1);
    }
  }
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [ref, { height }] = useMeasure();

  return (
    <Box sx={{ width: "100%", }}>
      {/* Main Background */}
      <Box sx={{ position: "absolute", zIndex: -10, top: 0, left: 0, right: 0 }}>
        <img src={MainBG} style={{ width: "100%" }} />
      </Box>
      <img src={logo} className="panoLogo" />

      <div className="heading" data-heading="Good times" >
        
          Space Odyssey
      </div>
      <section className="banner" id="home">
        <Container>
          <Row className="aligh-items-center">
            <Col xs={12} md={6} xl={7}>
              <TrackVisibility>
                {({ isVisible }) =>
                  <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>

                    <h1>{`Time to Code `} <span className="txt-rotate" dataPeriod="1000" data-rotate='[ "The Limits", "The sourroundings", "The World" ]'><span className="wrap">{text}</span></span></h1>
                    <p>
                      Coding competitions are a great way for young coders to apply  what they <br /> know in a  fun context and improve their analytical and problem-solving skills.
                    </p>
                    <a href="./auth"><button onClick={() => console.log('connect')} class="btn" type="button">
                      <strong>Play</strong>
                      <div id="container-stars">
                        <div id="stars"></div>
                      </div>

                      <div id="glow">
                        <div class="circle"></div>
                        <div class="circle"></div>
                      </div>

                    </button> </a>

                  </div>}
              </TrackVisibility>
            </Col>
            <Col xs={12} md={6} xl={5}>
              <TrackVisibility>

              </TrackVisibility>
            </Col>
          </Row>
        </Container>
      </section>

      <Box
        ref={ref}
        sx={{

          position: "absolute",
          width: "100%",
          zIndex: -1,
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <img src={MainBG} style={{ width: "100%", opacity: 0 }} />
        {!isSmallScreen && (
          <Hidden mdDown>
            <img
              src={TreesImage}
              style={{
                position: "absolute",
                width: "100%",
                right: 0,
                left: 0,
                bottom: "13%",
              }}
            />
          </Hidden>
        )}

        {/* Cliff */}
        <img
          src={CliffImage}
          style={{

            height: "100%",
            position: "absolute",
            right: 0,
            top: 0,
            backgroundSize: "cover",
          }}
        />

        {/* Horse */}
        <img
          src={HorseImage}
          style={{

            position: "absolute",
            height: isSmallScreen ? "30%" : "38%",
            right: "14%",
            bottom: isSmallScreen ? "10%" : "45%",
            transform: "rotate(7deg)",
          }}
        />

      </Box>
      <Box>
        <section className="skill" id="rules" >
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="skill-bx wow zoomIn">
                  <h2>Rules</h2>
                  <p>Rules, regulations and general guidelines:</p>

                  <span>
                    1. Participants must follow our official pages at [insta],[fb],[linkedin]
                  </span>
                  <span>
                    2. All participants must adhere to sportsman spirit, and not indulge in any unfair means to win the adventure.
                  </span>
                  <span>
                    3. Cyber-based attacks such as DDoS, Script Injection and breaking into the servers are prohibited.
                  </span>
                  <span>
                    4. Do not press F12 or open Developer Tools during the game, it will lead to disqualification, and the game will end then and there.
                  </span>
                  <span>
                    5. Only one participation per person is allowed. Using multiple accounts to play the game is a violation of these terms.
                  </span>

                  <span>
                    6. Tip: Keep your curiosity up always and do not use ChatGPT :)
                  </span>

                </div>

              </div>
            </div>
          </div>

        </section>
      </Box>
    </Box>


  );
};

export default Home;

