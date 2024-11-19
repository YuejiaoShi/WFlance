import { generateInvoicePDF } from "../services/pdfService.js";
import fs from "fs";
import ProjectService from "../services/projectService.js";

export const generateInvoice = async (req, res) => {
  try {
    const project = await ProjectService.getProjectById(req.params.id);

    const invoiceData = {
      invoiceNumber: "INV-ID-" + project.id,
      date: new Date().toISOString().split("T")[0],
      items: [
        { description: project.title, quantity: 1, price: project.budget },
      ],
      total: project.budget,
    };

    const filePath = await generateInvoicePDF(invoiceData);

    res.setHeader("Content-Type", "application/pdf");
    // eslint-disable-next-line quotes
    res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"');
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("end", () => {
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).json({ error: "Failed to generate invoice" });
  }
};
