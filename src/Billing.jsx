import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  createContext,
} from "react";
import { FcPrint } from "react-icons/fc";
import { RxCross2 } from "react-icons/rx";
import { useReactToPrint } from "react-to-print";
import "./App.css";
import logo from "../src/assets/mvg.png";
// import { patch } from "../../BillingBackend/Router/Get";

const crContext = createContext();
const Billing = () => {
  ///////////// initialization
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef });
  const date = new Date();
  const month = date.getMonth() + 1;
  const today = `${date.getDate()}/${month}/${date.getFullYear()}`;

  let totalGross = 0;
  let totalLess = 0;
  let totalNet = 0;
  let totalGrossAmt = 0;
  let totalNetAmt = 0;
  let totalMC = 0;
  let subtotal = 0;
  let grand = 0;

  const initialState = {
    name: "",
    contact: "",
    pan: "",
    city: "",
    state: "",
    address: "",
    invoice: "",
    date: today,
  };
  const shoppingInitialState = {
    particular: "",
    purity: "",
    rate: 0,
    mc: 0,
    gross: 0,
    less: 0,
    net: 0,
    qty: 0,
    total: 0,
  };
  const shoppingInitialStateError = {
    invoice: "",
    name: "",
    contact: "",
    particular: "",
    purity: "",
    rate: "",
    mc: "",
    net: "",
    gross: "",
    qty: "",
    total: "",
  };

  ///////////// array define
  const [inputDetails, setInputDetails] = useState(initialState);
  const [shoppingInputDetails, setShoppingInputDetails] =
    useState(shoppingInitialState);
  const [shoppingInputDetailsStore, setShoppingInputDetailsStore] = useState(
    []
  );
  const [billingDetail, setBillingDetail] = useState();
  const [findTotalValue, setFindTotalValue] = useState(0);
  const [checkEmpty, setCheckEmpty] = useState(false);
  const [printPageShow, setPrintPageShow] = useState(false);
  const [showFormValidation, setShowFormValidation] = useState(false);
  const [checkError, setCheckError] = useState(shoppingInitialStateError);
  // // validation check
  const checkUserDetailValidation = () => {
    const inputError = initialState;
    let isError = true;
    if (!inputDetails.name) {
      inputError.name = "required";
      isError = false;
    }
    if (!inputDetails.contact) {
      inputError.contact = "required";
      isError = false;
    }
    if (!inputDetails.invoice) {
      inputError.invoice = "required";
      isError = false;
    }
    setCheckError({ ...checkError, inputError });
    return isError;
  };

  const checkValidation = () => {
    const inputError = shoppingInitialStateError;
    let isError = true;
    if (!shoppingInputDetails.particular) {
      inputError.particular = "required";
      isError = false;
    }
    if (!shoppingInputDetails.purity) {
      inputError.purity = "required";
      isError = false;
    }
    if (!shoppingInputDetails.rate) {
      inputError.rate = "required";
      isError = false;
    }
    // if (!inputDetails.invoice) {
    //   inputError.invoice = "required";
    //   isError = false;
    // }
    if (!shoppingInputDetails.mc) {
      inputError.mc = "required";
      isError = false;
    }
    if (!shoppingInputDetails.net) {
      inputError.net = "required";
      isError = false;
    }
    // if (!shoppingInputDetails.gross) {
    //   inputError.gross = "required";
    //   isError = false;
    // }
    if (!shoppingInputDetails.qty) {
      inputError.qty = "required";
      isError = false;
    }
    // if (!inputDetails.name) {
    //   inputError.name = "requried";
    //   isError = false;
    // }
    // if (!inputDetails.contact) {
    //   inputError.contact = "requried";
    //   isError = false;
    // }
    setCheckError(inputError);
    return isError;
  };

  // //////////// function Creation

  const CustomerDetailHandler = (e) => {
    const { name, value } = e.target;
    setInputDetails({ ...inputDetails, [name]: value, date: today });
    checkUserDetailValidation();
  };
  const ShoppingInputDetailHandler = (e) => {
    const { name, value } = e.target;
    setShoppingInputDetails({ ...shoppingInputDetails, [name]: value });
    checkValidation();
  };
  const AddShoppingValueEventHandler = (e) => {
    e.preventDefault();

    if (checkValidation()) {
      setShoppingInputDetailsStore([
        ...shoppingInputDetailsStore,
        shoppingInputDetails,
      ]);
      setCheckEmpty(true);
      setShoppingInputDetails({
        ...shoppingInputDetails,
        particular: "",
        purity: "",
        rate: "",
        mc: "",
        net: "",
        gross: "",
        qty: "",
      });
    } else {
      alert("check entry");
    }
  };
  const readyforPrintHandler = () => {
    if (!checkValidation()) {
    
      setBillingDetail({
        ...billingDetail,
        inputDetails,
        shoppingInputDetailsStore,
      });
      setPrintPageShow(!printPageShow);
      setShowFormValidation(!showFormValidation);
      dataPostHandler(billingDetail);
    } else {
      alert("check Input Fields");
    }
  };

  const dataPostHandler = async (elem) => {
    const { name, contact, address, city, state, pan, invoice } =
    inputDetails;
    try {
      const fd = await fetch("http://localhost:8000/bill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://localhost:5173",
        },
        body: JSON.stringify({
          name,
          contact,
          address,
          city,
          state,
          pan,
          invoice,
          date: today,
          item: billingDetail.shoppingInputDetailsStore,
        }),
      });
      const data = await fd.json();
      if (data.status === 202) {
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };

  return (
    <>
      <div className="billing-main-div">
        <h1>Billing Section</h1>
        <div className="customer-detail-div">
          <p>Customer's Details: </p>
          <button
            className="print-txt-btn"
            onClick={() => {
              readyforPrintHandler();
            }}
          >
            Print
          </button>

          <form action="" className="input-form">
            <div className="input-div">
              <label htmlFor="invoice">Invoice No:</label>
              <input
                type="number"
                name="invoice"
                value={inputDetails.invoice}
                onChange={(e) => CustomerDetailHandler(e)}
              />
              {checkError.invoice && (
                <p style={{ color: "red" }}>{checkError.invoice}</p>
              )}
            </div>
            <div className="input-div">
              <label htmlFor="name">Date</label>
              <input
                type="text"
                name="name"
                value={today}
                // onChange={(e) => CustomerDetailHandler(e)}
              />
            </div>
            <div className="input-div">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                name="name"
                value={inputDetails.name}
                onChange={(e) => CustomerDetailHandler(e)}
              />
              {checkError.name && (
                <p style={{ color: "red" }}>{checkError.name}</p>
              )}
            </div>
            <div className="input-div">
              <label htmlFor="name">Phone No:</label>
              <input
                type="text"
                name="contact"
                value={inputDetails.contact}
                onChange={(e) => CustomerDetailHandler(e)}
              />
              {checkError.contact && (
                <p style={{ color: "red" }}>{checkError.contact}</p>
              )}
            </div>
            <div className="input-div">
              <label htmlFor="name">State:</label>
              <input
                type="text"
                name="state"
                value={inputDetails.state}
                onChange={(e) => CustomerDetailHandler(e)}
              />
            </div>
            <div className="input-div">
              <label htmlFor="name">City:</label>
              <input
                type="text"
                name="city"
                value={inputDetails.city}
                onChange={(e) => CustomerDetailHandler(e)}
              />
            </div>
            <div className="input-div">
              <label htmlFor="name">Address:</label>
              <input
                type="text"
                name="address"
                value={inputDetails.address}
                onChange={(e) => CustomerDetailHandler(e)}
              />
            </div>
            <div className="input-div">
              <label htmlFor="name">Pan No:</label>
              <input
                type="text"
                name="pan"
                value={inputDetails.pan}
                style={{ textTransform: "uppercase" }}
                onChange={(e) => CustomerDetailHandler(e)}
              />
            </div>
          </form>
          <p>Shopping's Details: </p>
          <table className="shopping-table">
            <thead>
              <tr>
                <th>Particular</th>
                <th>Purity</th>
                <th>Rate</th>
                <th>MC</th>
                <th>Gross Wet.</th>
                <th>Less Wet.</th>
                <th>Net Wet.</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            {!checkEmpty ? (
              <tbody>
                <tr>
                  <td>
                    <input
                      type="text"
                      name="particular"
                      value={shoppingInputDetails.particular}
                      onChange={(e) => {
                        ShoppingInputDetailHandler(e);
                      }}
                    />

                    {checkError.particular && (
                      <p style={{ color: "red" }}>{checkError.particular}</p>
                    )}
                  </td>
                  <td>
                    <input
                      type="text"
                      name="purity"
                      value={shoppingInputDetails.purity}
                      onChange={(e) => {
                        ShoppingInputDetailHandler(e);
                      }}
                    />
                    {checkError.purity && (
                      <p style={{ color: "red" }}>{checkError.purity}</p>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      name="rate"
                      value={shoppingInputDetails.rate}
                      onChange={(e) => {
                        ShoppingInputDetailHandler(e);
                      }}
                    />
                    {checkError.rate && (
                      <p style={{ color: "red" }}>{checkError.rate}</p>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      name="mc"
                      value={shoppingInputDetails.mc}
                      onChange={(e) => {
                        ShoppingInputDetailHandler(e);
                      }}
                    />
                    {checkError.mc && (
                      <p style={{ color: "red" }}>{checkError.mc}</p>
                    )}
                  </td>

                  <td>
                    <input
                      type="number"
                      name="gross"
                      value={shoppingInputDetails.gross}
                      onChange={(e) => {
                        ShoppingInputDetailHandler(e);
                      }}
                    />
                    {checkError.gross && (
                      <p style={{ color: "red" }}>{checkError.gross}</p>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      name="less"
                      value={shoppingInputDetails.less}
                      onChange={(e) => {
                        ShoppingInputDetailHandler(e);
                      }}
                    />
                    {checkError.less && (
                      <p style={{ color: "red" }}>{checkError.gross}</p>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      name="net"
                      value={shoppingInputDetails.net}
                      onChange={(e) => {
                        ShoppingInputDetailHandler(e);
                      }}
                    />
                    {checkError.net && (
                      <p style={{ color: "red" }}>{checkError.net}</p>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      name="qty"
                      value={shoppingInputDetails.qty}
                      onChange={(e) => {
                        ShoppingInputDetailHandler(e);
                      }}
                    />
                    {checkError.qty && (
                      <p style={{ color: "red" }}>{checkError.qty}</p>
                    )}
                  </td>
                  <td>
                    <input
                      type="text"
                      name="total"
                      value={shoppingInputDetails.total}
                      onClick={(e) => {
                        setShoppingInputDetails({
                          ...shoppingInputDetails,
                          total: 3,
                        });
                      }}
                    />
                  </td>
                  <td>
                    <button onClick={(e) => AddShoppingValueEventHandler(e)}>
                      add
                    </button>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td>
                    <input
                      type="text"
                      name="particular"
                      value={shoppingInputDetails.particular}
                      onChange={(e) => {
                        ShoppingInputDetailHandler(e);
                      }}
                    />

                    {checkError.particular && (
                      <p style={{ color: "red" }}>{checkError.particular}</p>
                    )}
                  </td>
                  <td>
                    <input
                      type="text"
                      name="purity"
                      value={shoppingInputDetails.purity}
                      onChange={(e) => {
                        ShoppingInputDetailHandler(e);
                      }}
                    />
                    {checkError.purity && (
                      <p style={{ color: "red" }}>{checkError.purity}</p>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      name="rate"
                      value={shoppingInputDetails.rate}
                      onChange={(e) => {
                        ShoppingInputDetailHandler(e);
                      }}
                    />
                    {checkError.rate && (
                      <p style={{ color: "red" }}>{checkError.rate}</p>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      name="mc"
                      value={shoppingInputDetails.mc}
                      onChange={(e) => {
                        ShoppingInputDetailHandler(e);
                      }}
                    />
                    {checkError.mc && (
                      <p style={{ color: "red" }}>{checkError.mc}</p>
                    )}
                  </td>

                  <td>
                    <input
                      type="number"
                      name="gross"
                      value={shoppingInputDetails.gross}
                      onChange={(e) => {
                        ShoppingInputDetailHandler(e);
                      }}
                    />
                    {checkError.gross && (
                      <p style={{ color: "red" }}>{checkError.gross}</p>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      name="less"
                      value={shoppingInputDetails.less}
                      onChange={(e) => {
                        ShoppingInputDetailHandler(e);
                      }}
                    />
                    {checkError.gross && (
                      <p style={{ color: "red" }}>{checkError.gross}</p>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      name="net"
                      value={shoppingInputDetails.net}
                      onChange={(e) => {
                        ShoppingInputDetailHandler(e);
                      }}
                    />
                    {checkError.net && (
                      <p style={{ color: "red" }}>{checkError.net}</p>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      name="qty"
                      value={shoppingInputDetails.qty}
                      onChange={(e) => {
                        ShoppingInputDetailHandler(e);
                      }}
                    />
                    {checkError.qty && (
                      <p style={{ color: "red" }}>{checkError.qty}</p>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      name="total"
                      value={findTotalValue}
                      // onChange={(e) => {
                      //   ShoppingInputDetailHandler(e);
                      // }}
                    />
                  </td>
                  <td>
                    <button onClick={(e) => AddShoppingValueEventHandler(e)}>
                      add
                    </button>
                  </td>
                </tr>
                {shoppingInputDetailsStore &&
                  shoppingInputDetailsStore.map((elem, ind) => {
                    const {
                      particular,
                      purity,
                      rate,
                      mc,
                      net,
                      less,
                      gross,
                      qty,
                    } = elem;

                    totalGross += parseFloat(gross);
                    totalLess += parseFloat(less);
                    totalNet += parseFloat(net);
                    totalMC += parseFloat(mc) * parseFloat(net);
                    var totalV = (
                      parseFloat(net) *
                      (parseInt(rate) + parseInt(mc)) *
                      parseInt(qty)
                    ).toFixed(2);
                    totalGrossAmt = (
                      parseFloat(totalGrossAmt) +
                      parseFloat(gross) * parseFloat(rate)
                    ).toFixed(2);
                    
                    totalNetAmt = (
                      parseFloat(totalNetAmt) +
                      parseFloat(net) * parseFloat(rate)
                    ).toFixed(2);
                    subtotal = (
                      parseFloat(subtotal) +
                      (parseFloat(gross) - parseFloat(less)) *
                        (parseInt(rate) + parseInt(mc)) *
                        parseInt(qty)
                    ).toFixed(2);

                    return (
                      <tr>
                        <td>{particular}</td>
                        <td>{purity}</td>
                        <td>{rate}</td>
                        <td>{mc}</td>
                        <td>{gross}</td>
                        <td>{less}</td>
                        <td>{net}</td>
                        <td>{qty}</td>
                        <td>{totalV}</td>
                        {/* <td>
                        <button onClick={() => removeDataEventHandler(elem)}>
                          cancel
                        </button>
                      </td> */}
                      </tr>
                    );
                  })}

                <div className="show-total-div">
                  <p>
                    Total Gross Weight(gm) <span>{totalGross} </span>
                  </p>
                  <p>
                    Total Less Weight(gm) <span>{totalLess} </span>
                  </p>
                  <p>
                    Total Net Weight(gm) <span>{totalNet} </span>
                  </p>
                  <p>
                    Total Gross Amount(₨) <span> {totalGrossAmt}</span>
                  </p>
                  <p>
                    Total Net Amount(₨) <span> {totalNetAmt}</span>
                  </p>
                  <p>
                    Total MC(RS) <span>{totalMC} </span>
                  </p>
                  <p
                    style={{
                      border: "none",
                      fontWeight: "600",
                    }}
                  >
                    Total Amount(₨) <span> {subtotal}</span>
                  </p>
                  {/* <p
                    style={{
                      border: "none",
                      fontWeight: "600",
                    }}
                  >
                    Grand Total(₨){" "}
                    <span style={{ fontWeight: "600" }}> {grand}</span>
                  </p> */}
                </div>
              </tbody>
            )}
          </table>
        </div>
        <div
          className="bill-format"
          style={{ display: !printPageShow ? "none" : "flex" }}
        >
          <FcPrint className="print-btn" onClick={handlePrint} />
          <RxCross2
            className="cancel-btn"
            onClick={() => {
              setPrintPageShow(!printPageShow);
              setShowFormValidation(!showFormValidation);
            }}
          />

          {showFormValidation ? (
            <crContext.Provider value={billingDetail}>
              <ComponentToPrint innerRef={contentRef} />
            </crContext.Provider>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default Billing;

const ComponentToPrint = (props) => {
  const modeldata = useContext(crContext);
  const [customerDetail, setCustomerDetail] = useState(modeldata.inputDetails);
  const [customerShopingDetail, setCustomerShopingDetail] = useState(
    modeldata.shoppingInputDetailsStore
  );
  console.log("====================================");
  console.log("Print Page");
  console.log("====================================");
  console.log(modeldata);
  let totalNet = 0;
  let totalGross = 0;
  let totalLess = 0;
  let totalMC = 0;
  let subtotal = 0;
  let grand = 0;
  let total = 0;

  return (
    <>
      <div id="print" ref={props.innerRef}>
        <h3>Customer's Slip Copy</h3>
        <div className="model-form">
          <div className="shop-detail">
            <div className="shop-logo-div">
              <img src={logo} alt="logo" />
            </div>
            <div className="shop-name">
              <h1>VAISHNAVI JWELLERS</h1>
              <h2>Add. Prem Nagar opp. Govt. I.T.I. Delhi Road </h2>
              <h2>Saharanpur,Saharanpur,Uttar Pradesh</h2>
              <h3>1234567890,0987654321</h3>
            </div>
            <div className="time-invoice">
              <p>
                Invoice: <span>{customerDetail.invoice}</span>
              </p>
              <p>
                Date: <span>{customerDetail.date}</span>
              </p>
              {/* <p>
                GST: <span>123456789vf</span>
              </p> */}
            </div>
          </div>
          <div className="customer-detail">
            <h2>
              name: <span>{customerDetail.name}</span>
            </h2>
            <h2 className="even">
              contact No. : <span>{customerDetail.contact}</span>
            </h2>
            <h2>
              PAN No.: <span>{customerDetail.pan}</span>
            </h2>
            <h2>
              State: <span>{customerDetail.state}</span>
            </h2>
            <h2>
              District: <span>{customerDetail.city}</span>
            </h2>
            <h2 className="even">
              Address: <span>{customerDetail.address}</span>
            </h2>
          </div>
          <div className="shoping-details">
            <table>
              <thead>
                <tr>
                  <th>sr. no.</th>
                  <th>Particulars</th>
                  <th>Purity</th>
                  <th>Rate</th>
                  <th>MC</th>
                  <th>Gross Weight</th>
                  <th>Less Weight</th>
                  <th>Net Weight</th>
                  <th>Qty.</th>
                  <th>Net Amt.</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {customerShopingDetail.map((elem, ind) => {
                  const {
                    particular,
                    purity,
                    rate,
                    mc,
                    net,
                    less,
                    gross,
                    qty,
                  } = elem;
                  totalNet = (
                    parseFloat(totalNet) +
                    (parseFloat(gross) - parseFloat(less))
                  ).toFixed(3);
                  totalGross = (
                    parseFloat(totalGross) + parseFloat(gross)
                  ).toFixed(3);
                  totalLess = parseFloat(totalLess + parseFloat(less)).toFixed(
                    2
                  );
                  totalMC = (
                    parseFloat(totalMC) +
                    parseInt(mc) * parseFloat(net) * parseInt(qty)
                  ).toFixed(2);
                  subtotal = parseFloat(
                    parseFloat(subtotal) +
                      (parseFloat(gross) - parseFloat(less)) *
                        parseInt(rate) *
                        parseInt(qty)
                  ).toFixed(2);
                  grand = parseFloat(
                    parseFloat(grand) +
                      (parseFloat(gross) - parseFloat(less)) *
                        (parseInt(rate) + parseInt(mc)) *
                        parseInt(qty)
                  ).toFixed(2);
                  total = (
                    parseFloat(net) *
                    (parseInt(rate) + parseInt(mc)) *
                    parseInt(qty)
                  ).toFixed(2);
                  return (
                    <>
                      <tr className="bill-data-column">
                        <td>{ind + 1}</td>
                        <td>{particular}</td>
                        <td>{purity}</td>
                        <td>{rate}</td>
                        <td>{mc}</td>
                        <td>{gross}</td>
                        <td>{less}</td>
                        <td>{net}</td>
                        <td>{qty}</td>
                        <td>
                          {net === ""
                            ? ""
                            : parseInt(
                                parseFloat(net) * parseInt(rate) * parseInt(qty)
                              ).toFixed(2)}
                        </td>
                        {/* <td>{gross != "" ? "" : gross * rate * qty}</td> */}
                        <td style={{ borderRight: "none" }}>{total}</td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="total-amt-div">
          <div className="declaration-div">
            <p>bank name: punjab national bank</p>
            <p>branch: Delhi Road</p>
            <p>A/c no: XXXXXXX432</p>
            <p>IFSC code: XXXXXf432</p>
            <p>UPI ID: XXXXXXXX32@ybl</p>
          </div>
          <div className="total-div">
            <p>
              Sub Total Gross Weight(gm) <span>{totalGross} </span>
            </p>
            <p>
              Sub Total Less Weight(gm) <span>{totalLess} </span>
            </p>
            <p>
              Sub Total Net Weight(gm) <span>{totalNet} </span>
            </p>
            <p>
              Sub Total Making Charges(₨) <span> {totalMC}</span>
            </p>
            <p>
              Sub Total Amount(₨) <span> {subtotal}</span>
            </p>
            <p style={{ borderTop: "1px solid black", fontWeight: "600" }}>
              Grand Total(₨) <span style={{ fontWeight: "600" }}> {grand}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
