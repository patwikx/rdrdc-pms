import { Property, RPT, Space } from "@/types/type";
import axios from "axios";
import ExcelJS, { Workbook, Worksheet } from 'exceljs';

export const handleExportProperties = async (): Promise<void> => {
  try {
    const propertiesData = await fetchProperties();
    const workbook = await createWorkbook(propertiesData);
    await downloadWorkbook(workbook);
  } catch (error) {
    console.error('Error exporting properties:', error);
    alert('Failed to export properties. Please try again.');
  }
};

// Fetch properties from API
const fetchProperties = async (): Promise<Property[]> => {
  const response = await axios.get<Property[]>('/api/fetch-properties');
  return response.data;
};

// Create Excel workbook
const createWorkbook = async (propertiesData: Property[]): Promise<Workbook> => {
  const workbook = new Workbook();

  for (const property of propertiesData) {
    const worksheet = workbook.addWorksheet(property.propertyName || `Property ${property.id}`);
    setupWorksheet(worksheet, property);
  }

  return workbook;
};

// Setup individual worksheet
const setupWorksheet = (worksheet: Worksheet, property: Property): void => {
  setColumnWidths(worksheet);
  addTitleHeaders(worksheet);
  addPropertyDetails(worksheet, property);
  addSpacesSection(worksheet, property);
  addRPTSection(worksheet, property);
  addAttachmentsSection(worksheet, property);
};

// Set column widths
const setColumnWidths = (worksheet: Worksheet): void => {
  worksheet.columns = [
    { width: 20 },
    { width: 30 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 20 }
  ];
};

// Add title headers
const addTitleHeaders = (worksheet: Worksheet): void => {
  worksheet.mergeCells('A1:F1');
  worksheet.mergeCells('A2:F2');

  const titleCell = worksheet.getCell('A1');
  titleCell.value = "RD REALTY DEVELOPMENT CORPORATION";
  titleCell.font = { bold: true, size: 16 };
  titleCell.alignment = { horizontal: 'center' };

  const subtitleCell = worksheet.getCell('A2');
  subtitleCell.value = "Property Management System";
  subtitleCell.font = { bold: true, size: 14 };
  subtitleCell.alignment = { horizontal: 'center' };
};

const addPropertyDetails = (worksheet: Worksheet, property: Property): void => {
    worksheet.mergeCells('A3:F3');
    const headerCell = worksheet.getCell('A3');
    headerCell.value = "Property Details";
    headerCell.font = { bold: true, size: 14 };
    headerCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCCCCC' }
    };

    // Calculate the total rent revenue with a fallback for undefined values
    const totalRentRevenue = property.space?.reduce((sum, space) => sum + (space.totalSpaceRent || 0), 0) || 0;
    console.log("Total Property Rent Revenue:", totalRentRevenue);

    const propertyDetails = [
        ["Property Code", property.propertyCode],
        ["Property Name", property.propertyName],
        ["Title Number", property.titleNo],
        ["Lot Number", property.lotNo],
        ["Registered Owner", property.registeredOwner],
        ["Location", `${property.address}, ${property.city}, ${property.province}`],
        ["Property Type", property.propertyType],
        ["Leasable Area", property.leasableArea.toString()],
        ["Property Rent Revenue", totalRentRevenue.toString()]
    ];

    propertyDetails.forEach((detail, index) => {
        worksheet.getCell(`A${index + 4}`).value = detail[0];
        worksheet.getCell(`A${index + 4}`).font = { bold: true };
        worksheet.getCell(`B${index + 4}`).value = detail[1];
        
        // Optional: Set a number format for better display in Excel
        if (detail[0] === "Property Rent Revenue") {
            worksheet.getCell(`B${index + 4}`).numFmt = '$#,##0.00';
        }
    });
};

// Add spaces section
const addSpacesSection = (worksheet: Worksheet, property: Property): void => {
  const spacesRow = 12; // Assuming property details end at row 11
  addSectionHeader(worksheet, spacesRow, "Spaces");

  if (property.space && property.space.length > 0) {
    addTableHeaders(worksheet, spacesRow + 1, ["Space Number", "Space Area (sq ft.)", "Space Status", "Space Rate", "Monthly Rent"]);

    property.space.forEach((space, index) => {
      const row = worksheet.getRow(spacesRow + 2 + index);
      row.values = [space.spaceNumber, space.spaceArea, space.spaceStatus, space.spaceRate, space.totalSpaceRent];
    });
  } else {
    worksheet.mergeCells(`A${spacesRow + 1}:F${spacesRow + 1}`);
    worksheet.getCell(`A${spacesRow + 1}`).value = "No Spaces Available";
  }
};

// Add RPT section
const addRPTSection = (worksheet: Worksheet, property: Property): void => {
  const rptRow = 14 + (property.space?.length || 0); // Assuming spaces section ends 2 rows after its start
  addSectionHeader(worksheet, rptRow, "RPT");

  if (property.rpt && property.rpt.length > 0) {
    addTableHeaders(worksheet, rptRow + 1, ["Tax Dec No", "Payment Mode", "Due Date", "Status", "Custodian Remarks"]);

    property.rpt.forEach((rptItem, index) => {
      const row = worksheet.getRow(rptRow + 2 + index);
      row.values = [rptItem.TaxDecNo, rptItem.PaymentMode.toString(), rptItem.DueDate, rptItem.Status, rptItem.custodianRemarks];
    });
  } else {
    worksheet.mergeCells(`A${rptRow + 1}:F${rptRow + 1}`);
    worksheet.getCell(`A${rptRow + 1}`).value = "No RPT Data Available";
  }
};

// Add attachments section
const addAttachmentsSection = (worksheet: Worksheet, property: Property): void => {
  const attachmentsRow = 16 + (property.space?.length || 0) + (property.rpt?.length || 0); // Assuming RPT section ends 2 rows after its start
  addSectionHeader(worksheet, attachmentsRow, "Attachments");

  if (property.attachments && property.attachments.length > 0) {
    addTableHeaders(worksheet, attachmentsRow + 1, ["File"]);

    property.attachments.forEach((attachment, index) => {
      const row = worksheet.getRow(attachmentsRow + 2 + index);
      row.values = [attachment.files];
    });
  } else {
    worksheet.mergeCells(`A${attachmentsRow + 1}:F${attachmentsRow + 1}`);
    worksheet.getCell(`A${attachmentsRow + 1}`).value = "No Attachments Available";
  }
};

// Helper function to add section headers
const addSectionHeader = (worksheet: Worksheet, row: number, title: string): void => {
  worksheet.mergeCells(`A${row}:F${row}`);
  const headerCell = worksheet.getCell(`A${row}`);
  headerCell.value = title;
  headerCell.font = { bold: true, size: 14 };
  headerCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFCCCCCC' }
  };
};

// Helper function to add table headers
const addTableHeaders = (worksheet: Worksheet, row: number, headers: string[]): void => {
  headers.forEach((header, index) => {
    const cell = worksheet.getCell(row, index + 1);
    cell.value = header;
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEEEEEE' }
    };
  });
};

// Download the workbook
const downloadWorkbook = async (workbook: Workbook): Promise<void> => {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'exported_properties.xlsx');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
