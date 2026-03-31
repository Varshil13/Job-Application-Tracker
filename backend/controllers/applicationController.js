const Application = require("../models/applicationSchema");

async function getallapplications(req, res) {
  try {
    const userId = req.user.id;
    const applications = await Application.find({ userId }).sort({
      uploadedAt: -1,
    });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}


module.exports = { getallapplications };
