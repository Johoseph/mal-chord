import { h } from "preact";
import { useEffect, useState, useRef, useCallback } from "preact/hooks";
import styled from "styled-components";
import { jsPDF } from "jspdf";
import { Canvg } from "canvg";

import { Spinner } from "components";

import MALLogo from "assets/branding/mal-chord-pdf.jpg";

const Wrapper = styled.div`
  width: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PDFViewer = styled.embed`
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const Canvas = styled.canvas`
  height: 100%;
  width: 100%;
`;

const scalePixels = (value, pageSize) => {
  switch (pageSize) {
    case "A4":
      return value * 1;
    case "A3":
      return value * 1.2;
    case "A2":
      return value * 1.4;
  }
};

const getCatLength = (endCategory) => {
  switch (endCategory) {
    case "genre":
      return endCategory.length + 1;
    case "your list status":
      return endCategory.length - 2;
    default:
      return endCategory.length;
  }
};

export const PrintingDocument = ({
  chordSvg,
  pageState,
  userName,
  startCategory,
  endCategory,
}) => {
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

    const dimensionFactor =
      canvasCurrent.width / doc.internal.pageSize.getWidth();

    const relativeImgHeight = canvasCurrent.height / dimensionFactor;
    const pageDimensions = {
      width: doc.internal.pageSize.getWidth(),
      height: doc.internal.pageSize.getHeight(),
    };

    const pageMargin = pageDimensions.width / 20;
    let totalPageHeight = pageDimensions.height;
    let topMargin = pageMargin;

    // First page
    doc.setFillColor("#07070a");
    doc.rect(0, 0, pageDimensions.width, pageDimensions.height, "F");

    // Header details
    if (pageState.headerState === "On") {
      const sz = pageState.pageSize;

      doc.setTextColor("#ffffff");

      const logoDimRatio = 2.8333;
      const logoHeight = scalePixels(15, sz);
      const logoWidth = logoDimRatio * logoHeight;

      doc.addImage(
        MALLogo,
        "PNG",
        pageMargin,
        topMargin,
        logoWidth,
        logoHeight
      );

      doc.setFontSize(scalePixels(20, sz));
      doc.text(
        `${userName}'s ${startCategory} list`,
        logoWidth + pageMargin + scalePixels(5, sz),
        pageMargin + scalePixels(10, sz)
      );

      doc.setFontSize(scalePixels(16, sz));
      doc.text(
        "mal-chord.com",
        pageDimensions.width - pageMargin,
        pageMargin + scalePixels(10, sz),
        {
          align: "right",
        }
      );

      // Category Detail
      doc.setFillColor("#2e51a2");
      doc.rect(
        pageMargin + scalePixels(16, sz),
        pageMargin + scalePixels(23, sz),
        pageDimensions.width -
          (2 * pageMargin +
            scalePixels(16, sz) +
            scalePixels(2.6, sz) * getCatLength(endCategory)),
        scalePixels(1, sz),
        "F"
      );

      doc.setFontSize(scalePixels(14, sz));
      doc.text(startCategory, 0 + pageMargin, pageMargin + scalePixels(25, sz));

      doc.text(
        endCategory,
        pageDimensions.width - pageMargin,
        pageMargin + scalePixels(25, sz),
        {
          align: "right",
        }
      );
      topMargin += scalePixels(35, sz);
    }

    doc.addImage(
      canvasCurrent,
      "JPEG",
      0,
      topMargin,
      pageDimensions.width,
      relativeImgHeight
    );

    // Additional pages (if required)
    while (topMargin + relativeImgHeight > totalPageHeight) {
      doc.addPage();

      doc.setFillColor("#07070a");
      doc.rect(0, 0, pageDimensions.width, pageDimensions.height, "F");

      doc.addImage(
        canvasCurrent,
        "JPEG",
        0,
        -totalPageHeight + topMargin,
        pageDimensions.width,
        relativeImgHeight
      );

      // Increment totalPageHeight
      totalPageHeight += pageDimensions.height;
    }

    newPDFDocument(doc);
  }, [
    pageState.pageSize,
    pageState.pageOrientation,
    pageState.headerState,
    userName,
    startCategory,
    endCategory,
  ]);

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
    let canvgInstance, timeout;

    newPDFDocument(); // Reset current PDF document
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
      {PDFDocument && (
        <PDFViewer
          type="application/pdf"
          src={URL.createObjectURL(
            PDFDocument.output("blob", "mal-chord-poster.pdf")
          )}
        />
      )}
      <Spinner />
    </Wrapper>
  );
};
