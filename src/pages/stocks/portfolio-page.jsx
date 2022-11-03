import React from "react";
import Searchbar from "../../components/searchbar/searchbar";
import { useCallback, useState, useRef, useEffect } from "react";
import axios from "axios";
import jwt_decode from 'jwt-decode'
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

function PortfolioPage() {
    const [holdings, setHoldings] = useState([]);
    const [totalPortValue, setTotalPortValue] = useState(0)
    

    // retrieve token from local storage and decode user
    const token = localStorage.getItem('user_token')
    const user = jwt_decode(token).data

    useEffect(() => {
      const fetchHoldings = async () => {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/holdings/${user}`
          )
          const rawArray = response.data

          // to add totalCost into array (since db does not include this field)
          const addTotal = function (array) {
            array.map((holding) => {
              let total =
                parseFloat(holding.quantity) * parseFloat(holding.costPerQuantity);
              holding.totalCost = total;
            });
            return array;
          };
          const convertedArray = addTotal(rawArray)

          // to consolidate all holdings per ticker 
          const sumByKey = (arr, key, value, value2) => {
            const map = new Map();
            const map2 = new Map();
            for (const obj of arr) {
              const currQtySum = map.get(obj[key]) || 0;
              const currCostSum = map2.get(obj[key]) || 0;
              map.set(obj[key], parseFloat(currQtySum) + parseFloat(obj[value]));
              map2.set(obj[key], parseFloat(currCostSum) + parseFloat(obj[value2]));
            }
            const res = Array.from(map, ([k, v]) => ({ [key]: k, [value]: v }));
            const res2 = Array.from(map2, ([k, v]) => ({ [key]: k, [value2]: v }));
            const res3 = [];
            res.map((e) => {
              res2.map((e2) => {
                if (e.ticker === e2.ticker) {
                  res3.push(Object.assign(e, e2));
                }
              });
            });
            return [res3];
          };

          const consolidatedHoldings = sumByKey(convertedArray, "ticker", "quantity", "totalCost")
          const consolHoldingsData = consolidatedHoldings[0]

          // getting price live price of tickers
          let id = 1
          const addPrice = await Promise.all(
            consolHoldingsData.map(async (holdings) => {
              const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/stocks/oneprice/${holdings.ticker}`
              )
              const profileResponse = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/stocks/oneprofile/${holdings.ticker}`
              )
              const price = await response.data.c
              holdings.price = await price
              holdings.id = id
              id += 1
              const picture = await profileResponse.data.logo
              holdings.logo = await picture
              const name = await profileResponse.data.name
              holdings.name = await name
              return holdings 
            })
          )
          setHoldings(addPrice)
          console.log(holdings)
      }
      fetchHoldings()
    },[])

    useEffect(() => {
      // let portValue = 0
      // function sumPortValue(item) {
      //   let holdingVal = item.price * item.quantity
      //     portValue += holdingVal
      // } 
      const getTotalPortValue = async () => {
        let portValue = 0
          holdings.forEach(myFunction);

          function myFunction(item) {
            let holdingVal = item.price * item.quantity
            portValue += holdingVal;
          }
        console.log(portValue)
        setTotalPortValue(portValue)
      }
      getTotalPortValue()
    },[holdings])

    // const numberize = (num) => {
    //   parseFloat(num).toLocaleString()
    // }

    // console.log("test calc: ", (100000.29).toLocaleString())


    return (
      <div className="App">
        {/* <Searchbar/> */}
        <header className="App-header">
          <p>
            <Container>
              {!holdings ? (
                  <h1>Loading..</h1>
              ) : (
                  <Table striped bordered hover variant="dark" size="sm">
                      <thead>
                          <tr>
                              <th></th>
                              <th>Ticker</th>
                              <th>Price</th>
                              <th>Total gain/ loss</th>
                              <th>Quantity</th>
                              <th>Cost per share</th>
                              <th>Market value</th>
                              <th>% of Portfolio</th>
                          </tr>
                      </thead>
                      <tbody>
                          {holdings && holdings.map((holding) => {
                              return <tr key={holding.id} id={holding.id}>
                                  <td><img src={`${holding.logo}`}></img></td>
                                  <td>
                                    <p>{`${holding.name} (${holding.ticker})`}</p>
                                  </td>
                                  <td>{(holding.price).toLocaleString()}</td>
                                  <td>{((parseFloat(holding.price) - (parseFloat(holding.totalCost)/parseFloat(holding.quantity))) * parseFloat(holding.quantity)).toLocaleString()}</td>
                                  <td>{holding.quantity}</td>
                                  <td>{(parseFloat(holding.totalCost)/parseFloat(holding.quantity)).toLocaleString()}</td>
                                  <td>{(parseFloat(holding.price) * parseFloat(holding.quantity)).toLocaleString()}</td>
                                  {totalPortValue && (
                                    <td>{((parseFloat(holding.price) * parseFloat(holding.quantity)) / parseFloat(totalPortValue)).toFixed(5) }</td>
                                  )}
                              </tr>
                          })}
                      </tbody>
                  </Table>
              )}
            </Container>
          </p>
          <p>
          </p>
        </header>
      </div>
    );
  }
  
export default PortfolioPage;