import React, { useEffect, useState } from "react";
import "./App.css";
import gif from "../src/assets/ac.gif";
import { RxCross2 } from "react-icons/rx";

const Ladger = () => {
    let dueAmt=0;
    let payeAmt=0;
    let balanceAmt=0;
    let payval = 0;
    let dueval = 0;
  const date = new Date();
  const month = date.getMonth() + 1;
  const today = `${month}/${date.getDate()}/${date.getFullYear()}`;
  const [getData, setGetData] = useState();
  const [addData, setAddData] = useState({ name: "", contact: 0, address: "" });
  const [addTempData, setAddTempData] = useState({
    name: "",
    contact: 0,
    address: "",
  });
  const [addUserDetail, setAddUserDetail] = useState({
    name: "",
    contact: 0,
    address: "",
  });
  const [addUserAccountDetail, setAddUserAccountDetail] = useState({
    summary:"",
    balance: 0,
    due: 0,
    pay: 0,
    date: today,
  });
  const [showHide, setShowHide] = useState(false);
  const [userRecord, setUserRecord] = useState();
  const [customerRecordShowHide, setCustomerRecordShowHide] = useState(false);
  const [addNewRecord, setAddNewRecord] = useState({
    summary: "",
    balance: "",
    pay: "",
    due: "",
    date: "",
  });
   const [searchData, setSearchData] = useState([]);
    const [searchInputField, setSearchInputField] = useState({
        name: "",
        contact: "",
      });

  const fetchData = async () => {
    const fd = await fetch("https://ladgerprojectbackend.onrender.com/ladger");
    // const fd = await fetch("http://localhost:8000/ladger");
    const data = await fd.json();
    if (data.status === 202) {
      setGetData(data.fetchData);
    setSearchData(data.fetchData)
    } else {
      setGetData(error);
    }
  };

  useEffect(() => {
    fetchData();
  },[]);
  const AddAcountInputDataHandler = (e) => {
    const { name, value } = e.target;
    if (name === "name" || name === "address" || name === "contact") {
      setAddUserDetail({ ...addUserDetail, [name]: value });
    } else {
      setAddUserAccountDetail({ ...addUserAccountDetail, [name]: value });
    }
  };

  const dataSubmitEventHandler = async (e) => {
    e.preventDefault();
    const { name, address, contact } = addUserDetail;
    try {
      // const fd = await fetch("http://localhost:8000/ladger", {
      const fd = await fetch("https://ladgerprojectbackend.onrender.com/ladger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          address,
          contact,
          account: addUserAccountDetail,
        }),
      });
      const result = await fd.json();
      if (result.status === 202) {
        alert(result.message);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.log(error);
    }
    setShowHide(!showHide);
  };
 
  const userAccountRecordHandler = (elem) => {
    const { name, address, contact } = elem;
    setUserRecord(elem.account);
    setAddTempData({ name, address, contact });
    setCustomerRecordShowHide(!customerRecordShowHide);
  };
  const newRecordAddEventHandler = (e) => {
    const { name, value } = e.target;
    setAddNewRecord({ ...addNewRecord, [name]: value, date: today });
  };

  const updateDataInRecordandler = async (e) => {
    e.preventDefault();
    try {
      const { name, address, contact } = addTempData;
      const {summary,due,pay,balance} = addNewRecord;
      if(summary!='' || due!='' ||pay!='' || balance!=''){
        const fd = await fetch("https://ladgerprojectbackend.onrender.com/ladger", {
        // const fd = await fetch("http://localhost:8000/ladger", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            address,
            contact,
            account: addNewRecord,
          }),
        });
        const result = await fd.json();
        if (result.status === 202) {
          alert(result.message);
        } else {
          alert(result.error);
        }
      }else{
        alert("please enter all data")
      }
      
    } catch (error) {
      console.log(error);
    }
    setAddNewRecord({
        summary: "",
        balance: "",
        pay: "",
        due: "",
        date: "",
      })
  };

  const searchDataEventHandler = (e) => {
    const {name,contact}=searchInputField
    e.preventDefault();
    const filtered = searchData.filter((item) =>
      item.name.toLowerCase().includes(name.toLowerCase())
    );
    
    setSearchData(filtered)
  }

  return (
    <div className="ladger-main-div">
     <div class="search-div">
          <div class="input-div">
            <label for="name">Name</label>
            <input
              type="text"
              value={searchInputField.name}
              onChange={(e) => {
                setSearchInputField({
                  ...searchInputField,
                  name: e.target.value,
                });
              }}
            />
          </div>
          <div class="input-div">
            <label for="name">City</label>
            <input
              type="text"
              value={searchInputField.contact}
              onChange={(e) => {
                setSearchInputField({
                  ...searchInputField,
                  contact: e.target.value,
                });
              }}
            />
          </div>
          <button
            class="srchbtn"
            onClick={(e) => {
              searchDataEventHandler(e);
            }}
          >
            Search
          </button>
          <button
            class="srchbtn"
            onClick={(e) => {
              setSearchData(getData);
            }}
          >
            Reset
          </button>
          <button
            class="srchbtn"
            onClick={(e) => {
              setShowHide(!showHide);
            }}
          >
            Register
          </button>
        </div>
      <table style={{ width: "100%" }}>
        <thead>
          <tr className="ladger-head">
            <th>Sr.</th>
            <th>Name</th>
            <th>Contact</th>
            <th style={{ textAlign: "start" }}>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {searchData &&
            searchData.map((elem, ind) => {
              const { name, contact, address } = elem;

              return (
                <>
                  <tr className="ladger-head">
                    <td>{ind + 1}</td>
                    <td>{name}</td>
                    <td>{contact}</td>
                    <td style={{ textAlign: "start" }}>{address}</td>
                    <td
                      className="view-btn"
                      style={{ fontWeight: 400 }}
                      onClick={() => {
                        userAccountRecordHandler(elem);
                      }}
                    >
                      View Account
                    </td>
                  </tr>
                </>
              );
            })}
        </tbody>
        <div
          className="customerDataRecord"
          style={{ display: customerRecordShowHide ? "block" : "none" }}
        >
          <RxCross2
            className="cancel-btn"
            onClick={() => {
              setCustomerRecordShowHide(!customerRecordShowHide);
            }}
          />
          <div className="data-entry-field">
            <input
              type="text"
              placeholder="Summary"
              name="summary"
              value={addNewRecord.summary}
              onChange={(e) => {
                newRecordAddEventHandler(e);
              }}
            />
            <input
              type="text"
              placeholder="Pay Amount"
              name="pay"
              value={addNewRecord.pay}
              onChange={(e) => {
                newRecordAddEventHandler(e);
              }}
            />
            <input
              type="text"
              placeholder="Due Payment"
              name="due"
              value={addNewRecord.due}
              onChange={(e) => {
                newRecordAddEventHandler(e);
              }}
            />
            <input
              type="text"
              placeholder="Balance Payment"
              name="balance"
              value={addNewRecord.balance}
              onChange={(e) => {
                newRecordAddEventHandler(e);
              }}
            />
            <button
              onClick={(e) => {
                updateDataInRecordandler(e);
              }}
            >
              Add{" "}
            </button>
          </div>
          <table>
            <thead>
              <tr className="ladger-record">
                <th>S.N.</th>
                <th>Date</th>
                <th>Particular</th>
                <th>Balance</th>
                <th>Pay</th>
                <th>Due</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {userRecord &&
                userRecord.map((elem, ind) => {
                  const { date, pay, due, balance ,summary} = elem;
                  {/* let payval = 0;
                  let dueval = 0; */}
                  payval =  parseFloat(payval)+parseFloat(pay)
                        payeAmt = parseFloat(payeAmt)+parseFloat(pay)
                        {/* dueval +=  parseFloat(due) */}
                        balanceAmt =  parseFloat(balanceAmt) + parseFloat(balance)
                        dueAmt = balanceAmt- payeAmt
                  return (
                    <>
                      <tr className="ladger-record">
                        <td>{ind + 1}</td>
                        <td>{date}</td>
                        <td>{summary}</td>
                        <td>{balance}</td>
                        <td>{pay}</td>
                        <td>{due}</td>
                      </tr>
                    </>
                  );
                })}
            </tbody>
            <div className="ladger-record-total-section">
              <p>
                Total Balance Amount <span style={{color:"#01144d"}}>{balanceAmt}</span>
              </p>
              <p>
                Total Pay Amount <span style={{color:"green"}}>{payeAmt}</span>
              </p>
              <p>
                Total Due Amount <span>{dueAmt}</span>
              </p>
            </div>
          </table>
        </div>
      </table>
      <div
        className="add-data-form"
        style={{ display: showHide ? "block" : "none" }}
      >
        <RxCross2
          className="cancel-btn"
          onClick={() => {
            setShowHide(!showHide);
          }}
        />
        <div className="data-part">
          <div className="add-data-left">
            <img src={gif} alt="" />
          </div>
          <div className="add-data-right">
            <div className="input-div">
              <label htmlFor="date">date : </label>
              <input
                type="text"
                name="date"
                id="date"
                value={addUserAccountDetail.date}
              />
            </div>
            <div className="input-div">
              <label htmlFor="name">Name :</label>
              <input
                type="text"
                name="name"
                id="name"
                value={addUserDetail.name}
                onChange={(e) => {
                  AddAcountInputDataHandler(e);
                }}
              />
            </div>
            <div className="input-div">
              <label htmlFor="contact">Contact :</label>
              <input
                type="text"
                name="contact"
                id="contact"
                value={addUserDetail.contact}
                onChange={(e) => {
                  AddAcountInputDataHandler(e);
                }}
              />
            </div>
            <div className="input-div">
              <label htmlFor="address">Address :</label>
              <input
                type="text"
                name="address"
                id="address"
                value={addUserDetail.address}
                onChange={(e) => {
                  AddAcountInputDataHandler(e);
                }}
              />
            </div>
            <div className="input-div">
              <label htmlFor="balance">Amount :</label>
              <input
                type="text"
                name="balance"
                id="balance"
                value={addUserAccountDetail.balance}
                onChange={(e) => {
                  AddAcountInputDataHandler(e);
                }}
              />
              </div>
            <div className="input-div">
              <label htmlFor="summary">Remarks :</label>
              <input
                type="text"
                name="summary"
                id="summary"
                value={addUserAccountDetail.summary}
                onChange={(e) => {
                  AddAcountInputDataHandler(e);
                }}
              />
            </div>
            <div className="input-div">
              <label htmlFor="pay">pay :</label>
              <input
                type="text"
                name="pay"
                id="pay"
                value={addUserAccountDetail.pay}
                onChange={(e) => {
                  AddAcountInputDataHandler(e);
                }}
              />
            </div>
            <div className="input-div">
              <label htmlFor="due">due :</label>
              <input
                type="text"
                name="due"
                id="due"
                value={addUserAccountDetail.due}
                onChange={(e) => {
                  AddAcountInputDataHandler(e);
                }}
              />
            </div>
            <button onClick={(e) => dataSubmitEventHandler(e)}>Add Data</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ladger;
