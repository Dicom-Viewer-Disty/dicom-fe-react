import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
//dependency component
import { Link, useLocation, useHistory, useParams } from "react-router-dom";
//my own component
import styles from "./DetailPatient.module.css";
import DashboardLayout from "../../../layouts/dashboard-layout/DashboardLayout";
import { BASE_API_URL } from "../../../constant/url";
import { logout } from "../../../utils/auth";
//framework component

import { Typography, Breadcrumbs } from "@mui/material";
import { Image, Skeleton, message } from "antd";
import { FaUserAlt } from "react-icons/fa";
import { DefaultAvatar } from "../../../assets/assets";
//var

// dicom
// dicom
import "./style.css";
import CornerstoneViewport from "react-cornerstone-viewport";
import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import { uids } from "../../../helper/uids";
import Tooltip from "@mui/material/Tooltip";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
// mui
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

// icons
import { GoScreenNormal } from "react-icons/go";
import { HiColorSwatch } from "react-icons/hi";
import { TbZoomPan } from "react-icons/tb";
import { MdOutlinePanTool } from "react-icons/md";
import { TfiRuler, TfiRulerAlt2 } from "react-icons/tfi";
import { RiRuler2Fill } from "react-icons/ri";
import { FaRegHandRock } from "react-icons/fa";
import { TbEraser } from "react-icons/tb";
import { AiOutlineUpload, AiOutlineDownload } from "react-icons/ai";

