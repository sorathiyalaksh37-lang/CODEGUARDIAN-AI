import React from "react";

const Navbar = () => {

  return (

    <nav
      className="
      bg-zinc-900/80
      backdrop-blur-lg
      border-b
      border-zinc-800
      px-8
      py-4
      flex
      justify-between
      items-center
      sticky
      top-0
      z-50
      "
    >

      <h1
        className="
        text-3xl
        font-black
        bg-gradient-to-r
        from-green-400
        to-blue-500
        bg-clip-text
        text-transparent
        "
      >
        CodeGuardian AI
      </h1>

      <div className="flex gap-4">

        <button
          className="
          bg-gradient-to-r
          from-green-500
          to-emerald-400
          hover:from-green-400
          hover:to-emerald-300
          text-black
          font-bold
          px-6
          py-3
          rounded-2xl
          transition-all
          duration-300
          hover:scale-105
          "
        >
          Dashboard
        </button>

        <button
          className="
          bg-red-500
          hover:bg-red-400
          px-6
          py-3
          rounded-2xl
          font-bold
          transition-all
          duration-300
          hover:scale-105
          "
        >
          Logout
        </button>

      </div>

    </nav>

  );

};

export default Navbar;