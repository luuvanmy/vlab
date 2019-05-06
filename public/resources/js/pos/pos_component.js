Vue.filter('name', function (value) {
    return value == '' ? 'Unknown' : value;
});
Vue.filter('capitalize', function (value) {
    if (!value) return '';
    var to = _.capitalize(value);
    return to;
})
Vue.filter('text-lowercase', function (value) {
    return (value != '') ? String(value).toLowerCase() : '';
});
Vue.filter('iso-full-time', function (value) {
    return moment(value).format('HH:mm DD/MM');
});
Vue.filter('iso-time', function (value) {
    return moment(value).format('HH:mm');
});

Vue.filter('full-time', function (value) {

    return moment(new Date(value * 1000)).format('HH:mm:ss DD/MM/YYYY');
});

Vue.filter('only-day', function (value) {
    return moment(new Date(value * 1000)).format('DD/MM/YYYY');
})
Vue.filter('day', function (value) {
    return moment(new Date(value * 1000)).format('DD');
})
Vue.filter('month', function (value) {
    return moment(new Date(value * 1000)).format('MM');
})
Vue.filter('year', function (value) {
    return moment(new Date(value * 1000)).format('YYYY');
})
Vue.filter('dd-mm', function (value) {
    return moment(new Date(value * 1000)).format('DD/MM');
})
Vue.filter('prev-month', function (value) {
    return moment(new Date(value * 1000)).subtract(1, 'months').endOf('month').format('MM');
})
Vue.filter('money', function (value) {
    return (value == undefined) ? '' : value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
})
Vue.filter('phone', function (phone) {
    return phone.replace(/[^0-9]/g, '')
        .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
});
Vue.filter('short-money', function (value) {
    if (value > 1000000000) {
        value = Math.floor((value / 1000000000)).toFixed(0);
        return '~ ' + value + 'B';
    }
    if (value > 1000000) {
        value = Math.floor((value / 1000000)).toFixed(0);
        return '~ ' + value + 'M';
    }
    if (value > 1000) {
        value = Math.floor((value / 1000)).toFixed(0);
        return value + 'K';
    }
    return value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
})

