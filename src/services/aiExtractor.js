// services/aiExtractor.js

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as XLSX from "xlsx";
import { PDFDocument } from "pdf-lib";
import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addInvoice } from "../redux/invoiceSlice";
import { addCustomer } from "../redux/customerSlice";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

const prompt = `
        Analyze the given data (image, PDF, or text) and extract structured information in JSON format. The structure should adhere to the following format:
        JSON Output Structure
        {
          "invoices": [
            {
              "serial_number": "string",  // Unique identifier for the invoice
              "products": [
                {
                  "name": "string",       // Name of the product
                  "quantity": "number",   // Quantity purchased
                  "unit_price": "number", // Price per unit
                  "tax": "number",        // Applicable tax
                  "price_with_tax": "number", // Price including tax
                  "discount": "number"    // Optional, applicable discount
                }
              ],
              "customer_id": "string",     // ID linking to the customer's information
              "total_amount": "number",    // Total invoice amount including taxes[ should not be a range should be an exact number]
              "date": "string"             // Invoice date in ISO format (YYYY-MM-DD)
            }
          ],
          "customers": [
            {
              "customer_id": "string",     // Unique identifier for the customer
              "name": "string",            // Name of the customer
              "phone_number": "string",    // Contact number of the customer
              "total_purchase_amount": "number", // Total purchase amount across all invoices
              "additional_details": "object"     // Optional, any additional fields extracted for the customer
            }
          ]
        }
        Requirements
        Invoice Extraction:

        Each invoice must include a unique serial_number, an array of products, a customer_id, and other relevant details.
        Generate a customer_id if it is missing in the input data to maintain relational integrity between invoices and customers.
        Customer Extraction:

        Include a customer_id for each customer, linked to their invoices.
        Extract name, phone_number, and calculate total_purchase_amount by summing up all related invoices.
        Add any additional extracted customer information as a key-value pair under additional_details.
        Product Extraction:

        For each invoice, extract all associated products with their details such as name, quantity, unit_price, tax, price_with_tax, and optionally discount.
        Consistency:

        Ensure that relationships between invoices, customers, and products are preserved through the customer_id field.
        Note
        Provide the extracted results in a nested JSON format adhering to the structure described above.
        If any mandatory field is missing in the input data, use placeholders or generated values (e.g., random customer_id) to ensure completeness.
      `;

// const pdf2pic = require("pdf2pic"); // Install this with npm install pdf2pic
// import pdf2pic from "pdf2pic";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const textModel = genAI.getGenerativeModel({ model: "gemini-pro" });
const visionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Utility to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
  });
};

// Main extractor class
export class DataExtractor {
  // Extract data from PDF using Vision API
  async extractFromPDF(pdfFile) {
    try {
      // Convert PDF to image (first page)
      console.log("pdfFile", pdfFile);
      const pdfImage = await this.convertPDFToImage(pdfFile);
      console.log("converted to image successfully");
      // const base64Image = await fileToBase64(pdfImage);
      console.log("pdfImage", pdfImage);
      // Prepare prompt for Gemini
      const base64ImageData = pdfImage.split(",")[1];
      

      // Call Gemini Vision API
      const result = await visionModel.generateContent([
        prompt,
        {
          inlineData: { data: base64ImageData, mimeType: "image/jpeg" },
        },
      ]);

      const response = result.response;
      console.log(response.text(), "response from gemini");
      const cleanedResponse = response
        .text()
        .replace(/```json|```/g, "")
        .trim();
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error("PDF extraction error:", error);
      throw new Error("Failed to extract data from PDF");
    }
  }

  // Extract data from Excel
  async extractFromExcel(excelFile) {
    try {
      const workbook = await this.readExcelFile(excelFile);
      console.log("workbook", workbook);
      // const sheetData = await this.parseExcelSheet(workbook);
      // console.log("sheetData",sheetData);
      // Convert Excel data to text for Gemini processing
      const textData = JSON.stringify(workbook, null, 2);

      console.log("textData", textData);


      const result = await visionModel.generateContent([`${prompt} Analyze this Excel data and extract the required
        ${textData} `]);

      const response = result.response;
      console.log(response.text(), "response from gemini");
      const cleanedResponse = response
        .text()
        .replace(/```json|```/g, "")
        .trim();
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error("Excel extraction error:", error);
      throw new Error("Failed to extract data from Excel");
    }
  }

  // Extract data from Image
  async extractFromImage(imageFile) {
    try {
      const base64Image = await fileToBase64(imageFile);



      const result = await visionModel.generateContent([
        prompt,
        {
          inlineData: { data: base64Image, mimeType: imageFile.type },
        },
      ]);

      const response = result.response;
      console.log(response.text(), "response from gemini");
      const cleanedResponse = response
        .text()
        .replace(/```json|```/g, "")
        .trim();
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error("Image extraction error:", error);
      throw new Error("Failed to extract data from image");
    }
  }

