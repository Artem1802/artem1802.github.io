class Pagination { //реализация класса пагинации
    constructor(paginationId, pageSize, onPageChange) {
        this.pagination = document.getElementById(paginationId)
        this.pageSize = pageSize
        this.onPageChange = onPageChange
        this.page = 1;
        this.bindOnClickEvent()
    }

    bindOnClickEvent() { // реализация события щелчка
        this.pagination.addEventListener('click', (e) => {
            if (e.target === this.pagination) return;
            const page = e.target.innerHTML
            this.setPage(page)
        })
    }

    setOnPageChange(onPageChange) { //изменение параметров страницы 
        this.onPageChange = onPageChange
    }

    setPage(page) { 
        this.page = page;
        this.onPageChange(page, this.pageSize)
    }

    markAsActive(pageEl) {
        pageEl.classlist.add('active');
    }

    resetActive(pageEl) {

    }

    setTotal(total) {
        this.total = total
    }

    render() {
        const pageCount = this.getPageCount();
        for (let i = 1; i <= pageCount; i++) {
            const div = document.createElement('div')
            div.innerHTML = i
            this.pagination.appendChild(div)
        }
    }

    getPageCount() {
        return Math.ceil(this.total / this.pageSize)
    }
}