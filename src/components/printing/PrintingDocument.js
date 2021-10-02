import { h } from "preact";
import styled from "styled-components";
import { jsPDF } from "jspdf";
import Canvg from "canvg";

import { useEffect, useState, useRef, useCallback } from "preact/hooks";

const Wrapper = styled.div`
  width: 70%;
`;

const PDFViewer = styled.embed`
  width: 100%;
  height: 100%;
`;

const Canvas = styled.canvas`
  height: 100%;
  width: 100%;
`;

export const PrintingDocument = ({ chordSvg, pageState }) => {
  const [PDFDocument, newPDFDocument] = useState();

  let canvasRef = useRef();

  const generatePDF = useCallback(() => {
    const doc = new jsPDF({
      format: pageState.pageSize,
      orientation: pageState.pageOrientation,
    });

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
      canvasCurrent,
      "JPEG",
      0,
      10,
      doc.internal.pageSize.getWidth(),
      canvasCurrent.height /
        (canvasCurrent.width / doc.internal.pageSize.getWidth())
    );

    newPDFDocument(doc);
  }, [pageState.pageSize, pageState.pageOrientation]);

  const generateCanvas = useCallback(
    async (canvgInstance) => {
      if (chordSvg && canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");

        chordSvg.style = "";

        canvgInstance = await Canvg.from(ctx, chordSvg.outerHTML, {
          anonymousCrossOrigin: true,
        });

        await canvgInstance.start();
      }
    },
    [chordSvg]
  );

  useEffect(() => {
    let canvgInstance;
    let timeout;

    generateCanvas(canvgInstance);

    // Ensure canvgInstance restarts
    timeout = setTimeout(() => {
      generatePDF();
    }, 500);

    return () => {
      canvgInstance?.stop();
      clearTimeout(timeout);
    };
  }, [generateCanvas, generatePDF]);

  const observeCanvas = useCallback(() => {
    const currentStyle = canvasRef.current.style;
    if (
      currentStyle.display != "none" &&
      currentStyle.getPropertyPriority("display") != "important"
    )
      currentStyle.setProperty("display", "none", "important");
  }, []);

  // Prevent changing the display on canvas element as much as possible
  useEffect(() => {
    let observer;
    if (canvasRef.current) {
      observer = new MutationObserver(observeCanvas);
      observer.observe(canvasRef.current, {
        attributes: true,
        attributeFilter: ["style"],
      });
    }
    return () => observer.disconnect();
  }, [observeCanvas]);

  return (
    <Wrapper>
      <Canvas ref={canvasRef} style={{ display: "none" }} />
      {PDFDocument ? (
        <PDFViewer
          type="application/pdf"
          src={URL.createObjectURL(
            PDFDocument.output("blob", "mal-chord-poster.pdf")
          )}
          // onLoad={() => console.log("TODO:!")}
        />
      ) : (
        <div>TODO: Loading</div>
      )}
    </Wrapper>
  );
};
