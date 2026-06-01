import Team from "../models/Team.js";
import User from "../models/User.js";
import Message from "../models/Message.js";

// CREATE TEAM
export const createTeam = async (req, res) => {
  try {
    const { name } = req.body;

    const team = await Team.create({
      name,
      owner: req.user._id,
      members: [req.user._id],
    });

    const populatedTeam = await Team.findById(team._id)
      .populate("members", "name email")
      .populate("owner", "name email");

    res.json({
      success: true,
      team: populatedTeam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET MY TEAMS
export const getMyTeams = async (req, res) => {
  try {
    const teams = await Team.find({
      members: req.user._id,
    })
      .populate("members", "name email")
      .populate("owner", "name email");

    res.json({
      success: true,
      teams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// INVITE MEMBER
export const inviteMember = async (req, res) => {
  try {
    const { teamId, email } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (team.members.includes(user._id)) {
      return res.status(400).json({
        success: false,
        message: "User already in team",
      });
    }

    team.members.push(user._id);
    await team.save();

    const updatedTeam = await Team.findById(teamId)
      .populate("members", "name email")
      .populate("owner", "name email");

    res.json({
      success: true,
      message: "Member added successfully",
      team: updatedTeam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// REMOVE MEMBER
export const removeMember = async (req, res) => {
  try {
    const { teamId, memberId } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    team.members = team.members.filter(
      (m) => m.toString() !== memberId
    );
    await team.save();

    const updatedTeam = await Team.findById(teamId)
      .populate("members", "name email")
      .populate("owner", "name email");

    res.json({
      success: true,
      message: "Member removed",
      team: updatedTeam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE TEAM
export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    if (team.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only owner can delete team",
      });
    }

    await Message.deleteMany({ team: id });
    await Team.deleteOne({ _id: id });

    res.json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};