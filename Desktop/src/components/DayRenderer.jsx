// DayRenderer.jsx
import React from "react";
import dayjs from "dayjs";

const DayRenderer = ({ day, value, history, ...props }) => {
  if (!day) return <div {...props} />;

  const dateString = day.format("YYYY-MM-DD");
  const formattedHistory = history.map((date) =>
    dayjs(date).format("YYYY-MM-DD")
  );
  const isCompleted = formattedHistory.includes(dateString);
  const isSelected = day.isSame(value, "day");

  return (
    <div
      {...props}
      style={{
        backgroundColor: isCompleted
          ? "#4CAF50"
          : isSelected
          ? "#2196F3"
          : "transparent",
        color: isCompleted ? "white" : "inherit",
        borderRadius: "50%",
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "2px",
        cursor: "pointer",
      }}
    >
      {day.date()}
    </div>
  );
};

export default DayRenderer;
