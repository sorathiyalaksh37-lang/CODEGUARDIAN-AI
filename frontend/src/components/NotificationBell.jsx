import React from "react";

import {
  FaBell,
} from "react-icons/fa";

import {
  useNotification,
} from "../context/NotificationContext";

const NotificationBell =
  () => {

    const {
      notifications,
    } =
      useNotification();

    return (

      <div
        className="
        fixed
        top-5
        right-5
        z-50
        "
      >

        <div
          className="
          relative
          "
        >

          <div
            className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-2xl
            p-4
            "
          >

            <FaBell
              className="
              text-white
              text-2xl
              "
            />

            {
              notifications.length >
                0 && (

                <div
                  className="
                  absolute
                  -top-2
                  -right-2
                  bg-red-500
                  text-white
                  w-6
                  h-6
                  rounded-full
                  text-xs
                  flex
                  items-center
                  justify-center
                  font-bold
                  "
                >
                  {
                    notifications.length
                  }
                </div>

              )
            }

          </div>

        </div>

        {/* LIST */}

        <div
          className="
          mt-4
          space-y-3
          w-[320px]
          "
        >

          {
            notifications.map(
              (
                notification
              ) => (

                <div

                  key={
                    notification.id
                  }

                  className="
                  bg-zinc-900
                  border
                  border-zinc-800
                  rounded-2xl
                  p-4
                  shadow-2xl
                  "

                >

                  <h3
                    className="
                    font-bold
                    text-green-400
                    "
                  >
                    {
                      notification.title
                    }
                  </h3>

                  <p
                    className="
                    text-sm
                    text-zinc-300
                    mt-2
                    "
                  >
                    {
                      notification.message
                    }
                  </p>

                </div>

              )
            )
          }

        </div>

      </div>

    );

  };

export default NotificationBell;