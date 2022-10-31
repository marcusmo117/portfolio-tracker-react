import React from "react";
import Searchbar from "../../components/searchbar/searchbar";
import { useCallback, useState, useRef, useEffect } from "react";

function PortfolioPage() {
    const [stockPrice, setStockPrice] = useState(0) 
    const [stockSymbol, setStockSymbol] = useState('test')


    return (
      <div className="App">
        <Searchbar/>
        <header className="App-header">
          <p>
            {stockSymbol}
          </p>
          <p>
            {stockPrice}
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
  
export default PortfolioPage;