import { createContext, useEffect, useState } from "react";
import "./App.css";
import Axios from "axios";
import BarChart from "./BarChart";

export const DataContext = createContext();
function App() {
  const DATA_URL = "/Data.json";
  const [items, setItems] = useState([]);
  const [selectedFieldData, setSelectedFieldData] = useState();
  const fetchData = async () => {
    try {
      const { data } = await Axios.get(DATA_URL);
      setItems(data.financialRatioFieldsGroups);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <DataContext.Provider value={{ selectedFieldData }}>
    <div className="App">
      <h1 className="my-5">Financial Ratios</h1>
      <div className="container mt-3">
        <table className="table mb-0">
          <thead>
            <tr>
              <th scope="col" className="w-25 text-start">
                Details
              </th>
              <th className="text-center">Chart</th>
              <th className="text-center">2022</th>
              <th className="text-center">2021</th>
              <th className="text-center">2020</th>
              <th className="text-center">2019</th>
            </tr>
          </thead>
        </table>
        <div className="accordion" id="accordionExample">
          {items.map((item) => (
            <div className="accordion-item" key={item.groupSeqNo}>
              <h2
                className="accordion-header"
                id={`heading-${item.groupSeqNo}`}
              >
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${item.groupSeqNo}`}
                  aria-expanded="false"
                  aria-controls={`collapse-${item.groupSeqNo}`}
                >
                  {item.fieldGroupEn}
                </button>
              </h2>
              <div
                id={`collapse-${item.groupSeqNo}`}
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body p-0 ">
                  <table className="table mb-0">
                    <tbody>
                      {item.financialRatioFieldsGroupFields.map((field) => (
                        <tr key={field.nameEn}>
                          <td className="w-25 text-start fw-lighter">
                            {field.nameEn}
                          </td>
                          <td
                            className="text-center"
                            data-bs-toggle="modal"
                            data-bs-target="#chartModal"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSelectedFieldData(field);
                            }}
                          >
                            <i className="fa-solid fa-chart-simple"></i>
                          </td>
                          {["2022", "2021", "2020", "2019"].map((year) => {
                            const value = field.values.find(
                              (val) => val.year === year
                            )?.value;
                            return (
                              <td
                                key={year}
                                className="text-center"
                                style={{
                                  color: value < 0 ? "red" : "green",
                                }}
                              >
                                {value && Math.abs(value).toFixed(4)
                                  }
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="modal fade"
          id="chartModal"
          tabIndex="-1"
          aria-labelledby="chartModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {selectedFieldData && (
                  <BarChart />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DataContext.Provider>
  );
}

export default App;
