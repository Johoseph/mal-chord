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

        chordSvg.style = "";

        canvgInstance = await Canvg.from(
          ctx,
          // TODO: Figure out how to handle width better
          chordSvg.outerHTML,
          {
            anonymousCrossOrigin: true,
          }
        );

        await canvgInstance.start();
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
          src={PDFDocument.output("datauristring", "mal-chord-poster.pdf")}
        />
      ) : (
        <div>TODO: Loading</div>
      )}
    </>
  );
};
