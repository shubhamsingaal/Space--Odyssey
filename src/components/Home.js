import { Box } from "@mui/material";
import React from "react";
import "../styles/landing.css"
import {
  Button,
  Container,
  Hidden,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LaunchButton from "../components/Buttons/LaunchButton";
import { section1Content } from "../utils/content";
import useMeasure from "react-use-measure";
import Title from "../components/Title";
import logo from "../assets/logo.png";

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
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [ref, { height }] = useMeasure();

  return (
    <Box sx={{ width: "100%", }}>
      {/* Main Background */}
      <Box sx={{ position: "absolute", zIndex: -10, top: 0, left: 0, right: 0 }}>
        <img src={MainBG} style={{ width: "100%" }} />
      </Box>
      <img src={logo} style={{ height: "196px", objectFit: "contain" }} />

  
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

        {/* Star */}

        {/* Trees */}
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
      <Box style={{ backgroundColor: "black" }}>
        <section className="skill" id="rules" >
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="skill-bx wow zoomIn">
                  <h2>Rules</h2>
                  <p>Rules, regulations and general guidelines:</p>
                  <hr />
                  <span>
                    1. Participants must follow our official pages at [insta],[fb],[linkedin]
                  </span> <hr />
                  <span>
                    2. All participants must adhere to sportsman spirit, and not indulge in any unfair means to win the adventure.
                  </span> <hr />
                  <span>
                    3. Cyber-based attacks such as DDoS, Script Injection and breaking into the servers are prohibited.
                  </span> <hr />
                  <span>
                    4. Do not press F12 or open Developer Tools during the game, it will lead to disqualification, and the game will end then and there.
                  </span> <hr />
                  <span>
                    5. Only one participation per person is allowed. Using multiple accounts to play the game is a violation of these terms.
                  </span> <hr />
                  <span>
                    6. All decisions made by judges will be final and binding.
                  </span> <hr />
                  <span>
                    7. Tip: Keep your curiosity up always and do not use ChatGPT :)
                  </span> <hr />

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

