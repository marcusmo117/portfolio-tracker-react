import React from "react";
import { useCallback, useState, useRef, useEffect } from "react";
import axios from "axios";
import jwt_decode from 'jwt-decode'
import Container from 'react-bootstrap/Container';
import { Row, Col, Card } from "react-bootstrap";
import { Doughnut, Chart, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

function AllocationPage() {
    const [holdings, setHoldings] = useState([]);
    const [totalPortValue, setTotalPortValue] = useState(0)
    const [totalCost, setTotalCost] = useState(0)
    

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
          console.log(consolHoldingsData)

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
              // adding latest market price into object
              const price = await response.data.c
              holdings.price = await price

              // adding holdings id into object
              holdings.id = id
              id += 1

              // adding logo into object
              const picture = await profileResponse.data.logo
              holdings.logo = await picture

              // adding company name into object
              const name = await profileResponse.data.name
              holdings.name = await name

              // adding company industry into object
              const industry = await profileResponse.data.finnhubIndustry
              holdings.industry = await industry
               
              // adding country, currency and exchange
              const country = await profileResponse.data.country
              holdings.country = await country
              const currency = await profileResponse.data.currency
              holdings.currency = await currency
              const exchange = await profileResponse.data.exchange
              holdings.exchange = await exchange 

              return holdings
            })
          )
          setHoldings(addPrice)
          console.log('holdings:', holdings)
      }
      fetchHoldings()
    },[])

    useEffect(() => {
      const getTotalPortValue = async () => {
        let portValue = 0
          holdings.forEach(myFunction);

          function myFunction(item) {
            let holdingVal = item.price * item.quantity
            portValue += holdingVal;
          }
        setTotalPortValue(portValue)
      }
      getTotalPortValue()

      const getTotalCost = async () => {
        let portCost = 0
          holdings.forEach(functionOne)

          function functionOne(item) {
            portCost += item.totalCost
          }
          setTotalCost(portCost)
      }
      getTotalCost()

    },[holdings])

    const costData = {
        labels: 
          holdings.map((holding) => {
                return holding.name
        })
        ,
        datasets: [{
          label: 'Cost dataset',
          data:
            holdings.map((holding) => {
                return holding.totalCost
            })
          ,
          backgroundColor: [
            '#463F1A',
            '#60492C',
            '#F9EBE0',
            '#208AAE',
            '#0D2149'

          ],
          hoverOffset: 4
        }]
    };

    const marketData = {
        labels: 
          holdings.map((holding) => {
                return holding.name
        })
        ,
        datasets: [{
          label: 'Market value dataset',
          data:
            holdings.map((holding) => {
                return (parseFloat(holding.quantity) * parseFloat(holding.price))
            })
          ,
          backgroundColor: [
            '#463F1A',
            '#60492C',
            '#F9EBE0',
            '#208AAE',
            '#0D2149'

          ],
          hoverOffset: 4
        }]
    };


    // to consolidate all holdings per industry
    const groupByIndustry = (arr = []) => {
        // const map = {};
        let res = [];
        arr.forEach((holding) => {
            let index = res.findIndex(x => x.industry === holding.industry)
            if (index === -1) {
                res.push({
                    industry: holding.industry,
                    marketValue: parseFloat(holding.quantity) * parseFloat(holding.price),
                    cost: parseFloat(holding.totalCost)
                })
            } else {
                res[index].marketValue += parseFloat(holding.quantity) * parseFloat(holding.price)
                res[index].cost += parseFloat(holding.totalCost)
            }
        })
        return res
    };
    // groupByIndustry(holdings)


    const industryData = {
        labels: 
          (groupByIndustry(holdings)).map((holding) => {
                return holding.industry
        })
        ,
        datasets: [{
          label: 'Market value dataset',
          data:
          (groupByIndustry(holdings)).map((holding) => {
                return holding.marketValue
            })
          ,
          backgroundColor: [
            '#463F1A',
            '#60492C',
            '#F9EBE0',
            '#208AAE',
            '#0D2149'

          ],
          hoverOffset: 4
        }]
    };

    const industryDataCost = {
        labels: 
          (groupByIndustry(holdings)).map((holding) => {
                return holding.industry
        })
        ,
        datasets: [{
          label: 'Market value dataset',
          data:
          (groupByIndustry(holdings)).map((holding) => {
                return holding.cost
            })
          ,
          backgroundColor: [
            '#463F1A',
            '#60492C',
            '#F9EBE0',
            '#208AAE',
            '#0D2149'

          ],
          hoverOffset: 4
        }]
    };

    // to consolidate all holdings per currency 
    const groupByCurrency = (arr = []) => {
        // const map = {};
        let res = [];
        arr.forEach((holding) => {
            let index = res.findIndex(x => x.currency === holding.currency)
            if (index === -1) {
                res.push({
                    currency: holding.currency,
                    marketValue: parseFloat(holding.quantity) * parseFloat(holding.price),
                    cost: parseFloat(holding.totalCost)
                })
            } else {
                res[index].marketValue += parseFloat(holding.quantity) * parseFloat(holding.price)
                res[index].cost += parseFloat(holding.totalCost)
            }
        })
        return res
    };


    const currencyData = {
        labels: 
          (groupByCurrency(holdings)).map((holding) => {
                return holding.currency
        })
        ,
        datasets: [{
          label: 'Market value dataset',
          data:
          (groupByCurrency(holdings)).map((holding) => {
                return holding.marketValue
            })
          ,
          backgroundColor: [
            '#463F1A',
            '#60492C',
            '#F9EBE0',
            '#208AAE',
            '#0D2149'

          ],
          hoverOffset: 4
        }]
    };

    // to consolidate all holdings per country 
    const groupByCountry = (arr = []) => {
        // const map = {};
        let res = [];
        arr.forEach((holding) => {
            let index = res.findIndex(x => x.country === holding.country)
            if (index === -1) {
                res.push({
                    country: holding.country,
                    marketValue: parseFloat(holding.quantity) * parseFloat(holding.price),
                    cost: parseFloat(holding.totalCost)
                })
            } else {
                res[index].marketValue += parseFloat(holding.quantity) * parseFloat(holding.price)
                res[index].cost += parseFloat(holding.totalCost)
            }
        })
        return res
    };


    const countryData = {
        labels: 
          (groupByCountry(holdings)).map((holding) => {
                return holding.country
        })
        ,
        datasets: [{
          label: 'Market value dataset',
          data:
          (groupByCountry(holdings)).map((holding) => {
                return holding.marketValue
            })
          ,
          backgroundColor: [
            '#463F1A',
            '#60492C',
            '#F9EBE0',
            '#208AAE',
            '#0D2149'

          ],
          hoverOffset: 4
        }]
    };

    // to consolidate all holdings per exchange 
    const groupByExchange = (arr = []) => {
        // const map = {};
        let res = [];
        arr.forEach((holding) => {
            let index = res.findIndex(x => x.exchange === holding.exchange)
            if (index === -1) {
                res.push({
                    exchange: holding.exchange,
                    marketValue: parseFloat(holding.quantity) * parseFloat(holding.price),
                    cost: parseFloat(holding.totalCost)
                })
            } else {
                res[index].marketValue += parseFloat(holding.quantity) * parseFloat(holding.price)
                res[index].cost += parseFloat(holding.totalCost)
            }
        })
        return res
    };


    const exchangeData = {
        labels: 
          (groupByExchange(holdings)).map((holding) => {
                return holding.exchange
        })
        ,
        datasets: [{
          label: 'Market value dataset',
          data:
          (groupByExchange(holdings)).map((holding) => {
                return holding.marketValue
            })
          ,
          backgroundColor: [
            '#463F1A',
            '#60492C',
            '#F9EBE0',
            '#208AAE',
            '#0D2149'

          ],
          hoverOffset: 4
        }]
    };

    return (
      <div className="App">
        <header className="App-header">
            <Container fluid>
             <Row className='mb-3 mt-3'>
              <Col>
                    <Card bg="dark">
                        <Card.Header>By Holdings (mkt. val.)</Card.Header>
                        <Card.Body>
                            <Card.Title>Companies</Card.Title>
                            <div>
                                {!holdings ? (
                                    <h1>Loading..</h1>
                                ) : (
                                    <div>
                                        <Doughnut data={marketData}/>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card bg="dark">
                        <Card.Header>By Holdings (cost)</Card.Header>
                        <Card.Body>
                            <Card.Title>Companies</Card.Title>
                            <div>
                                {!holdings ? (
                                    <h1>Loading..</h1>
                                ) : (
                                    <div>
                                        <Doughnut data={costData}/>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card bg="dark">
                        <Card.Header>By Industry (mkt. val.)</Card.Header>
                        <Card.Body>
                            <Card.Title>Industries</Card.Title>
                            <div>
                                {!holdings ? (
                                    <h1>Loading..</h1>
                                ) : (
                                    <div>
                                        <Doughnut data={industryData}/>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card bg="dark">
                        <Card.Header>By Industry (cost)</Card.Header>
                        <Card.Body>
                            <Card.Title>Industries</Card.Title>
                            <div>
                                {!holdings ? (
                                    <h1>Loading..</h1>
                                ) : (
                                    <div>
                                        <Doughnut data={industryDataCost}/>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
              </Row> 
              <Row>
                <Col>
                    <Card bg="dark">
                        <Card.Header>By Currency (mkt. val.)</Card.Header>
                        <Card.Body>
                            <Card.Title>Currencies</Card.Title>
                            <div>
                                {!holdings ? (
                                    <h1>Loading..</h1>
                                ) : (
                                    <div>
                                        <Doughnut data={currencyData}/>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card bg="dark">
                        <Card.Header>By Country (mkt. val.)</Card.Header>
                        <Card.Body>
                            <Card.Title>Countries</Card.Title>
                            <div>
                                {!holdings ? (
                                    <h1>Loading..</h1>
                                ) : (
                                    <div>
                                        <Doughnut data={countryData}/>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card bg="dark">
                        <Card.Header>By Exchange (mkt. val.)</Card.Header>
                        <Card.Body>
                            <Card.Title>Exchanges</Card.Title>
                            <div>
                                {!holdings ? (
                                    <h1>Loading..</h1>
                                ) : (
                                    <div>
                                        <Doughnut data={exchangeData}/>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card bg="dark">
                        <Card.Header>Custom Category</Card.Header>
                        <Card.Body>
                            <Card.Title>Categories</Card.Title>
                            <div>
                                {!holdings ? (
                                    <h1>Loading..</h1>
                                ) : (
                                    <h1>Coming soon :)</h1>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
              </Row>   
            </Container>
            
            <Container>
            </Container>
        </header>
      </div>
    );
  }
  
export default AllocationPage;