import "./styles.css";
import { useState, useEffect } from "react";

export default function App() {
  const [newHabit, setNewHabit] = useState("");
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem("habits");
    try {
      return savedHabits ? JSON.parse(savedHabits) : [];
    } catch (error) {
      console.error("Error parsing saved habits from localStorage:", error);
      return [];
    }
  });
  const [filteredHabits, setFilteredHabits] = useState(habits);
  const [filter, setFilter] = useState("all");

  const progress = Math.floor(
    habits.length
      ? (habits.filter((habit) => habit.completed).length / habits.length) * 100
      : 0
  );

  const parseDate = (dateString) => {
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate)) {
      console.warn(`Invalid date format found: ${dateString}`);
      return null;
    }
    return parsedDate;
  };

  const getDaysDifference = (dateString) => {
    const habitDate = parseDate(dateString);
    if (!habitDate) return "unknown";
    const today = new Date();
    const timeDifference = today - habitDate;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  };

  const getTaskMessage = (daysNumber, completed) => {
    if (daysNumber === "unknown") {
      return completed
        ? "Completed at an unknown date"
        : "Added at an unknown date";
    } else if (daysNumber === 0) {
      return completed ? "Completed today" : "Added today";
    } else if (daysNumber === 1) {
      return completed ? "Completed yesterday" : "Added yesterday";
    } else {
      return completed
        ? `Completed ${daysNumber} days ago`
        : `Added ${daysNumber} days ago`;
    }
  };

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
    showHabits(filter);
  }, [habits, filter]);

  function addHabit() {
    if (newHabit.trim()) {
      const date = new Date();
      const today = date.toISOString(); // Stocker la date au format ISO
      setHabits([
        ...habits,
        {
          name: newHabit,
          completed: false,
          addedDate: today,
          completionDate: "",
        },
      ]);
      setNewHabit("");
    }
  }

  function clearAll() {
    setHabits([]);
  }

  function updateHabits(index) {
    const date = new Date();
    const today = date.toISOString();
    const updatedHabits = habits.map((h, i) =>
      i === index
        ? {
            ...h,
            completed: !h.completed,
            completionDate: h.completed ? "" : today, // Mise à jour de la date d'achèvement
          }
        : h
    );
    setHabits(updatedHabits);
  }

  function showHabits(value) {
    setFilter(value);
    if (value === "all") {
      setFilteredHabits(habits);
    } else if (value === "done") {
      setFilteredHabits(habits.filter((habit) => habit.completed));
    } else if (value === "todo") {
      setFilteredHabits(habits.filter((habit) => !habit.completed));
    }
  }

  function deleteHabit(index) {
    const deldHabits = habits.filter((_, i) => i !== index);
    setHabits(deldHabits);
  }

  return (
    <div>
      <h1>HabitTracker</h1>
      <div className="progressBar">
        <div
          className="progressFill"
          style={{ width: `${progress}%` }}
        >{`${progress}%`}</div>
      </div>
      <h3>Progression bar</h3>
      <h2>V 2.0</h2>
      <div className="form">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="insert your habit"
        />

        <button className="addButton" onClick={addHabit}>
          Add habit
        </button>
        <button className="clearButton" onClick={clearAll}>
          Clear all
        </button>
      </div>

      <div className="filter">
        <button
          className={filter === "all" ? "selectedButton" : ""}
          onClick={() => showHabits("all")}
        >
          All
        </button>
        <button
          className={filter === "todo" ? "selectedButton" : ""}
          onClick={() => showHabits("todo")}
        >
          Todo
        </button>
        <button
          className={filter === "done" ? "selectedButton" : ""}
          onClick={() => showHabits("done")}
        >
          Done
        </button>
      </div>

      <div className="list">
        <table>
          <thead>
            <tr>
              <th>Habit</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredHabits.map((habit, index) => {
              const daysNumber = getDaysDifference(habit.addedDate);
              const taskMessage = getTaskMessage(daysNumber, habit.completed);
              return (
                <tr>
                  <th key={index}>
                    <span
                      style={{
                        textDecoration: habit.completed
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {habit.name}
                    </span>
                  </th>
                  <td>
                    <span className="dateTask">{taskMessage}</span>
                  </td>
                  <td>
                    <button
                      className={
                        habit.completed
                          ? "redButton updateButton"
                          : "updateButton"
                      }
                      onClick={() => updateHabits(index)}
                    >
                      {habit.completed ? "Undo" : "Done"}
                    </button>
                    <button
                      className={"updateButton redButton"}
                      onClick={() => deleteHabit(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
