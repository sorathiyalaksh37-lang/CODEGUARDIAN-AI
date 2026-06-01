import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import toast from "react-hot-toast";

const TeamWorkspace = () => {

  const [teams,
    setTeams] =
    useState([]);

  const [teamName,
    setTeamName] =
    useState("");

  // GET TEAMS

  const fetchTeams =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const { data } =
          await axios.get(

            "http://localhost:8000/api/team",

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,

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

  const createTeam =
    async () => {

      if (!teamName) {

        toast.error(
          "Enter team name"
        );

        return;

      }

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.post(

          "http://localhost:8000/api/team/create",

          {
            name: teamName,
          },

          {

            headers: {

              Authorization:
                `Bearer ${token}`,

            },

          }

        );

        toast.success(
          "Team Created"
        );

        setTeamName("");

        fetchTeams();

      } catch (error) {

        toast.error(
          error.response?.data
            ?.message ||
          "Failed"
        );

      }

    };

  return (

    <div
      className="
      min-h-screen
      bg-black
      text-white
      p-8
      "
    >

      <h1
        className="
        text-5xl
        font-black
        mb-10
        "
      >
        Team Workspace
      </h1>

      {/* CREATE */}

      <div
        className="
        bg-zinc-900
        border
        border-zinc-800
        rounded-3xl
        p-6
        flex
        flex-col
        md:flex-row
        gap-5
        "
      >

        <input

          type="text"

          placeholder="Enter Team Name"

          value={teamName}

          onChange={(e) =>
            setTeamName(
              e.target.value
            )
          }

          className="
          flex-1
          bg-black
          border
          border-zinc-700
          rounded-2xl
          px-5
          py-4
          outline-none
          "

        />

        <button

          onClick={createTeam}

          className="
          bg-cyan-500
          hover:bg-cyan-600
          text-black
          font-black
          px-8
          rounded-2xl
          "

        >
          CREATE TEAM
        </button>

      </div>

      {/* TEAMS */}

      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
        mt-10
        "
      >

        {
          teams.map(
            (team) => (

              <div

                key={team._id}

                className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-3xl
                p-6
                "

              >

                <h2
                  className="
                  text-3xl
                  font-black
                  "
                >
                  {team.name}
                </h2>

                <p
                  className="
                  text-zinc-500
                  mt-3
                  "
                >
                  Team Collaboration Workspace
                </p>

              </div>

            )
          )
        }

      </div>

    </div>

  );

};

export default TeamWorkspace;