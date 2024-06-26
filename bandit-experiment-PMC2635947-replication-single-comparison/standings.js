import { getUrlParameter, getScoresSoFar, nextRound, getComparersScoresSoFar, initializeFocusTracker } from './shared.js';

initializeFocusTracker();

document.addEventListener('DOMContentLoaded', function() {
    const round = getUrlParameter('round');
    const finalRound = JSON.parse(sessionStorage.getItem('gameSettings')).numberOfRounds;
    const scores = getScoresSoFar();
    const socialScores = getComparersScoresSoFar();

    const scoresSum = scores.reduce((total, score) => total + score, 0);
    const socialScoresSum = socialScores.reduce((total, socialScores) => total + socialScores, 0);
    /*const avgScore = (scoresSum / scores.length).toFixed(1);*/
    const avgScore = Math.max(...scores);
    const avgSocialScore = Math.max(...socialScores);

    const data = [
        { name: "n3ssiori", score: 0 },
        { name: "You", score: 0 } // init for animation
    ];

    // Create SVG container
    const svg = d3.select("#barChart");

    // Set margins and dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    // Create scales
    const xScale = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .domain(data.map(d => d.name));

    const ymax = socialScoresSum;
    let ymin = 0;
    if (avgScore < 0) {
      ymin = avgScore;
    }
    const yScale = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([ymin, ymax]);

    // Create axes
    const xAxis = d3.axisBottom(xScale);

    // Append axes
    svg.append("g")
      .attr("transform", `translate(${margin.left}, ${yScale(0) + margin.top})`)
      .call(xAxis);

    var youTick = svg.selectAll(".tick text").filter(function() { return d3.select(this).text() === "You"; })
    youTick.attr("fill", "#1F449C");
    if (avgScore < 0) {
      youTick.attr("dy", "-1em");
    }

    // Create initial bars
    const bars = svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.name) + margin.left)
      .attr("y", d => yScale(d.score) + margin.top)
      .attr("width", xScale.bandwidth())
      .attr("height", d => 0);

    // Add text labels
    svg.selectAll(".bar-label")
      .data(data)
      .enter().append("text")
      .attr("class", "bar-label")
      .attr("x", d => xScale(d.name) + margin.left + xScale.bandwidth() / 2)
      .attr("y", d => yScale(0) - margin.top + 50)
      .attr("text-anchor", "middle")
      .attr("fill", "transparent")
      .text(d => Math.round(d.score));

    function updateSocialBar(player1Score) {
      data[0].score = player1Score;

      // Update scales
      const maxScore = Math.max(avgSocialScore, avgScore);
      const minScore = Math.min(0, avgScore);
      yScale.domain([minScore, maxScore]);

      // Update "Player 1" score with animation
      bars.filter(d => d.name === "n3ssiori")
        .transition()
        .duration(2000)
        .attr("y", d => yScale(Math.max(0, d.score)) + margin.top)
        .attr("height", d => Math.abs(yScale(0) - yScale(d.score)));

      // Update text labels
      svg.selectAll(".bar-label")
        .data(data)
        .filter(d => d.name === "n3ssiori")
        .text(d => Math.round(d.score)) // Update text content with score
        .transition()
        .duration(2000)
        .attr("fill", "white")
        .attr("y", d => yScale(Math.max(0, d.score)) + margin.top + 20);
    }

    function updatePlayerBar(avgScore) {
      data[1].score = avgScore;

      // Update scales
      const maxScore = Math.max(avgSocialScore, avgScore);
      const minScore = Math.min(0, avgScore);
      yScale.domain([minScore, maxScore]);

      // Update "You" score with animation
      bars.filter(d => d.name === "You")
          .transition()
          .duration(2000)
          .attr("y", d => yScale(Math.max(0, d.score)) + margin.top)
          .attr("height", d => Math.abs(yScale(0) - yScale(d.score)));

      svg.selectAll(".bar-label")
        .data(data)
        .filter(d => d.name === "You")
        .text(d => Math.round(d.score)) // Update text content with score
        .transition()
        .duration(2000)
        .attr("fill", d => Math.abs(yScale(0) - yScale(d.score)) < 50 ? "black" : "white") // Conditionally change text color
        .attr("y", d => {
          const barHeight = Math.abs(yScale(0) - yScale(d.score));
          if (barHeight < 50) {
            if (avgScore < 0) {
              return yScale(Math.max(0, d.score)) + margin.top + 20;// Move text below bar
            } else {
              return yScale(Math.max(0, d.score)) + margin.top - 5;// Move text above bar
            } 
          } else {
            return yScale(Math.max(0, d.score)) + margin.top + 20; // Default position
          }
        });
    }

    // Update scores with some delay to see the animation
    setTimeout(() => {
        updateSocialBar(avgSocialScore);
    }, 500); // Delay
    
    setTimeout(() => {
        updatePlayerBar(avgScore);
    }, 2500); // Delay

    const butt = document.getElementById('next');
    if (butt) {
      butt.disabled = true;
      butt.style.cursor = 'not-allowed'; // Change cursor to not-allowed
      butt.addEventListener('click', nextRound);
      butt.innerHTML = "Next Round? Round " + (parseFloat(round) + 1) + " of " + finalRound;
    }

    setTimeout(() => {
        butt.disabled = false;
        butt.classList.add('enabled');
        butt.style.cursor = 'pointer';
    }, 6000);
});
