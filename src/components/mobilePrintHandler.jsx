import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const MobilePrintHandler = ({ content, customer, cartItems, totals, storage, onClose }) => {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "QuotationBill",
    pageStyle: `
      @page { size: 80mm auto; margin: 0; }
      body { margin: 0; padding: 0; background: white; }
      @media print {
        .print-button { display: none !important; }
      }
    `,
    onAfterPrint: () => {
      toast.success("Print completed");
      onClose();
    },
    onPrintError: (error) => {
      console.error("Print error:", error);
      // Fallback: open in new window
      const html = buildPrintHtml(customer, cartItems, totals, storage);
      const win = window.open();
      win.document.write(html);
      win.document.close();
      win.print();
    },
  });

  return (
    <div>
      <div style={{ display: 'none' }}>
        <div ref={printRef}>
          <QuotationPrint
            customer={customer}
            cartItems={cartItems}
            totals={totals}
            storage={storage}
          />
        </div>
      </div>
      <button 
        onClick={handlePrint}
        style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '15px 30px',
          background: '#4a2c1a',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          zIndex: 10000,
        }}
      >
        🖨️ Print Receipt
      </button>
    </div>
  );
};