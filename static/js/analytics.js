// /* Well hello there if you are reading this in the inspect mode. */
document.addEventListener('DOMContentLoaded', async function() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const userData = JSON.parse(localStorage.getItem('userData'));
    const token = localStorage.getItem('token');

    if (!userData || !token) {
        window.location.href = '/';
        return;
    }

    try {
        const response = await fetch('/api/user-activities', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch activity data');
        }

        const data = await response.json();
        if (data.success && data.activities) {
            processData(data.activities);
        } else {
            throw new Error(data.detail || 'Failed to fetch data');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        loadingOverlay.style.display = 'none';
        document.querySelector('.container').innerHTML = `
            <div style="color: white; text-align: center; padding: 2rem;">
                <h2>Error loading analytics</h2>
                <p>${error.message}</p>
                <button class="nav-btn" onclick="window.location.reload()">Retry</button>
            </div>
        `;
    }
});
const WEEK_RANGES = {
    1: {
        start: new Date('2025-01-13T00:00:00'), //Monday
        end: new Date('2025-01-19T23:59:59')    //Sunday
    },
    2: {
        start: new Date('2025-01-20T00:00:00'),
        end: new Date('2025-01-26T23:59:59')
    },
    3: {
        start: new Date('2025-01-27T00:00:00'),
        end: new Date('2025-02-02T23:59:59')
    },
    4: {
        start: new Date('2025-02-03T00:00:00'),
        end: new Date('2025-02-09T23:59:59')
    }
};

function calculateKPIs(data) {
    const totalDSA = data.reduce((sum, row) =>
        sum + (row.dsa_easy || 0) + (row.dsa_medium || 0) + (row.dsa_hard || 0), 0);

    const avgHours = data.reduce((sum, row) =>
        sum + (row.ml_hours || 0) + (row.de_hours || 0) + (row.ds_hours || 0) +
        (row.cert_hours || 0) + (row.proj_hours || 0) + (row.sd_hours || 0), 0) /
        (data.length || 1);

    const totalContent = data.reduce((sum, row) =>
        sum + (row.youtube_checked ? 1 : 0) + (row.linkedin_checked ? 1 : 0), 0);

    const totalAptitude = data.reduce((sum, row) =>
        sum + (row.aptitude_attempted ? (row.aptitude_questions || 0) : 0), 0);

    return {
        totalDSA,
        avgHours: parseFloat(avgHours.toFixed(2)),
        totalContent,
        totalAptitude
    };
}

function updateKPIDisplay(kpis) {
    document.getElementById('total-dsa').textContent = kpis.totalDSA;
    document.getElementById('avg-hours').textContent = kpis.avgHours;
    document.getElementById('total-content').textContent = kpis.totalContent;
    document.getElementById('total-aptitude').textContent = kpis.totalAptitude;
}

function processWeeklyDSAData(data, weekNumber) {
    console.log('Raw data received:', data);
    const weekRange = WEEK_RANGES[weekNumber];
    console.log('Week range:', weekRange);


    const weekData = data.filter(day => {
        const date = new Date(day.date);
        date.setHours(0, 0, 0, 0);  //Normalize time
        weekRange.start.setHours(0, 0, 0, 0);  //Normalize time
        weekRange.end.setHours(0, 0, 0, 0);    //Normalize time

        const isInRange = date >= weekRange.start && date <= weekRange.end;
        const hasData = day.dsa_easy > 0 || day.dsa_medium > 0 || day.dsa_hard > 0;

        console.log('Checking date:', date.toISOString(),
                    'In range:', isInRange,
                    'Has data:', hasData);

        return isInRange && hasData;
    });

    console.log('Filtered week data:', weekData);

    //sorting by date here
    weekData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // total calc for stats
    const totals = weekData.reduce((acc, day) => ({
        easy: acc.easy + (day.dsa_easy || 0),
        medium: acc.medium + (day.dsa_medium || 0),
        hard: acc.hard + (day.dsa_hard || 0)
    }), { easy: 0, medium: 0, hard: 0 });

    //updating stats display here
    document.getElementById('dsa-easy-total').textContent = totals.easy;
    document.getElementById('dsa-medium-total').textContent = totals.medium;
    document.getElementById('dsa-hard-total').textContent = totals.hard;

    //here i am formatting data for dsa linechaert
    const chartData = weekData.map(day => ({
        date: new Date(day.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        }),
        easy: parseInt(day.dsa_easy) || 0,
        medium: parseInt(day.dsa_medium) || 0,
        hard: parseInt(day.dsa_hard) || 0
    }));

    console.log('Chart data:', chartData);
    return chartData;
}


