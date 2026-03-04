import React, { forwardRef, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle, Button, DialogActions } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import { getSessionUser } from "../components/functions";
import { toast } from 'react-toastify';

const QuotationPrint = forwardRef(({ customer, cartItems, totals, storage }, ref) => {
 
  const safeNum = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
  const rupee = (n) =>
    safeNum(n).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div
      ref={ref}
      style={{
        width: "80mm",
        fontFamily: "Courier New, monospace",
        fontSize: "12px",
        padding: "2mm", 
        lineHeight: 1.2,
        color: "#000",
      }}
    >

    
      <div style={{ 
        textAlign: "center", 
        fontWeight: 900,
        fontSize: "18px", 
        paddingBottom: "1.5mm", 
        marginBottom: "2mm",
        borderBottom: "1px solid #000",
        letterSpacing: "1px"
      }}>
        QUOTATION
      </div>

      <div style={{ marginBottom: "1.5mm" }}>
        <div style={{ 
          marginBottom: "1mm", 
          fontSize: "14px", 
          fontWeight: 700 
        }}>
          <strong>DATE:</strong> {new Date().toLocaleDateString("en-GB")} / {new Date().toLocaleTimeString("en-IN", { 
            hour: "2-digit", 
            minute: "2-digit",
            hour12: true 
          })}
        </div>
        <div style={{ 
          fontSize: "14px", 
          fontWeight: 700 
        }}>
         <strong>TAKEN:</strong> {storage?.Created_BY_Name || storage?.Name || "—"}
        </div>
      </div>

      {/* Info Section */}
      <div style={{ 
        borderTop: "1px solid #000",
        borderBottom: "1px solid #000",
        padding: "1mm 0",
        marginBottom: "2mm"
      }}>
        {/* Party Name */}
        <div style={{ 
          fontSize: "14px", 
          fontWeight: 800, 
          padding: "0.5mm 0",
          lineHeight: 1.1
        }}>
          {customer?.Billl_Name || customer?.Short_Name || "—"}
        </div>

        {/* Location and Phone - First Row */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between",
          padding: "0.5mm 0" 
        }}>
          <div style={{ 
            flex: 1, 
            fontSize: "14px", 
            fontWeight: 700,
            marginRight: "2mm"
          }}>
            {[customer?.Party_Location, customer?.City].filter(Boolean).join(", ") || "—"}
          </div>
          <div style={{ 
            flex: 1, 
            fontSize: "14px", 
            fontWeight: 700 
          }}>
            {customer?.Mobile_No || customer?.Land_Line || "—"}
          </div>
        </div>

        {/* Transport and Broker - Second Row */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between",
          padding: "0.5mm 0" 
        }}>
          <div style={{ 
            flex: 1, 
            fontSize: "14px", 
            fontWeight: 700,
            marginRight: "2mm"
          }}>
            {customer?.Transporter || "—"}
          </div>
          <div style={{ 
            flex: 1, 
            fontSize: "14px", 
            fontWeight: 700 
          }}>
            {customer?.Broker || "—"}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div style={{ border: "0.5px solid #000" }}>
        <table style={{ 
          width: "100%", 
          borderCollapse: "collapse" 
        }}>
          <thead>
            <tr>
              <th style={{ 
                border: "0.5px solid #000", 
                padding: "0.5mm", 
                textAlign: "center", 
                fontSize: "14px", 
                fontWeight: 800,
                background: "#f5f5f5"
              }}>RATE</th>
              <th style={{ 
                border: "0.5px solid #000", 
                padding: "0.5mm", 
                textAlign: "center", 
                fontSize: "14px", 
                fontWeight: 800,
                background: "#f5f5f5"
              }}>ITEM NAME</th>
              <th style={{ 
                border: "0.5px solid #000", 
                padding: "0.5mm", 
                textAlign: "center", 
                fontSize: "14px", 
                fontWeight: 800,
                background: "#f5f5f5"
              }}>BAGS</th>
            </tr>
          </thead>
          <tbody>
            {cartItems && cartItems.length > 0 ? (
              cartItems.map((item, i) => {
                const packWeight = parseFloat(item.Print_Name?.match(/(\d+(?:\.\d+)?)\s*KG/i)?.[1]) || 0;
                const bags = packWeight > 0 ? safeNum(item.kgs) / packWeight : 0;
                
                return (
                  <tr key={i} style={{ minHeight: "8mm" }}>
                    <td style={{ 
                      border: "0.5px solid #000", 
                      padding: "2mm 1mm",
                      textAlign: "center", 
                      verticalAlign: "middle",
                      width: "25mm",
                      fontSize: "14px",
                      fontWeight: 700
                    }}>
                      ₹{rupee(item.price)}
                    </td>
                    <td style={{ 
                      border: "0.5px solid #000", 
                      textAlign: "left", 
                      paddingLeft: "1.5mm",
                      verticalAlign: "middle",
                      width: "60mm",
                      fontSize: "14px",
                      fontWeight: 700
                    }}>{item.Print_Name}</td>
                    <td style={{ 
                      border: "0.5px solid #000", 
                      textAlign: "center", 
                      padding: "0.3mm",
                      verticalAlign: "middle",
                      width: "12mm",
                      fontSize: "14px",
                      fontWeight: 700
                    }}>{bags > 0 ? bags.toFixed(0) : "0"}</td>
                  </tr>
                );
              })
            ) : (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} style={{ minHeight: "8mm" }}>
                  <td style={{ border: "0.5px solid #000", width: "25mm" }}></td>
                  <td style={{ border: "0.5px solid #000", width: "60mm" }}></td>
                  <td style={{ border: "0.5px solid #000", width: "12mm" }}></td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      
  <div
  style={{
    background: "#f0f0f0",
    border: "1px solid #000",
    padding: "1mm",
    display: "grid",
    gridTemplateColumns: "40px 1fr 30px", 
    alignItems: "center",
    fontSize: "12px",
    fontWeight: "bold"
  }}
>

  <div style={{ textAlign: "center" }}>
    ₹{rupee(totals?.subtotal)}
  </div>

 
  <div style={{ textAlign: "center" }}>
    {cartItems?.length
      ? cartItems
          .reduce((sum, item) => sum + safeNum(item.kgs), 0)
          .toFixed(2)
      : "0.00"}{" "}
    KGS
  </div>


  <div style={{ textAlign: "center" }}>
    {cartItems?.length
      ? cartItems
          .reduce((sum, item) => {
            const packWeight =
              parseFloat(
                item.Print_Name?.match(/(\d+(?:\.\d+)?)\s*KG/i)?.[1]
              ) || 0;
            return sum + (packWeight ? safeNum(item.kgs) / packWeight : 0);
          }, 0)
          .toFixed(0)
      : "0"}
  </div>
</div>

      </div>
    </div>
  );
});

