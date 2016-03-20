var Calendar = function(parent) {
    this.init(parent);
};

Calendar.prototype.init = function(parent) {
    //today
    this.setToday();
    //write and cache DOM elements
    parent = parent || document.body;
    this.dom = document.createElement('div');
    this.dom.classList.add('calendar');
    this.dayDOM = document.createElement('div');
    this.dayDOM.classList.add('calendar__day');
    this.dom.appendChild(this.dayDOM);
    this.monthDOM = document.createElement('div');
    this.monthDOM.classList.add('calendar__month');
    this.dom.appendChild(this.monthDOM);
    this.render();
    parent.appendChild(this.dom);

    //add events
    this.addEventListeners();
};

Calendar.prototype.destroy = function() {
    //remove events
    this.removeEventListeners();
    //clean up DOM
    this.dom.parentNode.removeChild(this.dom);
};

Calendar.prototype.addEventListeners = function() {
    //bind event listeners
    this.dom.addEventListener('click', this.clickHandler.bind(this), false);
    document.body.addEventListener('keyup', this.keyupHandler.bind(this), false);
};

Calendar.prototype.clickHandler = function(e) {
    var action = e.target.dataset.action,
        method,
        args = [];
    if (!action) return;
    action = action.split(':');
    method = action[0];
    args = action[1].split(',') || [];
    this[method].apply(this, args);
};

Calendar.prototype.focusDate = function(date) {
    this.setDate(date);
    this.setDay(new Date(this.year, this.month, this.date).getDay());
    this.renderDay();
};

Calendar.prototype.focusMonth = function(direction) {
    var month = this.month;
    month += parseFloat(direction,10);
    if (month < 0) {
        month = 11;
        this.setYear(this.year - 1);
    } else if (month > 11) {
        month = 1;
        this.setYear(this.year + 1);
    }
    this.setMonth(month);
    this.renderMonth();
};

Calendar.prototype.keyupHandler = function(e) {
    var key = event.keyCode || event.which;
    console.log(key);
    switch (key) {
    case 37:
        this.focusMonth(-1);
        break;
    case 39:
        this.focusMonth(1);
        break;
    }
};

Calendar.prototype.removeEventListeners = function() {
    //unbind event listeners
    this.dom.removeEventListener('click', this.clickHandler, false);
    document.body.removeEventListener('keyup', this.keyupHandler, false);
};

Calendar.prototype.setToday = function(today) {
    today = today || new Date();
    this.setYear(today.getFullYear());
    this.setMonth(today.getMonth());
    this.setDate(today.getDate());
    this.setDay(today.getDay());
    this.today = today;
};

Calendar.prototype.setYear = function(year) {
    this.year = year;
};

Calendar.prototype.setMonth = function(month) {
    this.month = month;
};

Calendar.prototype.getMonthString = function(month) {
    var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    return months[month];
};

Calendar.prototype.setDate = function(date) {
    this.date = date;
};

Calendar.prototype.setDay = function(day) {
    this.day = this.getDayString(day);
};

Calendar.prototype.getDayString = function(day) {
    var days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];
    return days[day];
};

Calendar.prototype.render = function() {
    this.renderMonth();
    this.renderDay();
};

Calendar.prototype.renderMonth = function() {
    /*
        <header class="calendar__month__header">
            <button class="calendar__button--previous">&lt;</button>
            <div class="calendar__month__name">March 2016</div>
            <button class="calendar__button--next">&gt;</button>
        </header>
        <div class="calendar__month__days">
            <abbr class="calendar__month__day__name" title="Monday">M</abbr>
            <div class="calendar__month__day__date">1</div>
            <div class="calendar__month__day__date--current">2</div>
            <div class="calendar__month__day__date--filler"></div>
        </div>
    */
    var ct = 0,
        firstDay = new Date(this.year, this.month, 1).getDay(),
        daysInMonth = new Date(this.year, this.month + 1, 0).getDate(),
        displayableDays = 42,
        thisMonth = (this.year === this.today.getFullYear() && this.month === this.today.getMonth()),
        today = (thisMonth) ? this.today.getDate() : -1,
        monthDOM =
            '<header class="calendar__month__header">' +
                '<button class="calendar__button button--previous" data-action="focusMonth:-1">&lt;</button>' +
                '<div class="calendar__month__name">' + this.getMonthString(this.month) + ' ' + this.year + '</div>' +
                '<button class="calendar__button button--next" data-action="focusMonth:1">&gt;</button>' +
            '</header>';
    for (var i = 0; i < 7; i++) {
        monthDOM += '<abbr class="calendar__month__day day--name" title="' + this.getDayString(i) + '">' + this.getDayString(i)[0] + '</abbr>';
    }
    for (var i = 0; i < firstDay; i++) {
        monthDOM += '<div class="calendar__month__day day--date--filler"></div>';
        ct++;
    }
    for (var i = 1; i <= daysInMonth; i++) {
        if (i === today) {
            monthDOM += '<div class="calendar__month__day day--current" data-action="focusDate:' + i + '">' + i + '</div>';
        } else {
            monthDOM += '<div class="calendar__month__day day--date" data-action="focusDate:' + i + '">' + i + '</div>';
        }
        ct++;
    }
    for (var i = ct; i < displayableDays; i++) {
        monthDOM += '<div class="calendar__month__day day--date--filler"></div>';
    }
    this.monthDOM.innerHTML = monthDOM;
};

Calendar.prototype.renderDay = function() {
    /*
        <div class="calendar__day__name">Monday</div>
        <div class="calendar__day__number">1</div>
    */
    this.dayDOM.innerHTML = '<div class="calendar__day__name">' + this.day + '</div><div class="calendar__day__number"><span>' + this.date + '</span></div>';
};
