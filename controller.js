const User = require('./model');
const controller = {};
const excelJS = require('exceljs');
const fs = require('fs');

controller.exportExcel = async (req, res) => {
  const workbook = new excelJS.Workbook();  // Create a new workbook
  const worksheet = workbook.addWorksheet("Data Users"); // New Worksheet
  const path = "./files";  // Path to download excel
  const nameFile = 'users';
  const ext = '.xlsx';
  // Column for data in excel. key must match data key
  worksheet.columns = [
    { header: "S no.", key: "s_no", width: 10 }, 
    { header: "First Name", key: "fname", width: 10 },
    { header: "Last Name", key: "lname", width: 10 },
    { header: "Email Id", key: "email", width: 10 },
    { header: "Gender", key: "gender", width: 10 },
  ];
  // Looping through User data
  let counter = 1;
  User.forEach((user) => {
    user.s_no = counter;
    worksheet.addRow(user); // Add data in worksheet
    counter++;
  });
  // Making first line in excel bold
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });
  try {
    // create a directory if it doesn't exist 
    if (!fs.existsSync(path)){
      fs.mkdirSync(path, { recursive: true });
    }
    const data = await workbook.xlsx.writeFile(`${path}/${nameFile}${ext}`) // create xlsx file
    .then(() => {
      //send response 
      return res.status(200).download(`${path}/${nameFile}${ext}`, (err) => {
        fs.unlink(`${path}/${nameFile}${ext}`, () => {
          console.log("File was deleted"); // Callback
        }); 
      });
    });
  } catch (err) {
    res.send({
    status: "error",
    message: "Something went wrong",
  });
  }
}


module.exports = controller;