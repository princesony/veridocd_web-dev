import React, { useEffect, useState,useRef } from "react";
import FormBuilder from "./formBuilder";
import { Print } from "@mui/icons-material";
import { doc, getDoc } from "firebase/firestore";
import { database } from "../../Firebase/Firebase";
import { useProfileContext } from "../../Providers/ProfileProvider";
import { useNavigate, useParams } from "react-router-dom";
import { getUrl } from "../../Utils/StorageMethods";
import { useToastProvider } from "../../Providers/ToastProvider";
import ReactToPrint from "react-to-print";
const PrintScreen = () => {
  let [formMapped, setFormMapped] = useState([]);
  let [applicantSelfie, setApplicantSelfie] = useState();
  const [assignment, setAssignment] = useState();
  const [form, setForm] = useState();
  const { id } = useParams();
  const [response, setResponse] = useState();
  const { profile } = useProfileContext();
  const agency = profile;
  const navigate = useNavigate();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { showSuccess, showError } = useToastProvider();



  const getDetails = async () => {
    await getDoc(doc(database, "assignments/" + id, "form_data/data")).then(
      async (formData) => {
        await getDoc(
          doc(database, "assignments/" + id, "form_data/response")
        ).then(async (formResponse) => {
          console.log("formData", formData.data());
          console.log("formResponse", formResponse.data());

          await getDoc(doc(database, "assignments/", id)).then(
            async (assignment) => {
              console.log("assignment", assignment.data());

              setAssignment(assignment.data());
              setForm(formData.data());
              setResponse(formResponse.data());

              //create form json
              let formValues = await mapFormDataToResponse(formData.data(), formResponse.data());

              //attach image urls
              let imageData = await converValueToURL(formValues);

              await setFormMapped(formValues);
              setIsDataLoaded(true);
              console.log(formMapped)
            }
          )
            .catch((err) => {
              console.log(err)
            });
        })
          .catch((err) => {
            console.log(err)
          });
      }
    );
  };

  const mapFormDataToResponse = async (formData, formResponse) => {
    for (let key in formResponse) {
      const array = key.split(',');

      if (array.length == 2) {
        ((formData.data[array[0]]).fields[array[1]])['value'] = formResponse[key]
      }
      if (array.length == 4) {
        let column = (((formData.data[array[0]]).fields[array[1]]).columns[array[3]]);
        column['value'] = formResponse[key];
        let row = (((formData.data[array[0]]).fields[array[1]]).rows[array[2]]);

        if (!row.columns) {
          row['columns'] = []
        }
        row.columns.push(column);
      }
    }

    return formData.data;
  }

  const handleSort = (item, secondArg?) => {
    console.log(item)
  }

  const converValueToURL = async (data) => {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].fields.length; j++) {

        if (data[i].fields[j].widget == "image") {
          let pfpUrl;
          if (data[i].fields[j].value && data[i].fields[j].value.length) {
            [pfpUrl] = data[i].fields[j].value ? data[i].fields[j].value : null;
            if (pfpUrl !== undefined && pfpUrl !== null && pfpUrl !== "") {
              await getUrl(pfpUrl).then(async (url) => {
                data[i].fields[j].value = url;
              })
                .catch((err) => {
                  data[i].fields[j].value = pfpUrl;
                });
            }
          }
        }

        if (data[i].fields[j].widget == "geotag_image") {
          let pfpUrl;
          if (data[i].fields[j].value && data[i].fields[j].value.length) {
            [pfpUrl] = data[i].fields[j].value ? data[i].fields[j].value : null;
            if (pfpUrl !== undefined && pfpUrl !== null && pfpUrl !== "") {
              await getUrl(pfpUrl).then(async (url) => {
                data[i].fields[j].value = url;
              })
                .catch((err) => {
                  data[i].fields[j].value = pfpUrl;
                });
            }
          }
        }

        if (data[i].fields[j].widget == "signature") {
          let pfpUrl;
          if (data[i].fields[j].value) {
            pfpUrl = data[i].fields[j].value;
            if (pfpUrl !== undefined && pfpUrl !== null && pfpUrl !== "") {
              await getUrl(pfpUrl).then(async (url) => {
                data[i].fields[j].value = url;
              })
                .catch((err) => {
                  data[i].fields[j].value = pfpUrl;
                });
            }
          }
        }

        if (data[i].fields[j].widget == "file") {
          let pfpUrl;
          if (data[i].fields[j].value && data[i].fields[j].value.length) {
            [pfpUrl] = data[i].fields[j].value ? data[i].fields[j].value : null;

            if (pfpUrl !== undefined && pfpUrl !== null && pfpUrl !== "") {
              await getUrl(pfpUrl).then(async (url) => {
                data[i].fields[j].value = url;
              })
                .catch((err) => {
                  data[i].fields[j].value = pfpUrl;
                });;
            }
          }
        }

        if (data[i].fields[j].widget == "toggle-input") {
          let toggleValue;
          if (data[i].fields[j].value) {
            toggleValue = data[i].fields[j].value ? "yes" : "No";
            data[i].fields[j].value = toggleValue;
          }
        }

      }
    }
    return data;
  }


  const componentRef = useRef();  


  useEffect(() => {
    getDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 

  return form && assignment && isDataLoaded ? (
    <div>
      <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
      <ReactToPrint
  trigger={() => <Print />}
  content={() => componentRef.current}
  bodyClass="print-agreement"
/>
      </div>

      <div id="printablediv" ref={componentRef}>
        <h1 style={{ backgroundColor: "#C00000",   color: "white" }}>
          {assignment.document_type}
        </h1>

        <div style={{}}>
          <div>
            <div style={{
              fontSize: "25px",
              fontWeight: "800",
              padding: "0 0 15px 0",
              marginLeft:"11px"

            }}>{form.name}</div>
            {formMapped.map((item, index) => (
              <div>
                <div style={{ border: "1px solid black" }}>
                  <div onClick={() => handleSort(item)} key={index}
                    style={{
                      backgroundColor: "#002060",
                      color: "white", padding: "3px 10px",
                      borderBottom: "1px solid black",
                      fontWeight: "800",
                      fontSize: "20px"
                    }}>
                    {item.name}
                  </div>
                  <div style={{}}>

                    {item.fields.map((item2) => (
                      <div style={{ borderBottom: "1px solid black", width: "100%", display: "flex" }}>
                        <div style={{ width: "35%", padding: "3px 10px", display: "inline-block", fontWeight: "800" }}>
                          {item2.label}
                        </div>
                        <div onClick={() => handleSort(item2)} style={{ width: "65%", borderLeft: "1px solid black", display: "inline-block" }}>
                          {item2.widget !== "table" &&
                            item2.widget !== "dropdown" &&
                            item2.widget !== "image" &&
                            item2.widget !== "signature" &&
                            item2.widget !== "geotag_image" &&
                            item2.widget !== "file" &&
                            <div style={{ padding: "3px 10px" }}>
                              {item2.value}
                            </div>
                          }

                          {item2.widget == "dropdown" &&
                            <div style={{ padding: "3px 10px" }}>
                              {item2.value.value}
                            </div>
                          }

                          {item2.widget == "image" &&
                            <div style={{ padding: "3px 10px", display: "flex" }}>
                              {/* {getImageUrl(item2.value)} */}

                              <img style={{ height: "200px" }} src={item2.value}></img>
                            </div>
                          }

                          {item2.widget == "signature" &&
                            <div style={{ padding: "3px 10px", display: "flex" }}>
                              {/* {getImageUrl(item2.value)} */}

                              <img style={{ height: "50px" }} src={item2.value}></img>
                            </div>
                          }

                          {item2.widget == "geotag_image" &&
                            <div style={{ padding: "3px 10px", display: "flex" }}>
                              {/* {getImageUrl(item2.value)} */}

                              <img style={{ height: "200px" }} src={item2.value}></img>
                            </div>
                          }

                          {item2.widget == "file" &&
                            <div style={{ padding: "3px 10px", display: "flex" }}>
                              {/* {getImageUrl(item2.value)} */}

                              <a href={item2.value} target="_blank">{item2.label}</a>
                            </div>
                          }

                          {item2.widget.length == "table" &&
                            <div >
                              {item2.rows && item2.rows.map((item3) => (
                                <div style={{ borderBottom: "1px solid black", width: "100%", }}>
                                  <div style={{
                                    backgroundColor: "#8d8d8d",
                                    color: "white",
                                    width: "100%",
                                    display: "inline-block",
                                    fontWeight: "800",
                                    borderBottom: "1px solid black",
                                  }}>
                                    <div style={{
                                      padding: "3px 10px"
                                    }}>
                                      {item3.label}
                                    </div>
                                  </div>
                                  {item3.columns.length && item3.columns.map((item4) => (
                                    <div style={{ borderBottom: "1px solid black", display: "flex" }}>
                                      <div style={{ width: "35%", padding: "3px 10px", display: "inline-block", fontWeight: "800" }}>
                                        {item4.label}
                                      </div>
                                      <div onClick={() => handleSort(item4)}
                                        style={{
                                          width: "65%",
                                          padding: "3px 10px",
                                          borderLeft: "1px solid black",
                                          display: "inline-block"
                                        }}>
                                        {item4.value}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          }


                        </div>
                      </div>
                    ))}

                  </div>
                </div>

                <br></br>
                <br></br>

              </div>
            ))}



          </div>
        </div>

        <br></br>

      </div>
    </div >
  ) : (
    <div style={{ display: "flex", justifyContent: "center" }}><h3>Loading...</h3></div>
  );
};

export default PrintScreen;
