import React, { useEffect } from 'react';
import Base from '../Base/Base.jsx';
import { useNavigate } from 'react-router-dom';
import {Bar} from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'



ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
const Dashboard = () => {

    const navigate = useNavigate();
    useEffect(() => {
        if (! localStorage.getItem("token")) {
            navigate("/login",{replace:true})
        }
    }, [])
    
    const data = {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Orders",
          data: [10, 35, 60, 20, 45, 74, 90, 60, 50, 83, 95, 100],
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(255, 205, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(201, 203, 207, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(255, 205, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(50, 162, 235, 0.6)",
          ],
          borderColor: [
            "rgba(255, 99, 132)",
            "rgba(255, 159, 64)",
            "rgba(255, 205, 86)",
            "rgba(75, 192, 192)",
            "rgba(54, 162, 235)",
            "rgba(153, 102, 255)",
            "rgba(201, 203, 207)",
            "rgba(255, 99, 132)",
            "rgba(255, 159, 64)",
            "rgba(255, 205, 86)",
            "rgba(75, 192, 192)",
            "rgba(50, 162, 235)",
          ],
          borderWidth: 1,
        },
      ],
    };
   

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "category",
          beginAtZero: true,
          ticks: {
            color: "#f50057",
            fontSize: 14,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: "#ff1744",

            fontSize: 14,
          },
        },
      },
    };
    return (
      <Base title={"Dashboard"}>
        <div style={{ width: "100%", height: "400px", margin: "0 auto" }}>
          <Bar data={data} options={options}></Bar>{" "}
        </div>
      </Base>
    );
};

export default Dashboard;