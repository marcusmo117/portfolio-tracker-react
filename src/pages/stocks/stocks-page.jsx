import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Placeholder from 'react-bootstrap/Placeholder'; 
import AddHoldingsButton from "../../components/addHoldings/addHoldingsButton";
import Spinner from 'react-bootstrap/Spinner';

function StockPage(props) {
    const params = useParams()
    let location = useLocation();
    const [profile, setProfile] = useState({});
    const [financials, setFinancials] = useState({});
    const [chart, setChart] = useState({}); 
    const [news, setNews] = useState([]);
    const [staticPrice, setStaticPrice] = useState({})
    const [resp, setResp] = useState({})
    const [stockPrice, setStockPrice] = useState(0) 
    const [stockSymbol, setStockSymbol] = useState()
    // const symbol = params.stocksymbol

    // create websocket connection 
    // const socket = props.socket
    // new WebSocket(`ws:${process.env.REACT_APP_WS_BACKEND_URL}`)


    // connection opened
    props.socket.addEventListener('open', function(event) {
      console.log('Connected to websocket server')
    })

    // listen for messages 
    props.socket.addEventListener('message', function(event) {
        const data = JSON.parse(event.data)
        // console.log('converted data: ', data.data[0].p)
        setStockPrice(data.data[0].p)
    }) 

    useEffect(() => {
        const fetchStock = async () => {
            const response = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/api/v1/stocks/${params.stocksymbol}`
            )
            const { profile, financials, chart, news, staticPrice } = response.data;
            
            console.log(profile)
            console.log(financials)
            console.log(chart)
            console.log(news)
            console.log(staticPrice)

            setProfile(profile)
            setFinancials(financials)
            setChart(chart)
            setNews(news)
            setStaticPrice(staticPrice)
            setResp(response)
            setStockSymbol(profile.ticker)
            console.log("params:", params.stocksymbol)
            console.log("stocksymbol for form:", stockSymbol)
        }
        fetchStock() //check this!!
        setTimeout(function() {
            props.socket.send(`${params.stocksymbol}`)
        }, 2100)
    },[location])

    // SOLVE BUG FOR NEW HOLDING TICKER

    return (
      <div className="App">
        <header className="App-header">
        {(Object.keys(profile).length === 0) ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
            <Container>
              <p>
                <a href={`${profile.weburl}`} target="_blank"><img src={`${profile.logo}`}></img></a>
              </p>
                <h1>{profile.name}</h1>
              <p>
                {stockPrice ? (
                  <h2>Price: {stockPrice}</h2>
                ) : (
                  <h2>Price: {staticPrice.c}</h2>
                )}
              </p>
              <Container>
                <Table striped bordered hover variant="dark" size="sm">
                    {resp.data &&
                        <tbody>
                            <tr>
                                <td>{`52-week high: (${financials['metric']['52WeekHighDate']})`}</td>
                                <td>{financials['metric']['52WeekHigh']}</td>
                            </tr>
                            <tr>
                                <td>{`52-week low: (${financials['metric']['52WeekLowDate']})`}</td>
                                <td>{financials['metric']['52WeekLow']}</td>
                            </tr>
                            <tr>
                                <td>Market cap:</td>
                                <td>{(financials.metric.marketCapitalization).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td>Beta:</td>
                                {resp.data && <td>{financials['metric']['beta']} </td>}
                            </tr>
                            <tr>
                                <td>P/E ratio (TTM):</td>
                                <td>{financials.metric.peBasicExclExtraTTM}</td>
                            </tr>
                            <tr>
                                <td>P/S ratio (TTM):</td>
                                <td>{financials.metric.psTTM}</td>
                            </tr>
                            <tr>
                                <td>D/E ratio:</td>
                                <td>{financials['metric']['totalDebt/totalEquityAnnual']}</td>
                            </tr>
                            <tr>
                                <td>ROE (TTM):</td>
                                <td>{financials['metric']['roeTTM']}</td>
                            </tr>
                        </tbody>
                    }
                </Table>
              </Container>
              <AddHoldingsButton
                stockSymbol={stockSymbol}
              />
            </Container>
          )
        }
        </header>
      </div>
    );
  }
  
export default StockPage;