import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Placeholder from 'react-bootstrap/Placeholder';
import AddHoldingsButton from "../../components/addHoldings/addHoldingsButton";

function StockPage() {
    const params = useParams()
    const [profile, setProfile] = useState({});
    const [financials, setFinancials] = useState({});
    const [chart, setChart] = useState({}); 
    const [news, setNews] = useState([]);
    const [resp, setResp] = useState({})
    const [stockPrice, setStockPrice] = useState(0) 
    const symbol = params.stocksymbol

    // create websocket connection 
    const socket = new WebSocket(`ws:${process.env.REACT_APP_WS_BACKEND_URL}`)

    // connection opened
    socket.addEventListener('open', function(event) {
      console.log('Connected to websocket server')
    })

    // listen for messages 
    socket.addEventListener('message', function(event) {
        const data = JSON.parse(event.data)
        // console.log('converted data: ', data.data[0].p)
        setStockPrice(data.data[0].p)
    })

    useEffect(() => {
        const fetchStock = async () => {
            const response = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/api/v1/stocks/${params.stocksymbol}`
            )
            const { profile, financials, chart, news } = response.data;
            
            console.log(profile)
            console.log(financials)
            console.log(chart)
            console.log(news)

            setProfile(profile)
            setFinancials(financials)
            setChart(chart)
            setNews(news)
            setResp(response)
        }
        fetchStock() //check this!!
        setTimeout(function() {
            socket.send(`${params.stocksymbol}`)
        }, 2100)
    },[])

    return (
      <div className="App">
        <header className="App-header">
          <p>
            <a href={`${profile.weburl}`} target="_blank"><img src={`${profile.logo}`}></img></a>
          </p>
            <h1>{profile.name}</h1>
          <p>
            <h2>Price: {stockPrice}</h2>
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
            stockSymbol={symbol}
          />
        </header>
      </div>
    );
  }
  
export default StockPage;