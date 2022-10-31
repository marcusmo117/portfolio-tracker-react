import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
// import Placeholder from 'react-bootstrap/Placeholder';
import AddHoldingsButton from "../../components/addHoldings/addHoldingsButton";
import jwt_decode from 'jwt-decode'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function HoldingsPage() {
    const navigate = useNavigate();
    const [holdings, setHoldings] = useState([]);
    const [addHoldings, setAddHoldings] = useState(0)
    const [oneHolding, setOneHolding] = useState({})
    const [show, setShow] = useState(false);
    
    // retrieve token from local storage and decode user
    const token = localStorage.getItem('user_token')
    const user = jwt_decode(token).data

    useEffect(() => {
        const fetchHoldings = async () => {
            const response = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/api/v1/holdings/${user}`
            )
            setHoldings(response.data)
        }
        fetchHoldings()
    },[])


    // re-render when add/edit holdings is done
    useEffect(() => {
        const fetchHoldings = async () => {
            const response = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/api/v1/holdings/${user}`
            )
            setHoldings(response.data)
        }
        fetchHoldings()
    },[addHoldings])


    // for modal functionality
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const showHoldingForm = async (e) => {
        const holdingId = e.currentTarget.id
        const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/holdings/one/${holdingId}`
        )
        setOneHolding(response.data)
        handleShow()
        console.log(oneHolding)

    };

    // store data for edit holding
    const handleChange = (e) => {
        setOneHolding({
          ...oneHolding,
          [e.target.name]: e.target.value,
        });
      };

    
    // submit edit holding
    const submitEdit = async () => {
        try {
            const resp = await axios({
              method: "put",
              url: `${process.env.REACT_APP_BACKEND_URL}/api/v1/holdings/edit/${oneHolding.id}`,
              data: {
                email: oneHolding.email,
                ticker: oneHolding.ticker,
                tradeDate: oneHolding.tradeDate,
                quantity: oneHolding.quantity,
                costPerQuantity: oneHolding.costPerQuantity,
                customCategory: oneHolding.customCategory
              },
              headers: {
                  "Content-Type": "application/json",
              },
              withCredentials: true,
              }
            );
            toast.success(resp.data.message);
            navigate("/holdings")
            handleClose()

            // to re-render holdings page:
            let addHoldingsCount = addHoldings
            setAddHoldings(addHoldingsCount += 1)

          } catch (err) {
            toast.error(err.response.data.message);
          }
      };

    // submit delete holding
    const submitDelete = async () => {
        try {
            const resp = await axios({
              method: "delete",
              url: `${process.env.REACT_APP_BACKEND_URL}/api/v1/holdings/delete/${oneHolding.id}`,
              data: {email : user},
              headers: {
                  "Content-Type": "application/json",
              },
              withCredentials: true,
              }
            );
            toast.success(resp.data.message);
            navigate("/holdings")
            handleClose()

            // to re-render holdings page:
            let addHoldingsCount = addHoldings
            setAddHoldings(addHoldingsCount += 1)

          } catch (err) {
            toast.error(err.response.data.message);
          }
      };

    return (
      <div className="App">
        <header className="App-header">
          <p>
            <h1>All transactions</h1>
          </p>
          <Container>
            {!holdings ? (
                <h1>Loading..</h1>
            ) : (
                <Table striped bordered hover variant="dark" size="sm">
                    <thead>
                        <tr>
                            <th>Ticker</th>
                            <th>Trade Date</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {holdings && holdings.map((holding) => {
                            return <tr key={holding.id} id={holding.id} onClick={showHoldingForm} style={{cursor:'pointer'}}>
                                <td>{holding.ticker}</td>
                                <td>{`${holding.tradeDate} (last updated: ${(holding.updatedAt).substring(0,10)})`}</td>
                                <td>{holding.quantity}</td>
                                <td>{holding.costPerQuantity}</td>
                                <td>{holding.customCategory}</td>
                            </tr>
                        })}
                    </tbody>
                </Table>
            )}
          </Container>
          <AddHoldingsButton
            setAddHoldings={setAddHoldings}
            addHoldings = {addHoldings}
          />
          {!oneHolding ? (
            <div></div>
          ) : (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{`${oneHolding.ticker} (trade date: ${oneHolding.tradeDate})`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="email">
                            <Form.Control
                                type="hidden"
                                name="email"
                                value={oneHolding.email}
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="ticker"
                        >
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Ticker"
                                className="mb-3"
                            >
                                <Form.Control as="textarea" defaultValue={oneHolding.ticker} name="ticker" placeholder={oneHolding.ticker} autoFocus onChange={handleChange}/>
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="tradeDate"
                        >
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Trade Date"
                                className="mb-3"
                            >
                                <Form.Control type="date" name="tradeDate" defaultValue={oneHolding.tradeDate} placeholder={oneHolding.tradeDate} onChange={handleChange}/>
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="quantity"
                        >
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Quantity"
                                className="mb-3"
                            >
                                <Form.Control type="number" name="quantity" defaultValue={oneHolding.quantity} placeholder={oneHolding.quantity} onChange={handleChange} />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="costPerQuantity"
                        >
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Average Cost Per Quantity"
                                className="mb-3"
                            >
                                <Form.Control type="number" name="costPerQuantity" defaultValue={oneHolding.costPerQuantity} placeholder={oneHolding.costPerQuantity} onChange={handleChange}/>
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="customCategory"
                        >
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Custom Category (optional)"
                                className="mb-3"
                            >
                                <Form.Control type="text" name="customCategory" defaultValue={oneHolding.customCategory} placeholder={oneHolding.customCategory} onChange={handleChange}/>
                            </FloatingLabel>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={submitDelete}>
                        Delete holding
                    </Button>
                    <Button variant="primary" onClick={submitEdit}>
                        Edit holding
                    </Button>
                </Modal.Footer>
            </Modal>
        )}
        </header>
      </div>
    );
  }
  
export default HoldingsPage;