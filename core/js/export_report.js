const searchVariable = parseInt(window.location.search.substr(3))
const reportObject = new Array()
const convertUnixToRegularTime = (unixTimestamp) => {
  // Multiply by 1000 to convert seconds to milliseconds
  const date = new Date(unixTimestamp * 1000);

  // Format the date and time
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Return in the format YYYY-MM-DD HH:mm:ss
  return `${hours}:${minutes}`;
}
const fetchReportData = async (param) => {
  const {data, error} = await supabase
    .from('reports')
    .select('*')
    .eq('session_id', searchVariable)
    .limit(1)

    if (error) {
      console.log("Reports error", error)
    } else {
      return data
    }
}
const flattenJSONnon = (obj, prefix = []) => {
  let result = [];
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === "object" && !Array.isArray(value)) {
      // Dive deeper into the object
      result = result.concat(flattenJSON(value, [...prefix, key]));
    } else {
      // Add the current path and value to the result
      result.push([...prefix, key, value]);
    }
  }
  return result;
}
const exportToExcell = async (data) => {


    // Recursive function to flatten the JSON
    const flattenJSON = (obj, prefix = []) => {
      let result = [];
      for (const key in obj) {
        const value = obj[key];
        if (typeof value === "object" && !Array.isArray(value)) {
          // Dive deeper into the object
          result = result.concat(flattenJSON(value, [...prefix, key]));
        } else {
          // Add the current path and value to the result
          result.push([...prefix, key, value]);
        }
      }
      return result;
    }

    // Function to process data for each name
    const processDataForName = async (name, locations) => {


      if (Object.keys(locations).length > 0) {
        const result = flattenJSON(locations, [name]);
        return result
        // Optionally invoke another function
        /*
        if (callback) {
          callback(name, result);
        }
        */

      }

    }

    // Main loop with "break" between names
    for (const person in data) {
      // Process data for the current person
      processDataForName(person, data[person]).then(result => {
        if (result) {
          reportObject[person] = result
        }
      })
    }
}



const generateExcel = async (result) => {
  console.log("Generating Excel document...");

  // Create a new ExcelJS workbook
  const workbook = new ExcelJS.Workbook();

  // Loop through the result object (users and their respective data)
  for (const [user, data] of Object.entries(result)) {
    console.log(`Creating tab for ${user}`);

    // Remove username and convert Unix timestamps
    data.forEach((item, i) => {
      data[i].splice(0, 1); // Remove the first column (username)
      data[i][3] = convertUnixToRegularTime(data[i][3]); // Convert Unix time to regular time
    });

    console.log(data);

    // Add a worksheet named after the user
    const worksheet = workbook.addWorksheet(user);

    // ---- HEADER SECTION ----
    // Merge cells to create a large header
    worksheet.mergeCells('A1:D1');
    const headerCell = worksheet.getCell('A1');
    headerCell.value = `Detaljerad rapport från:\n${user}`;
    headerCell.font = { bold: true, size: 20, color: { argb: 'FFFFFF' } }; // White text
    headerCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true};
    headerCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ca5757' }, // Blue background
    };

    worksheet.getRow(1).height = 100

    // Optional sub-header
    worksheet.mergeCells('A2:D2');
    const subHeaderCell = worksheet.getCell('A2');
    subHeaderCell.value = `Automatisk genererad rapport från netle.se snöapp. (${searchVariable})\nAll data genereras under arbetsdagen via klarmarkeringar`;
    subHeaderCell.font = { italic: true, size: 12, color: { argb: '000000' } }; // Black text
    subHeaderCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true};
    worksheet.getRow(2).height = 45
    // ---- TABLE SECTION ----
    // Add column headers
    const columnHeaders = ["Förening", "Moment", "Uppgift", "Sluttid"];
    worksheet.addRow(columnHeaders).font = { bold: true }; // Bold headers

    // Add rows to the table
    data.forEach(row => worksheet.addRow(row));

    // Auto-adjust column widths
    worksheet.columns.forEach(column => {
      column.width = 20; // Adjust width for better readability
    });

    // Apply alternating row colors for better readability
    data.forEach((_, index) => {
      const row = worksheet.getRow(index + 4); // +4 to account for the header and sub-header
      if (index % 2 === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F2F2F2' }, // Light gray for alternating rows
        };
      }
    });
  }

  // ---- EXPORT THE WORKBOOK ----
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Snörapport-${searchVariable}.xlsx`; // Replace `searchVariable` with your actual variable
  link.click();

  let html = `
  <div class="session-confetti">
    <div class="sc-content">
      <h1>Validering godkänd.</h1>
      <p>All data har kompilerats och finns nu i det nedladdade excell dokumentet.</strong></p>
      <img src="img/shaka.gif" alt="">
      <button type="button" name="button" onclick="window.history.go(-1); return false;">Tack, ta mig tillbaka.</button>
    </div>
    <div class="sc-blur"></div>
  </div>
  `
  let body = document.getElementsByTagName('body')[0]
  body.insertAdjacentHTML('beforeend', html)

};

fetchReportData(searchVariable).then(data => {
    if (data.length > 0) {
        exportToExcell(data[0].data).then(d => {
          generateExcel(reportObject)
        })
    }
})
