import menuSide from "./adminHome.js";

export default {
    template: ` <div style="display: flex;">
        <div class="card1">
            <h1>Users vs Creators</h1>
            <div class="card card-style mb-2">
                <div class="card-body">
                    <div class="chart-container" style="position: relative;">
                        <canvas id="user_vs_creator"></canvas>
                    </div>
                </div>
            </div>
        </div>
        <div class="card1">
            <h1>Top Liked Songs</h1>
            <div class="card card-style mb-2" style="color: blue;">
                <div class="card-body">
                    <div class="chart-container" style="position: relative;">
                        <canvas id="name_vs_likes"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            user_creator_chart: null
        };
    },
    methods: {
        async likechart() {
            const form = new FormData();
            form.append("current_user", localStorage.getItem("current_user"));

            const res = await fetch("http://localhost:8080/admin_graph", {
                method: "POST",
                body: form,
            });
            if (res.ok) {
                const data = await res.json();
                const name_labels = data.top_tracks_names;
                const song_like = data.top_tracks_likes;
                new Chart(document.getElementById("name_vs_likes"), {
                    type: "bar",
                    data: {
                        labels: name_labels,
                        datasets: [
                            {
                                label: "Top 10 Most Liked Songs",
                                data: song_like,
                                fill: false,
                                borderColor: "rgb(75, 192, 192)",
                                lineTension: 0.5,
                                backgroundColor: [
                                    "rgba(255, 99, 132,0.7)",
                                    "rgba(255, 159, 64, 0.7)",
                                    "rgba(255, 205, 86, 0.7)",
                                    "rgba(75, 192, 192, 0.7)",
                                    "rgba(54, 162, 235, 0.7)",
                                    "rgba(153, 102, 255, 0.7)",
                                    "rgba(201, 203, 207, 0.7)",
                                    "rgba(255, 99, 132, 0.7)",
                                    "rgba(255, 159, 64, 0.7)",
                                    "rgba(255, 205, 86, 0.7)",
                                ],
                                borderColor: [
                                    "rgb(255, 99, 132)",
                                    "rgb(255, 159, 64)",
                                    "rgb(255, 205, 86)",
                                    "rgb(75, 192, 192)",
                                    "rgb(54, 162, 235)",
                                    "rgb(153, 102, 255)",
                                    "rgb(201, 203, 207)",
                                    "rgb(255, 99, 132)",
                                    "rgb(255, 159, 64)",
                                    "rgb(255, 205, 86)",
                                ],
                                borderWidth: 1,
                                hoverBorderColor: "black",
                                hoverBorderWidth: 2,
                                pointHoverRadius: 5,
                            },
                        ],
                    },
                    options: { indexAxis: "y" },
                });
            }
        },
        async piechart() {
            const form = new FormData();
            form.append("current_user", localStorage.getItem("current_user"));

            const res = await fetch("http://localhost:8080/admin_pie_graph", {
                method: "POST",
                body: form,
            });
            if (res.ok) {
                const data = await res.json();
                const user_creator = data.user_creator;

                // Check if the chart already exists and destroy it
                if (this.user_creator_chart) {
                    this.user_creator_chart.destroy();
                }

                // Create a new chart using the canvas element
                this.user_creator_chart = new Chart('user_vs_creator', {
                    type: 'pie',
                    data: {
                        labels: ['no. of user', 'no of creators'],
                        datasets: [{
                            label: "User vs Creator",
                            data: user_creator,
                            backgroundColor: ['#5DA5DA ', '#FAA43A', '#60BD68',
                                '#B276B2', '#E16851', '#FB8267'],

                            borderWidth: 1,
                            hoverBorderColor: "black",
                            hoverBorderWidth: 2,
                            pointHoverRadius: 5
                        }],
                    },
                    options: {
                        title: {
                            display: true,
                            text: "User vs Creator",
                            fontSize: 20,
                        },
                        legend: {
                            position: "right",
                            labels: {
                                fontColor: "gray"
                            },
                            display: true,
                        },
                        elements: {
                            hitRadius: 3,
                        }
                    }
                });

            }
        },
    },

    mounted: async function () {
        this.likechart();
        this.piechart();
    },
};
