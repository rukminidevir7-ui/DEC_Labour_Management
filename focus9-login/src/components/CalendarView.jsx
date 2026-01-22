import React, { useState } from "react";
import "./CalendarView.css";

function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  // Helpers
  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  // Build calendar grid
  const daysArray = [];
  for (let i = 0; i < firstDay; i++) daysArray.push(null);
  for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);

  // Sample tasks - Replace with real data from backend
  const tasksData = {
    1: [
      { id: 1, type: "TimeIn", status: "completed", name: "Labour 1", docNo: "DOC-2026-000001" },
      { id: 2, type: "WorkAllocation", status: "pending", name: "Labour 2", docNo: "DOC-2026-000002" },
    ],
    5: [
      { id: 3, type: "Completion", status: "completed", name: "Labour 3", docNo: "DOC-2026-000003" }
    ],
    10: [
      { id: 4, type: "TimeOut", status: "completed", name: "Labour 4", docNo: "DOC-2026-000004" },
      { id: 5, type: "QC", status: "pending", name: "Labour 5", docNo: "DOC-2026-000005" },
    ],
    15: [
      { id: 6, type: "TimeIn", status: "completed", name: "Labour 6", docNo: "DOC-2026-000006" },
      { id: 7, type: "WorkAllocation", status: "completed", name: "Labour 7", docNo: "DOC-2026-000007" },
      { id: 8, type: "QC", status: "pending", name: "Labour 8", docNo: "DOC-2026-000008" },
    ],
    20: [
      { id: 9, type: "Completion", status: "completed", name: "Labour 9", docNo: "DOC-2026-000009" }
    ],
  };

  const getTaskColor = (type) => {
    const colors = {
      TimeIn: "#10b981",
      WorkAllocation: "#3b82f6",
      Completion: "#06b6d4",
      TimeOut: "#f59e0b",
      QC: "#8b5cf6",
    };
    return colors[type] || "#6b7280";
  };

  const getTaskLabel = (type) => {
    return type.replace(/([A-Z])/g, " $1").trim();
  };

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );

  const today = new Date();
  const isCurrentMonth =
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth();

  // Get tasks for selected day or today
  const displayDay = selectedDay || (isCurrentMonth ? today.getDate() : 1);
  const selectedTasks = tasksData[displayDay] || [];

  return (
    <div className="calendar-view-container">
      {/* Calendar Section */}
      <div className="calendar-view">
        {/* Header */}
        <div className="calendar-header">
          <button onClick={prevMonth} className="nav-btn">‹</button>
          <h2>{monthName} {year}</h2>
          <button onClick={nextMonth} className="nav-btn">›</button>
        </div>

        {/* Weekdays */}
        <div className="calendar-weekdays">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="calendar-days">
          {daysArray.map((day, idx) => (
            <div
              key={idx}
              className={`calendar-day ${day ? "has-day" : "empty"} ${
                isCurrentMonth && day === today.getDate() ? "today" : ""
              } ${selectedDay === day ? "selected" : ""}`}
              onClick={() => day && setSelectedDay(day)}
            >
              {day && (
                <>
                  <div className="day-number">{day}</div>
                  <div className="day-tasks">
                    {tasksData[day]?.slice(0, 3).map(task => (
                      <span
                        key={task.id}
                        className="task-dot"
                        style={{ backgroundColor: getTaskColor(task.type) }}
                        title={`${task.type}: ${task.name}`}
                      />
                    ))}
                    {tasksData[day]?.length > 3 && (
                      <span className="more-tasks">+{tasksData[day].length - 3}</span>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="calendar-legend">
          {["TimeIn", "WorkAllocation", "Completion", "TimeOut", "QC"].map(type => (
            <div key={type} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: getTaskColor(type) }} />
              <span>{getTaskLabel(type)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks List Section */}
      <div className="tasks-list-section">
        <div className="tasks-header">
          <h3>
            Tasks for {monthName} {displayDay}, {year}
          </h3>
          <span className="task-count">{selectedTasks.length} tasks</span>
        </div>

        {selectedTasks.length > 0 ? (
          <div className="tasks-list">
            {selectedTasks.map(task => (
              <div key={task.id} className="task-item">
                <div className="task-status-bar" style={{ backgroundColor: getTaskColor(task.type) }}></div>
                <div className="task-content">
                  <div className="task-header-row">
                    <div className="task-title">
                      <span className="task-type" style={{ backgroundColor: getTaskColor(task.type) }}>
                        {getTaskLabel(task.type)}
                      </span>
                      <span className="task-name">{task.name}</span>
                    </div>
                    <div className={`task-status ${task.status}`}>
                      {task.status === "completed" ? "✓ Completed" : "⏳ Pending"}
                    </div>
                  </div>
                  <div className="task-meta">
                    <span className="doc-no">Doc: {task.docNo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-tasks">
            <p>No tasks for this date</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarView;