import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

const Database = () => {
  const [getData, setGetData] = useState();
  const [showHide, setShowHide] = useState(false);
  const [userRecord, setUserRecord] = useState();
  const [searchData, setSearchData] = useState([]);
  const [searchInputField, setSearchInputField] = useState({
      name: "",
      contact: "",
    });

  const fetchData = async () => {
    try {
      const fd = await fetch("http://localhost:8000/bill");
      const data = await fd.json();
      setGetData(data);
      setSearchData(data)
      // const uniqueItems = data.filter((user, index, self) => {
      //   return self.findIndex((u) => u.name === user.name) === index; // Check if the index of the first occurrence matches the current index
      // });
      // setGetData(uniqueItems);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const showAllDetailHandler = (elem) => {
    setShowHide(!showHide);
    fetchUserRecord(elem);
  };

  const fetchUserRecord =(elem)=>{
   
    // const uniqueItems = data.filter((user, index, self) => {
    //   return self.findIndex((u) => u.name === user.name) === index; });
    setUserRecord(elem.item);

  }
  const searchDataEventHandler = (e) => {
    const {name,contact}=searchInputField
    console.log(searchInputField);
    
    e.preventDefault();
    const filtered = searchData.filter((item) =>
      item.name.toLowerCase().includes(name.toLowerCase())
    );
    setSearchData(filtered)
    console.log("hello");
    
    
  }
  
  return (
    <div className="database-main-div">
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
        </div>
      <table>
        <thead>
          <tr>
            <th>S.N.</th>
            <th>name</th>
            <th>Contact</th>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
            <th>Last Visit</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {searchData &&
            searchData.map((elem, ind) => {
              const { name, address, city, state, contact, pan, date } =
                elem;
              return (
                <tr>
                  <td>{ind + 1}</td>
                  <td>{name}</td>
                  <td>{contact}</td>
                  <td>{address}</td>
                  <td>{city}</td>
                  <td>{state}</td>
                  <td>{date}</td>
                  <td
                    className="view-btn"
                    onClick={() => {
                      showAllDetailHandler(elem);
                    }}
                  >
                    view
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      <div
        className="customerDataRecord"
        style={{ display: showHide ? "block" : "none" }}
      >
        <RxCross2
          className="cancel-btn"
          onClick={() => {
            setShowHide(!showHide);
          }}
        />
        <table>
          <thead>
            <tr>
              <th>S.N.</th>
              <th>Particular</th>
              <th>purity</th>
              <th>Rate</th>
              <th>MC</th>
              <th>Gross Weight</th>
              <th>Less Weight</th>
              <th>Net Weight</th>
              <th>Qty.</th>
              <th>Net Amt.</th>
              <th>Total MC</th>
              <th>Total</th>
              {/* <th>Date</th> */}
            </tr>
          </thead>
          <tbody>
            {userRecord &&
              userRecord.map((elem, ind) => {
                const {
                  gross,
                  grossAmt,
                  mc,
                  net,
                less,
                  particular,
                  purity,
                  rate,
                  qty
                } = elem;
                let total=0
                let totalMc=0
                let netAmt=0
                total = (((parseFloat(gross)-parseFloat(less))*(parseInt(rate) +parseInt(mc)))*parseInt(qty)).toFixed(2)
                totalMc = (((parseFloat(gross)-parseFloat(less))*(parseInt(mc)))*parseInt(qty)).toFixed(2)
                netAmt = (((parseFloat(gross)-parseFloat(less))*(parseInt(rate)))*parseInt(qty)).toFixed(2)
                return (
                  <>
                    <tr>
                      <td>{ind + 1}</td>
                      <td>{particular}</td>
                      <td>{purity}</td>
                      <td>{rate}</td>
                      <td>{mc}</td>
                      <td>{gross}</td>
                      <td>{less}</td>
                      <td>{net}</td>
                      <td>{qty}</td>
                      <td>{netAmt}</td>
                      <td>{totalMc}</td>
                      <td>{total}</td>
                      
                      {/* <td>{date}</td> */}
                    </tr>
                  </>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Database;
