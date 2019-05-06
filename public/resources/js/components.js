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
if (typeof window.VueMultiselect != 'undefined') {
    // Vue.use(window.VueMultiselect.default)
    Vue.component('multiselect', window.VueMultiselect.default)
}
if (typeof jconfirm != 'undefined') {
    jconfirm.defaults = {
        animateFromElement: false,
        smoothContent: true,
        title: '',
        content: '',
        theme: 'material',
        backgroundDismiss: true,
        defaultButtons: {
            close: {
                text: 'Đóng',
                btnClass: 'btn-inverse',
                action: function () {}
            },
        },
    };
}
Vue.prototype.$watchAll = function (props, callback) {
    var vm = this;
    props.forEach(function (prop) {
        vm.$watch(prop, callback.bind(null, prop));
    });
};
var AppMedia = new appMedia();

function appMedia() {
    var methods = this;
    methods.isLoading = false;
    methods.show = function (option) {
        if (methods.isLoading) return;
        if ($('#vue-gallery').length) {
            methods.isLoading = true;
            $('#vue-gallery').load('/admin/website/gallery/getModalGallery', function (res) {
                methods.isLoading = false;
                if (res.status == 403) {
                    $.confirm({
                        title: '',
                        content: res['message'],
                        type: 'red',
                        buttons: {
                            oke: {
                                text: 'Đóng',
                                btnClass: 'btn-inverse',
                            }
                        }
                    })
                    return;
                }
                if (typeof VueGallery == 'object') {

                    VueGallery.show(option);
                }
            })
        }
    }
    return methods;
}

if (typeof window.VueTimepicker != 'undefined') {
    Vue.use(window.VueTimepicker);
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
                        el['text'] = String(text).capitalize()
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
                    },'select2:unselecting' : function(e){
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
Vue.component('select2ajax', {
    props: ['options', 'value', 'url'],
    template: '<select class="form-control" ></select>',
    data: function() {
        return {
            ajaxOptions: {
              url: this.url,
              dataType: 'json',
              delay: 250,
              tags: true,
              data: function(params) {
                  return {
                      term: params.term, // search term
                      page: params.page
                  };
              },
              processResults: function(data, params) {
                  params.page = params.page || 1;
                  return {
                      results: data,
                      pagination: {
                          more: (params.page * 30) < data.total_count
                      }
                  };
              },
              cache: true
          }
      };
    },
    mounted: function() {
        var vm = this
        $(this.$el)
           .select2({
               placeholder: "Vui lòng chọn sản phẩm",
               ajax: this.ajaxOptions,
        }).on('select2:select' , function (e) {
            vm.$emit('input', e.params.data.id);
        })

    },
    watch: {
        url: function(value) {
            this.ajaxOptions.url = this.url;
            $(this.$el).select2({ ajax: this.ajaxOptions});
        },
        'value': function (newval) {
            $(this.$el).val(newval).trigger('change.select2');
        },
    }
})
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
Vue.filter('full-time-facebook', function (value) {

    return moment(new Date(value * 1000)).format('DD/MM/YYYY HH:mm');
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
Vue.directive('debounce', {
    bind: function (el, binding) {

        if (binding.value !== binding.oldValue) {
            el.oninput = _.debounce(function (evt) {
                el.dispatchEvent(new Event('change'))
            }, parseInt(binding.value) || 500)
        }
    }
})
Vue.directive('tooltip', {
    bind: function (el, binding, vnode) {
        if( helper.isTouchDevice() == false ){
            if( el != null && el != undefined){
                var placement = 'top';
                if( binding.value != undefined){
                    if(binding.value.hasOwnProperty('placement') ){
                        placement = binding.value.placement;
                    }
                }
                $(el).tooltip({
                    trigger: "hover",
                    placement : placement,
                });
            }
        }
    },
    unbind(el) {
        $(el).tooltip('destroy');
    }
})
Vue.directive('dropdown', {
    twoWay: true,
    bind: function (el, binding, vnode) {
        var vm = this;
        $(el).find('.v-dropdown-toggle').on('click', function () {
            // $(el).toggleClass('open');
            binding.value = true;
            console.log(binding);
        });
        // this.handler = function () {
        //     el.value = true;
        //     this.set(el.value)
        // }.bind(this)

    },
    update: function (el, binding) {
        console.log(binding);
    },
    unbind: function () {

    }
})
Vue.directive('select', {
    twoWay: true,
    bind: function (el, binding, vnode) {
        var vm = this;
        $(el).on("select2:select", function (e) {
            var event = new Event('change', {
                bubbles: true
            })
            var value = $(el).select2("val");
            el.value = value;
            if ($(el).attr('create') != undefined && $(el).val() == '-1') {
                el.value = null;
                var addnew = $($(el).attr('create'));
                var modal = $(addnew).data('modal');
                modal = (modal == undefined) ? '#myModal' : modal;
                var a = document.createElement('a');
                var att = document.createAttribute("data-url");
                att.value = $(addnew).data('url');
                a.setAttributeNode(att);
                load_data_to_modal(a, modal);
            }
            el.dispatchEvent(event);
        });
    },
    update: function (el, vnode) {
        $(el).val(vnode.value).trigger('change');
    },
    inserted: function (el, vnode) {
        var holder = $(el).attr('placeholder');
        var isMutiple = $(el).attr('multiple');
        var notfound = $(el).attr('notfound');
        var create = $(el).attr('create');
        var noSearch = $(el).attr('no-search');
        var options = {}
        if (noSearch != undefined) {
            options['dropdownCssClass'] = 'no-search';
        }
        if (holder != undefined) {
            options['placeholder'] = holder;
        }
        if (isMutiple != undefined) {
            options['tags'] = true;
        }
        if (notfound != undefined) {
            var string = notfound;
            options['language'] = {
                noResults: function () {
                    return string;
                }
            }
        } else {
            options['language'] = {
                noResults: function () {
                    return "Không tìm thấy !";
                }
            }
        }
        options['escapeMarkup'] = function (markup) {
            return markup;
        }
        if (vnode.value === undefined) {
            $(el).select2(options).val(null).trigger('change');
        } else {
            $(el).select2(options).val(vnode.value).trigger('change');
        }
    }
});



function updateFunction(el, binding) {
    var options = {
        allowClear: true,
        multiple: true,
        tags: true,
    }
    var holder = $(el).attr('placeholder');
    if (holder != undefined) {
        options['placeholder'] = holder;
    }
    var vm = this;
    $(el).select2(options).on("select2:select", function (e) {
        vm.$emit('input', $(this).val())
    });
}

Vue.directive('datepicker', {
    bind: function (el, binding, vnode) {
        var options = {
            dateFormat: "dd/mm/yy HH:mm:ss",
            changeYear: true,
            changeMonth: true,
            yearRange: '1950:2050',
            onSelect: function (date, i) {
                if (date !== i.lastVal) {
                    var date = helper.toDateTime(date) / 1000;
                    var event = new Event('input', {
                        bubbles: true
                    })
                    el.value = date;
                    el.dispatchEvent(event);
                }
            }
        }

        var minDate = $(el).attr('min');
        if (minDate != undefined & maxDate != '') {
            if (moment(new Date(minDate * 1000)).isValid()) {
                var date = moment(minDate * 1000).add(1, 'days');
                options.minDate = new Date(date);
            }
        }
        var maxDate = $(el).attr('max');
        if (maxDate != undefined & maxDate != '') {
            if (moment(new Date(maxDate * 1000)).isValid()) {
                var date = moment(maxDate * 1000).add(-1, 'days');
                options.maxDate = new Date(date);
            }
        }
        $(el).datepicker(options);
    },
    update: function (el, binding) {
        if (el.value != '') {
            var date = helper.formatDate(new Date(el.value * 1000), 'dd/mm/yyyy');
            if (moment(new Date(el.value * 1000)).isValid()) {
                $(el).datepicker('setDate', new Date(el.value * 1000));
            }
        }
        var minDate = $(el).attr('min');
        if (minDate != undefined & minDate != null) {
            if (moment(new Date(minDate * 1000)).isValid()) {
                var date = moment(minDate * 1000).add(1, 'days');
                $(el).datepicker("option", "minDate", new Date(date));
            }
        }
        var maxDate = $(el).attr('max');
        if (maxDate != undefined & maxDate != '') {
            if (moment(new Date(maxDate * 1000)).isValid()) {
                var date = moment(maxDate * 1000).add(-1, 'days');
                $(el).datepicker("option", "maxDate", new Date(date));
            }
        }
    },
    destroyed: function () {
        $(this.$el).datepicker("destroy");
    }
});


Vue.component('input-spinner', {
    template : '<div class="input-group">\
                <span class="input-group-btn" @click.stop.prevent="_descrease">\
                    <button class="btn btn-default" type="button"><span class="ion-ios-minus-empty"></span></button>\
                </span>\
                <money v-if="max != undefined" v-model="num"  class="form-control text-center" :min="1" :max="max"></money>\
                <money v-else v-model="num"  class="form-control text-center" :min="1"></money>\
                <span class="input-group-btn"  @click.stop.prevent="_increase">\
                    <button class="btn btn-default" type="button"><span class="ion-ios-plus-empty"></span></button>\
                </span>\
            </div>',
    props: {
        value : {},
        max : {}
    },
    data: function(){
        return {
            num : this.value
        }
    },
    methods:{
        _increase : function(){
            this.num += 1;
        },
        _descrease : function(){
            if( this.value > 1){
                this.num -= 1;
            }
        }
    },
    watch : {
        'value' : function(value) {
            this.num = value;
        },
        'num' : function(value){
            if( value != this.value){
                this.$emit('input', value);
            }
        }
    }
    
})
Vue.component('datepicker', {
    template: '<input type="text" class="datepicker"  readonly/>',
    props: {
        value: {

        },
        max: {

        },
        min: {

        }
    },
    mounted: function () {
        var options = {
            dateFormat: "dd/mm/yy",
            changeYear: true,
            changeMonth: true,
            yearRange: '1970:2050',
            onClose: this.onClose
        }
        if (this.min != undefined && this.min != '' && _.isDate(new Date(this.min * 1000))) {
            var date = moment(this.min * 1000).add(1, 'days');
            options.minDate = new Date(date);
        }
        if (this.max != undefined && this.max != '' && _.isDate(new Date(this.max * 1000))) {
            var date = moment(this.max * 1000).add(-1, 'days');
            options.minDate = new Date(date);
        }
        $(this.$el).datepicker(options);

        if (this.value == null) {
            $(this.$el).datepicker('setDate', this.value);
        } else {
            if (this.value != undefined && this.value != '' && _.isDate(new Date(this.value * 1000))) {
                $(this.$el).datepicker('setDate', new Date(this.value * 1000));
            } else {
                this.$emit('input', null);
            }
        }
    },
    methods: {
        onClose: function (date) {
            if( date != undefined && date != '' && date != null){
                this.$emit('input', helper.toDateTime(date) / 1000);
            }
        },
    },
    watch: {
        'value': function (newval) {
            if (newval == null) {
                $(this.$el).datepicker('setDate', newval);
            } else {
                if (newval != undefined && newval != '' && _.isDate(new Date(newval * 1000))) {
                    $(this.$el).datepicker('setDate', new Date(newval * 1000));
                } else {
                    this.$emit('input', null);
                }
            }
        },
        'min': function (newval) {
            if (newval != undefined && newval != '' && _.isDate(new Date(newval * 1000))) {
                var date = moment(newval * 1000).add(1, 'days');
                $(this.$el).datepicker('option', 'minDate', new Date(date));
            }
        },
        'max': function (newval) {
            if (newval != undefined && newval != '' && _.isDate(new Date(newval * 1000))) {
                var date = moment(newval * 1000).add(-1, 'days');
                $(this.$el).datepicker('option', 'maxDate', new Date(date));
            }
        },
    }
});

Vue.component('slide', {
    props: {
        active: Boolean,
        duration: {
            type: Number,
            default: 500
        },
        tag: String,
    },
    render: function (h) {
        return h(
            this.tag == undefined ? 'div' : this.tag, {
                style: {
                    display: 'none',
                },
                ref: 'container',
            },
            this.$slots.default
        )
    },
    mounted: function () {
        this.render();
    },
    watch: {
        active: function () {
            this.render();
        }
    },
    methods: {
        render: function () {
            if (this.active) {
                $(this.$refs.container).slideDown(this.duration);
            } else {
                $(this.$refs.container).slideUp(this.duration);
            }
        }
    }
});
if (typeof CKEDITOR != 'undefined') {
    CKEDITOR.plugins.add('gallery', {
        icons: 'gallery',
        init: function (editor) {
            editor.addCommand('openGallery', {
                exec: function (editor) {
                    if (typeof AppMedia != 'undefined') {
                        AppMedia.show({
                            output: function (data) {
                                var item = data[0];
                                var host = document.location.protocol + "//" + document.location.host;
                                var src = host + '/' + item.path;
                                var img = '<img src="'+ src + '" ';
                                img += 'atl="' + item.alt + '" ';
                                img += 'description="' + item.description + '" ';
                                img += " />";
                                var element = CKEDITOR.dom.element.createFromHtml(img);
                                editor.insertElement(element);
                            }
                        })
                    }
                }
            });
            editor.ui.addButton('Gallery', {
                label: 'Thư viện ảnh',
                command: 'openGallery',
                toolbar: 'insert'
            });
        }
    });

    Vue.component('ckeditor', {
        template: '<div class="ckeditor"><textarea :id="id" :value="value"></textarea></div>',
        props: {
            value: {
                type: String
            },
            height: {
                type: String,
                default: '400px',
            },
            toolbar: {
                type: Array,
                default: function () {
                    return [{
                            name: "clipboard",
                            items: ["Undo", "Redo", "Cut", "Copy", "Paste", "PasteText", "PasteFromWord", "Undo", "Redo", "oembed"]
                        }, {
                            name: "editing",
                            groups: ['find', 'selection', 'spellchecker', 'editing']
                        }, {
                            name: "links",
                            items: ["Link", "Unlink", "Gallery", "Anchor"]
                        }, {
                            name: "insert",
                            items: ['Image','VideoDetector', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe']
                        }, {
                            name: 'document',
                            items: ['-', 'NewPage', 'DocProps', 'Preview', 'Print', '-', 'Templates']
                        },
                        {
                            name: 'forms',
                            groups: ['forms']
                        }, {
                            name: "document",
                            items: ["Source",'docprops']
                        }, {
                            name: "basicstyles",
                            items: ["Bold", "Italic", "Strike", "-", "RemoveFormat"]
                        },
                        {
                            name: 'paragraph',
                            groups: ['list', 'indent', 'blocks', 'align', 'bidi'],
                            items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language']
                        },
                        {
                            name: 'styles',
                            items: ['Styles', 'Format', 'Font', 'FontSize']
                        }, {
                            name: 'others',
                            groups: ['others']
                        }, {
                            name: 'colors',
                           items: [ 'TextColor', 'BGColor' ]
                        }, {
                            name: "tools",
                            items: ["Maximize"]
                        }
                    ]
                }
            },
            language: {
                type: String,
                default: 'vi'
            },
            extraplugins: [
                {
                    type: String,
                    default: 'gallery'
                },
                {
                    default: 'imagepaste'
                },
                {
                    default: 'videodetector'
                }
            ],
        },
        data: function () {
            return {
                id: helper.createId(),
                editor: {},
            }
        },
        beforeUpdate: function () {
            var vm = this;
            const ckeditorId = vm.id;
            if (vm.value !== CKEDITOR.instances[ckeditorId].getData()) {
                CKEDITOR.instances[ckeditorId].setData(vm.value);
            };
        },
        mounted: function () {
            var vm = this;
            const ckeditorId = vm.id;
            const ckeditorConfig = {
                fullPage : true,
                toolbar: vm.toolbar,
                language: vm.language,
                height: vm.height,
                extraPlugins: 'gallery,imagepaste,docprops,videodetector',
                removePlugins: "image",
            };
            CKEDITOR.replace(ckeditorId, ckeditorConfig);
            CKEDITOR.instances[ckeditorId].setData(vm.value);
            CKEDITOR.instances[ckeditorId].on('change', function () {
                var ckeditorData = CKEDITOR.instances[ckeditorId].getData()
                if (ckeditorData !== vm.value) {
                    vm.$emit('input', ckeditorData)
                }
            });
        },
        destroyed: function () {
            var vm = this;
            const ckeditorId = vm.id;
            if (CKEDITOR.instances[ckeditorId]) {
                CKEDITOR.instances[ckeditorId].destroy();
            };
        }
    });
}

Vue.component('timerange', {
    props: ['classname', 'compare', 'start', 'end', 'open'],
    template: '<input type="text" :class="classname"  class="daterange_input" readonly />',
    data: function () {
        return {
            startDate: this.start,
            endDate: this.end,
        }
    },
    mounted: function () {
        var vm = this;
        if (this.startDate != undefined) {
            this.startDate = new Date(this.startDate * 1000);
        } else {
            this.startDate = typeof vm.compare == 'undefined' ? moment().startOf('month') : moment().subtract(1, 'month').startOf('month');
        }
        if (this.endDate != undefined) {
            this.endDate = new Date(this.endDate * 1000);
        } else {
            this.endDate = typeof vm.compare == 'undefined' ? moment().endOf('month') : moment().subtract(1, 'month').endOf('month');
        }
        $(this.$el).daterangepicker({
            startDate: this.startDate,
            endDate: this.endDate,
            alwaysShowCalendars: true,
            timePicker: true,
            timePicker24Hour: true,
            opens: (this.open == undefined) ? 'left' : this.open,
            locale: {
                format: 'DD/MM/YYYY HH:mm'
            },
            ranges: {
                'Hôm nay': [moment(), moment()],
                'Hôm qua': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                '7 ngày trước': [moment().subtract(6, 'days'), moment()],
                '30 ngày trước': [moment().subtract(29, 'days'), moment()],
                'Tháng này': [moment().startOf('month'), moment().endOf('month')],
                'Tháng trước': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
        });
        $(this.$el).on('apply.daterangepicker', function (ev, picker) {
            var endDate = moment(picker.endDate.format('YYYY-MM-DD HH:mm'), 'YYYY-MM-DD HH:mm').toDate().getTime() / 1000;
            var startDate = moment(picker.startDate.format('YYYY-MM-DD HH:mm'), 'YYYY-MM-DD HH:mm').toDate().getTime() / 1000;
            vm.$emit('input', {
                'endDate': endDate,
                'startDate': startDate
            });
        });
    },
    watch: {
        'value': function (val) {

        }
    }
});

Vue.component('daterange', {
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
        classname: {

        },
        time: {
            type: Boolean,
            default: false,
        },
        allownull: {
            type: Boolean,
            default: false,
        },
    },
    template: '<input type="text" v-model="val" :class="classname"  class="daterange_input" readonly />',
    data: function () {
        return {
            //  startDate: null,
            //  endDate: null,
            val: '',
        }
    },
    watch:{
        'value.startDate':function(new_va){
            
            if (this.value.hasOwnProperty('startDate')) {
                this.startDate = parseInt(this.value.startDate);
            } else {
                if (this.allownull) {
                    this.startDate = null;
                } else {
                    this.startDate = typeof vm.compare == 'undefined' ? moment().startOf('month') : moment().subtract(1, 'month').startOf('month');
                }
            }

            if (this.value.hasOwnProperty('endDate')) {
                this.endDate = parseInt(this.value.endDate);
            } else {
                if (this.allownull) {
                    this.endDate = null;
                } else {
                    this.endDate = typeof vm.compare == 'undefined' ? moment().endOf('month') : moment().subtract(1, 'month').endOf('month');
                }
            }
            if (this.value.hasOwnProperty('endDate') && this.value.hasOwnProperty('startDate')) {
                var string_start = '';
                var string_end = '';
                if (moment(parseInt(this.value.startDate) * 1000).isValid() && moment(parseInt(this.value.endDate) * 1000)) {
                    // if( vm.time){
                    //    string_start = moment(parseInt(this.value.startDate)*1000).format('HH:mm DD/MM/YYYY');
                    //    string_end = ' - ' + moment(parseInt(this.value.endDate)*1000).format('HH:mm DD/MM/YYYY');
                    // }else{
                    //    string_start =  moment(parseInt(this.value.startDate)*1000).format('DD/MM/YYYY');
                    //    string_end = ' - ' + moment(parseInt(this.value.endDate)*1000).format('DD/MM/YYYY');
                    // }
                    string_start = moment(parseInt(this.value.startDate) * 1000).format('HH:mm DD/MM/YYYY');
                    string_end = ' - ' + moment(parseInt(this.value.endDate) * 1000).format('HH:mm DD/MM/YYYY');
                    this.val = string_start + string_end;
                }

            }
        }
    },
    mounted: function () {
        var vm = this;
        if (this.value.hasOwnProperty('startDate')) {
            this.startDate = parseInt(this.value.startDate);
        } else {
            if (this.allownull) {
                this.startDate = null;
            } else {
                this.startDate = typeof vm.compare == 'undefined' ? moment().startOf('month') : moment().subtract(1, 'month').startOf('month');
            }
        }

        if (this.value.hasOwnProperty('endDate')) {
            this.endDate = parseInt(this.value.endDate);
        } else {
            if (this.allownull) {
                this.endDate = null;
            } else {
                this.endDate = typeof vm.compare == 'undefined' ? moment().endOf('month') : moment().subtract(1, 'month').endOf('month');
            }
        }
        if (this.value.hasOwnProperty('endDate') && this.value.hasOwnProperty('startDate')) {
            var string_start = '';
            var string_end = '';
            if (moment(parseInt(this.value.startDate) * 1000).isValid() && moment(parseInt(this.value.endDate) * 1000)) {
                // if( vm.time){
                //    string_start = moment(parseInt(this.value.startDate)*1000).format('HH:mm DD/MM/YYYY');
                //    string_end = ' - ' + moment(parseInt(this.value.endDate)*1000).format('HH:mm DD/MM/YYYY');
                // }else{
                //    string_start =  moment(parseInt(this.value.startDate)*1000).format('DD/MM/YYYY');
                //    string_end = ' - ' + moment(parseInt(this.value.endDate)*1000).format('DD/MM/YYYY');
                // }
                string_start = moment(parseInt(this.value.startDate) * 1000).format('HH:mm DD/MM/YYYY');
                string_end = ' - ' + moment(parseInt(this.value.endDate) * 1000).format('HH:mm DD/MM/YYYY');
                this.val = string_start + string_end;
            }

        }
        var options = {
            alwaysShowCalendars: true,
            opens: this.open,
            drops: this.drop,
            timePicker: true,
            timePicker24Hour: true,
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
        if (this.startDate != '' && this.startDate != null) {
            options['startDate'] = this.startDate;
        }
        if (this.endDate != '' && this.endDate != null) {
            options['endDate'] = this.endDate;
        }
        $(this.$el).daterangepicker(options);
        $(this.$el).on('apply.daterangepicker', function (ev, picker) {
            var startDate = parseInt(picker.startDate / 1000);
            var endDate = parseInt(picker.endDate / 1000) + 59;
            var string_start = '';
            var string_end = '';
            string_start = moment(picker.startDate).format('HH:mm DD/MM/YYYY');
            string_end = ' - ' + moment(picker.endDate).format('HH:mm DD/MM/YYYY');
            vm.val = string_start + string_end;
            vm.$emit('input', {
                'endDate': parseInt(picker.endDate / 1000),
                'startDate': parseInt(picker.startDate / 1000)
            });
        });
    },
});
Vue.component('number', {
    props: ['value', 'max', 'min', 'classname', "disabled"],
    template: '<input  @focus="onFocus" type="text" :class="classname" v-model="val" @keyup="onChange" @change="onChange" :disabled="disabled"/>',
    data: function () {
        return {
            val: this.value,
            focused: false,
        }
    },
    mounted: function () {
        if (this.val == '' || this.val == undefined || this.val == 'NaN') {
            if (this.min != undefined) {
                this.val = _.toNumber(this.min);
            } else {
                this.val = 0;
            }
            this.$emit('input', this.val);
            return;
        }
        if (this.min != undefined && parseInt(this.min) != 'NaN') {
            var min = parseInt(this.min.toString().replace(/,/g, ""));
            if (parseInt(String(this.val).replace(/,/g, "")) < min) {
                this.val = min;
            }
        }
        if (this.max != undefined && parseInt(this.max) != 'NaN') {
            var max = parseInt(this.max.toString().replace(/,/g, ""));
            if (parseInt(String(this.val).replace(/,/g, "")) > max) {
                this.val = max;
            }
        }
        this.val = parseInt(String(this.val).replace(/,/g, ""));
        this.val = String(this.val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.$emit('input', this.val);

    },
    methods: {
        onFocus: function () {
            // this.focused = true;
        },
        onBlur: function () {
            this.$emit('onblurevent');
        },
        onChange: function () {
            // this.focused = false;
            this.$emit('onchangeevent');
        },
    },
    watch: {
        'val': function (newval, oldval) {
            if (newval != oldval) {

                if (this.val == '' || this.val == 'NaN') {
                    if (this.min != undefined) {
                        this.val = this.min;
                    } else {
                        this.val = 0;
                    }
                    this.$emit('input', this.val);
                    this.$emit('onchangeevent');
                    return;
                }
                if (this.min != undefined && parseInt(this.min) != 'NaN') {
                    var min = parseInt(this.min.toString().replace(/,/g, ""));
                    if (parseInt(String(this.val).replace(/,/g, "")) < min) {
                        this.val = min;
                        this.$emit('input', this.val);
                        this.$emit('onchangeevent');
                        return;
                    }
                }
                if (this.max != undefined && parseInt(this.max) != 'NaN') {
                    var max = parseInt(this.max.toString().replace(/,/g, ""));
                    if (parseInt(String(this.val).replace(/,/g, "")) > max) {
                        this.val = max;
                        this.$emit('input', this.val);
                        this.$emit('onchangeevent');
                        return;
                    }
                }
                this.val = parseInt(String(this.val).replace(/,/g, ""));
                this.val = String(this.val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                this.$emit('input', this.val);
                this.$emit('onchangeevent');
            }
        },
        'value': function (newval, oldval) {
            if (newval != oldval) {
                this.val = newval;
            }
        },
    },
});
Vue.component("number1", {
    template: '<input type="text" :class="classname" :disabled="disabled" @focus="onFocus($event)" @keyup="onBlur" @blur="onChange" v-model="model">',
    props: {
        value: {},
        max: {},
        min : {
            default : 0,
        },
        disabled: {},
        classname: {},
        allow: {
            default: 'int'
        }
    },
    data: function () {
        return {
            // model : 0,
            focused: false,
        }
    },
    mounted : function(){
        // this.model = this.value;
        this.model = this.checkValid(this.value);
    },
    methods:{
        onFocus: function (event) {
            this.focused = true;
            setTimeout(function () {
                event.target.select()
            }, 0)
        },
        onBlur: function () {
            this.$emit('onchangeevent');
        },
        onChange: function () {
            // this.focused = false;
            // this.$emit('onchangeevent');
        },
        isNumber : function(str) {
            var pattern = /^\d+$/;
            return pattern.test(str); 
        },
        toNumber : function(value){
            var string  = String(value).replace(/,/g, "");
            if(this.allow=='float'){
                return string;
            }
            return parseInt(string);
        },
        toNumberFormat : function(value){
            return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        checkMin : function(value){
            value = this.toNumber(value);
            if( value < this.min ){
                this.model = this.min;
                return false;
            }
            return true;
        },
        checkMax : function(value){
            value =this.toNumber(value);
            if( this.max != undefined && value > this.max ){
                this.model = this.max;
                return false;
            }
            return true;
        }, 
        checkValid : function(newValue){
            if( !this.isNumber(newValue)){
                if( newValue == null ){
                    newValue = this.min ;
                }else{
                    if(this.allow=='float'){
                        newValue = String(newValue).replace(/[^0-9.,]*/g, '');
                    }else{
                        newValue = String(newValue).replace(/[^0-9]/g, '');
                    }
                    if( newValue == ''){
                        newValue = this.min ;
                    }
                }
            }
            if( this.toNumber(newValue) < this.min){
                newValue = this.min ;
            }

            if( this.max != undefined && parseFloat(this.toNumber(newValue)) > parseFloat(this.toNumber(this.max))){
               newValue = this.max ;
            }
            return  this.toNumber(newValue);
        }
    },
    watch : {
        value : function(newval){
            if( newval == null || newval == undefined || newval == 'null' || newval == 'undefined'){
                newval = this.min ;
                this.$el.value = this.toNumberFormat(newval);
                this.$emit("input", this.toNumber(newval));
                return;
            }
            this.checkValid(newval);
        }
    },
    computed : {
        model : {
            get: function(){
                return String(this.value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            set: function(newValue){
                newValue = this.checkValid(newValue);
                this.$el.value = newValue;
                this.$emit("input", newValue);
            }
        }
    },
    
});
Vue.component('pagination', {
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


Vue.component('paginate', {
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
