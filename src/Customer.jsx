import React, { useEffect, useState } from "react";

const Customer = () => {
  const [getData, setGetData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [searchInputField, setSearchInputField] = useState({
    name: "",
    contact: "",
  });

  const fetchData = async () => {
    const fd = await fetch("https://ladgerprojectbackend.onrender.com/customer");
    // const fd = await fetch("http://localhost:8000/customer");
    const data = await fd.json();
    const tempData = data.fetchData;
    // setGetData(data.fetchData);
    setGetData(
      tempData.filter((user, index, self) => {
        return self.findIndex((u) => u.name === user.name) === index;
      })
    );
    setSearchData(
      tempData.filter((user, index, self) => {
        return self.findIndex((u) => u.name === user.name) === index;
      })
    );
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const searchDataEventHandler = (e) => {
    const {name,contact}=searchInputField
    e.preventDefault();
    const filtered = searchData.filter((item) =>
      item.name.toLowerCase().includes(name.toLowerCase())
    );

    setSearchData(filtered)
  };
  return (
    <>
      <div className="customer-main-div">
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
        <table style={{ width: "100%" }}>
          <thead>
            <tr className="table-head">
              <th>Sr. No. </th>
              <th>Name</th>
              <th>Contact</th>
              <th>State</th>
              <th>City</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {!searchData
              ? ""
              : searchData.map((elem, ind) => {
                  return (
                    <tr className="customer-data-table">
                      <td style={{textAlign:"center"}}>{ind + 1}</td>
                      <td className="name">{elem.name}</td>
                      <td>{elem.contact}</td>
                      <td>{elem.state}</td>
                      <td>{elem.city}</td>
                      <td>{elem.address}</td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Customer;
