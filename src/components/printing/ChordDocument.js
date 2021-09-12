import { h } from "preact";
import styled from "styled-components";
import { jsPDF } from "jspdf";

import { useEffect, useState } from "preact/hooks";

const PDFViewer = styled.embed`
  width: 100%;
  height: 100%;
`;

export const ChordDocument = () => {
  const [document, newDocument] = useState();

  useEffect(() => {
    const doc = new jsPDF();

    doc.setProperties({
      title: "Test title",
    });

    doc.text("Hello World!", 10, 10);

    newDocument(doc);
  }, []);

  return (
    <PDFViewer type="application/pdf" src={document?.output("datauristring")} />
  );
};
