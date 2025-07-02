async function loadData() {
  try {
    const response = await fetch('notion-data.json'); // Local Notion export
    const data = await response.json();

    const summary = {};

    data.results.forEach(row => {
      const expense = row.properties.Expense.title[0]?.text?.content || 'Unknown';
      const amount = row.properties.Amount.number || 0;

      if (!summary[expense]) summary[expense] = 0;
      summary[expense] += amount;
    });

    const labels = Object.keys(summary);
    const values = Object.values(summary);

    const ctx = document.getElementById('expenseChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Amount',
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: 'Expenses from Notion DB'
          }
        }
      }
    });

  } catch (error) {
    console.error("Error loading or parsing Notion data:", error);
  }
}

loadData();
