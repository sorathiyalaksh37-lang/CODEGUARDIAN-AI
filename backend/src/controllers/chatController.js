import Message from "../models/Message.js";
import Team from "../models/Team.js";

// SEND MESSAGE
export const sendMessage = async (req, res) => {
  try {
    const { teamId, text } = req.body;

    const team = await Team.findOne({
      _id: teamId,
      members: req.user._id,
    });

    if (!team) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this team",
      });
    }

    const message = await Message.create({
      team: teamId,
      sender: req.user._id,
      text: text,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email");

    res.json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET MESSAGES
export const getMessages = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findOne({
      _id: teamId,
      members: req.user._id,
    });

    if (!team) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this team",
      });
    }

    const messages = await Message.find({ team: teamId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};