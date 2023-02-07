const colDefs = [ //определение макета столбцов
    { field: 'name', label: 'Имя', sort: true, getValue: (rowData) => rowData.name.firstName },
    { field: 'name', label: 'Фамилия', sort: true, getValue: (rowData) => rowData.name.lastName },
    { field: 'about', label: 'Описание', sort: true },
    {
        field: 'eyeColor',
        sort: true,
        label: 'Цвет глаз',
        renderCell: (cell, rowData) => {
            const div = document.createElement("div")
            div.style.backgroundColor = rowData.eyeColor;
            div.style.width = '100px';
            div.style.height = '20px';
            cell.appendChild(div)
        }
    },
]