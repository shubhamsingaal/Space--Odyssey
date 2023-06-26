import React from 'react';
import navIcon1 from "../assets/nav-icon1.svg";
import navIcon2 from "../assets/nav-icon2.svg";
import navIcon3 from "../assets/nav-icon3.svg";
import logo from "../assets/logo.png";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/footer.css"

export const Footer = () => {
    const styles = `
    .footer {
      
      background-color: black;
      padding: 20px 0;
    }

    .footer img {
      width: 150px;
      height: auto;
    }

    .social-icon img {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }

    .footer p {
      margin-top: 10px;
      font-size: 14px;
      color: #888;
    }

    @media (max-width: 576px) {
      /* Responsive styles for small screens */
      .text-center.text-sm-end {
        text-align: center !important;
      }
    }
  `;

    return (
        <footer className="footer">
            <Container>
                <Row className="align-items-center">
                    <Col size={12} sm={6}>
                        <img src={logo} alt="Logo" />
                    </Col>
                    <Col size={12} sm={6} className="text-center text-sm-end">
                        <div className="social-icon">
                            <a href="https://www.linkedin.com/company/istenitdgp/mycompany/" target="blank">
                                <img src={navIcon1} alt="" />
                            </a>
                            <a href="https://www.facebook.com/istenitdgp/" target="blank">
                                <img src={navIcon2} alt="" />
                            </a>
                            <a href="https://www.instagram.com/istenitdgp/?hl=en" target="blank">
                                <img src={navIcon3} alt="" />
                            </a>
                        </div>
                        <p>Copyright 2023. All Rights Reserved</p>
                    </Col>
                </Row>
            </Container>
            <style>{styles}</style>
        </footer>
    );
}
