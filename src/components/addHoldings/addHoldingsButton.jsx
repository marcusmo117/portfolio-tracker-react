import React from "react";
import { useCallback, useState, useRef, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import jwt_decode from 'jwt-decode'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


function AddHoldingsButton(props) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [holding, setHolding] = useState({})
  const [ticker, setTicker] = useState()

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // retrieve token from local storage and decode user
  const token = localStorage.getItem('user_token')
  const user = jwt_decode(token)

  useEffect(() => {
    setTicker(props.stockSymbol)
    setHolding({"ticker": props.stockSymbol, "email": user.data})
  },[])

  useEffect(() => {
    setTicker(props.stockSymbol)
    setHolding({"ticker": props.stockSymbol, "email": user.data})
  },[props.stockSymbol])

  const handleChange = (e) => {
    setHolding({
      ...holding,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    // e.preventDefault();
    try {
        const resp = await axios({
          method: "post",
          url: `${process.env.REACT_APP_BACKEND_URL}/api/v1/holdings`,
          data: holding,
          headers: {
              "Content-Type": "application/json",
          },
          withCredentials: true,
          }
        );
        toast.success(resp.data.message);
        navigate("/holdings")
        // to re-render holdings page:
        let addHoldings = props.addHoldings
        props.setAddHoldings(addHoldings += 1)
      } catch (err) {
        toast.error(err.response.data.message);
      }
  }

  const submitAndClose = () => {
    handleSubmit()
    handleClose()
  }


  return (
    <>
      <Button variant="success" onClick={handleShow}>
        New holding!
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Holding</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="email">
              <Form.Control
                type="hidden"
                name="email"
                value={user}
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
                <Form.Control as="textarea" defaultValue={ticker} name="ticker" placeholder={ticker} autoFocus onChange={handleChange}/>
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
                <Form.Control type="date" name="tradeDate" placeholder="12/12/2022" onChange={handleChange}/>
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
                <Form.Control type="number" name="quantity" placeholder="1" onChange={handleChange} />
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
                <Form.Control type="number" name="costPerQuantity" placeholder="1" onChange={handleChange}/>
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
                <Form.Control type="text" name="customCategory" placeholder="a" onChange={handleChange}/>
              </FloatingLabel>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={submitAndClose}>
            Add holding
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
  
export default AddHoldingsButton;