function createDSALineChart(weeklyData) {
    const traceEasy = {
        x: weeklyData.map(d => d.date),
        y: weeklyData.map(d => d.easy),
        name: 'Easy',
        type: 'scatter',
        mode: 'lines+markers',
        line: {
            width: 3,
            color: 'rgb(75, 192, 192)',  //Green CHOLOR
            shape: 'linear'
        },
        marker: {
            size: 8,
            symbol: 'circle'
        },
        hovertemplate: '<b>%{x}</b><br>Easy: %{y}<extra></extra>'
    };

    const traceMedium = {
        x: weeklyData.map(d => d.date),
        y: weeklyData.map(d => d.medium),
        name: 'Medium',
        type: 'scatter',
        mode: 'lines+markers',
        line: {
            width: 3,
            color: 'rgb(255, 159, 64)',  // Orange CHOLORRRR
            shape: 'linear'
        },
        marker: {
            size: 8,
            symbol: 'circle'
        },
        hovertemplate: '<b>%{x}</b><br>Medium: %{y}<extra></extra>'
    };

    const traceHard = {
        x: weeklyData.map(d => d.date),
        y: weeklyData.map(d => d.hard),
        name: 'Hard',
        type: 'scatter',
        mode: 'lines+markers',
        line: {
            width: 3,
            color: 'rgb(255, 99, 132)',  // Red COLORRRR
            shape: 'linear'
        },
        marker: {
            size: 8,
            symbol: 'circle'
        },
        hovertemplate: '<b>%{x}</b><br>Hard: %{y}<extra></extra>'
    };

    const layout = {
        height: 400,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: {
            color: 'white',
            family: 'Poppins, sans-serif'
        },
        margin: {
            l: 50,
            r: 20,
            t: 30,
            b: 50
        },
        showlegend: false,
        xaxis: {
            showgrid: true,
            gridcolor: 'rgba(255,255,255,0.1)',
            tickangle: -45,
            tickfont: { size: 10 }
        },
        yaxis: {
            showgrid: true,
            gridcolor: 'rgba(255,255,255,0.1)',
            title: 'Questions Solved',
            rangemode: 'nonnegative',
            tickmode: 'linear',
            tick0: 0,
            dtick: 1,
            range: [0, Math.max(...weeklyData.map(d => Math.max(d.easy, d.medium, d.hard))) + 1 || 5]
        }
    };

    Plotly.newPlot('dsa-line-chart', [traceEasy, traceMedium, traceHard], layout, {
        responsive: true,
        displayModeBar: false
    });
}

function processSQLData(data, weekNumber) {
    console.log('Raw SQL data received:', data);
    const weekRange = WEEK_RANGES[weekNumber];
    console.log('SQL Week range:', weekRange);

    const weekData = data.filter(day => {
        const date = new Date(day.date);
        date.setHours(0, 0, 0, 0);
        weekRange.start.setHours(0, 0, 0, 0);
        weekRange.end.setHours(0, 0, 0, 0);

        const isInRange = date >= weekRange.start && date <= weekRange.end;
        const hasData = day.sql_attempted && day.sql_questions > 0;

        console.log('Checking SQL date:', date.toISOString(),
                    'In range:', isInRange,
                    'Has data:', hasData);

        return isInRange && hasData;
    });

    console.log('Filtered SQL week data:', weekData);


    weekData.sort((a, b) => new Date(a.date) - new Date(b.date));


    const total = weekData.reduce((acc, day) => acc + (parseInt(day.sql_questions) || 0), 0);
    document.getElementById('sql-total').textContent = total;

    // chart datea preparation
    const chartData = weekData.map(day => ({
        date: new Date(day.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        }),
        questions: parseInt(day.sql_questions) || 0
    }));

    console.log('SQL Chart data:', chartData);
    return chartData;
}

