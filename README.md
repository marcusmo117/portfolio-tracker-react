# Portfolio Tracker App 

## Introduction

Portfolio Tracker App is a personal app that allows users to search for stocks (only US at the moment). Users can sign up and keep track of stocks that they’ve bought. Holdings are then calculated against current prices and relevant allocations can be viewed as well. Think Yahoo Finance but with added functionalities!

Check it out at (https://portfolio-tracker-app.netlify.app/register).

## Links to Repos

- [React Frontend ](https://github.com/marcusmo117/portfolio-tracker-react)
- [Express Backend ](https://github.com/marcusmo117/portfolio-tracker-express)

## Technologies

- PERN stack
- APIs from [Finnhub](https://finnhub.io/docs/api/introduction)
  - Websocket for trades (live prices on stock page)
  - Symbol Lookup (for search function in nav bar) 
  - Company profile 2
  - Basic Financials
  - Quote 
- Netlify for frontend React deployment
- Render for backend Express deployment

## Packages used

- Handle browser request: Axios, Cors,
- Authorisation: Bcrypt, Express-joi-validation, Jsonwebtoken
- Autocomplete in search bar: [React Bootstrap Typeahead](https://www.npmjs.com/package/react-bootstrap-typeahead)
- Style: React Bootstrap, React Chartjs-2, React toastify
- Others: sequelize, websocket 

## Planned Model Schema

![image](https://user-images.githubusercontent.com/105291883/200094246-256401c2-97fc-4ef7-83ed-5366780cfb25.png)


## Future Ideas

- [ ] Properly working websocket with user differentiation (and maybe for portfolio page)
- [ ] Include individual API key option
- [ ] Add historical price graph and company news for stocks page
- [ ] Handle non functioning tickers
