import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

//pages
import PortfolioPage from "./pages/stocks/portfolio-page.jsx";
import LoginPage from "./pages/login/login-page";
import RegisterPage from "./pages/register/register-page";
import StockPage from "./pages/stocks/stocks-page";
import HoldingsPage from "./pages/stocks/holdings-page";

//components
import Auth from "./components/auth/Auth";
import Navibar from "./components/navbar/navbar";

function App() {
  let location = useLocation();
  const [tokenState, setTokenState] = useState();
  const [user, setUser] = useState();

  // create websocket connection
  const socket = new WebSocket(`wss:${process.env.REACT_APP_WS_BACKEND_URL}`);

  useEffect(() => {
    console.log("page changed");
    console.log("trying to disconnect from websocket server");
    setTimeout(function () {
      socket.send(`unsub`);
    }, 2000);
  }, [location]);

  // for navbar to change states
  const token = localStorage.getItem("user_token");

  const getToken = async () => {
    setTokenState(token);
    if (tokenState) {
      setUser(jwt_decode(tokenState).data);
    }
  };

  useEffect(() => {
    getToken();
  }, [tokenState]);

  return (
    <div className="App">
      <Navibar
        tokenState={tokenState}
        user={user}
        setTokenState={setTokenState}
      />
      <Routes>
        {/* <Route path="/" /> */}
        <Route path="/" element={<Auth component={PortfolioPage} />} />
        <Route path="/holdings" element={<Auth component={HoldingsPage} />} />
        <Route
          path="/stocks/:stocksymbol"
          element={<Auth component={StockPage} />}
        />
        <Route
          path="/login"
          element={<LoginPage setTokenState={setTokenState} />}
        />
        <Route
          path="/register"
          element={<RegisterPage setTokenState={setTokenState} />}
        />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