function DetailPatient(props) {
  const [detail, setDetail] = useState({});
  const [dicomFile, setDicomFile] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  // dicom

  const [stack1, setStack1] = useState([]);
  const history = useHistory();
  const inputRef = useRef(null);
  const [typeColor, setTypeColor] = useState("");
  const columns = [
    { id: "name", label: "Tag", minWidth: 170 },
    { id: "code", label: "Value", minWidth: 100 },
  ];

  const [val, setVal] = useState([]);
  const [rows, setRows] = useState([]);
  const [init, setInit] = useState(true);
  const [local, setLocal] = useState();
  const [mode, setMode] = useState("");
  const [state, setState] = useState({
    activeViewportIndex: 0,
    viewports: [0],
    tools: [
      // Mouse
      {
        name: "Wwwc",
        mode: "active",
        modeOptions: { mouseButtonMask: 1 },
      },
      {
        name: "Normal",
        mode: "active",
        modeOptions: { mouseButtonMask: 1 },
      },
      {
        name: "Zoom",
        mode: "active",
        modeOptions: { mouseButtonMask: 2 },
      },
      {
        name: "Pan",
        mode: "active",
        modeOptions: { mouseButtonMask: 4 },
      },
      "Length",
      "Angle",
      "Bidirectional",
      "FreehandRoi",
      "Eraser",
      // Scroll
      { name: "StackScrollMouseWheel", mode: "active" },
      // Touch
      { name: "PanMultiTouch", mode: "active" },
      { name: "ZoomTouchPinch", mode: "active" },
      { name: "StackScrollMultiTouch", mode: "active" },
    ],
    imageIds: stack1,
    // FORM
    activeTool: "Normal",
    imageIdIndex: 0,
    isPlaying: false,
    frameRate: 22,
  });

  console.log(id);

  useEffect(() => {
    var config = {
      method: "get",
      url: `http://localhost:3000/api/v1/patient/${id}`,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setDetail(response.data);
        let tempDicoms = [];
        response.data.dicoms.forEach((element) => {
          console.log(element.dicomFile);
          tempDicoms = [...tempDicoms, `dicomweb://localhost:3000${element.dicomFile}`];
        });
        console.log(tempDicoms);
        setStack1(tempDicoms);
        console.log(stack1);
        console.log(state);
        setState({
          ...state,
          imageIds: tempDicoms,
        });
        console.log(state);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleUploadDicom = (e) => {
    console.log(e.target.files[0]);
    var dataBody = new FormData();
    dataBody.append("dicomFile", e.target.files[0]);
    dataBody.append("patienId", id);

    var config = {
      method: "post",
      url: "http://localhost:3000/api/v1/dicom",
      data: dataBody,
    };

    axios(config)
      .then(function (response) {
        alert("upload file dicom berhasil");
      })
      .catch(function (error) {
        console.log(error);
        alert("upload file dicom gagal");
      });
  };

  // dicom
  const handleInput = (e) => {
    const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(e.target.files[0]);
    setState({ ...state, imageIds: [imageId] });
    setInit(false);
    console.log(e);
    console.log(state);
    console.log(typeof imageId);

    // more info
    cornerstone.loadImage(imageId).then(
      function (image) {
        console.log(image);

        // important

        function formatData(data) {
          return data.substring(0, 4) + "-" + data.substring(4, 6) + "-" + data.substring(6);
        }

        function readTagString(image, tag) {
          let tagValue = image.data.string(tag);
          if (tagValue === undefined) {
            return "Unknown";
          } else {
            return tagValue;
          }
        }

        function readTagStringID(image, tag) {
          let tagValue = image.data.string(tag);
          if (tagValue === undefined) {
            return "Unknown";
          } else {
            return tagValue + " [" + uids[tagValue] + "]";
          }
        }

        function readTagUint16(image, tag) {
          let tagValue = image.data.uint16(tag);
          if (tagValue === undefined) {
            return "Unknown";
          } else {
            return tagValue;
          }
        }

        // 18
        setVal(val.push(readTagUint16(image, "x00020000")));
        setVal(val.push(readTagUint16(image, "x00020001")));
        setVal(val.push(readTagStringID(image, "x00020002")));
        setVal(val.push(readTagString(image, "x00020003")));
        setVal(val.push(readTagStringID(image, "x00020010")));
        setVal(val.push(readTagString(image, "x00020012")));
        setVal(val.push(readTagString(image, "x00020013")));
        setVal(val.push(readTagString(image, "x00020016")));
        setVal(val.push(readTagString(image, "x00080005")));
        setVal(val.push(readTagString(image, "x00080008")));
        setVal(val.push(readTagStringID(image, "x00080016")));
        setVal(val.push(readTagString(image, "x00080018")));
        setVal(val.push(readTagString(image, "x00080020") + " [" + formatData(readTagString(image, "x00080020")) + "]"));
        setVal(val.push(readTagString(image, "x00080021") + " [" + formatData(readTagString(image, "x00080021")) + "]"));
        setVal(val.push(readTagString(image, "x00080022") + " [" + formatData(readTagString(image, "x00080022")) + "]"));
        setVal(val.push(readTagString(image, "x00080023") + " [" + formatData(readTagString(image, "x00080023")) + "]"));
        setVal(val.push(readTagString(image, "x00080030")));
        setVal(val.push(readTagString(image, "x00080031")));
        console.log(val);
        setRows([
          { name: "(0002,0000) File Meta Information Group Length", code: val.length !== 0 ? val[0] : "-" },
          { name: "(0002,0001) File Meta Information Version", code: val.length !== 0 ? val[1] : "-" },
          { name: "(0002,0002) Media Storage SOP Class UID", code: val.length !== 0 ? val[2] : "-" },
          { name: "(0002,0003) Media Storage SOP Instance UID", code: val.length !== 0 ? val[3] : "-" },
          { name: "(0002,0010) Transfer Syntax UID", code: val.length !== 0 ? val[4] : "-" },
          { name: "(0002,0012) Implementation Class UID", code: val.length !== 0 ? val[5] : "-" },
          { name: "(0002,0013) Implementation Version Name", code: val.length !== 0 ? val[6] : "-" },
          { name: "(0002,0016) Source Application Entity Title", code: val.length !== 0 ? val[7] : "-" },
          { name: "(0008,0005) Specific Character Set", code: val.length !== 0 ? val[8] : "-" },
          { name: "(0008,0008) Image Type", code: val.length !== 0 ? val[9] : "-" },
          { name: "(0008,0016) SOP Class UID", code: val.length !== 0 ? val[10] : "-" },
          { name: "(0008,0018) SOP Instance UID", code: val.length !== 0 ? val[11] : "-" },
          { name: "(0008,0020) Study Date", code: val.length !== 0 ? val[12] : "-" },
          { name: "(0008,0021) Series Date", code: val.length !== 0 ? val[13] : "-" },
          { name: "(0008,0022) Acquisition Date", code: val.length !== 0 ? val[14] : "-" },
          { name: "(0008,0023) Content Date", code: val.length !== 0 ? val[15] : "-" },
          { name: "(0008,0030) Study Time", code: val.length !== 0 ? val[16] : "-" },
          { name: "(0008,0031) Series Time", code: val.length !== 0 ? val[17] : "-" },
        ]);
      },

      function (err) {
        alert(err);
      }
    );
  };

  // download/export
  const exportDicom = () => {
    html2canvas(inputRef.current).then((canvas) => {
      // fix pdf for lean canvas
      let imgData = canvas.toDataURL("image/png");
      let imgWidth = 210;
      let pageHeight = 295;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let doc = new jsPDF("p", "mm");
      let position = 10; // give some top padding to first page
      doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10; // top padding for other pages
        doc.addPage();
        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save("dicom.pdf");
    });
  };

  console.log(val);

  return (
    <DashboardLayout>
      <div className={styles.wrapper}>
        <div className={styles.topWrapper}>
          <h2 className={styles.pageTitle}>Detail Pasien</h2>
          <Breadcrumbs aria-label="breadcrumb" className={styles.breadcumbs}>
            <Link className={styles.breadActive} underline="hover" color="inherit" to="/dashboard">
              Home
            </Link>
            <Link className={styles.breadActive} underline="hover" color="inherit" to="/list-user">
              Pasien
            </Link>
            <Typography className={styles.breadUnactive}>Detail Pasien</Typography>
          </Breadcrumbs>
        </div>
      </div>
      {loading ? (
        <Skeleton />
      ) : (
        <div className={styles.detailContainer}>
          <div className={styles.container}>
            <div className={styles.leftContainer}>
              <div className={styles.profile}>
                <div className={styles.imageBoxProfile}>
                  <Image src={detail.profileImage} className={styles.imageItemProfile} />
                </div>
                <div className={styles.topProfileText}>
                  <h5 className={styles.name}>{detail.name}</h5>
                  <p className={styles.city}>No Rekam Medis : {detail.medicalRecordNumber} </p>
                </div>
              </div>
              <div className={styles.mainDetail}>
                <div className={styles.mainUserDetail}>
                  <div className={styles.mainTitle}>
                    <FaUserAlt className={styles.mainTitleIcon} />
                    <h4 className={styles.mainTitleText}>Data Diri Pasien</h4>
                  </div>
                  <div className={styles.mainDetailData}>
                    <div className={styles.mainLeftData}>
                      <p className={styles.titleDetail}>Jenis Kelamin</p>
                      <p className={styles.titleDetail}>Tanggal Lahir</p>
                      <p className={styles.titleDetail}>Alamat</p>
                      <p className={styles.titleDetail}>Email</p>
                      <p className={styles.titleDetail}>No Whatsapp</p>
                      <p className={styles.titleDetail}>Penyakit</p>
                      <p className={styles.titleDetail}>Catatan</p>
                    </div>
                    <div className={styles.mainRightData}>
                      <p className={styles.textDetail}>: {detail.gender}</p>
                      <p className={styles.textDetail}>: {detail.birthDate.slice(0, 10)}</p>
                      <p className={styles.textDetail}>: {detail.address}</p>
                      <p className={styles.textDetail}>: {detail.email}</p>
                      <p className={styles.textDetail}>: {detail.phoneNumber}</p>
                      <p className={styles.textDetail}>: {detail.disease}</p>
                      <p className={styles.textDetail}>: {detail.note}</p>
                    </div>
                  </div>
                </div>
                <div className={styles.mainUserDetail}>
                  <div className={styles.mainTitle}>
                    <FaUserAlt className={styles.mainTitleIcon} />
                    <h4 className={styles.mainTitleText}>File Dicom</h4>
                  </div>
                  <div className={styles.mainDetailDataDicom}>
                    <input type="file" name="" id="" accept=".dcm" onChange={handleUploadDicom} />
                    <div>
                      {detail.dicoms.map((item) => {
                        return (
                          <div>
                            <p>{item.dicomFile.slice(8)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* dicom */}
          <div className="dicom-wrapper">
            {/* OPTION FORM */}
            <div className="dicom-menu">
              {typeColor === "wwwc" ? (
                <Tooltip title="Wwwc" placement="right-start">
                  <button
                    style={{ backgroundColor: "#7e3af2" }}
                    onClick={() => {
                      setState({ ...state, activeTool: "Wwwc" });
                      setTypeColor("");
                    }}
                    className="menu-card"
                  >
                    <HiColorSwatch className="menu-card__icon" />
                  </button>
                </Tooltip>
              ) : (
                <Tooltip title="Wwwc" placement="right-start">
                  <button
                    onClick={() => {
                      setState({ ...state, activeTool: "Wwwc" });
                      setTypeColor("wwwc");
                    }}
                    className="menu-card"
                  >
                    <HiColorSwatch className="menu-card__icon" />
                  </button>
                </Tooltip>
              )}

              {typeColor === "zoom" ? (
                <Tooltip title="Zoom" placement="right-start">
                  <button
                    style={{ backgroundColor: "#7e3af2" }}
                    onClick={() => {
                      setState({ ...state, activeTool: "Normal" });
                      setTypeColor("");
                    }}
                    className="menu-card"
                  >
                    <TbZoomPan className="menu-card__icon" />
                  </button>
                </Tooltip>
              ) : (
                <Tooltip title="Zoom" placement="right-start">
                  <button
                    onClick={() => {
                      setState({ ...state, activeTool: "Zoom" });
                      setTypeColor("zoom");
                    }}
                    className="menu-card"
                  >
                    <TbZoomPan className="menu-card__icon" />
                  </button>
                </Tooltip>
              )}

              {typeColor === "pan" ? (
                <Tooltip title="Pan" placement="right-start">
                  <button
                    style={{ backgroundColor: "#7e3af2" }}
                    onClick={() => {
                      setState({ ...state, activeTool: "Pan" });
                      setTypeColor("");
                    }}
                    className="menu-card"
                  >
                    <MdOutlinePanTool className="menu-card__icon" />
                  </button>
                </Tooltip>
              ) : (
                <Tooltip title="Pan" placement="right-start">
                  <button
                    onClick={() => {
                      setState({ ...state, activeTool: "Pan" });
                      setTypeColor("pan");
                    }}
                    className="menu-card"
                  >
                    <MdOutlinePanTool className="menu-card__icon" />
                  </button>
                </Tooltip>
              )}

              {typeColor === "length" ? (
                <Tooltip title="Length" placement="right-start">
                  <button
                    style={{ backgroundColor: "#7e3af2" }}
                    onClick={() => {
                      setState({ ...state, activeTool: "Normal" });
                      setTypeColor("");
                    }}
                    className="menu-card"
                  >
                    <TfiRuler className="menu-card__icon" />
                  </button>
                </Tooltip>
              ) : (
                <Tooltip title="Length" placement="right-start">
                  <button
                    onClick={() => {
                      setState({ ...state, activeTool: "Length" });
                      setTypeColor("length");
                    }}
                    className="menu-card"
                  >
                    <TfiRuler className="menu-card__icon" />
                  </button>
                </Tooltip>
              )}

              {typeColor === "angle" ? (
                <Tooltip title="Angle" placement="right-start">
                  <button
                    style={{ backgroundColor: "#7e3af2" }}
                    onClick={() => {
                      setState({ ...state, activeTool: "Normal" });
                      setTypeColor("");
                    }}
                    className="menu-card"
                  >
                    <TfiRulerAlt2 className="menu-card__icon" />
                  </button>
                </Tooltip>
              ) : (
                <Tooltip title="Angle" placement="right-start">
                  <button
                    onClick={() => {
                      setState({ ...state, activeTool: "Angle" });
                      setTypeColor("angle");
                    }}
                    className="menu-card"
                  >
                    <TfiRulerAlt2 className="menu-card__icon" />
                  </button>
                </Tooltip>
              )}

              {typeColor === "bidirectional" ? (
                <Tooltip title="Bidirectional" placement="right-start">
                  <button
                    style={{ backgroundColor: "#7e3af2" }}
                    onClick={() => {
                      setState({ ...state, activeTool: "Normal" });
                      setTypeColor("");
                    }}
                    className="menu-card"
                  >
                    <RiRuler2Fill className="menu-card__icon" />
                  </button>
                </Tooltip>
              ) : (
                <Tooltip title="Bidirectional" placement="right-start">
                  <button
                    onClick={() => {
                      setState({ ...state, activeTool: "Bidirectional" });
                      setTypeColor("bidirectional");
                    }}
                    className="menu-card"
                  >
                    <RiRuler2Fill className="menu-card__icon" />
                  </button>
                </Tooltip>
              )}

              {typeColor === "freehand" ? (
                <Tooltip title="Freehand" placement="right-start">
                  <button
                    style={{ backgroundColor: "#7e3af2" }}
                    onClick={() => {
                      setState({ ...state, activeTool: "Normal" });
                      setTypeColor("");
                    }}
                    className="menu-card"
                  >
                    <FaRegHandRock className="menu-card__icon" />
                  </button>
                </Tooltip>
              ) : (
                <Tooltip title="Freehand" placement="right-start">
                  <button
                    onClick={() => {
                      setState({ ...state, activeTool: "FreehandRoi" });
                      setTypeColor("freehand");
                    }}
                    className="menu-card"
                  >
                    <FaRegHandRock className="menu-card__icon" />
                  </button>
                </Tooltip>
              )}

              {typeColor === "eraser" ? (
                <Tooltip title="Eraser" placement="right-start">
                  <button
                    style={{ backgroundColor: "#7e3af2" }}
                    onClick={() => {
                      setTypeColor("");
                      setState({ ...state, activeTool: "Normal" });
                    }}
                    className="menu-card"
                  >
                    <TbEraser className="menu-card__icon" />
                  </button>
                </Tooltip>
              ) : (
                <Tooltip title="Eraser" placement="right-start">
                  <button
                    onClick={() => {
                      setTypeColor("eraser");
                      setState({ ...state, activeTool: "Eraser" });
                    }}
                    className="menu-card"
                  >
                    <TbEraser className="menu-card__icon" />
                  </button>
                </Tooltip>
              )}

              <Tooltip title="Upload File" placement="right-start">
                <div>
                  <label for="file-upload" className="custom-file-upload">
                    <AiOutlineUpload className="menu-card__icon" />
                  </label>
                  <input id="file-upload" accept=".dcm" type="file" onChange={handleInput} />
                </div>
              </Tooltip>

              <Tooltip title="Download PDF" placement="right-start">
                <button onClick={exportDicom} className="menu-card">
                  <AiOutlineDownload className="menu-card__icon" />
                </button>
              </Tooltip>

              {/* <input type="file" onChange={handleInput} name="" id="" class="custom-file-input" /> */}
            </div>

            <div className="dicom-view" ref={inputRef}>
              <CornerstoneViewport key={Math.random} tools={state.tools} imageIds={state.imageIds} imageIdIndex={state.imageIdIndex} isPlaying={state.isPlaying} frameRate={state.frameRate} activeTool={state.activeTool} />
            </div>

            {/* <div className="dicom-info">
              <Paper className="dicom-table">
                <TableContainer sx={{ maxHeight: "76vh", maxWidth: "100%" }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell key={Math.random()} align={column.align} style={{ minWidth: column.minWidth }}>
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => {
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align} style={{ fontSize: "12px" }}>
                                  {column.format && typeof value === "number" ? column.format(value) : value}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </div> */}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default DetailPatient;
