const snippetModel = require("../models/snippet-model");
const userModel = require("../models/user-model");

const createSnippet = async (req, res) => {
  try {
    const { name, description, language, content, collaborators } = req.body;

    if (!name || !language) {
      return res.status(400).json("Name and Language required!");
    }

    const snippet = await snippetModel.create({
      name,
      description: description || "",
      language,
      content: content || "",
      collaborators: collaborators || [],
      owner: req.user.id,
    });

    await userModel.findByIdAndUpdate(
        req.user.id,
        { $push: { snippets: snippet._id } },
        { new: true, useFindAndModify: false }
    )

    return res.status(200).json(snippet);

  } catch (err) {
    return res.status(500).json(err.message);
  }
};

const findSnippet = async (req, res) => {
  try {
    const { id } = req.body;

    const snippet = snippetModel.findOne({_id: id});

    const {name, language, owner, collaborators, description, content, version, lastEditedBy} = snippet

    return res.status(200).json({name, language, owner, collaborators, description, content, version, lastEditedBy});

  } catch (err) {
    return res.status(500).json(err.message);
  }
};

module.exports = {
  createSnippet,
  findSnippet,
};
