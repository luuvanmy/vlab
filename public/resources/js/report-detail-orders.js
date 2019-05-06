

//5 product selling

var  string_label_product_selling=
['Samsung Galaxy Tab E 9.6 (SM-T561) - Số lượng : 150 sản phẩm',
'Lenovo Phab 2  - Số lượng : 123 sản phẩm',
'Samsung Galaxy Tab E 9.6 (SM-T561)  - Số lượng : 95 sản phẩm',
'Samsung Galaxy Book 10.6 inch  - Số lượng : 65 sản phẩm',
'iPad Wifi Cellular 32GB (2017)  - Số lượng : 50 sản phẩm'];
var id_product_selling = $("#report-product-selling");
var labels_product_selling = $(id_product_selling.data('label'));
var data = {
  labels:  string_label_product_selling,
  datasets: [{
    data: [300,50,100,50,100],
    backgroundColor:["#36a2eb","#ff6384","#4bc0c0","#fecd56","#cacbd0"],
  }]
};
var chart_product_selling = new Chart(id_product_selling, {
  type: "doughnut",
  data: data,
  options:{
    legend: {
      display: false
    },
    animation: {
      duration: 1000,
      onComplete: function(animation) {
        labels_product_selling.html(chart_product_selling.generateLegend());
      }
    },
  }
});

//5 product focus

var  string_label_product_focus=
['Samsung Galaxy Tab E 9.6 (SM-T561)',
'Lenovo Phab 2',
'Samsung Galaxy Tab E 9.6 (SM-T561)',
'Samsung Galaxy Book 10.6 inch',
'iPad Wifi Cellular 32GB (2017)'];
var id_product_focus = $("#report-product-focus");
var labels_product_focus = $(id_product_focus.data('label'));
var data = {
  labels:  string_label_product_focus,
  datasets: [{
    data: [300,50,100,50,100],
    backgroundColor:["#36a2eb","#ff6384","#4bc0c0","#fecd56","#cacbd0"],
  }]
};
var chart_product_focus = new Chart(id_product_focus, {
  type: "doughnut",
  data: data,
  options:{
    legend: {
      display: false
    },
    animation: {
      duration: 1000,
      onComplete: function(animation) {
        labels_product_focus.html(chart_product_focus.generateLegend());
      }
    },
  }
});



//report orders review-shipment
var  string_label_shipment =([
  ['Giao hàng nhanh ( 50% )- Số lượng : 50 người'],
  ['Giao hàng tiết kiệm ( 15% )- Số lượng : 15 người'],
  ['Viettel Post ( 35% )- Số lượng : 35 người'],
]);
var id_review_shipment = $("#review-shipment");
var labels_shipment = $(id_review_shipment.data('label'));
    var data = {
        labels: string_label_shipment,
        datasets: [{
          data:[311,461,722,],
          backgroundColor:["rgb(255, 99, 132)","rgb(75, 192, 192)","rgb(255, 205, 86)","rgb(201, 203, 207)","rgb(54, 162, 235)"]
        }]
    };
var chart_shipment= new Chart(id_review_shipment, {
    type: "polarArea",
    data: data,
    options:{
      title: {
            display: true,
            text:'Phản hồi đối tác vận chuyển',
        },
      legend: {
        display: false
      },
       tooltips: {
          enabled: false
      },
      animation: {
        duration: 1000,
        onComplete: function(animation) {
          labels_shipment.html(chart_shipment.generateLegend());
        }
      },
    }
});
