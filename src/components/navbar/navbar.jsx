import { Navbar, Nav, NavDropdown, Container, Col } from "react-bootstrap";
// import LogoutComp from "../logout/Logout";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
// import SearchMovies from "./SearchMovies";


function Navibar({ tokenState, user, setTokenState }) {
  const navigate = useNavigate();

//   const navToProfile = () => {
//     navigate("/profiles/" + user);
//   };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      sticky="top"
      style={{ color: "white", margin: "0px 0px 50px 0px" }}>
      {tokenState ? (
        <Container fluid>
          <Col className="d-flex justify-content-start align-items-center">
            <Navbar.Brand className="me-4">Portfolio Tracker App :D</Navbar.Brand>
            <LinkContainer to={"/"} style={{ color: "inherit", textDecoration: "inherit" }}>
              <Nav.Link className="d-inline-block me-4">Portfolio</Nav.Link>
            </LinkContainer>

            <LinkContainer to={"/holdings"} style={{ color: "inherit", textDecoration: "inherit" }}>
              <Nav.Link className="d-inline-block me-4">Holdings </Nav.Link>
            </LinkContainer>
          </Col>
          <Col xs={5}>
            to insert searchbar
          </Col>
          <Col className="d-flex justify-content-end align-items-center">
            <NavDropdown
              className="me-4"
              title={user}
              id="navbarScrollingDropdown"
              align="end">
              <NavDropdown.Item id="profileDropdown">
                Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item id="logoutDropdown">
                to insert logout
                {/* <LogoutComp setTokenState={setTokenState} /> */}
              </NavDropdown.Item>
            </NavDropdown>
          </Col>
        </Container>
      ) : (
        <Container fluid>
          <Col className="d-flex justify-content-start align-items-center">
            <Navbar.Brand className="mr-4">Portfolio Tracker App :D</Navbar.Brand>
          </Col>
          <Col className="d-flex justify-content-end align-items-center">
            <LinkContainer to={"/login"} style={{ color: "inherit", textDecoration: "inherit" }}>
              <Nav.Link className="d-inline-block me-4">Login </Nav.Link>
            </LinkContainer>
            <LinkContainer to={"/register"} style={{ color: "inherit", textDecoration: "inherit" }}>
              <Nav.Link className="d-inline-block me-4">Register </Nav.Link>
            </LinkContainer>
          </Col>
        </Container>
      )}
    </Navbar>
  );
}

export default Navibar;