QuotationPrint.displayName = "QuotationPrint";

const PrintPreviewModal = ({ open, onClose, customer, cartItems, totals, onPrintAndSave, storage, isReprint = false }) => {
  
  const printRef = useRef();
  const [isPrinting, setIsPrinting] = useState(false);
  
  const handleReactPrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "QuotationBill",
    onBeforeGetContent: () => {
      setIsPrinting(true);
    },
    onAfterPrint: () => {
      setIsPrinting(false);
      toast.success("Print completed successfully");
    },
    onError: (err) => {
      setIsPrinting(false);
      console.error("Print Error:", err);
      toast.error("Print failed");
    },
  });
  
  const handlePrintAndSave = async () => {
    setIsPrinting(true);
    try {
      if (isReprint) {
        await handleReactPrint(); 
        toast.success("Order reprinted successfully");
        return true;
      } else {
        const result = await onPrintAndSave();
        if (result) {
          await handleReactPrint();
        }
        return result;
      }
    } catch (error) {
      console.error('Error in print operation:', error);
      toast.error('Error printing order');
      return false;
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle style={{ fontWeight: "bold", fontSize: "20px" }}>
        {isReprint ? 'Reprint Quotation' : 'Print Preview - Quotation'}
      </DialogTitle>
    
      <DialogContent>
        <QuotationPrint 
          ref={printRef} 
          customer={customer} 
          cartItems={cartItems} 
          totals={totals} 
          storage={storage} 
        />
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          variant="outlined"
          disabled={isPrinting}
        >
          Close
        </Button>
        <Button 
          variant="contained" 
          onClick={handlePrintAndSave} 
          disabled={isPrinting}
          style={{ fontWeight: "bold" }}
        >
          {isPrinting ? 'Processing...' : (isReprint ? 'Print' : 'Print & Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrintPreviewModal;