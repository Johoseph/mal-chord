import { h } from "preact";
import styled from "styled-components";
import { jsPDF } from "jspdf";
import Canvg from "canvg";

import { useEffect, useState, useRef, useCallback } from "preact/hooks";

const PDFViewer = styled.embed`
  width: 100%;
  height: 100%;
`;

const Canvas = styled.canvas`
  height: 100%;
  width: 100%;
  display: none;
`;

export const PrintingDocument = ({ chordSvg }) => {
  const [PDFDocument, newPDFDocument] = useState();

  let canvasRef = useRef();

  const generatePDF = useCallback(() => {
    const doc = new jsPDF();

    doc.setProperties({
      title: "MAL Chord - Printable Poster",
      subject: "A printable PDF of current MAL Chord selection.",
      creator: "https://github.com/Johoseph",
    });

    const canvasCurrent = canvasRef.current;

    doc.setFillColor("#07070a");
    doc.rect(
      0,
      0,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight(),
      "F"
    );

    doc.addImage(
      canvasRef.current,
      "JPEG",
      0,
      10,
      doc.internal.pageSize.getWidth(),
      canvasCurrent.height /
        (canvasCurrent.width / doc.internal.pageSize.getWidth())
    );

    newPDFDocument(doc);
  }, []);

  const generateCanvas = useCallback(
    async (canvgInstance) => {
      if (chordSvg && canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");

        canvgInstance = await Canvg.from(
          ctx,
          // Width should be portrait/landscape width (to figure out)
          `<svg width="1437" height="40">
          <g id="start-nodes">
            <image
            href="https://api-cdn.myanimelist.net/images/anime/1704/106947.jpg"
            x="72.85"
            y="1"
            width="40"
            height="40"
          />
          </g>
          <g id="end-nodes">
            <rect
              width="40"
              height="40"
              x="1325.15"
              y="0"
              class="listener-ignore hlp-9 top-10 forceY left-10"
              id="hlp-9"
              style="fill: rgb(31, 119, 180); cursor: pointer"
            ></rect>
          </g>
          <g id="links">
            <g>
              <path
                d="M112.85,1C800.3014285714286,1 597.7700000000001,0 1325.15,0L1325.15,40C637.6985714285715,40 840.23,41 112.85,41L112.85,1"
                fill="#1f77b4"
                opacity="0.5"
                id="0"
              ></path>
            </g>
          </g>
          <g id="highlighted-links"></g>
          <g style="font: 10px sans-serif; fill: rgb(255, 255, 255)">
            <text
              x="117.85"
              y="21"
              dy="0.35em"
              text-anchor="start"
              style="font-size: 13.3333px"
            >
              Demon Slayer -Kimetsu no Yaiba- The Movie: Mugen Train
            </text>
          </g>
          <g style="font: 10px sans-serif; fill: rgb(255, 255, 255)">
            <text
              x="1320.15"
              y="20"
              dy="0.35em"
              text-anchor="end"
              style="font-size: 13.3333px"
            >
              10
            </text>
          </g>
        </svg>
        `,
          {
            anonymousCrossOrigin: true,
          }
        );

        canvgInstance.start();
      }
    },
    [chordSvg]
  );

  useEffect(() => {
    let canvgInstance;
    generateCanvas(canvgInstance);
    generatePDF();
    return () => canvgInstance?.stop();
  }, [generateCanvas, generatePDF]);

  return (
    <>
      <Canvas ref={canvasRef} />
      {PDFDocument ? (
        <PDFViewer
          type="application/pdf"
          src={PDFDocument.output("datauristring")}
        />
      ) : (
        <div>TODO: Loading</div>
      )}
    </>
  );
};
