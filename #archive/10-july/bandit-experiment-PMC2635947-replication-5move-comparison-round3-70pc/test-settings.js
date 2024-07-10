document.addEventListener('DOMContentLoaded', function() {
    const columnsSlider = document.getElementById('columns');
    const rowsSlider = document.getElementById('rows');
    const columnsValue = document.getElementById('columnsValue');
    const rowsValue = document.getElementById('rowsValue');
    const nextButton = document.getElementById('nextButton');
    const output = document.getElementById('output');

    columnsSlider.addEventListener('input', function() {
        columnsValue.textContent = columnsSlider.value;
    });

    rowsSlider.addEventListener('input', function() {
        rowsValue.textContent = rowsSlider.value;
    });

    nextButton.addEventListener('click', function() {
        const columns = columnsSlider.value;
        const rows = rowsSlider.value;
        output.textContent = `Columns: ${columns}, Rows: ${rows}`;
    });
});
