import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import socket from "../socket";

const NotificationContext =
  createContext();

export const useNotification =
  () =>
    useContext(
      NotificationContext
    );

export const NotificationProvider =
  ({ children }) => {

    const [
      notifications,
      setNotifications,
    ] = useState([]);

    // ADD NOTIFICATION

    const addNotification =
      (notification) => {

        const newNotification = {

          id: Date.now(),

          ...notification,

        };

        setNotifications(
          (prev) => [

            newNotification,

            ...prev,

          ]
        );

        // AUTO REMOVE

        setTimeout(() => {

          setNotifications(
            (prev) =>
              prev.filter(
                (n) =>
                  n.id !==
                  newNotification.id
              )
          );

        }, 5000);

      };

    useEffect(() => {

      // SCAN COMPLETE

      socket.on(
        "scan-completed",
        (data) => {

          addNotification({

            type: "success",

            title:
              "Scan Completed",

            message:
              `${data.repo} secured successfully`,

          });

        }
      );

      // NEW MESSAGE

      socket.on(
        "receive-message",
        (message) => {

          addNotification({

            type: "message",

            title:
              "New Team Message",

            message:
              `${message.sender?.email}: ${message.text}`,

          });

        }
      );

      return () => {

        socket.off(
          "scan-completed"
        );

        socket.off(
          "receive-message"
        );

      };

    }, []);

    return (

      <NotificationContext.Provider
        value={{
          notifications,
        }}
      >

        {children}

      </NotificationContext.Provider>

    );

  };