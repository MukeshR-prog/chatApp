import User from "../models/userModel.js";

export const SearchContact = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;
    if (searchTerm === undefined || searchTerm === null) {
      return res.status(400).send("Please provide a search term");
    }
    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const regex = new RegExp(sanitizedSearchTerm, "i");
    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
      ],
    });
    return res.status(200).json({contacts});
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Internal Server Error");
  }
};