Vue.filter('dd-mm-yyyy', function (value) {
    return helper.formatDate(new Date(value * 1000), 'dd/mm/yyyy');
})
Vue.filter('mm-dd-yyyy', function (value) {
    return helper.formatDate(new Date(value * 1000), 'mm/dd/yyyy');
})
Vue.filter('timeago', function (value) {
    
    return moment(new Date(value * 1000)).startOf().fromNow();
})
Vue.component('suggestion', {
    template: '<div class="list-suggestions">\
            <input type="text" \
            :class="extendedOptions.inputClass"\
            ref="input"\
            v-bind="$attrs"\
            v-on:keydown="onKeyDown"\
            v-on:blur="hideItems"\
            v-on:focus="showItems = true"\
            v-model="query"\
            :placeholder="extendedOptions.placeholder">\
            <div class="suggestions">\
                <ul ref="list" class="items" v-show="items.length > 0 && showItems === true">\
                    <li class="item"\
                    :key="index"\
                    :data-index="index"\
                    v-for="(item, index) in items"\
                    @click.prevent="selectItem(index)"\
                    v-bind:class="{\'is-active\': index === activeItemIndex }">\
                        <slot name="item" :data="item"></slot>\
                    </li>\
                </ul>\
            </div>\
        </div>',
    props: {
        options: {
            type: Object,
            default: {}
        },
        change: {
            type: Function,
            required: true
        },
        select: {
            type: Function
        },
        value: {
            type: String,
            required: true
        }
    },
    data: function () {
        var defaultOptions = {
            debounce: 0,
            placeholder: '',
            inputClass: 'input'
        }
        var extendedOptions = Object.assign({}, defaultOptions, this.options)
        return {
            extendedOptions,
            query: this.value,
            lastSetQuery: null,
            items: [],
            activeItemIndex: -1,
            showItems: false
        }
    },
    beforeMount: function () {
        if (this.extendedOptions.debounce !== 0) {
            this.onQueryChanged = _.debounce(this.onQueryChanged, this.extendedOptions.debounce)
        }
    },
    watch: {
        'query': function (newValue, oldValue) {
            if (newValue === this.lastSetQuery) {
                this.lastSetQuery = null
                return
            }
            this.onQueryChanged(newValue)
            this.$emit('input', newValue)
        },
        'value': function (newValue, oldValue) {
            this.setInputQuery(newValue)
        }
    },
    methods: {
        setFocus : function(){
            $(this.$refs.input).select();
        },
        onItemSelectedDefault: function (item) {
            if (typeof item === 'string') {
                this.$emit('input', item)
                this.setInputQuery(item)
                this.showItems = false
            }
        },
        hideItems: function () {
            var vm = this;
            setTimeout(function () {
                vm.showItems = false
            }, 150)
        },
        showResults: function () {
            this.showItems = true;
        },
        setInputQuery: function (value) {
            this.lastSetQuery = value;
            this.query = value;
        },
        onKeyDown: function (e) {
            switch (e.keyCode) {
                case 40:
                    this.highlightItem('down');
                    e.preventDefault();
                    break
                case 38:
                    this.highlightItem('up');
                    e.preventDefault();
                    break
                case 13:
                    this.selectItem();
                    e.preventDefault();
                    break
                default:
                    return true
            }
        },
        selectItem: function (index) {
            var item = null;
            if (typeof index === 'undefined') {
                if (this.activeItemIndex === -1) {
                    return
                }
                item = this.items[this.activeItemIndex];
            } else {
                item = this.items[index];
            }
            if (!item) {
                return
            }
            if (this.select) {
                this.select(item);
                if (this.extendedOptions.hasOwnProperty('focusOnSelect') && this.extendedOptions['focusOnSelect']) {
                    this.$refs.input.select();
                }
            } else {
                this.onItemSelectedDefault(item);
            }
            this.hideItems();
        },
        highlightItem: function (direction) {
            if (this.items.length === 0) {
                return
            }
            var selectedIndex = this.items.findIndex((item, index) => {
                return index === this.activeItemIndex;
            })
            if (selectedIndex === -1) {
                if (direction === 'down') {
                    selectedIndex = 0;
                } else {
                    selectedIndex = this.items.length - 1;
                }
            } else {
                this.activeIndexItem = 0;
                if (direction === 'down') {
                    selectedIndex++;
                    if (selectedIndex === this.items.length) {
                        selectedIndex = 0;
                    }
                } else {
                    selectedIndex--;
                    if (selectedIndex < 0) {
                        selectedIndex = this.items.length - 1;
                    }
                }
            }
            this.activeItemIndex = selectedIndex;
            this.$nextTick(function () {
                this.resultNext(direction, selectedIndex);
            })

        },
        resultNext: function (direction, selectedIndex) {
            var results = $(this.$refs.list);
            var next = results.find('[data-index=' + selectedIndex + ']');
            results.scrollToElement(next, 300);
        },
        setItems: function (items) {
            this.items = items;
            this.activeItemIndex = -1;
            this.showItems = true;
        },
        onQueryChanged: function (value) {
            var vm = this;
            var result = this.change(value);
            this.items = [];
            if (typeof result === 'undefined' || typeof result === 'boolean' || result === null) {
                return;
            }
            if (result instanceof Array) {
                this.setItems(result);
            } else if (typeof result.then === 'function') {
                result.then(function (items) {
                    vm.setItems(items);
                })
            }
        }
    }
})
if (typeof VueForm != 'undefined') {
    Vue.use(VueForm, {
        inputClasses: {
            valid: 'form-control-success',
            invalid: 'form-control-danger'
        },
        validators: {
            matches: function (value, attrValue) {
                if (!attrValue) {
                    return true;
                }
                return value === attrValue;
            },
            'password-strength': function (value) {
                return /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(value);
            },
            phone: function (value) {
                return helper.isNumber(value);
            },
            minvalue: function (value, attrValue) {
                if (!attrValue) {
                    return true;
                }
                return value >= attrValue;
            },
            url: function (value) {
                // return pattern.test(value);
                return true;
            },
            'check-unique': function (value, attrValue, vnode) {
                console.log(value);
                console.log(attrValue);
                console.log(vnode);
                // return new Promise((resolve, reject) => {
                //    this.debounced(value, resolve, reject);
                // });
                return true;

            }
        }
    });
}
Vue.component('select2', {
    props: {
        value: {
            required: true,
        },
        options: {
            type: Array,
        },
        placeholder: {
            type: String,
        },
        notfound: {
            type: String,
            default: 'Không tìm thấy !',
        },
        search: {
            type: Boolean,
            default: false,
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        change: {
            type: Function,
        },
        allowclear: {
            type: Boolean,
            default: false,
        },
        max: {
            type: Number,
            default: 10,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        position: {
            type: String,
            default: 'left'
        },
        icon: {
            type: String,
        },
        width: {
            type: String,
            default: 'resolve'
        },
        labels: {
            type: Array,
        }
    },
    template: '<select class="form-control" ></select>',
    created: function () {
        this.convert();

    },
    mounted: function () {
        var vm = this;
        var config = {
            disabled: this.disabled,
            multiple: this.multiple,
            minimumResultsForSearch: this.search ? 0 : -1,
            allowClear: this.allowclear,
            data: this.data,
            language: {
                noResults: function () {
                    return vm.notfound;
                }
            },
            escapeMarkup: function (markup) {
                return markup;
            }
        };
        if (this.placeholder != undefined) {
            config['placeholder'] = this.placeholder;
        }
        this.config = config;
        this.init();

    },

    data: function () {
        return {
            data: [],
            config: {},
            selected: this.value,
            select2: null,
        }
    },
    methods: {
        convert: function () {
            var vm = this;
            var data = [];
            if (_.isArray(vm.options)) {

                if (vm.labels != undefined && vm.labels.length == 2) {
                    data = vm.options.map(function (item) {
                        var el = {};
                        el['id'] = item[vm.labels[0]];
                        var text = '';
                        if (item.hasOwnProperty(vm.labels[1])) {
                            text = item[vm.labels[1]];
                        }
                        el['text'] = String(text).capitalize();
                        return el;
                    })
                } else {
                    data = vm.options.map(function (item) {
                        var el = {};
                        el['id'] = item.hasOwnProperty('id') ? item['id'] : (item.hasOwnProperty('_id') ? item['_id'] : '');
                        var text = '';
                        if (item.hasOwnProperty('text')) {
                            text = item['text'];
                        } else if (item.hasOwnProperty('name')) {
                            text = item['name'];
                        } else if (item.hasOwnProperty('code')) {
                            text = item['code'];
                        }
                        el['text'] = text;
                        return el;
                    })
                }
            }
            vm.data = data;
        },
        init: function () {
            var vm = this;
            vm.config['data'] = vm.data;
            if (vm.placeholder != undefined && !vm.multiple) {
                $(vm.$el).append("<option></option>")
            }

            if (vm.multiple) {
                vm.select2 = $(vm.$el).select2(vm.config).on('change', function (e) {
                    vm.$emit('input', $(this).val());
                    if (vm.change != undefined && typeof vm.change == 'function') {
                        vm.change();
                    }
                });
            } else {
                vm.select2 = $(vm.$el).select2(vm.config).on({
                    'select2:select': function (e) {
                        vm.$emit('input', e.params.data.id);
                        if (vm.change != undefined && typeof vm.change == 'function') {
                            vm.change();
                        }
                    } 
                    ,'select2:unselecting' : function(e){
                        var data = e.params.data;  
                        $(this).data('state', 'unselected');
                        if( data == undefined){
                            vm.$emit('input', '');
                        }
                    },'select2:open' : function(e){
                        if ($(this).data('state') === 'unselected') {
                            $(this).removeData('state'); 
                            var self = $(this);
                            setTimeout(function() {
                                self.select2('close');
                            }, 1);
                        }  
                    }
                });

            }
            if (vm.value != undefined && vm.value != '') {
               vm.select2.val(vm.value).trigger("change.select2");
                
            } else {
                if (_.find(vm.data, {
                        id: vm.value
                    }) == undefined && !vm.multiple) {
                    vm.$emit('input', '');
                }
            }
        },
        destroy: function () {
            if ($(this.$el).data('select2')) {
                this.select2.select2('destroy');
                $(this.$el).empty();
                this.init();
            }
        }
    },
    watch: {
        options: {
            handler : function(){
                this.convert();
                this.destroy();
            },
            deep : true
        },
        'value': function (newval) {
            this.select2.val(newval).trigger('change.select2');
        },
        'disabled': function (newval) {
            $(this.$el).attr('disabled', newval);
        }
    },
    computed: {

    },
})

Vue.component('timeago' , {
    props : {
        time : {
            type : Number,
            required : true,
        }
    },
    template : '<span>{{message}}</span>',
    data : function(){
        return {
            message : '',
            timeout : null ,
        }
    },
    watch : {
        time : function(value){
            clearInterval(this.timeout);
            this.message = moment(new Date(value * 1000)).startOf().fromNow();
            this.timeout = setInterval(()=>{
                this.message = moment(new Date(value * 1000)).startOf().fromNow()
            },30000);
        }
    },
    beforeDestroy : function(){
        clearInterval(this.timeout);
    },
    created : function(){
        this.message = moment(new Date(this.time * 1000)).startOf().fromNow();
        this.timeout = setInterval(()=>{
            this.message = moment(new Date(this.time * 1000)).startOf().fromNow()
        },30000);
    }
})


Vue.component('pagination', {
    props: {
        change: {
            type: Function,
            required : true,
        },
        current : {
            type : Number,
            required : true,
        },
        total: {
            type: Number,
        },
        pageshow: {
            type: Number,
            default: 5,
        },
        pageRange: {
            type: Number,
            default: 3
        },
        withNextPrev: {
            type: Boolean,
            default: true
        },
        activeBGColor: {
            type: String,
        },
        customActiveBGColor: {
            type: String,
            default: null,
        }
    },
    template: '<ul v-if="total > 1 && total < 8" class="pagination pagination-split"><li v-if="withNextPrev" :class="disablePrev"><a @click="!disablePrev ? btnPrev() : \'\'">\n                        <i class="fa fa-angle-left"></i>\n                    </a>\n                </li>\n                <li v-for="n in total" :class="n == selected ? \'active \' + activeBGColor  : \'\'">\n                    <a @click="emitBtnClick(n)" :style="customActiveBGColor && n == selected ? {background: customActiveBGColor, borderColor: customActiveBGColor} : {}">\n                    {{ n }}\n                    </a>\n                </li>\n                <li v-if="withNextPrev" :class="disableNext">\n                    <a @click="!disableNext ? btnNext() : \'\'">\n                        <i class="fa fa-angle-right"></i>\n                    </a>\n                </li>\n            </ul>\n\n            <ul v-else-if="total >= 8" class="pagination pagination-split">\n                <li v-if="withNextPrev" :class="disablePrev">\n                    <a @click="!disablePrev ? btnPrev() : \'\'">\n                        <i class="fa fa-angle-left"></i>\n                    </a>\n                </li>\n                <template v-for="(item , index) in pages">\n                    <template v-if="item.show">\n                        <li v-if="item.disable != \'disabled\'" :class="item.content == selected ? \'active \' + activeBGColor : \'\' + item.disable">\n                            <a @click="emitBtnClick(item.content)" :style="customActiveBGColor && item.content == selected ? {background: customActiveBGColor, borderColor: customActiveBGColor} : {}">\n                                {{ item.content}}\n                            </a>\n                        </li>\n                        <li v-else>\n                            <a v-if="!item.showInput" @click.stop.prevent="showDotsInput(index ,  $event)">...</a>\n                            <span v-else style="padding:0;width:50px;">\n                                <input type="number" @change="onChange($event.target.value)" style="border:none;width:100%;height:32px;padding:0 3px;text-align: center;"/>\n                            </span>\n\n                        </li>\n                    </template>\n                </template>\n                <li v-if="withNextPrev" :class="disableNext">\n                    <a @click="!disableNext ? btnNext() : \'\'"><i class="fa fa-angle-right"></i>\n                    </a>\n                </li>\n            </ul>',

    mounted: function () {
        this.init();
    },
    data: function () {
        return {
            selected: (this.current) ? this.current : 1,
            disableNext: '',
            disablePrev: '',
            pages: [],
        };
    },
    methods: {
        emitBtnClick: function (n) {
            this.change(n);
            
        },
        onChange: function (number) {
            var num = parseInt(number);
            if (num > 0 && num <= this.total) {
                this.change(num);
                this.disablePrevNext();
            } else {
                this.init();
            }
        },
        btnNext: function () {
            this.change( this.selected+ 1);
            this.disablePrevNext();
        },

        btnPrev: function () {
            this.change( this.selected - 1);
            this.disablePrevNext();
        },
        disablePrevNext: function () {
            this.disablePrev = this.selected == 1 ? 'disabled' : '';
            this.disableNext = this.selected == this.total ? 'disabled' : '';
        },
        init: function () {
            var items = [];
            for (var i = 0; i < this.total; i++) {
                var page = {
                    content: i + 1,
                    disable: '',
                    show: false
                }
                items[i] = page;
            }
            var page1 = {
                content: '...',
                disable: 'disabled',
                show: false,
                showInput: false,
            }
            var page2 = {
                content: '...',
                disable: 'disabled',
                show: false,
                showInput: false,
            }
            items.splice(1, 0, page1);
            items.splice(items.length - 1, 0, page2);
            for (var i = 0; i < items.length; i++) {
                if (i == 0 || i == items.length - 1)
                    items[i].show = true;

                if (this.selected <= this.pageRange) {
                    if (this.selected == this.pageRange) {
                        if (i >= 2 && i <= this.pageRange + 1)
                            items[i].show = true;
                    } else {
                        if (i >= 2 && i <= this.pageRange)
                            items[i].show = true;
                    }
                    items[items.length - 2].show = true;
                } else if (this.selected > this.pageRange) {
                    if (i >= this.selected - 1 && (this.selected + 2) < items.length - 2 && i <= this.selected + 1) {
                        items[1].show = true;
                        items[items.length - 2].show = true;
                        items[i].show = true;
                    } else if (i >= items.length - 2 - this.pageRange && (this.selected + 2) >= items.length - 2) {
                        items[1].show = true;
                        items[items.length - 2].show = false;
                        items[i].show = true;
                    }
                }

            }
            this.pages = items;
            this.disablePrevNext();
        },
        showDotsInput: function (index, $event) {
            var vm = this;
            var target = $($event.target).parent();
            this.pages[index].showInput = true;
            this.$nextTick(function () {
                target.parent().find('input').select();
            })
        }
    },
    watch: {
        'total' : function(){
            this.init();
        },
        'current': function (newval) {
            this.selected = newval;
            this.disablePrevNext();
        }
    }
});

Vue.component('paginationold', {
    props: {
        current: {
            type: Number,
            default: 1,
        },
        total: {
            type: Number,
        },
        pageshow: {
            type: Number,
            default: 5,
        },
        pageRange: {
            type: Number,
            default: 3
        },
        withNextPrev: {
            type: Boolean,
            default: true
        },
        activeBGColor: {
            type: String,
        },
        customActiveBGColor: {
            type: String,
            default: null,
        }
    },
    template: '\n            <ul v-if="total > 1 && total < 8" class="pagination pagination-split">\n                <li v-if="withNextPrev" :class="disablePrev">\n                    <a @click="!disablePrev ? btnPrev() : \'\'">\n                        <i class="fa fa-angle-left"></i>\n                    </a>\n                </li>\n                <li v-for="n in total" :class="n == selected ? \'active \' + activeBGColor  : \'\'">\n                    <a @click="emitBtnClick(n)" :style="customActiveBGColor && n == selected ? {background: customActiveBGColor, borderColor: customActiveBGColor} : {}">\n                    {{ n }}\n                    </a>\n                </li>\n                <li v-if="withNextPrev" :class="disableNext">\n                    <a @click="!disableNext ? btnNext() : \'\'">\n                        <i class="fa fa-angle-right"></i>\n                    </a>\n                </li>\n            </ul>\n\n            <ul v-else-if="total >= 8" class="pagination pagination-split">\n                <li v-if="withNextPrev" :class="disablePrev">\n                    <a @click="!disablePrev ? btnPrev() : \'\'">\n                        <i class="fa fa-angle-left"></i>\n                    </a>\n                </li>\n                <template v-for="(item , index) in pages">\n                    <template v-if="item.show">\n                        <li v-if="item.disable != \'disabled\'" :class="item.content == selected ? \'active \' + activeBGColor : \'\' + item.disable">\n                            <a @click="emitBtnClick(item.content)" :style="customActiveBGColor && item.content == selected ? {background: customActiveBGColor, borderColor: customActiveBGColor} : {}">\n                                {{ item.content}}\n                            </a>\n                        </li>\n                        <li v-else>\n                            <a v-if="!item.showInput" @click.stop.prevent="showDotsInput(index ,  $event)">...</a>\n                            <span v-else style="padding:0;width:50px;">\n                                <input type="number" @change="onChange($event.target.value)" style="border:none;width:100%;height:32px;padding:0 3px;text-align: center;"/>\n                            </span>\n\n                        </li>\n                    </template>\n                </template>\n                <li v-if="withNextPrev" :class="disableNext">\n                    <a @click="!disableNext ? btnNext() : \'\'">\n                        <i class="fa fa-angle-right"></i>\n                    </a>\n                </li>\n            </ul>\n        ',
    mounted: function () {
        this.init();
    },
    data: function () {
        return {
            selected: (this.current) ? this.current : 1,
            disableNext: '',
            disablePrev: '',
            pages: [],
        };
    },
    methods: {
        emitBtnClick: function (n) {
            this.selected = n;
            this.disablePrevNext();
        },
        onChange: function (number) {
            var num = parseInt(number);
            if (num > 0 && num <= this.total) {
                this.selected = num;
                disablePrevNext();
            } else {
                this.init();
            }
        },
        btnNext: function () {
            
            this.selected++;
            this.disablePrevNext();
        },

        btnPrev: function () {
            this.selected--;
            this.disablePrevNext();
        },
        disablePrevNext: function () {
            this.disablePrev = this.selected == 1 ? 'disabled' : '';
            this.disableNext = this.selected == this.total ? 'disabled' : '';
        },
        init: function () {
            var items = [];
            for (var i = 0; i < this.total; i++) {
                var page = {
                    content: i + 1,
                    disable: '',
                    show: false
                }
                items[i] = page;
            }
            var page1 = {
                content: '...',
                disable: 'disabled',
                show: false,
                showInput: false,
            }
            var page2 = {
                content: '...',
                disable: 'disabled',
                show: false,
                showInput: false,
            }
            items.splice(1, 0, page1);
            items.splice(items.length - 1, 0, page2);
            for (var i = 0; i < items.length; i++) {
                if (i == 0 || i == items.length - 1)
                    items[i].show = true;

                if (this.selected <= this.pageRange) {
                    if (this.selected == this.pageRange) {
                        if (i >= 2 && i <= this.pageRange + 1)
                            items[i].show = true;
                    } else {
                        if (i >= 2 && i <= this.pageRange)
                            items[i].show = true;
                    }
                    items[items.length - 2].show = true;
                } else if (this.selected > this.pageRange) {
                    if (i >= this.selected - 1 && (this.selected + 2) < items.length - 2 && i <= this.selected + 1) {
                        items[1].show = true;
                        items[items.length - 2].show = true;
                        items[i].show = true;
                    } else if (i >= items.length - 2 - this.pageRange && (this.selected + 2) >= items.length - 2) {
                        items[1].show = true;
                        items[items.length - 2].show = false;
                        items[i].show = true;
                    }
                }

            }
            this.pages = items;
            this.disablePrevNext();
        },
        showDotsInput: function (index, $event) {
            var vm = this;
            var target = $($event.target).parent();
            this.pages[index].showInput = true;
            this.$nextTick(function () {
                target.parent().find('input').select();
            })
        }
    },
    watch: {
        'selected': function (newval, oldval) {
            if (newval != oldval) {
                this.$emit('input', newval);
                this.init();
            }
        },
        'total' : function(){
            this.init();
        },
        'current': function (newval) {
            if (this.selected != newval) {
                this.emitBtnClick(newval);
            }
        }
    }
});

Vue.component('time-picker',{
    template : `
        <div class="timepicker">
            
            <div class="input-group">
            	<span class="input-group-btn" @click.stop.prevent="onClick()">
                    <button class="btn btn-default">
                        <i class="far fa-calendar-alt"></i>
                    </button>
                </span>
                <input   class="form-control" ref="el" :placeholder="placeholder"  readonly/>
                <a @click.stop.prevent="clear()" class="btn_clear" v-if="allowclear && value != ''"><i class="fal fa-times"></i></a>
            </div>
        </div>
    `,
    props:{
        value : {},
        allowclear : {
        	default : true,
        },
        timepicker :{
        	default : false,
        },
        placeholder: {
            default : ''
        },
    },
    data: function(){
        return {
            val : this.value ,
        }
    },
    watch :{
        value : function(value){
            if( this.val != value){
                this.val = value;
                if( value == ''){
                	if( this.timepicker ){
                		$(this.$refs.el).datetimepicker('setDate', null);
                	}else{
                		$(this.$refs.el).datepicker('setDate', null);
                	}
                }else{
                	if( this.timepicker ){
                		$(this.$refs.el).datetimepicker('setDate', new Date(this.val * 1000));
                	}else{
                		$(this.$refs.el).datepicker('setDate', new Date(this.val * 1000));
                	}
                }
                
            }
        }
    },
    methods :{
        onClick : function(){
            $(this.$refs.el).focus();
        },
        clear : function(){
        	this.$emit('input' , '');
        }
    },
    mounted : function(){
    	if( this.timepicker == true){
	    	var options = {
	    		controlType: 'select',
				timeFormat: 'hh:mm',
				dateFormat : 'dd/mm/yy',
				stepMinute: 1,
				closeText: "Xác nhận",
	            prevText: "<",
	            nextText: ">",
	            currentText: "Hôm nay",
	            monthNames: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
	            monthNamesShort: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
	            dayNames: ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
	            dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
	            dayNamesMin: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
	            weekHeader: "Wk",
	            timeText: '',
	            hourText :'Giờ : ',
	            minuteText: 'Phút : ',
	            timeFormat: 'HH:mm',
	            minDateTime: new Date(),
	            onClose  : (date)=>{
	            	if( date != ''){
	            		var time = moment(date, "DD-MM-YYYY HH:mm").valueOf();
	            		this.$emit('input', parseInt(time/ 1000));
	            	}
	            }
	    	};

			$(this.$refs.el).datetimepicker(options);
			if( this.val != ''){
				$(this.$refs.el).datetimepicker('setDate', new Date(this.val * 1000));
			}
		}else{
			var options = {
				dateFormat : 'dd/mm/yy',
				closeText: "Xác nhận",
	            prevText: "<",
	            nextText: ">",
	            currentText: "Hôm nay",
	            monthNames: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
	            monthNamesShort: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
	            dayNames: ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
	            dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
	            dayNamesMin: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
	            weekHeader: "Wk",
	            timeText: '',
	            hourText :'Giờ : ',
	            minuteText: 'Phút : ',
	            timeFormat: 'HH:mm',
	            minDateTime: new Date(),
	            onClose  : (date)=>{
	            	if( date != ''){
	            		var time = moment(date, "DD-MM-YYYY HH:mm").valueOf();
	            		this.$emit('input', parseInt(time/ 1000));
	            	}
	            }
	    	};

			$(this.$refs.el).datepicker(options);
			if( this.val != ''){
				$(this.$refs.el).datepicker('setDate', new Date(this.val * 1000));
			}
		}
    }
})

Vue.component('daterange-picker', {
    props: {
        value: {

        },
        compare: {

        },
        open: {
            type: String,
            default: 'left',
        },
        start: {

        },
        end: {

        },
        drop: {
            type: String,
            default: 'down',
        },
        allowclear: {
            type: Boolean,
            default: true,
        },
    },
    template: `
        <div class="daterange-picker">
            <div class="input-group">
                <span class="input-group-btn" >
                    <button class="btn btn-default">
                        <i class="far fa-calendar-alt"></i>
                    </button>
                </span>
                <input type="text"  ref="el" v-model="text" class="form-control"   readonly />
                <a @click.stop.prevent="_clear()" class="btn_clear" v-if="allowclear && _showClear"><i class="fal fa-times"></i></a>
            </div>
        </div>
    
    `,
    data: function () {
        return {
            text: '',
            options : {},
            range  :{
                startDate : '',
                endDate : '',
            }
        }
    },
    methods :{
        _clear : function(){
            this.$emit('input', {
                'startDate': '',
                'endDate' : ''
            });
            this.text = '';
        },
        _init : function(){
            var vm = this;
            this.options = {
                alwaysShowCalendars: true,
                opens: this.open,
                drops: this.drop,
                timePicker: false,
                timePicker24Hour: false,
                autoApply: false,
                autoUpdateInput: false,
                applyButtonClasses: "btn-success",

                locale: {
                    format: 'DD/MM/YYYY',
                    direction: 'ltr',
                    format: moment.localeData().longDateFormat('L'),
                    separator: ' - ',
                    applyLabel: 'Đồng ý',
                    cancelLabel: 'Đóng',
                    weekLabel: 'W',
                    customRangeLabel: 'Tùy chọn',
                    daysOfWeek: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                    monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                },
                ranges: {
                    'Hôm nay': [moment().startOf('day'), moment().endOf('day')],
                    'Hôm qua': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                    '7 ngày trước': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                    '30 ngày trước': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                    'Tháng này': [moment().startOf('month'), moment().endOf('month')],
                    'Tháng trước': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
            };
            if( this.value.hasOwnProperty('startDate') && this.value.hasOwnProperty('endDate')){
                var state = new Date(this.value.startDate * 1000);
                var end = new Date(this.value.endDate * 1000);
                if( _.isDate(state) && _.isDate(end) ){
                    this.options['startDate'] = state;
                    this.options['endDate'] = end;
                    this.range.startDate = this.value.startDate;
                    this.range.endDate = this.value.endDate;
                    var string_start = '';
                    var string_end = '';
                    string_start = moment(this.range.startDate * 1000).format('HH:mm DD/MM/YYYY');
                    string_end = ' - ' + moment(this.range.endDate * 1000).format('HH:mm DD/MM/YYYY');
                    this.text = string_start +  string_end;
                } 
            }
            $(this.$refs.el).daterangepicker(this.options);
            $(this.$refs.el).on('apply.daterangepicker', function (ev, picker) {
                var timeStart = parseInt(picker.startDate / 1000);
                var timeEnd = parseInt(picker.endDate / 1000);
                vm.range.startDate = timeStart;
                vm.range.endDate = timeEnd;
                vm.$emit('input', {
                    'startDate': timeStart,
                    'endDate' : timeEnd
                });
            });
        }
    },
    computed :{
        _showClear : function(){
            var show = true;
            if( this.range.startDate == '' || this.range.endDate == ''){
                show = false;
            }
            return show;
        }
    },
    watch :{
        'value' : {
            handler : function(value){
                if( value.hasOwnProperty('startDate') && value.hasOwnProperty('endDate')){
                    if( value.startDate != '' && value.endDate != ''){
                        if( _.isDate(new Date(value.startDate)) && _.isDate(new Date(value.endDate))){
                            if( value.startDate != this.range.startDate && value.endDate != this.range.endDate ){
                                this.range.startDate = value.startDate;
                                this.range.endDate = value.endDate;
                                
                                 $(this.$refs.el).daterangepicker({ 
                                    startDate: new Date(value.startDate * 1000), 
                                    endDate: new Date(value.endDate * 1000), 
                                });
                            }
                            var string_start = '';
                            var string_end = '';
                            string_start = moment(this.range.startDate * 1000).format('HH:mm DD/MM/YYYY');
                            string_end = ' - ' + moment(this.range.endDate * 1000).format('HH:mm DD/MM/YYYY');
                            this.text = string_start +  string_end;
                            return ;
                        }
                    }
                }
                this.range = {
                    startDate : '',
                    endDate : ''
                }
                this.text = '';
            },
            deep : true,
        }
    },
    mounted: function () {
        this._init();

        // if (this.value.hasOwnProperty('startDate')) {
        //     this.startDate = parseInt(this.value.startDate);
        // } else {
        //     if (this.allownull) {
        //         this.startDate = null;
        //     } else {
        //         this.startDate = typeof vm.compare == 'undefined' ? moment().startOf('month') : moment().subtract(1, 'month').startOf('month');
        //     }
        // }

        // if (this.value.hasOwnProperty('endDate')) {
        //     this.endDate = parseInt(this.value.endDate);
        // } else {
        //     if (this.allownull) {
        //         this.endDate = null;
        //     } else {
        //         this.endDate = typeof vm.compare == 'undefined' ? moment().endOf('month') : moment().subtract(1, 'month').endOf('month');
        //     }
        // }
        // if (this.value.hasOwnProperty('endDate') && this.value.hasOwnProperty('startDate')) {
        //     var string_start = '';
        //     var string_end = '';
        //     if (moment(parseInt(this.value.startDate) * 1000).isValid() && moment(parseInt(this.value.endDate) * 1000)) {
        //         string_start = moment(parseInt(this.value.startDate) * 1000).format('HH:mm DD/MM/YYYY');
        //         string_end = ' - ' + moment(parseInt(this.value.endDate) * 1000).format('HH:mm DD/MM/YYYY');
        //         this.val = string_start + string_end;
        //     }

        // }
        
        // if (this.startDate != '' && this.startDate != null) {
        //     options['startDate'] = this.startDate;
        // }
        // if (this.endDate != '' && this.endDate != null) {
        //     options['endDate'] = this.endDate;
        // }
        
    },
});
if( typeof Vue2Scrollbar != 'undefined'){
    Vue.component('scrollbar' , Vue2Scrollbar);
}

