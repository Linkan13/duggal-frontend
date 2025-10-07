import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

// Dummy types
interface Student {
  id: string;
  name: string;
  attendance: Record<string, ("A" | "P")[]>; // key = month, value = array of 30 days
}

// Dummy single student data
const studentData: Student = {
  id: "1",
  name: "John Doe",
  attendance: {
    January: Array(30)
      .fill("P")
      .map((v, i) => (i % 7 === 0 ? "A" : "P")),
    February: Array(28)
      .fill("P")
      .map((v, i) => (i % 6 === 0 ? "A" : "P")),
  },
};

// Day names (starting from Sunday)
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AttendancePage() {
  const [student] = useState<Student>(studentData);
  const [filter, setFilter] = useState<"All" | "Present" | "Absent">("All");

  const getMonthStats = (days: ("A" | "P")[]) => {
    const present = days.filter((d) => d === "P").length;
    const absent = days.filter((d) => d === "A").length;
    return { present, absent };
  };

  const filteredDays = (days: ("A" | "P")[], filter: string) => {
    if (filter === "All") return days;
    if (filter === "Present") return days.map((d) => (d === "P" ? "P" : ""));
    if (filter === "Absent") return days.map((d) => (d === "A" ? "A" : ""));
    return days;
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-full bg-white shadow-lg rounded-lg p-4 space-y-6">
        <PageBreadcrumb pageTitle={`📊 Attendance - ${student.name}`} />

        {/* Filter Section */}
        <div className="flex items-center justify-start mb-4 space-x-4">
          <label className="text-sm font-medium">Show:</label>
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "All" | "Present" | "Absent")
            }
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="All">All</option>
            <option value="Present">Present Only</option>
            <option value="Absent">Absent Only</option>
          </select>
        </div>

        {Object.keys(student.attendance).map((month) => {
          const days = student.attendance[month];
          const { present, absent } = getMonthStats(days);
          const displayDays = filteredDays(days, filter);

          return (
            <div key={month} className="mb-6 border rounded-lg p-2 bg-gray-50">
              {/* Month Header */}
              <div className="flex justify-between items-center mb-2 px-2">
                <h4 className="font-semibold text-lg">{month}</h4>
                <div className="text-sm font-medium">
                  Present: <span className="text-green-700">{present}</span> |{" "}
                  Absent: <span className="text-red-600">{absent}</span>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="overflow-x-auto">
                <table className="table-fixed border-collapse border border-gray-300 w-full text-center text-xs">
                  <thead>
                    <tr className="bg-gray-100 sticky top-0">
                      <th className="border border-gray-300 px-1 py-1">Day</th>
                      {displayDays.map((_, i) => {
                        const dayName = dayNames[i % 7][0]; // first letter only
                        return (
                          <th
                            key={i}
                            className="border border-gray-300 px-1 py-1 font-medium text-gray-700 whitespace-nowrap"
                          >
                            <div className="flex flex-col items-center justify-center">
                              <span>{dayName}</span>
                              <span>{i + 1}</span>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-1 py-1 font-semibold bg-gray-100">
                        Status
                      </td>
                      {displayDays.map((status, idx) => {
                        const dayName = dayNames[idx % 7];
                        let bgColor = "";
                        let textColor = "text-white";
                        let displayStatus = status;

                        if (dayName === "Sun") {
                          bgColor = "bg-gray-400";
                          textColor = "text-white font-bold";
                          displayStatus = "L"; // Leave on Sunday
                        } else if (status === "P") {
                          bgColor = "bg-green-600";
                        } else if (status === "A") {
                          bgColor = "bg-red-600";
                        } else {
                          bgColor = "bg-white";
                          textColor = "text-gray-600";
                        }

                        // Add week separation: every 7 days
                        const weekBorder =
                          (idx + 1) % 7 === 0
                            ? "border-r-4 border-gray-500"
                            : "";

                        return (
                          <td
                            key={idx}
                            className={`px-1 py-1 border border-gray-300 ${bgColor} ${textColor} text-center ${weekBorder}`}
                          >
                            {displayStatus}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