function createSQLLineChart(sqlData) {
    const trace = {
        x: sqlData.map(d => d.date),
        y: sqlData.map(d => d.questions),
        type: 'scatter',
        mode: 'lines+markers',
        line: {
            width: 3,
            color: 'rgb(54, 162, 235)',  // Blue COLORRRR
            shape: 'linear'
        },
        marker: {
            size: 8,
            symbol: 'circle',
            color: 'rgb(54, 162, 235)'
        },
        hovertemplate: '<b>%{x}</b><br>Questions: %{y}<extra></extra>'
    };

    const layout = {
        height: 400,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: {
            color: 'white',
            family: 'Poppins, sans-serif'
        },
        margin: {
            l: 50,
            r: 20,
            t: 30,
            b: 50
        },
        showlegend: false,
        xaxis: {
            showgrid: true,
            gridcolor: 'rgba(255,255,255,0.1)',
            tickangle: -45,
            tickfont: { size: 10 }
        },
        yaxis: {
            showgrid: true,
            gridcolor: 'rgba(255,255,255,0.1)',
            title: 'Questions Solved',
            rangemode: 'nonnegative',
            tickmode: 'linear',
            tick0: 0,
            dtick: 1,
            range: [0, Math.max(...sqlData.map(d => d.questions)) + 1 || 5]
        }
    };

    Plotly.newPlot('sql-line-chart', [trace], layout, {
        responsive: true,
        displayModeBar: false
    });
}

function processAptitudeData(data, weekNumber) {
    const weekRange = WEEK_RANGES[weekNumber];

    // Filter data for selected week and only include days with aptitude activity
    const weekData = data.filter(day => {
        const date = new Date(day.date);
        date.setUTCHours(0, 0, 0, 0);

        const startDate = new Date(weekRange.start);
        startDate.setUTCHours(0, 0, 0, 0);

        const endDate = new Date(weekRange.end);
        endDate.setUTCHours(23, 59, 59, 999);

        const isInRange = date >= startDate && date <= endDate;
        const hasData = day.aptitude_attempted && day.aptitude_questions > 0;

        return isInRange && hasData;
    });

    // Sort by date
    weekData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate total for stats
    const total = weekData.reduce((acc, day) => acc + (parseInt(day.aptitude_questions) || 0), 0);
    document.getElementById('aptitude-total').textContent = total;

    // Return formatted data for chart
    return weekData.map(day => ({
        date: new Date(day.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        }),
        questions: parseInt(day.aptitude_questions) || 0
    }));
}

function createAptitudeLineChart(aptitudeData) {
    const trace = {
        x: aptitudeData.map(d => d.date),
        y: aptitudeData.map(d => d.questions),
        type: 'scatter',
        mode: 'lines+markers',
        line: {
            width: 3,
            color: 'rgb(153, 102, 255)',  // Purple coholoororor
            shape: 'linear'
        },
        marker: {
            size: 8,
            symbol: 'circle',
            color: 'rgb(153, 102, 255)'
        },
        hovertemplate: '<b>%{x}</b><br>Questions: %{y}<extra></extra>'
    };

    const layout = {
        height: 400,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: {
            color: 'white',
            family: 'Poppins, sans-serif'
        },
        margin: {
            l: 50,
            r: 20,
            t: 30,
            b: 50
        },
        showlegend: false,
        xaxis: {
            showgrid: true,
            gridcolor: 'rgba(255,255,255,0.1)',
            tickangle: -45,
            tickfont: { size: 10 }
        },
        yaxis: {
            showgrid: true,
            gridcolor: 'rgba(255,255,255,0.1)',
            title: 'Questions Solved',
            rangemode: 'nonnegative',
            tickmode: 'linear',
            tick0: 0,
            dtick: 1,
            range: [0, Math.max(...aptitudeData.map(d => d.questions)) + 1 || 5]
        }
    };

    Plotly.newPlot('aptitude-line-chart', [trace], layout, {
        responsive: true,
        displayModeBar: false
    });
}

