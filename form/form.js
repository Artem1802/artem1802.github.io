const form = document.getElementById('edit-form') //Возвращает ссылку на элемент по его идентификатору
let editingRow = null; //значения editingRow и editingRowData неизвестны
let editingRowData = null;

function onEditRowData(row, rowData) { //функция редактирования данных для строки
    editingRow = row;     
    editingRowData = rowData;
    showForm() 
    form.firstName.value = rowData.name.firstName;  
    form.lastName.value = rowData.name.lastName; 
	form.about.value = rowData.about; 
	form.eyeColor.value = rowData.eyeColor;  
}

function hideForm() {        //код функции сокрытия формы
    form.parentElement.style.display = 'none'
}

function showForm() {       //код функции показа формы
    form.parentElement.style.display = 'block'
}

function bindOnSubmitToForm(table) {    //обработка событий
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        hideForm();
        const newRowData = {  //объект новых данных
            name: {
                firstName: form.firstName.value,
                lastName: form.lastName.value
			},
			about: form.about.value,
			eyeColor: form.eyeColor.value
        };

        table.editRow(editingRow, newRowData)
        const itemIndex = data.findIndex(item => item.id === editingRowData.id);
        if (itemIndex !== -1) 
            data.splice(itemIndex, 1, newRowData) 
    })
}