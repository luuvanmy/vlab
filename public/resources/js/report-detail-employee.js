

var ctx = document.getElementById("employee-area");
var myChart = new Chart(ctx, {
  type:"doughnut",
  data:{
    labels:["Miền Bắc ","Miền Trung","Miền Đông ", "Miền Nam"],
    datasets:[{
      data:[300,50,100,142],
      backgroundColor:["#d12b32","#43b1ae","#727378","#aaacae","#f99221","#70aa00","#fd8832"]
    }]
  }
});

//sale-team-overview
var ctx = document.getElementById("sale-team-overview");
var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ["Nhóm ABC", "Nhóm ABC","Nhóm ABC", "Nhóm ABC", "Nhóm ABC", "Nhóm ABC", "Nhóm ABC","Nhóm ABC"],
    datasets: [{
      label: 'Chỉ tiêu doanh số',
      type:"line",
      fill:false,
      data: [7000000, 12000000, 18000000, 6000000, 9000000, 12000000, 18000000,7000000],
      backgroundColor:'#ff7261',
      borderColor:'#dd4b39',
      borderWidth:2
    },{
      label: 'Doanh số',
      type:"bar",
      data:[7000000, 12000000, 12000000, 18000000, 18000000, 7000000, 9000000,7000000],
      borderColor:"#48e4df",
      backgroundColor:"rgba(33, 131, 197, 0.9)"
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero:true
        }
      }]
    }
  }
});