function processHoursData(data) {
    return data.map(row => ({
        date: new Date(row.date).toLocaleDateString(),
        'Machine Learning': row.ml_hours || 0,
        'Data Engineering': row.de_hours || 0,
        'Data Analysis': row.ds_hours || 0,
        'Certification': row.cert_hours || 0,
        'Project': row.proj_hours || 0,
        'System Design': row.sd_hours || 0
    }));
}

function createHoursBarChart(data) {
    const categories = ['Machine Learning', 'Data Engineering', 'Data Analysis',
                       'Certification', 'Project', 'System Design'];

    const colors = {
        'Machine Learning': 'rgb(255, 99, 132)',    // Pink
        'Data Engineering': 'rgb(54, 162, 235)',    // Blue
        'Data Analysis': 'rgb(75, 192, 192)',       // Teal
        'Certification': 'rgb(255, 159, 64)',       // Orange
        'Project': 'rgb(153, 102, 255)',           // Purple
        'System Design': 'rgb(255, 205, 86)'        // Yellow
    };

    const traces = categories.map(category => ({
        name: category,
        type: 'bar',
        x: data.map(d => d.date),
        y: data.map(d => d[category]),
        marker: { color: colors[category] }
    }));

    const layout = {
        barmode: 'stack',
        height: 400,
        margin: { t: 30, r: 20, l: 50, b: 100 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: {
            color: 'white',
            family: 'Poppins, sans-serif'
        },
        showlegend: false,
        xaxis: {
            type: 'category',
            tickangle: -45,
            tickfont: { color: 'white' },
            gridcolor: 'rgba(255,255,255,0.1)'
        },
        yaxis: {
            title: 'Hours',
            titlefont: { color: 'white' },
            tickfont: { color: 'white' },
            gridcolor: 'rgba(255,255,255,0.1)'
        }
    };

    Plotly.newPlot('hours-bar-chart', traces, layout, {
        responsive: true,
        displayModeBar: false
    });
}

function initializeWeekSelectors(data) {
    document.getElementById('dsa-week-selector').addEventListener('change', (e) => {
        const weekData = processWeeklyDSAData(data, parseInt(e.target.value));
        createDSALineChart(weekData);
    });

    document.getElementById('sql-week-selector').addEventListener('change', (e) => {
        const weekData = processSQLData(data, parseInt(e.target.value));
        createSQLLineChart(weekData);
    });

    document.getElementById('aptitude-week-selector').addEventListener('change', (e) => {
        const weekData = processAptitudeData(data, parseInt(e.target.value));
        createAptitudeLineChart(weekData);
    });
}

function processData(data) {
    const loadingOverlay = document.getElementById('loadingOverlay');

    try {

        initializeWeekSelectors(data);


        const kpis = calculateKPIs(data);
        updateKPIDisplay(kpis);

        //processing inital data for week 1 in this snipppet
        const weeklyDSAData = processWeeklyDSAData(data, 1);
        createDSALineChart(weeklyDSAData);
        const sqlData = processSQLData(data, 1);
        createSQLLineChart(sqlData);
        const aptitudeData = processAptitudeData(data, 1);
        createAptitudeLineChart(aptitudeData);

        //processing hours data for stacker bar chaert
        const hoursData = processHoursData(data);
        createHoursBarChart(hoursData);

        //calender data for yt and linkedin content
        const contentWeeks = processContentData(data);
        createContentCalendar(contentWeeks);

        //STOPPING LOADING OVERLAY FROM BEING A FOREVER SORTA THIUNG
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    } catch (error) {
        console.error('Error processing data:', error);
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        document.querySelector('.container').innerHTML = `
            <div style="color: white; text-align: center; padding: 2rem;">
                <h2>Error processing data</h2>
                <p>${error.message}</p>
                <button class="nav-btn" onclick="window.location.reload()">Retry</button>
            </div>
        `;
    }
}

// this function was made possible by endless power of chatGPT
function processContentData(data) {
    // Update the start date to 2025
    const programStart = new Date('2025-01-13');
    const weeks = [{}, {}, {}, {}];

    data.forEach(day => {
        const date = new Date(day.date);
        date.setUTCHours(0, 0, 0, 0);

        // Calculate week index based on the start date
        const diffTime = date.getTime() - programStart.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const weekIndex = Math.floor(diffDays / 7);

        console.log('Processing content for date:', date, 'Week Index:', weekIndex);

        if (weekIndex >= 0 && weekIndex < 4) {
            // Handle YouTube content
            if (day.youtube_checked && day.youtube_link) {
                if (!weeks[weekIndex].youtube) {
                    weeks[weekIndex].youtube = [];
                }
                weeks[weekIndex].youtube.push({
                    date: date,
                    link: day.youtube_link
                });
            }

            // Handle LinkedIn content
            if (day.linkedin_checked && day.linkedin_link) {
                if (!weeks[weekIndex].linkedin) {
                    weeks[weekIndex].linkedin = [];
                }
                weeks[weekIndex].linkedin.push({
                    date: date,
                    link: day.linkedin_link
                });
            }
        }
    });

    console.log('Processed content weeks:', weeks);
    return weeks;
}

function createContentCalendar(weeks) {
    weeks.forEach((week, index) => {
        const weekContent = document.getElementById(`week${index + 1}-content`);
        if (!weekContent) return;

        weekContent.innerHTML = '';
        let hasContent = false;

        //yt kontent
        if (week.youtube && week.youtube.length > 0) {
            hasContent = true;
            week.youtube.forEach(video => {
                const videoElement = document.createElement('div');
                videoElement.className = 'content-item youtube-content';
                videoElement.innerHTML = `
                    <span class="content-icon">🎥</span>
                    <span class="content-date">${formatDate(video.date)}</span>
                    <div class="content-tooltip">View YouTube Video</div>
                `;

                if (video.link) {
                    videoElement.style.cursor = 'pointer';
                    videoElement.addEventListener('click', () => {
                        window.open(video.link, '_blank', 'noopener,noreferrer');
                    });
                }

                weekContent.appendChild(videoElement);
            });
        }

        //linkedin kontent
        if (week.linkedin && week.linkedin.length > 0) {
            hasContent = true;
            week.linkedin.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'content-item linkedin-content';
                postElement.innerHTML = `
                    <span class="content-icon">💼</span>
                    <span class="content-date">${formatDate(post.date)}</span>
                    <div class="content-tooltip">View LinkedIn Post</div>
                `;

                if (post.link) {
                    postElement.style.cursor = 'pointer';
                    postElement.addEventListener('click', () => {
                        window.open(post.link, '_blank', 'noopener,noreferrer');
                    });
                }

                weekContent.appendChild(postElement);
            });
        }

        //empty staste if no kontent
        if (!hasContent) {
            const emptyElement = document.createElement('div');
            emptyElement.className = 'content-item';
            emptyElement.style.opacity = '0.5';
            emptyElement.innerHTML = `<span>No content this week</span>`;
            weekContent.appendChild(emptyElement);
        }
    });
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}