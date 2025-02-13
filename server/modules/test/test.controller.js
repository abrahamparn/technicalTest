const getTestPage = async (req, res, next) => {
  try {
    let today = new Date();
    let body = `
            <html>
          <head>
            <title>Test API</title>
          </head>
          <body>
            <h1>Successful Test API Call</h1>
            <p>Today: ${today}</p>
            <p>Purpose: TEST API</p>
          </body>
        </html>
        `;

    return res.status(200).send(body);
  } catch {
    next(exception);
  }
};

module.exports = {
  getTestPage,
};
