class Table { // таблица представлена в виде класса с несколькими функциями: 
  constructor(tableId, colDefs) { // функции сортировки, обработчики событий, функции управления видимостью (показ и сокрытие колонок)
    this.table = document.getElementById(tableId);
    this.tbody = this.table.createTBody();
    this.thead = this.table.createTHead();
    this.colStates = {};
    this.colDefs = colDefs;
    this.currentSortingColIndex = 0;
    this.createHeader();
  }

  setRowsData(rowsData) {
    this.rowsData = rowsData;
  }

  addSortToHeader(theadRow) { // начало кода сортировки
    for (let i = 0; i < this.colDefs.length; i++) {
      const colDef = this.colDefs[i];
      const cell = theadRow.cells[i];
      if (!colDef.sort) continue;
      this.saveColState(i, { direction: 1 })
      cell.innerHTML = (colDef.label || '') + '↑'
      if (colDef.sort) this.bindSortEventForTheadCell(colDef, cell)
    }
  }

  bindSortEventForTheadCell(colDef, cell) { // привязка события к столбцам в заголовке таблицы
    cell.addEventListener('click', () => {
      const prevColState = this.getColStateByIndex(cell.cellIndex)
      this.currentSortingColIndex = cell.cellIndex;
      const direction = -prevColState.direction;
      cell.innerHTML = colDef.label ?? ''
      if (direction > 0) cell.innerHTML += '↑'
      else cell.innerHTML += '↓'
      this.saveColState(cell.cellIndex, { direction })
      this.render();
    })
  }

  saveSortColState(colIndex) {
    this.saveColState(colIndex, {})
  }

  applyColsSort() {
    const colState = this.getColStateByIndex(this.currentSortingColIndex);
    const colDef = this.colDefs[this.currentSortingColIndex];
    console.log(this.rowsData)
    this.rowsData.sort((a, b) => {
      const value1 = this.getRowDataFieldValue(colDef, a)
      const value2 = this.getRowDataFieldValue(colDef, b)
      if (typeof value1 === 'string')
        return colState.direction * value1.localeCompare(value2)
      else if (typeof value1 === 'number')
        return colState.direction * (value1 - value2)
      return sortExpression
    })
  }

  createHeader() { // создание заголовка таблицы
    const theadRow = this.thead.insertRow(0);
    for (const colDef of this.colDefs) {
      const th = document.createElement("th");
      th.innerHTML = colDef.label ?? ''
      theadRow.appendChild(th)
    }
    this.addSortToHeader(theadRow);
  }

  toggleColVisibility(colIndex) { // начало кода показа/сокрытия колонок таблицы
    this.saveVisibilityColState(colIndex)
    for (const cell of this.getColCellsByIndex(colIndex)) {
      if (!cell.style.display) cell.style.display = 'none'
      else cell.removeAttribute('style')
    }
  }

  saveVisibilityColState(colIndex) { //сохранение состояния колонок таблицы (видимые или скрытые)
    const colState = this.getColStateByIndex(colIndex) 
    if (colState && colState.hidden) this.saveColState(colIndex, { hidden: false })
    else this.saveColState(colIndex, { hidden: true })
  }

  saveColState(colIndex, colState) {
    this.colStates[colIndex] = Object.assign(this.colStates[colIndex] || {}, colState)
  }

  applyColsVisibility() {
    for (const [colIndex, colState] of Object.entries(this.colStates)) {
      if (colState.hidden)
        this.hideColByIndex(colIndex)
    }
  }

  getColStateByIndex(colIndex) { //получение состояния колонки по её индексу
    return this.colStates[colIndex] || {}
  }

  hideColByIndex(colIndex) { // сокрытие колонки по индексу
    for (const cell of this.getColCellsByIndex(colIndex))
      cell.style.display = 'none'
  }

  getColCellsByIndex(colIndex) { //получение ячеек столбца таблицы по индексу
    const cells = [];
    for (let i = 0; i < this.table.rows.length; i++) {
      const row = this.table.rows[i];
      const cell = row.cells[colIndex]
      if (!cell) return [];
      cells.push(cell)
    }
    return cells
  }

  render() { // обновление строк таблицы
    this.removeAllRows();
    for (const rowData of this.rowsData) this.createRowWithRowData(rowData);
    this.applyColsVisibility();
    this.applyColsSort();
  }

  removeAllRows() {
    this.tbody.innerHTML = "";
  }

  createRowWithRowData(rowData, rowIndex) { //создать строку таблицы
    const row = this.tbody.insertRow(rowIndex ?? -1);
    this.bindRowEvents(row, rowData);
    this.fillRowWithData(row, rowData);
  }

  bindRowEvents(row, rowData) { // обработчик события для строки
    row.addEventListener("click", () => {
      if (this.onEdit) this.onEdit(row, rowData);
    });
  }

  editRow(row, rowData) { // функция редактирования строки
    const rowCellsLength = row.cells.length;
    for (let i = 0; i < rowCellsLength; i++) row.deleteCell(0);
    const rowIndex = row.rowIndex - 1;
    this.tbody.deleteRow(rowIndex);
    this.createRowWithRowData(rowData, rowIndex);
  }

  setOnEdit(onEdit) {
    this.onEdit = onEdit;
  }

  fillRowWithData(row, rowData) { // заполнение строки таблицы данными
    for (const colDef of this.colDefs) {
      const value = this.getRowDataFieldValue(colDef, rowData);
      if (!value && !colDef.renderCell) continue;
      const cell = row.insertCell();
      if (colDef.renderCell) {
        colDef.renderCell(cell, rowData);
        continue;
      }
      const textNode = document.createTextNode(value);
      cell.appendChild(textNode);
    }
  }

  getRowDataFieldValue(colDef, rowData) {
    let value = rowData[colDef.field];
    if (!value && !colDef.getValue) return;
    if (colDef.getValue) value = colDef.getValue(rowData);
    return value;
  }
}
