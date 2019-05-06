//Chi phí nhập hàng theo nhà cung cấp mới - cũ
var report_chart = document.getElementById("supplier-reviews");
var chartExport = new Chart(report_chart, {
  type:"horizontalBar",
  data:{
    labels:['Khách hàng mới','Khách hàng cũ'],
    datasets:[{
      label:"Chi phí nhập hàng",
      data:[300000000,540250000],
      fill:false,
        backgroundColor:["#36a2eb","#4bc0c0","#fecd56","#cacbd0"],
      }
    ]},

      options: {
        scales: {
          xAxes: [{
            stacked: true,
             ticks:{beginAtZero:true}
          }],
          yAxes: [{
            stacked: true,
             ticks:{beginAtZero:true}
          }]
        }
      }
    });

    //5supplier-import

    var  string_label_supplier_import=([
      ['<p class="col-xs-7">Địa chỉ:  Hồng Khê, Bình Giang Hải Dương Điện thoại: 0975566555:</p><p class="border-right group-value"><p class="group-value">Tổng tiền: <strong class="total-money">1.600.120.000 đ</strong></p>'],
      ['<p class="col-xs-7">Địa chỉ:  Hồng Khê, Bình Giang Hải Dương Điện thoại: 0975566555:</p><p class="border-right group-value"><p class="group-value">Tổng tiền: <strong class="total-money">1.600.120.000 đ</strong></p>'],
      ['<p class="col-xs-7">Địa chỉ:  Hồng Khê, Bình Giang Hải Dương Điện thoại: 0975566555:</p><p class="border-right group-value"><p class="group-value">Tổng tiền: <strong class="total-money">1.600.120.000 đ</strong></p>'],
      ['<p class="col-xs-7">Địa chỉ:  Hồng Khê, Bình Giang Hải Dương Điện thoại</p><p class="border-right group-value"><p class="group-value">Tổng tiền: <strong class="total-money">1.600.120.000 đ</strong></p>'],
      ['<p class="col-xs-7">Địa chỉ:  Hồng Khê, Bình Giang Hải Dương Điện thoại</p><p class="border-right group-value"><p class="group-value">Tổng tiền: <strong class="total-money">1.600.120.000 đ</strong></p>'],
    ]);
    var id_supplier_import = $("#report-supplier-import");
    var labels_supplier_import = $(id_supplier_import.data('label'));
    var data = {
      labels:  string_label_supplier_import,
      datasets: [{
        data: [300000000,50000000,1000000000,500000000,1000000000],
        backgroundColor:["#36a2eb","#ff6384","#4bc0c0","#fecd56","#cacbd0"],
      }]
    };
    var chart_supplier_import = new Chart(id_supplier_import, {
      type: "doughnut",
      data: data,
      options:{
        legend: {
            display: false
          },
           tooltips: {
              enabled: false
          },
        legend: {
          display: false
        },
        animation: {
          duration: 1000,
          onComplete: function(animation) {
            labels_supplier_import.html(chart_supplier_import.generateLegend());
          }
        },
      }
    });

      //report status-import-warehouse status_import_warehouse
      var string_label_status_import_warehouse =([
        ['<p class="col-xs-3">Yêu cầu mua hàng:</p><p class="border-right group-value">Phiếu nhập: <strong class="total-money">12 / 21%</strong></p> <p class="group-value">Tổng tiền: <strong class="total-money">1.600.120.000 đ</strong></p><a onclick="load_data_to_modal(this,\'#myModal\')" data-url="modal-view-report.html" class="btn btn-sm link-detail "><i class="fa fa-arrow-right"></i>Xem chi tiết</a>'],
        ['<p  class="col-xs-3">Yêu cầu đã được duyệt:</p><p class="border-right group-value">Phiếu nhập: <strong class="total-money">12 / 21%</strong></p> <p class="group-value">Tổng tiền: <strong class="total-money">780.120.000 đ</strong></p> <a onclick="load_data_to_modal(this,\'#myModal\')" data-url="modal-view-report.html" class="btn btn-sm link-detail "><i class="fa fa-arrow-right"></i>Xem chi tiết</a>'],
        ['<p  class="col-xs-3">Đang nhập hàng:</p><p class="border-right group-value">Phiếu nhập: <strong class="total-money">12 / 21%</strong></p> <p class="group-value">Tổng tiền: <strong class="total-money">230.210.000 đ</strong></p><a onclick="load_data_to_modal(this,\'#myModal\')" data-url="modal-view-report.html" class="btn btn-sm link-detail "><i class="fa fa-arrow-right"></i>Xem chi tiết</a>'],
        ['<p class="col-xs-3">Đã nhập đủ:</p><p class="border-right group-value">Phiếu nhập: <strong class="total-money">12 / 21%</strong></p> <p class="group-value">Tổng tiền: <strong class="total-money">1.600.120.000 đ</strong></p><a onclick="load_data_to_modal(this,\'#myModal\')" data-url="modal-view-report.html" class="btn btn-sm link-detail "><i class="fa fa-arrow-right"></i>Xem chi tiết</a>'],
        ['<p  class="col-xs-3">Hủy:</p><p class="border-right group-value">Phiếu nhập: <strong class="total-money">12 / 21%</strong></p> <p class="group-value">Tổng tiền: <strong class="total-money">780.120.000 đ</strong></p> <a onclick="load_data_to_modal(this,\'#myModal\')" data-url="modal-view-report.html" class="btn btn-sm link-detail "><i class="fa fa-arrow-right"></i>Xem chi tiết</a>'],
        ['<p  class="col-xs-3">Nháp:</p><p class="border-right group-value">Phiếu nhập: <strong class="total-money">12 / 21%</strong></p> <p class="group-value">Tổng tiền: <strong class="total-money">230.210.000 đ</strong></p><a onclick="load_data_to_modal(this,\'#myModal\')" data-url="modal-view-report.html" class="btn btn-sm link-detail "><i class="fa fa-arrow-right"></i>Xem chi tiết</a>'],
      ]);
      var id_status_import_warehouse = $("#status-import-warehouse");
      var labels_status_import_warehouse = $(id_status_import_warehouse.data('label'));
          var data = {
              labels: string_label_status_import_warehouse,
              datasets: [{
                    data:[300,50,100,400,250,130],
                  backgroundColor:["rgb(255, 99, 132)","rgb(75, 192, 192)","rgb(255, 205, 86)","rgb(201, 203, 207)","rgb(54, 162, 235)","#2c6993"]
              }]
          };
      var chart_status_import_warehouse= new Chart(id_status_import_warehouse, {
          type: "pie",
          data: data,
          options:{
            legend: {
              display: false
            },
             tooltips: {
                enabled: false
            },
            animation: {
              duration: 1000,
              onComplete: function(animation) {
                labels_status_import_warehouse.html(chart_status_import_warehouse.generateLegend());
              }
            },
          }
      });