  // Validation and normalization
  // validateAndNormalizeData(data) {
  //   // Schema validation
  //   const requiredFields = {
  //     invoice: ["serialNumber", "date", "totalAmount"],
  //     customer: ["name", "phoneNumber"],
  //     products: ["name", "quantity", "unitPrice", "tax"],
  //   };

  //   // Check required fields
  //   const missingFields = [];
  //   Object.entries(requiredFields).forEach(([section, fields]) => {
  //     fields.forEach((field) => {
  //       if (section === "products") {
  //         if (!data[section]?.[0]?.[field]) {
  //           missingFields.push(`products.${field}`);
  //         }
  //       } else if (!data[section]?.[field]) {
  //         missingFields.push(`${section}.${field}`);
  //       }
  //     });
  //   });

  //   if (missingFields.length > 0) {
  //     return {
  //       data,
  //       errors: {
  //         missingFields,
  //         message: "Missing required fields in extracted data",
  //       },
  //     };
  //   }

  //   // Normalize data
  //   return {
  //     data: {
  //       invoice: {
  //         ...data.invoice,
  //         totalAmount: parseFloat(data.invoice.totalAmount),
  //       },
  //       customer: {
  //         ...data.customer,
  //         phoneNumber: data.customer.phoneNumber,
  //       },
  //       products: data.products.map((product) => ({
  //         ...product,
  //         quantity: parseInt(product.quantity),
  //         unitPrice: parseFloat(product.unitPrice),
  //         tax: parseFloat(product.tax),
  //         priceWithTax:
  //           parseFloat(product.unitPrice) * (1 + parseFloat(product.tax) / 100),
  //       })),
  //     },
  //     errors: null,
  //   };
  // }

  // Helper methods
  normalizePhoneNumber(phone) {
    // Remove all non-numeric characters
    return phone.replace(/\D/g, "");
  }

  // Convert PDF to image
  async convertPDFToImage(pdfFile) {
    try {
      // Load the PDF.js library
      const pdfData = await pdfFile.arrayBuffer(); // Read the file as an ArrayBuffer
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

      // Get the first page
      const page = await pdf.getPage(1);

      // Create a canvas element to render the page
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      const viewport = page.getViewport({ scale: 2 }); // Adjust scale for quality
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Render the page onto the canvas
      await page.render({ canvasContext: context, viewport }).promise;

      // Convert the canvas to a base64 image
      const base64Image = canvas.toDataURL("image/jpeg");

      // Cleanup
      canvas.remove();

      return base64Image; // Return the base64 image string
    } catch (error) {
      console.error("Error converting PDF to image:", error);
      throw new Error("Failed to convert PDF to image");
    }
  }

  async readExcelFile(excelFile) {
    // Read the file as an ArrayBuffer
    const arrayBuffer = await excelFile.arrayBuffer();

    // Parse the ArrayBuffer
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    // Get the first sheet name
    const firstSheetName = workbook.SheetNames[0];

    // Get the first sheet
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert the sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Return the JSON data
    return jsonData;
  }

  async parseExcelSheet(workbook) {
    // Get the first sheet name
    const firstSheetName = workbook.SheetNames[0];

    // Get the first sheet
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert the sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Return the JSON data
    return jsonData;
  }
}

// Usage example in a React component
export const useDataExtraction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const extractData = async (file) => {
    try {
      setLoading(true);
      setError(null);

      const extractor = new DataExtractor();
      let extractedData;

      switch (file.type) {
        case "application/pdf":
          extractedData = await extractor.extractFromPDF(file);
          break;
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        case "application/vnd.ms-excel":
          extractedData = await extractor.extractFromExcel(file);
          break;
        case "image/jpeg":
        case "image/png":
          extractedData = await extractor.extractFromImage(file);
          break;
        default:
          throw new Error("Unsupported file type");
      }

      // if (extractedData.errors) {
      //   setError(extractedData.errors);
      //   console.error("Extraction errors:", extractedData.errors);
      //   return null;
      // }

      // Dispatch to Redux store
      // console.log("Extracted data:", extractedData.data);

      // iterate over invoices and insert every invoice
      // into the redux store
      extractedData.invoices.forEach((invoice) => {
        dispatch(addInvoice(invoice));
      });
      extractedData.customers.forEach((customer) => {
        dispatch(addCustomer(customer));
      });

      // dispatch(addInvoice(extractedData.invoices));
      // dispatch(addCustomer(extractedData.customers));


      console.log("Extracted data:", extractedData);
      return extractedData;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { extractData, loading, error };
};
