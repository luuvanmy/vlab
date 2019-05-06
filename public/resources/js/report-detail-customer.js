
  //report customer-groups
  

  //report customer-reviews-employee
  var report_chart = document.getElementById("customer-reviews-employee");
  var chartBarExport = new Chart(report_chart, {
    type:"horizontalBar",
    data:{
      labels:  ['không đánh giá','★★★★★','★★★★','★★★','★★','★'],
      datasets:[{
        label:"Khách hàng mới",
        data:[130,32,124,93,73,121],
        borderColor:"#db9107",
        backgroundColor:"#f29f06"
      },
      {
        label:"Khách hàng cũ",
        data:[210,240,150,220,210,640,],
        type:"horizontalBar",
        fill:true,
        borderColor:"#285da4",
        backgroundColor:"#3a6cae"
      }]
    },
    options: {
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true
        }]
      }
    }
  });

    //report customer-reviews-product
    var report_chart = document.getElementById("customer-reviews-product");
    var chartBarExport = new Chart(report_chart, {
      type:"horizontalBar",
      data:{
        labels:  ['không đánh giá','★★★★★','★★★★','★★★','★★','★'],
        datasets:[{
          label:"Khách hàng mới",
          data:[130,32,124,93,73,121],
          borderColor:"#64656c",
          backgroundColor:"#717278"
        },
          {
            label:"Khách hàng cũ",
            data:[210,240,150,220,210,640,],
            type:"horizontalBar",
            fill:true,
            borderColor:"#36a6a3",
            backgroundColor:"#43b1ae"
          }
        ]},
        options: {
          scales: {
            xAxes: [{
              stacked: true
            }],
            yAxes: [{
              stacked: true
            }]
          }
        }
      });
