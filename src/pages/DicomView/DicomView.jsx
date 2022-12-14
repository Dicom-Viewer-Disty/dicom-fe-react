import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
//dependency component
import { Link } from "react-router-dom";
//my own component
import styles from "./DicomView.module.css";
import DashboardLayout from "../../layouts/dashboard-layout/DashboardLayout";
//framework component
import { Typography, Breadcrumbs } from "@mui/material";

// dicom
import CornerstoneViewport from "react-cornerstone-viewport";
import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import { uids } from "../../helper/uids";
import Tooltip from "@mui/material/Tooltip";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "./styles.css";
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
import { Skeleton } from "antd";

const stack1 = [];

function DicomView() {
  const [loading, setLoading] = useState(false);
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
      {loading ? (
        <Skeleton />
      ) : (
        <>
          <div className={styles.wrapper}>
            <div className={styles.topWrapper}>
              <h2 className={styles.pageTitle}>Dicom View</h2>
              <Breadcrumbs aria-label="breadcrumb" className={styles.breadcumbs}>
                <Link className={styles.breadActive} underline="hover" color="inherit" to="/dashboard">
                  Home
                </Link>
                <Typography className={styles.breadUnactive}>Dicom View</Typography>
              </Breadcrumbs>
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
              {init === true ? (
                <div className="dicom-init w-full ">
                  <div className=" flex space-x-4 items-center flex-row justify-between w-full">
                    <div className="w-full cursor-pointer flex justify-center ">
                      <div className="flex items-center justify-center w-full ">
                        <label className="flex flex-col w-full border-4 border-dashed hover:bg-gray-100 hover:border-gray-300">
                          <div className="dicom-init__inner cursor-pointer flex flex-col items-center justify-center pt-4">
                            <div className="flex flex-col items-center justify-center" style={{ height: "270px" }}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400 group-hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                              </svg>
                              <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">Upload file dicom</p>
                            </div>
                          </div>
                          <input type="file" accept=".dcm" class="opacity-0" onChange={handleInput} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="dicom-view" ref={inputRef}>
                  <CornerstoneViewport key={Math.random} tools={state.tools} imageIds={state.imageIds} imageIdIndex={state.imageIdIndex} isPlaying={state.isPlaying} frameRate={state.frameRate} activeTool={state.activeTool} />
                </div>
              )}

              <div className="dicom-info">
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
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default DicomView;
