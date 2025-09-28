import * as DocumentPicker from "expo-document-picker";
import Papa from "papaparse";
import { CSVData } from "../types";

export const pickCSVFile = async (): Promise<string | null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "text/csv",
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return null;
    }

    return result.assets[0].uri;
  } catch (error) {
    console.error("Error picking CSV file:", error);
    return null;
  }
};

export const parseCSV = async (uri: string): Promise<CSVData | null> => {
  try {
    const response = await fetch(uri);
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(
              new Error("CSV parsing failed: " + results.errors[0].message)
            );
            return;
          }

          const data = results.data as any[];

          // Limit to 10k rows
          if (data.length > 10000) {
            reject(
              new Error("CSV file too large. Maximum 10,000 rows allowed.")
            );
            return;
          }

          const headers = Object.keys(data[0] || {});
          const summary = generateSummary(data, headers);

          resolve({
            headers,
            rows: data,
            summary,
          });
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error("Error parsing CSV:", error);
    return null;
  }
};

const generateSummary = (
  data: any[],
  headers: string[]
): CSVData["summary"] => {
  const summary: CSVData["summary"] = {
    totalRows: data.length,
  };

  // Try to find date columns
  const dateColumns = headers.filter(
    (header) =>
      header.toLowerCase().includes("date") ||
      header.toLowerCase().includes("time")
  );

  if (dateColumns.length > 0) {
    const dateColumn = dateColumns[0];
    const dates = data
      .map((row) => row[dateColumn])
      .filter((date) => date && !isNaN(Date.parse(date)))
      .map((date) => new Date(date));

    if (dates.length > 0) {
      const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
      summary.dateRange = {
        start: sortedDates[0].toISOString().split("T")[0],
        end: sortedDates[sortedDates.length - 1].toISOString().split("T")[0],
      };
    }
  }

  // Try to find amount/price columns
  const amountColumns = headers.filter(
    (header) =>
      header.toLowerCase().includes("amount") ||
      header.toLowerCase().includes("price") ||
      header.toLowerCase().includes("cost") ||
      header.toLowerCase().includes("value")
  );

  if (amountColumns.length > 0) {
    summary.totals = {};
    amountColumns.forEach((column) => {
      const total = data.reduce((sum, row) => {
        const value = parseFloat(row[column]) || 0;
        return sum + value;
      }, 0);
      summary.totals![column] = total;
    });
  }

  // Try to find category columns
  const categoryColumns = headers.filter(
    (header) =>
      header.toLowerCase().includes("category") ||
      header.toLowerCase().includes("type") ||
      header.toLowerCase().includes("class")
  );

  if (categoryColumns.length > 0) {
    const categoryColumn = categoryColumns[0];
    const categories: { [key: string]: number } = {};

    data.forEach((row) => {
      const category = row[categoryColumn] || "Unknown";
      categories[category] = (categories[category] || 0) + 1;
    });

    summary.categories = categories;
  }

  return summary;
};

export const downloadSampleCSV = (): void => {
  const sampleData = [
    {
      date: "2024-01-01",
      category: "Food",
      amount: "150.00",
      description: "Grocery shopping",
    },
    {
      date: "2024-01-02",
      category: "Transport",
      amount: "25.00",
      description: "Uber ride",
    },
    {
      date: "2024-01-03",
      category: "Entertainment",
      amount: "50.00",
      description: "Movie tickets",
    },
    {
      date: "2024-01-04",
      category: "Food",
      amount: "30.00",
      description: "Restaurant",
    },
    {
      date: "2024-01-05",
      category: "Utilities",
      amount: "200.00",
      description: "Electricity bill",
    },
  ];

  const csv = Papa.unparse(sampleData);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "sample-expenses.csv";
  link.click();
  window.URL.revokeObjectURL(url);
};
