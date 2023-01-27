import { PDFViewer } from '@react-pdf/renderer';
import PDFReport from './pdfGenerator';

const PdfViewer = () => {
    return (
        <PDFViewer
            width={"100%"}
            height={"100%"}>
            <PDFReport />
        </PDFViewer>
    )
};

// parent component is app.js
export default PdfViewer;