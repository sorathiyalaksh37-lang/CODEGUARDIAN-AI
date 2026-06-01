import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import TeamChat from "../components/TeamChat";

import {
  FaUsers,
  FaTrash,
  FaUserPlus,
  FaCrown,
  FaComments,
  FaPaperPlane,
} from "react-icons/fa";

const Teams = () => {

  const [teams, setTeams] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);

  const token = localStorage.getItem("token");

  // FETCH TEAMS

  const fetchTeams = async () => {

    try {

      const { data } = await axios.get(
        "http://localhost:8000/api/teams/my-teams",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTeams(data.teams);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchTeams();

  }, []);

  // CREATE TEAM

  const createTeam = async () => {

    try {

      if (!name) {
        toast.error("Enter team name");
        return;
      }

      await axios.post(
        "http://localhost:8000/api/teams/create",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Team Created");

      setName("");

      fetchTeams();

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Failed"
      );

    }

  };

  // DELETE TEAM

  const deleteTeam = async (id) => {

    try {

      await axios.delete(
        `http://localhost:8000/api/teams/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Team Deleted");

      if (selectedTeam?._id === id) {
        setSelectedTeam(null);
      }

      fetchTeams();

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Delete Failed"
      );

    }

  };

  // INVITE MEMBER

  const inviteMember = async (teamId) => {

    try {

      if (!email) {
        toast.error("Enter email");
        return;
      }

      await axios.post(
        "http://localhost:8000/api/teams/add-member",
        {
          teamId,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Member Added");

      setEmail("");

      fetchTeams();

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Invite Failed"
      );

    }

  };

  // REMOVE MEMBER

  const removeMember = async (teamId, memberId) => {

    try {

      await axios.post(
        "http://localhost:8000/api/teams/remove-member",
        {
          teamId,
          memberId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Member Removed");

      fetchTeams();

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Remove Failed"
      );

    }

  };

  return (

    <div className="min-h-screen bg-black text-white p-5 md:p-10">

      {/* HEADER */}

      <div className="flex items-center gap-5 mb-10">

        <div className="w-20 h-20 rounded-3xl bg-green-500 flex items-center justify-center">

          <FaUsers className="text-black text-4xl" />

        </div>

        <div>

          <h1 className="text-5xl font-black">
            Team Workspace
          </h1>

          <p className="text-zinc-500 mt-2">
            Collaboration + Live Team Chat
          </p>

        </div>

      </div>

      {/* CREATE TEAM */}

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 flex flex-col md:flex-row gap-4 mb-10">

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Create new team"
          className="flex-1 bg-black border border-zinc-700 rounded-2xl px-5 py-4 outline-none"
        />

        <button
          onClick={createTeam}
          className="bg-green-500 hover:bg-green-600 text-black font-black px-8 rounded-2xl"
        >
          Create Team
        </button>

      </div>

      {/* TEAMS */}

      <div className="space-y-8">

        {teams.map((team) => (

          <div
            key={team._id}
            className="bg-zinc-900 border border-zinc-800 rounded-[30px] overflow-hidden"
          >

            {/* TOP */}

            <div className="p-7 border-b border-zinc-800">

              <div className="flex flex-col xl:flex-row justify-between gap-6">

                {/* LEFT */}

                <div>

                  <h2 className="text-4xl font-black">
                    {team.name}
                  </h2>

                  <p className="text-zinc-500 mt-2">
                    {team.members.length} Members
                  </p>

                </div>

                {/* ACTIONS */}

                <div className="flex flex-wrap gap-3">

                  <button
                    onClick={() => setSelectedTeam(team)}
                    className="bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-2xl font-bold flex items-center gap-2"
                  >

                    <FaComments />

                    Open Chat

                  </button>

                  <button
                    onClick={() => deleteTeam(team._id)}
                    className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-5 py-3 rounded-2xl transition-all flex items-center gap-2"
                  >

                    <FaTrash />

                    Delete

                  </button>

                </div>

              </div>

              {/* INVITE */}

              <div className="flex flex-col md:flex-row gap-4 mt-7">

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Invite member by email"
                  className="flex-1 bg-black border border-zinc-700 rounded-2xl px-5 py-4 outline-none"
                />

                <button
                  onClick={() => inviteMember(team._id)}
                  className="bg-green-500 hover:bg-green-600 text-black font-bold px-8 rounded-2xl flex items-center justify-center gap-2"
                >

                  <FaUserPlus />

                  Invite

                </button>

              </div>

            </div>

            {/* MEMBERS */}

            <div className="p-7">

              <h3 className="text-2xl font-black mb-5">
                Team Members
              </h3>

              <div className="space-y-4">

                {team.members.map((member) => (

                  <div
                    key={member._id}
                    className="flex flex-col md:flex-row justify-between gap-4 bg-black border border-zinc-800 rounded-2xl p-5"
                  >

                    <div>

                      <h3 className="font-semibold text-lg">
                        {member.email}
                      </h3>

                      <div className="flex items-center gap-2 mt-2 text-zinc-500">

                        {team.owner === member._id ? (
                          <>
                            <FaCrown className="text-yellow-400" />
                            Owner
                          </>
                        ) : (
                          "Member"
                        )}

                      </div>

                    </div>

                    {team.owner !== member._id && (

                      <button
                        onClick={() =>
                          removeMember(team._id, member._id)
                        }
                        className="bg-red-500/20 hover:bg-red-500 hover:text-white text-red-400 px-4 py-2 rounded-xl transition-all"
                      >
                        Remove
                      </button>

                    )}

                  </div>

                ))}

              </div>

            </div>

            {/* TEAM CHAT */}

            {selectedTeam?._id === team._id && (

              <div className="border-t border-zinc-800 p-7 bg-black/40">

                <div className="flex items-center gap-3 mb-6">

                  <FaPaperPlane className="text-green-400 text-2xl" />

                  <h2 className="text-3xl font-black">
                    Team Chat
                  </h2>

                </div>

                <TeamChat teamId={team._id} />

              </div>

            )}

          </div>

        ))}

      </div>

    </div>

  );

};

export default Teams;