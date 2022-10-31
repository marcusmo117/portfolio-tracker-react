import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";

//pages
import PortfolioPage from "./pages/stocks/portfolio-page.jsx";
import LoginPage from "./pages/login/login-page";
import RegisterPage from "./pages/register/register-page";
import StockPage from "./pages/stocks/stocks-page";
import HoldingsPage from "./pages/stocks/holdings-page";

//components
import Auth from "./components/auth/Auth";

function App() {
  let location = useLocation();

  // create websocket connection
  const socket = new WebSocket(`ws:${process.env.REACT_APP_WS_BACKEND_URL}`);

  useEffect(() => {
    console.log("page changed");
    console.log("trying to disconnect from websocket server");
    setTimeout(function () {
      socket.send(`unsub`);
    }, 2000);
  }, [location]);

  return (
    <div className="App">
      <Routes>
        {/* <Route path="/" /> */}
        <Route path="/" element={<Auth component={PortfolioPage} />} />
        <Route path="/holdings" element={<Auth component={HoldingsPage} />} />
        <Route
          path="/stocks/:stocksymbol"
          element={<Auth component={StockPage} />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
